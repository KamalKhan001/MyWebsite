# KK-TRUST COMP API Contracts

## Overview
This document outlines the API contracts and integration plan between frontend and backend for the KK-TRUST COMP export company website.

## Currently Mocked in Frontend (`/app/frontend/src/mock.js`)
- `products` - Array of 12 products with categories
- `testimonials` - Array of 6 client testimonials
- `categories` - Array of 4 product categories
- `companyInfo` - Company information, stats, contact, mission/vision

## Backend Implementation Plan

### Data Models (MongoDB)

#### 1. Product
```
{
  id: str (UUID),
  name: str,
  category: str (T-shirts | Sportswear | Gym Wear | Gloves),
  description: str,
  image: str (URL),
  min_order: str,
  colors: List[str],
  created_at: datetime
}
```

#### 2. Testimonial
```
{
  id: str (UUID),
  name: str,
  company: str,
  country: str,
  image: str (URL),
  text: str,
  rating: int (1-5),
  created_at: datetime
}
```

#### 3. ContactInquiry (new - from contact form)
```
{
  id: str (UUID),
  name: str,
  email: str,
  phone: str,
  company: str,
  country: str,
  product_interest: str,
  message: str,
  status: str (default: "new"),
  created_at: datetime
}
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products (optional `?category=` filter) |
| GET | `/api/testimonials` | Get all testimonials |
| POST | `/api/contact-inquiries` | Submit contact form |
| GET | `/api/contact-inquiries` | List inquiries (admin) |

### Frontend Integration Changes
1. Create `/app/frontend/src/services/api.js` for axios API calls
2. Replace mock data imports in:
   - `Home.jsx` → fetch featured products and testimonials
   - `Products.jsx` → fetch all products with filtering
   - `Contact.jsx` → POST to contact inquiry endpoint
3. Keep `companyInfo` and `categories` in mock.js (static data)
4. Add loading and error states

### Seed Strategy
On backend startup, if `products` collection is empty, seed it with the 12 products from mock data.
Same for testimonials collection (6 testimonials).
