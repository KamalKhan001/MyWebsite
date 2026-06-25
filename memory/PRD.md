# KK-TRUST COMP - Export Company Website PRD

## Original Problem Statement
Build a modern, responsive, professional business website for a new export company in Pakistan (KK-TRUST COMP) specializing in T-shirts, sportswear, gym wear, and gloves. The website should highlight brand story, product catalog, and international export services with sections for About Us, Product Gallery, Contact Form, and Client Testimonials. Color scheme: professional blue, white, and grey tones.

## User Choices
- Company Name: KK-TRUST COMP
- Logo: Text-based logo
- Products: Organized by 4 categories (T-shirts, Sportswear, Gym Wear, Gloves)
- Contact Form: Detailed (Name, Email, Phone, Company, Country, Product Interest, Message)
- Testimonials: Mock data (6 testimonials from different countries)
- Content: AI-generated brand story / About Us

## Architecture
- **Frontend**: React + Tailwind CSS + Shadcn UI components + React Router
- **Backend**: FastAPI + Motor (async MongoDB) + Pydantic
- **Database**: MongoDB (collections: products, testimonials, contact_inquiries)

## What's Been Implemented (Dec 2025)
### Pages
- Home: Hero, stats, why choose us (6 cards), featured products (4), testimonials (3), CTA
- About: Mission, vision, core values, achievements, why partner with us, certifications
- Products: 4 category cards, filter buttons, 12 products grid with images/MOQ/colors
- Contact: 4 info cards, detailed form, why-choose-us footer card

### Backend API Endpoints (all /api prefixed)
- GET `/api/` - Health check
- GET `/api/products` - List products with optional ?category= filter
- GET `/api/testimonials` - List all testimonials
- POST `/api/contact-inquiries` - Submit contact form
- GET `/api/contact-inquiries` - List submitted inquiries (admin)

### Database Auto-Seed
- 12 products seeded on first startup
- 6 testimonials seeded on first startup

### UI/Brand Elements
- Professional blue/white/grey color scheme
- KK-TRUST COMP branded logo (split blue + grey design)
- Responsive header with mobile menu
- Comprehensive footer with social icons, quick links, contact info
- Lucide-react icons (no emoji)
- Toast notifications for form feedback

## User Personas
- **International Buyer**: B2B importer/wholesaler looking for textile suppliers from Pakistan
- **Brand Owner**: Owner/manager looking for OEM/private label manufacturers
- **Admin (KK-TRUST team)**: Will need to view received contact inquiries

## Prioritized Backlog
### P1 (Next Phase)
- Admin dashboard to view & manage contact inquiries (with auth)
- Send email notifications on new contact inquiries (Resend/SendGrid)
- WhatsApp business chat integration (already shown in mock data)
- Product detail page (click product → see specs, all images)
- Multi-language support (English + Arabic for Middle East market)

### P2 (Future)
- CMS for admin to add/edit products & testimonials without code
- Image upload for products (currently using Unsplash URLs)
- Newsletter subscription
- Blog/News section for SEO
- Quote request workflow with PDF generation
- Google Analytics + SEO meta tags per page

## Test Credentials
N/A - no auth implemented yet
