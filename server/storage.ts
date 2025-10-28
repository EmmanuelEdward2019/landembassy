import { type Quote, type InsertQuote, type Contact, type InsertContact } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  createQuote(quote: InsertQuote): Promise<Quote>;
  getAllQuotes(): Promise<Quote[]>;
  deleteQuote(id: string): Promise<boolean>;
  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
  deleteContact(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private quotes: Map<string, Quote>;
  private contacts: Map<string, Contact>;

  constructor() {
    this.quotes = new Map();
    this.contacts = new Map();
  }

  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const id = randomUUID();
    const quote: Quote = {
      ...insertQuote,
      id,
      createdAt: new Date(),
    };
    this.quotes.set(id, quote);
    return quote;
  }

  async getAllQuotes(): Promise<Quote[]> {
    return Array.from(this.quotes.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async deleteQuote(id: string): Promise<boolean> {
    return this.quotes.delete(id);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = {
      ...insertContact,
      phone: insertContact.phone ?? null,
      id,
      createdAt: new Date(),
    };
    this.contacts.set(id, contact);
    return contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async deleteContact(id: string): Promise<boolean> {
    return this.contacts.delete(id);
  }
}

export const storage = new MemStorage();
