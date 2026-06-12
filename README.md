# WearLoop — Frontend

A Next.js 14 frontend for WearLoop, a circular fashion rental platform.

## Stack

- **Next.js 14** (App Router, TypeScript, `src/` directory)
- **Tailwind CSS** — custom design tokens for WearLoop's editorial palette
- **ESLint** — `next/core-web-vitals` config
- **Lucide React** — icons

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout (Navbar + Footer)
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Tailwind + base styles + fonts
│   ├── auth/page.tsx       # Sign in / Register
│   ├── shop/
│   │   ├── page.tsx        # Browseable product grid with filters
│   │   └── [id]/page.tsx   # Product detail + rental booking
│   ├── cart/page.tsx       # Rental bag
│   ├── how-it-works/       # How It Works page
│   └── about/              # About page
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── HeroSection.tsx         # Circular rotating text signature
│   │   ├── FeaturedSection.tsx
│   │   ├── HowItWorksSection.tsx
│   │   ├── SustainabilitySection.tsx
│   │   └── CTASection.tsx
│   └── ui/
│       ├── Button.tsx
│       └── ProductCard.tsx
├── lib/
│   ├── api.ts          # Axios-less fetch client → your Express backend
│   ├── mockData.ts     # Product fixtures for development
│   └── utils.ts        # formatPrice, getRentalPrice, token helpers
└── types/index.ts      # Shared TS types matching your backend DTOs
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

This should match the `PORT` in your backend's `.env`.

### 3. Start the dev server

```bash
npm run dev
```

Opens at `http://localhost:3000`.

## Connecting to the Backend

All API calls go through `src/lib/api.ts`. The client reads `NEXT_PUBLIC_API_URL` and calls your existing endpoints:

| Frontend action       | Backend endpoint             |
| --------------------- | ---------------------------- |
| Sign in               | `POST /auth/login`           |
| Register              | `POST /auth/register`        |
| Browse products       | `GET /products`              |
| Product detail        | `GET /products/:id`          |
| Place order           | `POST /orders`               |
| My orders             | `GET /orders/my`             |
| Cancel order          | `PATCH /orders/:id/cancel`   |
| Payments              | `POST /payments`             |

JWT tokens are stored in `localStorage` under `wearloop_token` and sent as `Authorization: Bearer <token>` on protected routes.

## Design Tokens

| Token             | Hex       | Usage                        |
| ----------------- | --------- | ---------------------------- |
| `charcoal`        | `#1A1A2E` | Page background              |
| `charcoal-light`  | `#252540` | Card / section backgrounds   |
| `parchment`       | `#F5F0E8` | Primary text                 |
| `rose`            | `#C9A898` | Primary accent / CTA         |
| `sage`            | `#8A9E8C` | Sustainability / secondary   |

## Build

```bash
npm run build
npm start
```
