import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, numeric, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import {
  LISTING_TYPES,
  PROPERTY_STATUSES,
  PROPERTY_TYPES,
  PRICE_PERIODS,
  INQUIRY_STATUSES,
} from "./property.js";

export const propertyListings = pgTable("property_listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  listingType: text("listing_type").notNull().default("sale"),
  status: text("status").notNull().default("available"),
  propertyType: text("property_type").notNull(),
  price: numeric("price", { precision: 15, scale: 2, mode: "number" }).notNull(),
  pricePeriod: text("price_period"),
  location: text("location").notNull(),
  bedrooms: integer("bedrooms").notNull().default(0),
  bathrooms: integer("bathrooms").notNull().default(0),
  area: integer("area").notNull().default(0),
  images: text("images").array().notNull().default(sql`'{}'::text[]`),
  features: text("features").array().notNull().default(sql`'{}'::text[]`),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const quotes = pgTable("quotes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  propertyInterest: text("property_interest").notNull(),
  budgetRange: text("budget_range").notNull(),
  message: text("message").notNull(),
  preferredContact: text("preferred_contact").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Public form input: bounded lengths so anonymous submissions can't bloat storage.
const name = z.string().trim().min(1).max(120);
const email = z.string().trim().email().max(254);
const phone = z.string().trim().min(5).max(32);
const message = z.string().trim().min(1).max(5000);

export const insertQuoteSchema = createInsertSchema(quotes)
  .omit({
    id: true,
    createdAt: true,
    status: true,
  })
  .extend({
    name,
    email,
    phone,
    propertyInterest: z.string().trim().min(1).max(120),
    budgetRange: z.string().trim().min(1).max(120),
    message,
    preferredContact: z.enum(["email", "whatsapp"]),
  });

export const insertContactSchema = createInsertSchema(contacts)
  .omit({
    id: true,
    createdAt: true,
    status: true,
  })
  .extend({
    name,
    email,
    phone: phone.nullish().or(z.literal("").transform(() => null)),
    message,
  });

export const inquiryStatusSchema = z.object({ status: z.enum(INQUIRY_STATUSES) });

const imageUrl = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => /^https:\/\//.test(value) || value.startsWith("/"), "Images must be https:// URLs");

// Admin property input. Rent/lease/shortlet prices carry a period; sale prices don't.
export const propertyInputSchema = z
  .object({
    title: z.string().trim().min(3).max(160),
    description: z.string().trim().max(10_000).default(""),
    listingType: z.enum(LISTING_TYPES),
    status: z.enum(PROPERTY_STATUSES),
    propertyType: z.enum(PROPERTY_TYPES),
    price: z.coerce.number().nonnegative().max(1e13),
    pricePeriod: z.enum(PRICE_PERIODS).nullish(),
    location: z.string().trim().min(2).max(200),
    bedrooms: z.coerce.number().int().min(0).max(100).default(0),
    bathrooms: z.coerce.number().int().min(0).max(100).default(0),
    area: z.coerce.number().int().min(0).max(100_000_000).default(0),
    images: z.array(imageUrl).max(30).default([]),
    features: z.array(z.string().trim().min(1).max(80)).max(50).default([]),
    featured: z.boolean().default(false),
  })
  .transform((input) => ({
    ...input,
    pricePeriod: input.listingType === "sale" ? null : (input.pricePeriod ?? "year"),
  }));

// Quick edits from the properties table (status dropdown, featured star)
export const propertyPatchSchema = z
  .object({
    status: z.enum(PROPERTY_STATUSES),
    featured: z.boolean(),
  })
  .partial()
  .refine((patch) => Object.keys(patch).length > 0, "Nothing to update");

export type Property = typeof propertyListings.$inferSelect;
export type PropertyInput = z.infer<typeof propertyInputSchema>;
export type PropertyPatch = z.infer<typeof propertyPatchSchema>;
export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type InquiryStatus = z.infer<typeof inquiryStatusSchema>["status"];
