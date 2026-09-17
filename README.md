# Taologos General Contractor — company profile site

Long single-page marketing site with a Sanity CMS content model, seeded English content, and a contact form that notifies **Telegram** (both admins) and optionally sends a thank-you email via **Resend**.

## Stack

- **Next.js** (App Router) — site + embedded Studio at `/studio`
- **Sanity** project `k8clerei` — schemas ready; seed fills the page until CMS docs exist
- **Vercel** — recommended host (client buys domain only)
- **Telegram** — form alerts to admin chat IDs

## Quick start

```bash
npm install
cp .env.example .env.local
# Fill TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_IDS (already set on the agent machine)
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- CMS: [http://localhost:3000/studio](http://localhost:3000/studio)

## Sanity setup checklist

1. Project ID: `k8clerei` (already wired).
2. In [sanity.io/manage](https://www.sanity.io/manage) → project **Taologos** → **Members**:
   - Invite `binyamt3@gmail.com` (Administrator)
   - Invite `matshimelis@gmail.com` (Administrator)
3. **API** → **CORS origins** — add:
   - `http://localhost:3000`
   - your future Vercel URL (e.g. `https://taologos.vercel.app`)
   - Enable **Allow credentials** for Studio.
4. Open `/studio`, sign in, create **Site settings** + **Projects** (or keep using seed until then).
5. Free plan is enough after the 30-day Growth trial ends ($0 forever unless you upgrade).

## Contact / Telegram

Both admins receive form alerts:

| Person | Telegram chat ID |
|---|---|
| Binyam | `315692957` |
| Matshimelis | `336660875` |

Set in `.env.local` / Vercel (never commit the bot token):

```bash
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_IDS=315692957,336660875
```

Each admin must have pressed **Start** on `@taologos_bot` at least once.

Optional: Resend thank-you emails via `RESEND_API_KEY`.

## Deploy (next major step)

1. Merge/push branch `cursor/taologos-company-site-2dfb`.
2. Import repo in Vercel.
3. Add env vars (`NEXT_PUBLIC_SANITY_*`, `TELEGRAM_*`, `NEXT_PUBLIC_SITE_URL`).
4. Deploy → add the Vercel URL to Sanity CORS.
5. Point the client domain DNS at Vercel when ready.

## Amharic later

Documents include a `language` field (`en` / `am`). English only for now.

## Brand notes

- Palette: deep navy/black + orange accent
- Recognition section includes the ISSPL / UN Congo certificate
- Mission / vision / values rewritten for a Grade Six contractor
