# Land Embassy Limited — Website

Corporate website for Land Embassy Limited, a real estate investment, architecture, development and management company in Nigeria. Visitors browse property listings (for sale, rent, lease and shortlet), services and blog posts, and send quote requests or contact messages. The team manages listings and inquiries from an admin dashboard and receives inquiries by email.

## Stack

- **Client:** React + TypeScript, Vite, Tailwind CSS, shadcn/ui (Radix), TanStack Query, Wouter
- **Server:** Express (`server/`), served as a Vercel serverless function in production (`api/index.ts`)
- **Database:** PostgreSQL (Neon) via Drizzle ORM (`shared/schema.ts`)
- **Email:** nodemailer over SMTP (Gmail by default)
- **Images:** Vercel Blob (admin uploads)

## Getting started

```bash
npm install
cp .env.example .env   # then fill in the values
npm run dev            # http://localhost:5000
```

Without `DATABASE_URL`, submissions are kept in memory (fine for local development). Without SMTP settings, email notifications are skipped.

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server with hot reload (API + client on one port) |
| `npm run check` | Type check |
| `npm test` | API and notification tests |
| `npm run build` | Production build (client to `dist/public`, server to `dist/index.js`) |
| `npm start` | Run the production build with Node |
| `npm run db:migrate` | Apply pending database migrations (also runs on every Vercel deploy) |
| `npm run db:generate` | Create a new migration after changing `shared/schema.ts` |

## Environment variables

See [.env.example](.env.example).

| Variable | Required | Description |
| --- | --- | --- |
| `ADMIN_TOKEN` | Yes | Token for `/embassy-admin`, at least 24 characters. Admin is disabled if unset. |
| `DATABASE_URL` | Yes (production) | Postgres connection string. |
| `ADMIN_EMAIL` | No | Where notifications go. Defaults to `landembassyltd@gmail.com`. |
| `SMTP_USER` / `SMTP_PASS` | For email | SMTP login. For Gmail use the address and an [App Password](https://myaccount.google.com/apppasswords). |
| `SMTP_HOST` / `SMTP_PORT` | No | Defaults to `smtp.gmail.com` / `465`. |
| `MAIL_FROM` | No | Sender address. Defaults to `SMTP_USER`. |
| `BLOB_READ_WRITE_TOKEN` | For uploads | Set automatically when a Vercel Blob store is connected. Without it, images are added by link. |

## Admin

Dashboard at `/embassy-admin`, log in with `ADMIN_TOKEN`.

- **Overview:** listing and inquiry totals, listings by status and type, recent inquiries and recently updated listings.
- **Properties:** search and filter all listings; change status (Available, Under Offer, Sold, Rented, Leased, Off Market) and featured flag inline; add, edit and delete listings. Off Market listings are hidden from the website. Featured listings appear on the home page.
- **Property editor:** listing type (Sale, Rent, Lease, Shortlet), price and price period, property type, bedrooms, bathrooms, area, images (upload or link; first image is the cover) and features.
- **Quote Requests / Messages:** filter by status (New, Contacted, Closed), read full messages, reply by email or WhatsApp, delete.

Every new quote request and contact message is also emailed to `ADMIN_EMAIL`. Reply to the email to answer the customer directly.

## Deployment

The site deploys to Vercel from GitHub: pull requests get preview deployments and merges to `main` go to production. `vercel.json` defines the build, the SPA and API rewrites, and security headers. Set the environment variables above in the Vercel project settings. Each deploy runs `npm run db:migrate` before building, so database tables are created and updated automatically; a failed migration fails the deploy and leaves the live site unchanged.

## Project layout

```
api/            Vercel serverless entry (wraps the Express app)
migrations/     SQL migrations (schema + the initial property listings)
client/         React app (pages, components, assets, public files)
server/         Express app, routes, storage, auth, email notifications
shared/         Database schema and validation shared by client and server
docs/           Design guidelines and the original site brief
```
