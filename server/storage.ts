import {
  quotes,
  contacts,
  propertyListings,
  type Quote,
  type InsertQuote,
  type Contact,
  type InsertContact,
  type Property,
  type PropertyInput,
  type PropertyPatch,
  type InquiryStatus,
} from "../shared/schema.js";
import { PUBLIC_STATUSES } from "../shared/property.js";
import { SEED_PROPERTIES } from "../shared/seed-properties.js";
import { randomUUID } from "crypto";
import { desc, eq, inArray } from "drizzle-orm";
import pg from "pg";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { log } from "./log.js";

export interface IStorage {
  listProperties(options: { publicOnly: boolean }): Promise<Property[]>;
  getProperty(id: string): Promise<Property | undefined>;
  createProperty(input: PropertyInput): Promise<Property>;
  updateProperty(id: string, input: PropertyInput | PropertyPatch): Promise<Property | undefined>;
  deleteProperty(id: string): Promise<boolean>;

  createQuote(quote: InsertQuote): Promise<Quote>;
  getAllQuotes(): Promise<Quote[]>;
  updateQuoteStatus(id: string, status: InquiryStatus): Promise<Quote | undefined>;
  deleteQuote(id: string): Promise<boolean>;

  createContact(contact: InsertContact): Promise<Contact>;
  getAllContacts(): Promise<Contact[]>;
  updateContactStatus(id: string, status: InquiryStatus): Promise<Contact | undefined>;
  deleteContact(id: string): Promise<boolean>;
}

// Featured first, then newest
function byFeaturedThenNewest(a: Property, b: Property) {
  return Number(b.featured) - Number(a.featured) || b.createdAt.getTime() - a.createdAt.getTime();
}

function newestFirst<T extends { createdAt: Date }>(a: T, b: T) {
  return b.createdAt.getTime() - a.createdAt.getTime();
}

export class MemStorage implements IStorage {
  private properties = new Map<string, Property>();
  private quotes = new Map<string, Quote>();
  private contacts = new Map<string, Contact>();

  constructor() {
    const seededAt = Date.now();
    SEED_PROPERTIES.forEach((seed, index) => {
      // Stagger timestamps so the seed keeps its original order
      const at = new Date(seededAt - index * 1000);
      this.properties.set(seed.id, { ...seed, pricePeriod: seed.pricePeriod ?? null, createdAt: at, updatedAt: at });
    });
  }

  async listProperties({ publicOnly }: { publicOnly: boolean }) {
    return Array.from(this.properties.values())
      .filter((p) => !publicOnly || PUBLIC_STATUSES.includes(p.status as never))
      .sort(byFeaturedThenNewest);
  }

  async getProperty(id: string) {
    return this.properties.get(id);
  }

  async createProperty(input: PropertyInput) {
    const now = new Date();
    const property: Property = { ...input, pricePeriod: input.pricePeriod ?? null, id: randomUUID(), createdAt: now, updatedAt: now };
    this.properties.set(property.id, property);
    return property;
  }

  async updateProperty(id: string, input: PropertyInput | PropertyPatch) {
    const existing = this.properties.get(id);
    if (!existing) return undefined;
    const updated: Property = { ...existing, ...input, updatedAt: new Date() };
    this.properties.set(id, updated);
    return updated;
  }

  async deleteProperty(id: string) {
    return this.properties.delete(id);
  }

  async createQuote(insertQuote: InsertQuote) {
    const quote: Quote = { ...insertQuote, id: randomUUID(), status: "new", createdAt: new Date() };
    this.quotes.set(quote.id, quote);
    return quote;
  }

  async getAllQuotes() {
    return Array.from(this.quotes.values()).sort(newestFirst);
  }

  async updateQuoteStatus(id: string, status: InquiryStatus) {
    const quote = this.quotes.get(id);
    if (!quote) return undefined;
    quote.status = status;
    return quote;
  }

  async deleteQuote(id: string) {
    return this.quotes.delete(id);
  }

  async createContact(insertContact: InsertContact) {
    const contact: Contact = {
      ...insertContact,
      phone: insertContact.phone ?? null,
      id: randomUUID(),
      status: "new",
      createdAt: new Date(),
    };
    this.contacts.set(contact.id, contact);
    return contact;
  }

  async getAllContacts() {
    return Array.from(this.contacts.values()).sort(newestFirst);
  }

  async updateContactStatus(id: string, status: InquiryStatus) {
    const contact = this.contacts.get(id);
    if (!contact) return undefined;
    contact.status = status;
    return contact;
  }

  async deleteContact(id: string) {
    return this.contacts.delete(id);
  }
}

export class DbStorage implements IStorage {
  private db: NodePgDatabase;

  constructor(databaseUrl: string) {
    // Small pool: each serverless instance handles few concurrent requests
    this.db = drizzle(new pg.Pool({ connectionString: databaseUrl, max: 3 }));
  }

  async listProperties({ publicOnly }: { publicOnly: boolean }) {
    return this.db
      .select()
      .from(propertyListings)
      .where(publicOnly ? inArray(propertyListings.status, PUBLIC_STATUSES) : undefined)
      .orderBy(desc(propertyListings.featured), desc(propertyListings.createdAt));
  }

  async getProperty(id: string) {
    const [property] = await this.db.select().from(propertyListings).where(eq(propertyListings.id, id));
    return property;
  }

  async createProperty(input: PropertyInput) {
    const [property] = await this.db.insert(propertyListings).values(input).returning();
    return property;
  }

  async updateProperty(id: string, input: PropertyInput | PropertyPatch) {
    const [property] = await this.db
      .update(propertyListings)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(propertyListings.id, id))
      .returning();
    return property;
  }

  async deleteProperty(id: string) {
    const deleted = await this.db
      .delete(propertyListings)
      .where(eq(propertyListings.id, id))
      .returning({ id: propertyListings.id });
    return deleted.length > 0;
  }

  async createQuote(insertQuote: InsertQuote) {
    const [quote] = await this.db.insert(quotes).values(insertQuote).returning();
    return quote;
  }

  async getAllQuotes() {
    return this.db.select().from(quotes).orderBy(desc(quotes.createdAt));
  }

  async updateQuoteStatus(id: string, status: InquiryStatus) {
    const [quote] = await this.db.update(quotes).set({ status }).where(eq(quotes.id, id)).returning();
    return quote;
  }

  async deleteQuote(id: string) {
    const deleted = await this.db.delete(quotes).where(eq(quotes.id, id)).returning({ id: quotes.id });
    return deleted.length > 0;
  }

  async createContact(insertContact: InsertContact) {
    const [contact] = await this.db.insert(contacts).values(insertContact).returning();
    return contact;
  }

  async getAllContacts() {
    return this.db.select().from(contacts).orderBy(desc(contacts.createdAt));
  }

  async updateContactStatus(id: string, status: InquiryStatus) {
    const [contact] = await this.db.update(contacts).set({ status }).where(eq(contacts.id, id)).returning();
    return contact;
  }

  async deleteContact(id: string) {
    const deleted = await this.db.delete(contacts).where(eq(contacts.id, id)).returning({ id: contacts.id });
    return deleted.length > 0;
  }
}

function createStorage(): IStorage {
  if (process.env.DATABASE_URL) {
    return new DbStorage(process.env.DATABASE_URL);
  }
  if (process.env.NODE_ENV === "production") {
    log("DATABASE_URL is not set: data is kept in memory and will be lost on restart");
  }
  return new MemStorage();
}

export const storage = createStorage();
