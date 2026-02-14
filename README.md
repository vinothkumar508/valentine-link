# Classic Moments ✨

A **fully static**, zero-backend web app that lets you create a personalized memory link for any occasion. The recipient gets an interactive YES/NO experience; choosing YES reveals a message and optional photo gallery.

## Tech stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Static export** — no server, no API routes, no database, no auth

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the experience. (The link generator is intentionally private and access-gated.)

## Deploy (Vercel)

```bash
npm run build
```

The `out` folder is a static export. Deploy to Vercel (or any static host); no server or env vars required.

## How it works

- **Personalization is in the URL** — e.g. `/?to=Ananya&from=Vinoth&msg=Will%20you%20be%20mine&imgs=https://a.jpg|https://b.jpg`
- All inputs are **sanitized and escaped** (no raw params in the DOM, XSS-safe).
- **Images** are lazy-loaded only after the recipient clicks YES; only `https://` URLs are accepted.

## Project structure

```
/app
  page.tsx   → Interactive proposal (YES/NO, confetti, gallery modal)
/components  → Card, Input, Buttons, Confetti, GalleryModal, Toast
/utils       → sanitize.ts, decodeParams.ts
```

## License

MIT
