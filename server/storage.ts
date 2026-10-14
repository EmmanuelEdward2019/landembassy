import {
  quotes,
  contacts,
  type Quote,
  type InsertQuote,
  type Contact,
  type InsertContact,
} from "../shared/schema.js";
import { randomUUID } from "crypto";
import { desc, eq } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import { log } from "./log.js";

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

export class DbStorage implements IStorage {
  private db: NeonHttpDatabase;

  constructor(databaseUrl: string) {
    this.db = drizzle(neon(databaseUrl));
  }

  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const [quote] = await this.db.insert(quotes).values(insertQuote).returning();
    return quote;
  }

  async getAllQuotes(): Promise<Quote[]> {
    return this.db.select().from(quotes).orderBy(desc(quotes.createdAt));
  }

  async deleteQuote(id: string): Promise<boolean> {
    const deleted = await this.db.delete(quotes).where(eq(quotes.id, id)).returning({ id: quotes.id });
    return deleted.length > 0;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await this.db.insert(contacts).values(insertContact).returning();
    return contact;
  }

  async getAllContacts(): Promise<Contact[]> {
    return this.db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async deleteContact(id: string): Promise<boolean> {
    const deleted = await this.db.delete(contacts).where(eq(contacts.id, id)).returning({ id: contacts.id });
    return deleted.length > 0;
  }
}

function createStorage(): IStorage {
  if (process.env.DATABASE_URL) {
    return new DbStorage(process.env.DATABASE_URL);
  }
  if (process.env.NODE_ENV === "production") {
    log("DATABASE_URL is not set: submissions are kept in memory and will be lost on restart");
  }
  return new MemStorage();
}

export const storage = createStorage();
