import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  location: text("location").notNull(),
  propertyType: text("property_type").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  area: integer("area").notNull(),
  images: text("images").array().notNull(),
  featured: integer("featured").default(0),
  status: text("status").notNull().default("available"),
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  image: text("image").notNull(),
  author: text("author").notNull(),
  publishedAt: text("published_at").notNull(),
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
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
  })
  .extend({
    name,
    email,
    phone: phone.nullish().or(z.literal("").transform(() => null)),
    message,
  });

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
});

export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
