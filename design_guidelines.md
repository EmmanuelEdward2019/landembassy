# Land Embassy Real Estate Website - Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from luxury real estate platforms (Zillow, Sotheby's Realty) and hospitality leaders (Airbnb) to create a premium, trust-building experience. The design emphasizes property visualization, seamless browsing, and conversion-focused interactions.

**Core Principle**: Establish Land Embassy as a premium, trustworthy corporate entity through sophisticated visual presentation while maintaining Nigerian market relevance and accessibility.

---

## Typography System

**Primary Font**: Montserrat (Google Fonts) - Professional, modern, excellent readability
**Secondary Font**: Lora (Google Fonts) - Elegant serif for editorial content

**Hierarchy**:
- Hero Headlines: Montserrat Bold, text-5xl to text-7xl
- Page Headers: Montserrat SemiBold, text-4xl to text-5xl
- Section Titles: Montserrat SemiBold, text-3xl to text-4xl
- Property Titles: Montserrat Medium, text-2xl
- Body Text: Montserrat Regular, text-base to text-lg
- Captions/Meta: Montserrat Regular, text-sm
- Blog Content: Lora Regular, text-lg with increased line-height

---

## Layout System

**Spacing Primitives**: Tailwind units of 4, 6, 8, 12, 16, 20, 24 (p-4, h-8, m-12, etc.)

**Container Strategy**:
- Full-width sections with inner max-w-7xl for content areas
- Property grids: max-w-7xl
- Text-heavy content: max-w-4xl
- Forms: max-w-2xl

**Responsive Grid**:
- Mobile: Single column (grid-cols-1)
- Tablet: 2 columns (md:grid-cols-2)
- Desktop: 3-4 columns (lg:grid-cols-3, xl:grid-cols-4 for property cards)

---

## Page-Specific Layouts

### Homepage
**Hero Section** (90vh):
- Full-width hero image (provided "hero image" file)
- Centered overlay content with blurred-background buttons
- Welcome headline + subheadline + dual CTAs ("Browse Properties" + "Get a Quote")
- Subtle scroll indicator

**Featured Properties** (py-20):
- 3-column grid on desktop showcasing premium listings
- Large property images with overlay details (location, price, type)
- Quick-view hover interactions

**Why Choose Land Embassy** (py-16):
- 4-column icon-based feature grid
- Icons: Heroicons (shield-check, chart-bar, users, home)
- Brief value propositions

**Statistics Bar** (py-12):
- 4-column metrics display (Properties Sold, Happy Clients, Years Experience, Locations)
- Large numbers with descriptive labels

**Testimonials** (py-20):
- 2-column testimonial cards with client photos (use "Sealed Deal" image)
- Quote formatting with client name and property purchased

**Latest News/Blog Preview** (py-16):
- 3-column blog card grid
- Featured image + headline + excerpt + "Read More"

### Properties Page
**Header Section**:
- Full-width header image ("crop for header" file) with page title overlay
- Breadcrumb navigation

**Search & Filter Bar** (sticky, py-6):
- Horizontal filter layout with dropdowns/inputs
- Filters: Location, Property Type, Price Range, Bedrooms, Bathrooms
- Search button with icon

**Property Grid** (py-12):
- 3-column responsive grid (lg:grid-cols-3)
- Property cards with: Image, Title, Location, Price, Specs (bed/bath/sqft), "View Details" button
- Pagination at bottom

**Individual Property Detail**:
- Hero image gallery (carousel with thumbnails)
- Two-column layout: Left (images + description), Right (sticky info card with price, specs, contact form)
- Features list, amenities, location map
- Related properties section

### About Us Page
**Header**: Full-width image ("welcome" file) with company mission overlay

**Company Story** (py-20):
- Two-column layout: Left (text content), Right (image - "Customer Care" file)
- Timeline of company milestones

**Team Section** (py-16):
- 3-column grid of team member cards (if photos available, otherwise icons)

**Achievements** (py-12):
- Image showcase ("LARGEST PLAZA RESIZED" file)
- Statistics and awards

### Get a Quote Page
**Header**: Professional image background

**Quote Form** (py-20):
- Single-column centered form (max-w-2xl)
- Fields: Name, Email, Phone, Property Interest, Budget Range, Message
- Dual submission options: "Send via Email" + "Send via WhatsApp" buttons
- Trust indicators (response time, privacy assurance)

### Gallery Page
**Masonry Grid Layout**:
- Pinterest-style staggered grid using all provided property images
- Lightbox functionality for full-view
- Category filters (Properties, Offices, Events, Sold Properties)

### Contact Us Page
**Two-Column Layout** (py-20):
- Left: Contact form (Name, Email, Subject, Message)
- Right: Contact information cards (Address, Phone, Email, WhatsApp)
- Full-width map section below

### Blog/Latest News Page
**Featured Post** (py-12):
- Large hero-style featured article with image
- Category tag, headline, excerpt, author, date

**Blog Grid** (py-16):
- 2-column grid of article cards
- Sidebar with categories, recent posts, search

---

## Component Library

### Navigation Header
- Sticky header with logo (left), main navigation (center), "Get a Quote" CTA (right)
- Mobile: Hamburger menu with slide-out drawer
- Logo: "logo resized" file

### Property Card
- Image (16:10 aspect ratio)
- Price badge (top-right corner)
- Property title + location (with map pin icon)
- Specs icons row (bed, bath, area)
- "View Details" button (full-width at bottom)

### Search Filter Component
- Dropdown selects with icons
- Price range slider
- "Apply Filters" + "Clear All" buttons

### Quote Form Module
- Input fields with icons (Heroicons: user, envelope, phone)
- Textarea for message
- Checkbox for terms/privacy
- Dual-button submission row

### Footer
- 4-column layout: Company Info + Quick Links + Properties + Contact
- Social media icons (Heroicons: Facebook, Instagram, Twitter, LinkedIn)
- Newsletter signup form
- Trust badges and certifications
- Copyright and legal links

### Blog Article Card
- Featured image (4:3 ratio)
- Category badge
- Headline (2 lines max)
- Excerpt (3 lines)
- Author + Date + Read time
- "Read More" link with arrow

### Testimonial Card
- Quote icon
- Client statement (italic text)
- Client photo or initial avatar
- Client name + property/designation
- Star rating

---

## Animations & Interactions

**Minimal & Purposeful**:
- Fade-in on scroll for sections (subtle, 0.3s)
- Property card hover: slight scale (1.02) and shadow enhancement
- Image galleries: smooth transitions between images
- Form inputs: focus state with subtle glow
- Button hover: slight brightness adjustment
- No parallax effects to maintain performance

---

## Icons

**Library**: Heroicons (via CDN)
**Common Icons**:
- Navigation: home, building-office, photo, document-text, phone, chat-bubble
- Properties: map-pin, currency-dollar, ruler, bed, bath
- Features: shield-check, clock, users, star
- Contact: envelope, phone, map

---

## Images

**Large Hero Image**: "hero image" file on homepage (full-width, 90vh)

**Page Headers**: Each page uses full-width header images with text overlays:
- Properties: "crop for header" file
- About: "welcome" file
- Gallery: "Pro home 1" file
- Contact: "Customer Care" file

**Content Images**:
- Featured properties: "Ajah 2", "LARGEST PLAZA RESIZED", other property files
- About section: "Customer Care", "Sealed Deal" (testimonials/success stories)
- Gallery: All provided property images in masonry layout

**Image Treatment**: All images maintain high quality with subtle overlays for text readability where needed.