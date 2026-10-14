import type { Express } from "express";
import rateLimit from "express-rate-limit";
import { storage } from "./storage.js";
import { insertQuoteSchema, insertContactSchema } from "../shared/schema.js";
import { requireAdminToken } from "./middleware/auth.js";

// Hidden form field that real visitors never fill in; bots usually do.
const HONEYPOT_FIELD = "website";

const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many submissions, please try again later" },
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  // Only failed attempts count, so brute-forcing the token is throttled
  // without locking out a legitimate admin.
  skipSuccessfulRequests: true,
  message: { error: "Too many attempts, please try again later" },
});

function isBot(body: unknown) {
  return typeof body === "object" && body !== null && Boolean((body as Record<string, unknown>)[HONEYPOT_FIELD]);
}

export function registerRoutes(app: Express) {
  // Lets the admin page check a token before showing the dashboard
  app.get("/api/admin/session", adminLimiter, requireAdminToken, (_req, res) => {
    res.json({ ok: true });
  });

  // Quote submission endpoint (public)
  app.post("/api/quotes", submissionLimiter, async (req, res, next) => {
    if (isBot(req.body)) {
      return res.status(201).json({ ok: true });
    }

    const parsed = insertQuoteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid quote data" });
    }

    try {
      await storage.createQuote(parsed.data);
      res.status(201).json({ ok: true });
    } catch (error) {
      next(error);
    }
  });

  // Get all quotes (admin only - protected)
  app.get("/api/quotes", adminLimiter, requireAdminToken, async (_req, res, next) => {
    try {
      res.json(await storage.getAllQuotes());
    } catch (error) {
      next(error);
    }
  });

  // Delete quote (admin only - protected)
  app.delete("/api/quotes/:id", adminLimiter, requireAdminToken, async (req, res, next) => {
    try {
      const deleted = await storage.deleteQuote(req.params.id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Quote not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // Contact submission endpoint (public)
  app.post("/api/contacts", submissionLimiter, async (req, res, next) => {
    if (isBot(req.body)) {
      return res.status(201).json({ ok: true });
    }

    const parsed = insertContactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid contact data" });
    }

    try {
      await storage.createContact(parsed.data);
      res.status(201).json({ ok: true });
    } catch (error) {
      next(error);
    }
  });

  // Get all contacts (admin only - protected)
  app.get("/api/contacts", adminLimiter, requireAdminToken, async (_req, res, next) => {
    try {
      res.json(await storage.getAllContacts());
    } catch (error) {
      next(error);
    }
  });

  // Delete contact (admin only - protected)
  app.delete("/api/contacts/:id", adminLimiter, requireAdminToken, async (req, res, next) => {
    try {
      const deleted = await storage.deleteContact(req.params.id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Contact not found" });
      }
    } catch (error) {
      next(error);
    }
  });

  // Unknown API routes get a JSON 404 instead of falling through to the SPA
  app.all("/api/*", (_req, res) => {
    res.status(404).json({ error: "Not found" });
  });
}
