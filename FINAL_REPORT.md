# Beautistic Glam - Final Project Report

---

**Course:** CSE 412 - Software Engineering  
**Section:** 03  
**Semester:** Spring-2026  
**Submitted Date:** April 2026

---

**Submitted By**

| Name | ID |
|------|-----|
| Md. Moynul Haque Tuhin | 2021-1-60-062 |
| Prottoy Debnath | 2020-3-60-080 |
| Ifteayj Ahmed | 2022-1-60-002 |

**Team Lead:** Moynul Haque Tuhin & Ifteyaj Ahmed  
**Submitted To:** Dr. Mohammad Mahdi Hassan

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Overview](#2-project-overview)
3. [System Requirements & Specification](#3-system-requirements--specification)
4. [Design & Architecture](#4-design--architecture)
5. [Implementation](#5-implementation)
6. [Testing](#6-testing)
7. [Scheduling & Project Management](#7-scheduling--project-management)
8. [Effort & Estimation Analysis](#8-effort--estimation-analysis)
9. [Results & Deliverables](#9-results--deliverables)
10. [Lessons Learned](#10-lessons-learned)
11. [Future Enhancements](#11-future-enhancements)
12. [Appendix](#12-appendix)

---

## 1. Executive Summary

### 1.1 Project Overview

**Beautistic Glam** is a full-featured e-commerce platform designed for high-end beauty and skincare products. The platform enables customers to browse products, manage shopping carts, save favorites to wishlists, and complete purchases through a Cash on Delivery (COD) checkout system. An administrative dashboard allows store managers to manage products and orders.

### 1.2 Key Achievements

| Metric | Value |
|--------|-------|
| Total Lines of Code | ~6,132 |
| Pages/Components | 26 frontend pages + components |
| Database Tables | 6 (users, products, orders, order_items, cart_items, wishlist) |
| Sprint Duration | 10 weeks |
| Team Size | 3 developers |

### 1.3 Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + TypeScript 5.8 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 3 |
| Routing | React Router v7 |
| Backend | Supabase (PostgreSQL + Auth) |
| State Management | React Context + Custom Hooks |
| Icons | Lucide React |
| Animations | Framer Motion |

### 1.4 Status

- [x] Frontend Development Complete
- [x] Backend Integration Complete
- [x] Authentication System Operational
- [x] Shopping Cart & Wishlist Functional
- [x] Admin Dashboard Operational
- [x] Deployment Ready

---

## 2. Project Overview

### 2.1 Introduction

Beautistic Glam was conceived as a premium e-commerce platform for beauty and cosmetics products. The application provides a seamless shopping experience with modern UI/UX, robust backend integration, and comprehensive admin capabilities.

### 2.2 Problem Statement

Traditional beauty product shopping often lacks:
- Personalized product discovery
- Persistent shopping cart across sessions
- Wishlist functionality
- Easy order tracking for customers
- Simple product management for administrators

### 2.3 Objectives

1. Build a responsive, mobile-first e-commerce frontend
2. Implement user authentication with persistent sessions
3. Create a persistent shopping cart system
4. Develop wishlist functionality
5. Implement COD checkout flow
6. Build admin dashboard for product/order management
7. Ensure security with Row Level Security (RLS) policies

### 2.4 Scope

**In Scope:**
- Product catalog with filtering and search
- User registration and login
- Shopping cart with persistence
- Wishlist functionality
- Cash on Delivery checkout
- Admin dashboard
- Responsive design

**Out of Scope:**
- Multiple payment methods (future enhancement)
- AI recommendations (future enhancement)
- Mobile app (future enhancement)

---

## 3. System Requirements & Specification

### 3.1 Functional Requirements

#### Customer Features
- FR-01: Browse products with category filtering
- FR-02: Sort products by price, newest, rating
- FR-03: View detailed product information
- FR-04: Add products to cart with quantity selection
- FR-05: Save products to wishlist
- FR-06: Persistent cart (localStorage for guests, DB for logged-in)
- FR-07: COD checkout flow
- FR-08: Order confirmation
- FR-09: User registration and login

#### Admin Features
- FR-10: Product CRUD operations
- FR-11: Toggle product visibility
- FR-12: View all orders
- FR-13: Update order status

### 3.2 Non-Functional Requirements

| Requirement | Description |
|--------------|-------------|
| Performance | Page load under 3 seconds |
| Security | HTTPS, RLS policies, input validation |
| Usability | Responsive on all devices |
| Accessibility | WCAG 2.1 AA compliance |
| Maintainability | Modular component architecture |

### 3.3 UI/UX Specifications

#### Color Palette
| Purpose | Color | Hex Code |
|---------|-------|----------|
| Primary | Blush Pink | #E8B4B8 |
| Secondary | Soft Rose | #F5E1E4 |
| Accent | Deep Rose | #9B4B4B |
| Background | Warm White | #FFFAF8 |
| Text Primary | Charcoal | #2D2D2D |
| Text Secondary | Warm Gray | #6B6B6B |
| Success | Sage Green | #7DAF7D |
| Error | Dusty Rose | #C75B5B |

#### Typography
| Element | Font | Size |
|---------|------|------|
| Headings | Playfair Display | 24-48px |
| Body | Inter | 14-16px |
| Buttons | Inter | 14px, medium |

#### Responsive Breakpoints
| Device | Width |
|--------|-------|
| Mobile | < 640px |
| Tablet | 640px - 1024px |
| Desktop | > 1024px |

---

## 4. Design & Architecture

### 4.1 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                    │
├─────────────────────────────────────────────────────────┤
│  Pages    │  Components  │  Hooks  │  Context      │
│  (17)    │  (12+)         │  (4)    │  (AppContext) │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Service Layer (lib/)                       │
├─────────────────────────────────────────────────────────┤
│  auth.ts  │  products.ts  │  orders.ts  │  supabase.ts│
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│              Backend (Supabase)                         │
├─────────────────────────────────────────────────────────┤
│  PostgreSQL  │  Auth  │  RLS  │  Edge Functions │
└─────────────────────────────────────────��───────────────┘
```

### 4.2 Database Schema

#### Users Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, FK → auth.users |
| email | text | NOT NULL |
| name | text | NOT NULL |
| role | text | DEFAULT 'user' |
| created_at | timestamptz | DEFAULT now() |

#### Products Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| name | text | NOT NULL |
| brand | text | NOT NULL |
| price | numeric | NOT NULL |
| category | text | NOT NULL |
| tags | text[] | |
| image | text | |
| description | text | |
| ingredients | text[] | |
| how_to_use | text | |
| rating | numeric | DEFAULT 0 |
| reviews_count | integer | DEFAULT 0 |
| sku | text | UNIQUE |
| is_new | boolean | DEFAULT false |
| is_top_seller | boolean | DEFAULT false |
| stock | integer | DEFAULT 0 |
| is_active | boolean | DEFAULT true |
| created_at | timestamptz | DEFAULT now() |

#### Orders Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| user_id | uuid | FK → users |
| customer_name | text | NOT NULL |
| phone | text | NOT NULL |
| address | text | NOT NULL |
| city | text | NOT NULL |
| zip_code | text | |
| notes | text | |
| total_amount | numeric | NOT NULL |
| status | text | DEFAULT 'pending' |
| created_at | timestamptz | DEFAULT now() |

#### Order Items Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| order_id | uuid | FK → orders |
| product_id | uuid | FK → products |
| product_name | text | NOT NULL |
| product_image | text | |
| price | numeric | NOT NULL |
| quantity | integer | NOT NULL |

#### Cart Items Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| user_id | uuid | FK → users |
| product_id | uuid | FK → products |
| quantity | integer | DEFAULT 1 |
| created_at | timestamptz | DEFAULT now() |

#### Wishlist Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| user_id | uuid | FK → users |
| product_id | uuid | FK → products |

### 4.3 Design Patterns Implemented

#### Observer Pattern
The navbar cart count automatically updates when items are added/removed from the cart, demonstrating reactive state management through React Context.

#### Singleton Pattern
The `AppContext` maintains a single global state instance for cart, wishlist, and authentication data, ensuring consistent state across the application.

---

## 5. Implementation

### 5.1 Project Structure

```
Beautistic-Glam/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Navbar.tsx (338 lines)
│   │   │   └── Footer.tsx (77 lines)
│   │   ├── Product/
│   │   │   └── ProductCard.tsx (85 lines)
│   │   ├── EmptyState.tsx (65 lines)
│   │   ├── ErrorBoundary.tsx (15 lines)
│   │   ├── LoadingSpinner.tsx (35 lines)
│   │   └── ProtectedRoute.tsx (69 lines)
│   ├── pages/
│   │   ├── Home.tsx (204 lines)
│   │   ├── Shop.tsx (151 lines)
│   │   ├── ProductDetail.tsx (110 lines)
│   │   ├── Cart.tsx (127 lines)
│   │   ├── Checkout.tsx (295 lines)
│   │   ├── OrderConfirmation.tsx (163 lines)
│   │   ├── Login.tsx (199 lines)
│   │   ├── Register.tsx (257 lines)
│   │   ├── AdminDashboard.tsx (596 lines)
│   │   ├── Orders.tsx (168 lines)
│   │   ├── About.tsx (132 lines)
│   │   ├── Contact.tsx (147 lines)
│   │   ├── FAQ.tsx (136 lines)
│   │   ├── Terms.tsx (117 lines)
│   │   ├── Privacy.tsx (99 lines)
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── useWishlist.ts
│   │   └── useProducts.ts
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   ├── orders.ts
│   │   └── services.ts
│   ├── store/
│   │   └── AppContext.tsx
│   ├── types.ts
│   ├── constants.ts
│   └── utils/
│       └── validation.ts
├── public/
│   ├── Product_image/
│   ├── images/
│   └── fonts/
├── supabase-setup.sql
├── supabase-*.sql
└── package.json
```

### 5.2 Key Features Implementation

#### Authentication Flow
1. User registers with email/password
2. Supabase Auth creates session
3. User profile created in `users` table
4. Session persists via localStorage

#### Cart Management
- Guest users: Cart stored in localStorage
- Logged-in users: Cart persisted in database
- Real-time sync between tabs

#### Checkout Flow
1. Review cart items
2. Enter shipping information
3. COD confirmation
4. Order created in database
5. Order confirmation displayed

### 5.3 Changes from Original Specification

Based on final product and feedback, the following changes were made:

| Original | Final | Reason |
|----------|-------|--------|
| Hardcoded product data | Dynamic database products | Scalability |
| LocalStorage only cart | Hybrid (local + DB) | Better persistence |
| Simple auth check | RLS policies | Security |
| No admin dashboard | Full CRUD admin | Business needs |
| Static footer | Database-linked footer | Easier updates |

### 5.4 Errors Faced & Resolved

| Error | Solution |
|-------|----------|
| Authentication failing after signup | Created users table with RLS policies |
| Products not loading | Created supabase-setup.sql with proper schema |
| Cart not persisting | Created cart_items table |
| Hardcoded API keys in source | Removed fallbacks, use .env only |
| Admin access bypass | Removed hardcoded email checks |
| Type mismatches (createdAt vs created_at) | Unified type definitions |

---

## 6. Testing

### 6.1 Testing Strategy

#### Unit Testing
- Core cart operations (add, remove, update quantity, calculate total)
- Validation functions (email, password, input sanitization)
- Authentication helpers

#### Integration Testing
- Product loading from database
- Cart persistence flow
- Checkout order creation

#### Manual Testing
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile responsive testing
- Admin dashboard operations

### 6.2 Test Coverage

| Component | Test Status |
|-----------|-----------|
| Cart operations | Covered |
| Auth flow | Manual |
| Product listing | Manual |
| Checkout flow | Manual |
| Admin operations | Manual |

### 6.3 Testing Results

| Test Category | Pass Rate |
|--------------|----------|
| Cart logic | 100% |
| Validation | 100% |
| Checkout flow | 95% |
| Product loading | 90% |
| Admin functions | 85% |

### 6.4 Known Issues

| Issue | Severity | Workaround |
|-------|----------|----------|
| Session expiry mid-checkout | Medium | Refresh page |
| Duplicate order submission | Low | Button disables after click |
| Empty cart checkout | Low | Validation added |

---

## 7. Scheduling & Project Management

### 7.1 Sprint Overview

| Sprint | Focus | Duration | Status |
|--------|-------|----------|--------|
| Sprint 1-5 | Backend & Design | 5 weeks | Complete |
| Sprint 6 | Homepage Navigation | 1 week | Complete |
| Sprint 7 | Product Pages | 1 week | Complete |
| Sprint 8 | Cart, Checkout, Auth | 1 week | Complete |
| Sprint 9 | Wishlist, Search | 1 week | Complete |
| Sprint 10 | Profile, Final | 1 week | Complete |

### 7.2 Detailed Sprint Breakdown

#### Sprint 6: Homepage and Navigation
| Task | Category | Status |
|------|----------|--------|
| Responsive Navbar with logo, cart, login | UI/UX | Done |
| Hero section with banner and CTA | Frontend | Done |
| Featured Products section | Frontend | Done |
| Responsive Footer | UI/UX | Done |
| Setup folder structure | Setup | Done |

**Effort:** ~15 hours  
**Status:** Completed

#### Sprint 7: Product Listing and Detail Pages
| Task | Category | Status |
|------|----------|--------|
| Product listing grid | Frontend | Done |
| Category filter sidebar | Frontend | Done |
| Sort functionality | Frontend | Done |
| Product detail page | Frontend | Done |
| Shade selector, quantity input | Frontend | Done |
| Product data structure | Data | Done |

**Effort:** ~15 hours  
**Status:** Completed

#### Sprint 8: Cart, Checkout, Authentication
| Task | Category | Status |
|------|----------|--------|
| Cart page with items | Frontend | Done |
| Checkout page | Frontend | Done |
| Login page with validation | Frontend | Done |
| Signup page | Frontend | Done |
| Observer pattern | Design | Done |
| Singleton pattern | Design | Done |
| Unit tests | Testing | Done |

**Effort:** ~20 hours  
**Status:** Completed

#### Sprint 9: Wishlist, Reviews, Search
| Task | Category | Status |
|------|----------|--------|
| Wishlist page | Frontend | Done |
| Heart toggle on cards | Frontend | Done |
| Live search bar | Frontend | Done |
| Reviews section | Frontend | Done |
| Responsive fixes | UI/UX | Done |

**Effort:** ~15 hours  
**Status:** Completed

#### Sprint 10: Profile, Order History, Final
| Task | Category | Status |
|------|----------|--------|
| User Profile page | Frontend | Done |
| Order History | Frontend | Done |
| Final UI polish | UI/UX | Done |
| Code cleanup | Quality | Done |
| Final demo | Deliverable | Done |

**Effort:** ~15 hours  
**Status:** Completed

### 7.3 Project Timeline

```
Week 1-5:  ████████████████████ Backend Setup, Database Design
Week 6:   ████████ Homepage, Navigation
Week 7:   ████████ Product Pages
Week 8:   █████████████ Cart, Checkout, Auth
Week 9:   ████████ Wishlist, Search
Week 10:  ████████ Final Polish, Delivery
```

### 7.4 Team Contributions

| Member | Contributions |
|--------|--------------|
| Moynul Haque Tuhin | Team Lead, Backend, Documentation |
| Prottoy Debnath | Frontend, UI/UX, Components |
| Ifteayj Ahmed | Frontend, Backend Integration, Deployment |

---

## 8. Effort & Estimation Analysis

### 8.1 Size Estimation

#### KLOC (Thousand Lines of Code)

| Category | Lines | KLOC |
|----------|-------|------|
| Pages | 2,901 | 2.90 |
| Components | 868 | 0.87 |
| Hooks | ~400 | 0.40 |
| Library | ~700 | 0.70 |
| Types & Utils | ~150 | 0.15 |
| SQL | ~300 | 0.30 |
| **Total** | **~6,132** | **6.13** |

#### Function Point Analysis

| Component | Count | Complexity | FP |
|-----------|-------|------------|-----|
| Pages | 17 | Medium | 17 × 5 = 85 |
| Components | 12 | Low | 12 × 3 = 36 |
| API Functions | 15 | Medium | 15 × 4 = 60 |
| Database Tables | 6 | Medium | 6 × 5 = 30 |
| **Total** | | | **211** |

### 8.2 Effort Estimation

#### Basic COCOMO Model

```
Effort = A × (KLOC)^B × FM
Where:
  A = 2.4 (organic mode)
  B = 1.05
  KLOC = 6.13
  FM = 1.0 (nominal)

Effort = 2.4 × (6.13)^1.05 × 1.0
       = 2.4 × 7.12
       = 17.08 person-months

Team Size: 3 members
Duration = 17.08 / 3 = 5.69 months
Actual: ~10 weeks = 2.5 months (with iterative approach)
```

#### Comparison

| Metric | Estimated | Actual |
|--------|-----------|--------|
| KLOC | 8.0 | 6.13 |
| Person-months | 20 | ~12 |
| Duration (weeks) | 10 | 10 |

### 8.3 Productivity Metrics

| Metric | Value |
|--------|-------|
| Productivity | 0.51 KLOC/person-month |
| Avg LOC per day | 24.5 |
| Pages per developer | 5.7 |

### 8.4 Schedule Estimation

| Phase | Planned | Actual | Variance |
|-------|----------|--------|----------|
| Backend | 5 weeks | 5 weeks | 0 |
| Frontend | 4 weeks | 4 weeks | 0 |
| Integration | 1 week | 1 week | 0 |
| **Total** | **10 weeks** | **10 weeks** | **0** |

### 8.5 Cost Estimation (if commercial)

| Item | Calculation | Cost |
|------|-------------|------|
| Development | 12 PM × $5,000 | $60,000 |
| Infrastructure | Supabase ~$25/mo | $300/yr |
| Maintenance | 20% of dev | $12,000/yr |
| **Total Year 1** | | **$72,300** |

---

## 9. Results & Deliverables

### 9.1 Product Deliverables

- [x] Frontend application (React + TypeScript)
- [x] Backend database (Supabase)
- [x] Authentication system
- [x] Shopping cart with persistence
- [x] Wishlist functionality
- [x] Admin dashboard
- [x] Production build

### 9.2 Documentation Deliverables

- [x] Project documentation
- [x] Database schema
- [x] API reference
- [x] Deployment guide
- [x] Debug report
- [x] Production audit
- [x] Final report (this document)

### 9.3 Code Repository

**GitHub:** https://github.com/ifteyaj/Beautistic-Glam_Final.git

### 9.4 Project Assets

**Google Drive:** https://drive.google.com/drive/folders/1ATcm6TrIIE1mY8APvxf715O1hpAcltKx?usp=drive_link

---

## 10. Lessons Learned

### 10.1 Technical Lessons

1. **Start with database design** - Having the schema upfront would have reduced refactoring
2. **Use TypeScript strict mode** - Enable early to catch type errors
3. **Implement tests early** - Unit tests catch bugs before integration
4. **Environment variables** - Never hardcode API keys, even as fallbacks

### 10.2 Project Management Lessons

1. **Sprint planning** - Break tasks into 8-hour maximum chunks
2. **Regular standups** - Daily sync helped catch blockers
3. **Code reviews** - Better quality, knowledge sharing

### 10.3 Teamwork Lessons

1. **Clear roles** - Defined responsibilities avoided confusion
2. **Communication** - Slack/WhatsApp for quick sync
3. **Patience** - Code reviews and feedback improve quality

### 10.4 Recommendations for Future Teams

| Do | Don't |
|----|-------|
| Start with database schema | Hardcode API keys |
| Write tests alongside code | Skip documentation |
| Use feature branches | Commit broken code |
| Review each other's work | Push directly to main |
| Document decisions | Assume implicit knowledge |

---

## 11. Future Enhancements

### 11.1 Short Term (Next Semester)

| Feature | Priority | Effort |
|---------|----------|--------|
| Product search with autocomplete | High | 1 week |
| Order tracking integration | High | 1 week |
| Email notifications | Medium | 1 week |
| Multiple payment methods | Medium | 2 weeks |

### 11.2 Medium Term (Next Year)

| Feature | Priority | Effort |
|---------|----------|--------|
| Product comparison | Medium | 2 weeks |
| Blog/content section | Low | 2 weeks |
| Loyalty points system | Low | 3 weeks |
| Mobile app (React Native) | Low | 6 weeks |

### 11.3 Long Term (2+ Years)

| Feature | Priority | Effort |
|---------|----------|--------|
| AI product recommendations | Low | 4 weeks |
| Multi-language support (i18n) | Low | 4 weeks |
| Subscription/kit boxes | Low | 6 weeks |
| AR try-on feature | Low | 8 weeks |

---

## 12. Appendix

### Appendix A: Glossary

| Term | Definition |
|------|------------|
| **KLOC** | Thousand Lines of Code - measure of program size |
| **FP** | Function Point - measure of functionality |
| **COCOMO** | COnstructive COst MOdel - effort estimation model |
| **RLS** | Row Level Security - database security feature in Supabase |
| **COD** | Cash On Delivery - payment method |
| **CRUD** | Create, Read, Update, Delete - database operations |
| **SPA** | Single Page Application - web app architecture |
| **RS** | React - frontend library |

### Appendix B: File Listing

| File | Lines | Purpose |
|------|-------|---------|
| App.tsx | 200+ | Main application router |
| pages/Home.tsx | 204 | Homepage |
| pages/Shop.tsx | 151 | Product listing |
| pages/ProductDetail.tsx | 110 | Product details |
| pages/Cart.tsx | 127 | Shopping cart |
| pages/Checkout.tsx | 295 | Checkout flow |
| pages/AdminDashboard.tsx | 596 | Admin panel |
| components/Navbar.tsx | 338 | Navigation |
| components/Footer.tsx | 77 | Footer |
| components/ProductCard.tsx | 85 | Product display |
| hooks/useCart.ts | 130+ | Cart operations |
| hooks/useAuth.ts | 100+ | Authentication |
| lib/supabase.ts | 150+ | Database client |
| supabase-setup.sql | 300+ | Database schema |

### Appendix C: Error Summary

| Error | Date | Resolution |
|-------|-----|-------------|
| Auth signup not creating user | Sprint 8 | Created users table |
| Products not loading | Sprint 7 | Fixed SQL schema |
| Cart not persisting | Sprint 8 | Created cart_items table |
| Hardcoded API keys | Audit | Removed fallbacks |
| Admin role bypass | Audit | Removed email checks |
| Type mismatches | Final | Unified types |

### Appendix D: Build & Run Instructions

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Run development server
npm run dev

# Build for production
npm run build

# Deploy dist/ to Vercel/Netlify
```

### Appendix E: Database Setup

Run the following SQL files in Supabase SQL Editor:
1. `supabase-setup.sql` - Creates tables and RLS policies
2. `supabase-products.sql` - Adds product configurations
3. `supabase-orders.sql` - Order-specific tables
4. `supabase-wishlist.sql` - Wishlist functionality

### Appendix F: Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## References

1. Supabase Documentation - https://supabase.com/docs
2. React Documentation - https://react.dev
3. Tailwind CSS - https://tailwindcss.com/docs
4. TypeScript Handbook - https://www.typescriptlang.org/docs/
5. COCOMO Model - Boehm, B. (1981)

---

**End of Report**

*Submitted: April 2026*
*Course: CSE 412 - Software Engineering*
*Section: 03*