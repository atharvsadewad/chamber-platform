# Law and Judgments

Frontend foundation for Laws and Judgments, an enterprise legal research platform.
Built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS,
and shadcn/ui conventions. This repo contains **frontend only** — no
backend, database, or API implementation.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Design system

The visual identity is drawn from the subject itself — Laws and Judgments,
citators, and citation formats — rather than generic SaaS defaults.

- **Palette:** deep Laws and Judgments green (`--primary`) and brass (`--accent`)
  over a vellum-cream light theme / near-black "Laws and Judgments at night"
  dark theme. Signal colors (`signal-good` / `signal-caution` /
  `signal-bad`) mirror real citator treatment flags.
- **Type:** Fraunces (serif) for display and headings, Inter for body
  and UI text, IBM Plex Mono reserved for citations and docket IDs —
  echoing the fixed-width look of real legal citations.
- **Signature element:** `SignalBadge` — Laws and Judgments's citator signal,
  reused across the landing page, cards, and empty/error states.

All color tokens live in `app/globals.css` as CSS variables and are
mapped into Tailwind via `tailwind.config.ts`, so `bg-primary`,
`text-accent`, `bg-signal-good`, etc. are available anywhere.

## Project structure

```
app/
  layout.tsx        Root layout: fonts, ThemeProvider, Navbar, Footer
  page.tsx           Landing page (composes components/sections/*)
  loading.tsx        Route-level loading skeleton
  error.tsx          Route-level error boundary
  not-found.tsx       404 page
  global-error.tsx    Root-level error boundary (layout failures)
  globals.css         Design tokens + Tailwind layers

components/
  theme-provider.tsx  next-themes wrapper (light/dark)
  layout/
    navbar.tsx          Responsive nav bar with mobile disclosure menu
    footer.tsx          Site footer with link columns
    theme-toggle.tsx    Light/dark toggle button
  ui/
    button.tsx          Reusable Button (CVA variants)
    card.tsx             Card + CardHeader/Title/Description/Content/Footer
    search.tsx           SearchBar (query + scope filters)
    signal-badge.tsx     Citator signal badge (good/caution/bad)
    skeleton.tsx         Skeleton primitive + composed loading states
    typography.tsx       Display/H1/H2/H3/Lead/Text/Muted/Eyebrow/Citation
  sections/
    hero.tsx             Landing hero + search + popular searches
    stats.tsx            Coverage/scale stats strip
    signals-demo.tsx      Laws and Judgments Signals showcase (signature section)
    features.tsx          Feature grid (built on Card)
    cta.tsx               Closing call-to-action

lib/
  utils.ts             cn() class-merge helper
  fonts.ts             next/font loaders (Fraunces, Inter, IBM Plex Mono)
```

## Notes

- All components are typed, accessible (labeled controls, focus
  states, `aria-*` where relevant), and responsive from mobile up.
- `SearchBar` is presentational: it manages local query/scope state
  and pushes to `/search?q=...&scope=...` on submit. It does not call
  any API — wire an `onSearch` handler or a real `/search` route in
  the backend project.
- `prefers-reduced-motion` is respected globally in `globals.css`.
