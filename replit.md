# Land Embassy Real Estate Website

## Overview

Land Embassy Limited is a premium real estate investment, architectural, development, and management company operating in Nigeria. This is a full-stack web application built to showcase properties, provide services information, and facilitate client engagement through quote requests and contact forms.

The application serves as a corporate website for Land Embassy, featuring property listings, service descriptions, blog content, an image gallery, and an admin panel for managing customer inquiries. The platform emphasizes luxury branding while maintaining accessibility for the Nigerian market.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**Routing**: Wouter for client-side navigation

**UI Components**: shadcn/ui component library built on Radix UI primitives
- Extensive use of pre-built accessible components (buttons, cards, dialogs, forms, etc.)
- Tailwind CSS for styling with custom design tokens
- "New York" style variant from shadcn/ui

**Design System**:
- Typography: Montserrat (primary) and Lora (secondary serif for editorial content) from Google Fonts
- Color scheme: Gold, white, and black (premium branding)
- Responsive grid layouts with mobile-first approach
- Custom Tailwind configuration with extended color system using CSS variables
- Consistent spacing using Tailwind's standard units (4, 6, 8, 12, 16, 20, 24)

**State Management**:
- TanStack Query (React Query) for server state management
- Local component state using React hooks
- Form handling with React Hook Form and Zod validation

**Key Pages**:
- Home: Hero section with property showcase and testimonials
- Properties: Filterable property listings with search
- Property Detail: Individual property view with image carousel
- About: Company information, mission, vision, and values
- Services: Five core service offerings
- Quote: Lead generation form for property inquiries
- Contact: Contact form with WhatsApp integration
- Blog: Content marketing platform
- Gallery: Image showcase with category filtering
- EmbassyAdmin: Protected admin panel for viewing submissions

### Backend Architecture

**Server Framework**: Express.js with TypeScript

**API Design**: RESTful endpoints following resource-based conventions
- `/api/quotes` - Quote submission and retrieval (protected)
- `/api/contacts` - Contact form submissions and retrieval (protected)

**Development Server**: Vite middleware integration for hot module replacement during development

**Storage Layer**: Abstract storage interface (`IStorage`) with in-memory implementation (`MemStorage`)
- Designed to be swapped with database implementation
- Currently uses Map-based storage for quotes and contacts
- UUID-based ID generation

**Authentication**: Simple token-based authentication for admin routes
- Hardcoded admin token: "LANDEMBASSY2024ADMIN"
- Middleware-based protection (`requireAdminToken`)
- Bearer token authentication scheme

**Request Logging**: Custom middleware for API request/response logging with timing

### Database Schema (Drizzle ORM)

**ORM**: Drizzle ORM configured for PostgreSQL (Neon Database)

**Tables**:
- `properties`: Property listings with images array, pricing, location, bedrooms/bathrooms, area, featured flag, and status
- `quotes`: Customer quote requests with contact info, property interest, budget range, and preferred contact method
- `contacts`: General contact form submissions
- `blog_posts`: Blog content with categories, authors, and publication dates

**Schema Design**: 
- All tables use UUID primary keys via `gen_random_uuid()`
- Timestamps for creation tracking
- Text arrays for storing multiple images per property
- Decimal precision for pricing (12 digits, 2 decimal places)

**Migration Strategy**: Schema defined in `/shared/schema.ts`, migrations generated to `/migrations` directory

### External Dependencies

**Database**: PostgreSQL via Neon Database serverless driver (`@neondatabase/serverless`)

**Styling & UI**:
- Tailwind CSS with PostCSS for processing
- Google Fonts (Montserrat, Lora)
- Radix UI component primitives for accessibility
- Lucide React for icons

**Form Validation**: Zod schema validation with Drizzle-Zod integration for type-safe database schemas

**Development Tools**:
- Replit-specific plugins for development (cartographer, dev banner, runtime error overlay)
- TypeScript with strict mode enabled
- ESBuild for server bundling in production

**Asset Management**: Static assets stored in `/attached_assets` directory with Vite alias configuration

**Social Media Integration**: Links to Facebook, Instagram, Twitter (X), and LinkedIn profiles

**Communication**: Email (info@landembassy.com) and WhatsApp integration for customer contact