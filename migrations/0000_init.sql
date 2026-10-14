-- Idempotent: quotes/contacts may already exist if `drizzle-kit push` was run
-- before migrations were introduced. Nothing here drops or rewrites data.
CREATE TABLE IF NOT EXISTS "contacts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"message" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "property_listings" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"listing_type" text DEFAULT 'sale' NOT NULL,
	"status" text DEFAULT 'available' NOT NULL,
	"property_type" text NOT NULL,
	"price" numeric(15, 2) NOT NULL,
	"price_period" text,
	"location" text NOT NULL,
	"bedrooms" integer DEFAULT 0 NOT NULL,
	"bathrooms" integer DEFAULT 0 NOT NULL,
	"area" integer DEFAULT 0 NOT NULL,
	"images" text[] DEFAULT '{}'::text[] NOT NULL,
	"features" text[] DEFAULT '{}'::text[] NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "quotes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"property_interest" text NOT NULL,
	"budget_range" text NOT NULL,
	"message" text NOT NULL,
	"preferred_contact" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

--> statement-breakpoint
ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'new' NOT NULL;
--> statement-breakpoint
ALTER TABLE "contacts" ADD COLUMN IF NOT EXISTS "status" text DEFAULT 'new' NOT NULL;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "property_listings_status_idx" ON "property_listings" ("status");
