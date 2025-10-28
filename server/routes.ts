import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuoteSchema, insertContactSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Quote submission endpoint
  app.post("/api/quotes", async (req, res) => {
    try {
      const quoteData = insertQuoteSchema.parse(req.body);
      const quote = await storage.createQuote(quoteData);
      res.status(201).json(quote);
    } catch (error) {
      res.status(400).json({ error: "Invalid quote data" });
    }
  });

  // Get all quotes (admin only)
  app.get("/api/quotes", async (req, res) => {
    try {
      const quotes = await storage.getAllQuotes();
      res.json(quotes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quotes" });
    }
  });

  // Delete quote (admin only)
  app.delete("/api/quotes/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteQuote(req.params.id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Quote not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete quote" });
    }
  });

  // Contact submission endpoint
  app.post("/api/contacts", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.status(201).json(contact);
    } catch (error) {
      res.status(400).json({ error: "Invalid contact data" });
    }
  });

  // Get all contacts (admin only)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contacts" });
    }
  });

  // Delete contact (admin only)
  app.delete("/api/contacts/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteContact(req.params.id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).json({ error: "Contact not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete contact" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
