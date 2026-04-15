# Beautistic Glam - Project Documentation

A production-ready e-commerce platform for high-end beauty and skincare products.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Database Schema](#4-database-schema)
5. [Features](#5-features)
6. [API Reference](#6-api-reference)
7. [Components](#7-components)
8. [State Management](#8-state-management)
9. [Environment Variables](#9-environment-variables)
10. [Development Setup](#10-development-setup)
11. [Build & Deployment](#11-build--deployment)
12. [Testing Strategy](#12-testing-strategy)
13. [Security Considerations](#13-security-considerations)
14. [Performance Optimization](#14-performance-optimization)
15. [Future Enhancements](#15-future-enhancements)

---

## 1. Project Overview

**Beautistic Glam** is a full-featured e-commerce platform for beauty and cosmetics products, featuring:

- Product catalog with filtering and search
- User authentication (login/register)
- Shopping cart with persistence
- Wishlist functionality
- Cash on Delivery (COD) checkout
- Admin dashboard for product and order management

---

## 2. Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend Framework | React 19 |
| Language | TypeScript 5.8 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 3 |
| Routing | React Router v7 |
| Backend | Supabase (PostgreSQL + Auth) |
| State Management | React Context + Custom Hooks |
| Icons | Lucide React |
| Animations | Framer Motion |

---

## 3. Project Structure

```
Beautistic-Glam/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Layout/        # Navbar, Footer
│   │   ├── Product/       # ProductCard
│   │   └── [shared]       # ErrorBoundary, EmptyState, LoadingSpinner
│   ├── pages/             # Route components (lazy-loaded)
│   │   ├── Home.tsx
│   │   ├── Shop.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── OrderConfirmation.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── AdminDashboard.tsx
│   │   └── About.tsx
│   ├── lib/               # Core services
│   │   ├── supabase.ts    # Supabase client
│   │   ├── auth.ts        # Authentication helpers
│   │   ├── products.ts    # Product CRUD operations
│   │   ├── orders.ts      # Order management
│   │   └── services.ts    # Combined service layer
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── useWishlist.ts
│   │   └── useProducts.ts
│   ├── store/
│   │   └── AppContext.tsx  # Global state provider
│   ├── types.ts           # TypeScript interfaces
│   ├── constants.ts       # App constants
│   ├── utils/             # Utility functions
│   └── App.tsx            # Router setup
├── public/                # Static assets
├── supabase-*.sql         # Database schema files
├── tailwind.config.js     # Tailwind configuration
├── vite.config.ts         # Vite configuration
└── package.json
```

---

## 4. Database Schema

### Tables

#### `users`
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK, FK → auth.users |
| email | text | NOT NULL |
| name | text | NOT NULL |
| role | text | DEFAULT 'user' |
| created_at | timestamptz | DEFAULT now() |

#### `products`
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

#### `orders`
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

#### `order_items`
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| order_id | uuid | FK → orders |
| product_id | uuid | FK → products |
| product_name | text | NOT NULL |
| product_image | text | |
| price | numeric | NOT NULL |
| quantity | integer | NOT NULL |

#### `cart_items`
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| user_id | uuid | FK → users |
| product_id | uuid | FK → products |
| quantity | integer | DEFAULT 1 |
| created_at | timestamptz | DEFAULT now() |

#### `wishlist`
| Column | Type | Constraints |
|--------|------|-------------|
| id | uuid | PK |
| user_id | uuid | FK → users |
| product_id | uuid | FK → products |

---

## 5. Features

### Customer Features

- [x] Browse products with filtering (category, price, rating)
- [x] Sort products (price, newest, rating)
- [x] Product detail view with gallery
- [x] Add to cart with quantity selection
- [x] Wishlist (save favorites)
- [x] Persistent cart (localStorage for guests, DB for logged-in users)
- [x] COD checkout flow
- [x] Order confirmation
- [x] User registration & login
- [x] Responsive mobile design

### Admin Features

- [x] Product CRUD (Create, Read, Update, Delete)
- [x] Toggle product visibility
- [x] View all orders
- [x] Update order status
- [x] View user orders

---

## 6. API Reference

### Authentication

```typescript
// Register
signUp(email: string, password: string, name: string): Promise<User>

// Login
signIn(email: string, password: string): Promise<User>

// Logout
signOut(): Promise<void>

// Password Reset
resetPassword(email: string): Promise<void>
updatePassword(newPassword: string): Promise<void>
```

### Products

```typescript
// Get all active products (with filters)
getProducts(options?: {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sort?: SortOption;
}): Promise<Product[]>

// Get single product
getProduct(id: string): Promise<Product>

// Admin: Get all products (including inactive)
getAllProducts(): Promise<Product[]>

// Admin: Create product
createProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<Product>

// Admin: Update product
updateProduct(id: string, updates: Partial<Product>): Promise<Product>

// Admin: Delete product
deleteProduct(id: string): Promise<void>

// Admin: Toggle visibility
toggleVisibility(id: string, isActive: boolean): Promise<void>
```

### Orders

```typescript
// Create COD order
createOrder(orderInput: {
  customerName: string;
  phone: string;
  address: string;
  city: string;
  zipCode?: string;
  notes?: string;
}): Promise<Order>

// Get all orders (admin)
getAllOrders(): Promise<Order[]>

// Get user's orders
getUserOrders(userId: string): Promise<Order[]>

// Get order with items
getOrderWithItems(orderId: string): Promise<Order & { items: OrderItem[] }>

// Update order status (admin)
updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>
```

### Cart & Wishlist

```typescript
// Cart
getCartItems(userId: string): Promise<CartItem[]>
addToCart(userId: string, productId: string, quantity: number): Promise<void>
updateCartQuantity(userId: string, productId: string, quantity: number): Promise<void>
removeFromCart(userId: string, productId: string): Promise<void>

// Wishlist
getWishlist(userId: string): Promise<string[]>
addToWishlist(userId: string, productId: string): Promise<void>
removeFromWishlist(userId: string, productId: string): Promise<void>
```

---

## 7. Components

### Layout Components

| Component | Location | Purpose |
|-----------|----------|---------|
| Navbar | `components/Layout/Navbar.tsx` | Sticky header with search, cart, user menu |
| Footer | `components/Layout/Footer.tsx` | Site footer with links and info |

### Shared Components

| Component | Location | Purpose |
|-----------|----------|---------|
| ProductCard | `components/Product/ProductCard.tsx` | Reusable product display with add-to-cart |
| ErrorBoundary | `components/ErrorBoundary.tsx` | Catches React errors |
| EmptyState | `components/EmptyState.tsx` | Empty cart/error displays |
| LoadingSpinner | `components/LoadingSpinner.tsx` | Loading indicators |

---

## 8. State Management

### AppContext (Global State)

```typescript
interface AppContextType {
  cart: CartItem[];
  wishlist: string[];
  auth: AuthState;
  products: Product[];

  // Cart actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // Wishlist actions
  toggleWishlist: (productId: string) => void;

  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;

  // Computed
  cartTotal: number;
}
```

### Custom Hooks

| Hook | Returns | Purpose |
|------|---------|---------|
| `useAuth()` | `{ user, isAuthenticated, isLoading, login, logout, register }` | Auth state |
| `useCart()` | `{ items, addItem, removeItem, updateQuantity, clearCart, total }` | Cart operations |
| `useWishlist()` | `{ ids, add, remove, isInWishlist }` | Wishlist operations |
| `useProducts(filters?)` | `{ products, isLoading, error }` | Product listing |
| `useProduct(id)` | `{ product, isLoading, error }` | Single product |

---

## 9. Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Required Supabase services:
- PostgreSQL database
- Authentication (Email/Password)
- Row Level Security (RLS) policies

---

## 10. Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd Beautistic-Glam

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Initialize database
# Run the SQL files in your Supabase SQL editor:
# 1. supabase-setup.sql (or supabase-simple.sql for basic setup)
# 2. supabase-products.sql
# 3. supabase-orders.sql

# Start development server
npm run dev
```

### Database Setup

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Navigate to SQL Editor
4. Run the SQL files in order:
   - `supabase-setup.sql` - Creates tables and RLS policies
   - `supabase-products.sql` - Additional product configurations
   - `supabase-orders.sql` - Order-specific tables

---

## 11. Build & Deployment

### Build for Production

```bash
npm run build
```

Output is generated in the `dist/` folder.

### Deployment Options

#### Option 1: Static Hosting (Recommended)

Deploy `dist/` to:
- **Vercel**: `vercel --prod`
- **Netlify**: `netlify deploy --prod`
- **Cloudflare Pages**: Connect GitHub repo

#### Option 2: Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Production Checklist

- [ ] Set up Supabase production project
- [ ] Configure environment variables
- [ ] Enable Row Level Security policies
- [ ] Set up proper CORS policies in Supabase
- [ ] Configure custom domain
- [ ] Set up analytics (optional)
- [ ] Enable CDN caching for static assets
- [ ] Set up monitoring and error tracking

---

## 12. Testing Strategy

### Recommended Testing Setup

```bash
# Install testing dependencies
npm install -D vitest @testing-library/react @testing-library/user-event jsdom
```

### Test Structure

```
src/
├── __tests__/
│   ├── components/
│   │   ├── ProductCard.test.tsx
│   │   └── Navbar.test.tsx
│   ├── pages/
│   │   ├── Shop.test.tsx
│   │   └── Checkout.test.tsx
│   ├── hooks/
│   │   └── useCart.test.ts
│   └── lib/
│       ├── products.test.ts
│       └── orders.test.ts
│   └── setup.ts
```

### Testing Examples

```typescript
// Component test
import { render, screen } from '@testing-library/react';
import ProductCard from '../components/Product/ProductCard';

test('displays product name and price', () => {
  render(<ProductCard product={mockProduct} />);
  expect(screen.getByText('Product Name')).toBeInTheDocument();
});

// Hook test
import { renderHook, act } from '@testing-library/react';
import { useCart } from '../hooks/useCart';

test('adds item to cart', () => {
  const { result } = renderHook(() => useCart());
  act(() => result.current.addItem(mockProduct));
  expect(result.current.items).toHaveLength(1);
});
```

### E2E Testing (Playwright)

```bash
npm install -D @playwright/test
npx playwright install
```

```typescript
// e2e/checkout.spec.ts
import { test, expect } from '@playwright/test';

test('complete checkout flow', async ({ page }) => {
  await page.goto('/shop');
  await page.click('[data-testid="product-card"]');
  await page.click('button:has-text("Add to Cart")');
  await page.goto('/cart');
  await page.click('button:has-text("Checkout")');
  await page.fill('[name="customerName"]', 'John Doe');
  // ... complete form
  await page.click('button:has-text("Place Order")');
  await expect(page).toHaveURL(/\/order-confirmation/);
});
```

---

## 13. Security Considerations

### Row Level Security (RLS)

Ensure these RLS policies are applied in Supabase:

```sql
-- Users can only see their own data
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Products: Everyone can view active products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (is_active = true);

-- Cart: Users can only access their own cart
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own cart" ON cart_items
  FOR ALL USING (auth.uid() = user_id);

-- Orders: Users see own orders, admins see all
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);
```

### Input Validation

All user inputs are sanitized:
- Email validation (regex)
- Password minimum 6 characters
- XSS prevention via `sanitizeInput()`

### Best Practices

- [ ] Enable 2FA for admin accounts
- [ ] Use HTTPS only
- [ ] Set up rate limiting
- [ ] Implement CSRF protection
- [ ] Regular security audits
- [ ] Keep dependencies updated

---

## 14. Performance Optimization

### Current Optimizations

- Lazy loading for page components
- Local storage for guest cart persistence
- Image optimization (use WebP format)
- Tailwind CSS purging

### Recommended Optimizations

```typescript
// Add to vite.config.ts for better performance
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
  },
});
```

### Image Optimization

```typescript
// Use lazy loading for images
<img src={product.image} loading="lazy" alt={product.name} />
```

### Caching Strategy

```typescript
// Supabase response caching
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
```

---

## 15. Future Enhancements

### Short Term
- [ ] Product search with autocomplete
- [ ] Product reviews and ratings submission
- [ ] Order tracking integration
- [ ] Email notifications for orders

### Medium Term
- [ ] Multiple payment methods (Stripe, PayPal)
- [ ] Product comparison feature
- [ ] Blog/content section
- [ ] Loyalty/reward points system

### Long Term
- [ ] Mobile app (React Native)
- [ ] AI-powered product recommendations
- [ ] Multi-language support (i18n)
- [ ] Subscription/kit boxes

---

## Support

For questions or issues, please refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [React Router Documentation](https://reactrouter.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
