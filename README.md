# WearLoop (frontend)

Next.js 14 app for WearLoop, a clothing rental site. Uses the App Router,
TypeScript and Tailwind. Scroll reveals use GSAP and icons come from lucide-react.

## Running it

```bash
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
echo "RESEND_API_KEY=re_..." >> .env.local   # the contact form and `npm run build` need it
npm run dev                  # http://localhost:3002
```

`NEXT_PUBLIC_API_URL` points at the Express API (default `http://localhost:5000`).
Endpoints are listed in [ROUTES.md](ROUTES.md).

## Where things are

- `src/app/` holds the routes. Pages that need client state keep their UI in a
  `*Content.tsx` file next to `page.tsx`, so `page.tsx` can export metadata.
- `src/components/sections/` holds the homepage sections.
- `src/components/layout/` holds the Navbar and Footer.
- `src/hooks/useReveal.ts` is the one scroll-in animation. Add `data-reveal` to
  children of the element that gets the ref. Users who set reduced motion
  don't get it.
- `src/lib/api.ts` is the fetch client. `src/lib/mockData.ts` has the product
  fixtures used until the API serves products.
- `src/context/AppContext.tsx` holds the cart and favourites.

## Theme

Colours are CSS variables in `src/app/globals.css`, switched by the `dark` class
on `<html>`.

| Token | Use |
| --- | --- |
| `paper`, `paper-2` | Page background, tinted bands |
| `ink`, `ink-2` | Text, primary buttons |
| `rose`, `sage` | Accent fills and borders |
| `rose-ink`, `sage-ink` | Accent text. Darker in light mode and lighter in dark mode, so it stays readable |

Headings use Fraunces (loaded with `next/font`) and body text uses Inter.

## Building pages

Content pages are put together from `src/components/ui/Page.tsx`: `PageHeader`,
`Section`, `RuledList`, `PageFooterNote`, `LegalBody`, `ButtonLink` and
`TextLink`. Use those before adding new one-off layouts.

## Social links

Footer icons only appear for entries in `socialLinks`
(`src/components/layout/Footer.tsx`) that have a URL.

## Build

```bash
npm run build && npm start
```
