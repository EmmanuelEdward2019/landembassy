import express, { type Express } from "express";
import rateLimit from "express-rate-limit";
import { storage } from "./storage.js";
import {
  insertQuoteSchema,
  insertContactSchema,
  inquiryStatusSchema,
  propertyInputSchema,
  propertyPatchSchema,
} from "../shared/schema.js";
import { PUBLIC_STATUSES } from "../shared/property.js";
import { requireAdminToken } from "./middleware/auth.js";
import { notifyAdmin } from "./notify.js";
import { handleImageUpload, uploadsEnabled, MAX_UPLOAD_BYTES } from "./uploads.js";

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

const adminOnly = [adminLimiter, requireAdminToken];

function isBot(body: unknown) {
  return typeof body === "object" && body !== null && Boolean((body as Record<string, unknown>)[HONEYPOT_FIELD]);
}

export function registerRoutes(app: Express) {
  // ---- Properties (public) ----

  app.get("/api/properties", async (_req, res, next) => {
    try {
      res.json(await storage.listProperties({ publicOnly: true }));
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/properties/:id", async (req, res, next) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property || !PUBLIC_STATUSES.includes(property.status as never)) {
        return res.status(404).json({ error: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      next(error);
    }
  });

  // ---- Admin ----

  // Lets the admin page check a token before showing the dashboard
  app.get("/api/admin/session", ...adminOnly, (_req, res) => {
    res.json({ ok: true, uploads: uploadsEnabled() });
  });

  app.get("/api/admin/properties", ...adminOnly, async (_req, res, next) => {
    try {
      res.json(await storage.listProperties({ publicOnly: false }));
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/admin/properties/:id", ...adminOnly, async (req, res, next) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property) return res.status(404).json({ error: "Property not found" });
      res.json(property);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/admin/properties", ...adminOnly, async (req, res, next) => {
    const parsed = propertyInputSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid property data", issues: parsed.error.issues });
    }
    try {
      res.status(201).json(await storage.createProperty(parsed.data));
    } catch (error) {
      next(error);
    }
  });

  // Full edit from the property form
  app.put("/api/admin/properties/:id", ...adminOnly, async (req, res, next) => {
    const parsed = propertyInputSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid property data", issues: parsed.error.issues });
    }
    try {
      const property = await storage.updateProperty(req.params.id, parsed.data);
      if (!property) return res.status(404).json({ error: "Property not found" });
      res.json(property);
    } catch (error) {
      next(error);
    }
  });

  // Quick edits: status and featured
  app.patch("/api/admin/properties/:id", ...adminOnly, async (req, res, next) => {
    const parsed = propertyPatchSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid update" });
    }
    try {
      const property = await storage.updateProperty(req.params.id, parsed.data);
      if (!property) return res.status(404).json({ error: "Property not found" });
      res.json(property);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/admin/properties/:id", ...adminOnly, async (req, res, next) => {
    try {
      const deleted = await storage.deleteProperty(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Property not found" });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  app.post(
    "/api/admin/uploads",
    ...adminOnly,
    express.raw({ type: "image/*", limit: MAX_UPLOAD_BYTES }),
    handleImageUpload,
  );

  // ---- Quote requests ----

  app.post("/api/quotes", submissionLimiter, async (req, res, next) => {
    if (isBot(req.body)) {
      return res.status(201).json({ ok: true });
    }

    const parsed = insertQuoteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid quote data" });
    }

    try {
      const quote = await storage.createQuote(parsed.data);
      // Awaited so serverless hosts don't freeze the function mid-send
      await notifyAdmin({
        subject: `New quote request from ${quote.name}`,
        replyTo: quote.email,
        fields: [
          ["Name", quote.name],
          ["Email", quote.email],
          ["Phone", quote.phone],
          ["Property interest", quote.propertyInterest],
          ["Budget range", quote.budgetRange],
          ["Preferred contact", quote.preferredContact],
          ["Message", quote.message],
        ],
      });
      res.status(201).json({ ok: true });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/quotes", ...adminOnly, async (_req, res, next) => {
    try {
      res.json(await storage.getAllQuotes());
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/quotes/:id", ...adminOnly, async (req, res, next) => {
    const parsed = inquiryStatusSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid status" });
    try {
      const quote = await storage.updateQuoteStatus(req.params.id, parsed.data.status);
      if (!quote) return res.status(404).json({ error: "Quote not found" });
      res.json(quote);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/quotes/:id", ...adminOnly, async (req, res, next) => {
    try {
      const deleted = await storage.deleteQuote(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Quote not found" });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // ---- Contact messages ----

  app.post("/api/contacts", submissionLimiter, async (req, res, next) => {
    if (isBot(req.body)) {
      return res.status(201).json({ ok: true });
    }

    const parsed = insertContactSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid contact data" });
    }

    try {
      const contact = await storage.createContact(parsed.data);
      await notifyAdmin({
        subject: `New contact message from ${contact.name}`,
        replyTo: contact.email,
        fields: [
          ["Name", contact.name],
          ["Email", contact.email],
          ["Phone", contact.phone],
          ["Message", contact.message],
        ],
      });
      res.status(201).json({ ok: true });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/contacts", ...adminOnly, async (_req, res, next) => {
    try {
      res.json(await storage.getAllContacts());
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/contacts/:id", ...adminOnly, async (req, res, next) => {
    const parsed = inquiryStatusSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Invalid status" });
    try {
      const contact = await storage.updateContactStatus(req.params.id, parsed.data.status);
      if (!contact) return res.status(404).json({ error: "Contact not found" });
      res.json(contact);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/contacts/:id", ...adminOnly, async (req, res, next) => {
    try {
      const deleted = await storage.deleteContact(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Contact not found" });
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  // Unknown API routes get a JSON 404 instead of falling through to the SPA
  app.all("/api/*", (_req, res) => {
    res.status(404).json({ error: "Not found" });
  });
}
