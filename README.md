# Taologos General Contractor — company profile site

Long single-page marketing site with a Sanity CMS content model, seeded English content, and a contact form that notifies **Telegram** and optionally sends a thank-you email via **Resend**.

## Stack

- **Next.js** (App Router) — site + embedded Studio at `/studio`
- **Sanity** — schemas ready; connect a project ID when you create one
- **Vercel** — recommended host (client buys domain only)
- **Telegram + Resend** — contact flow (option A)

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

CMS Studio: [http://localhost:3000/studio](http://localhost:3000/studio) (needs `NEXT_PUBLIC_SANITY_PROJECT_ID`).

The public page works **without** Sanity using seed content in `src/lib/content/seed.ts`.

## What the client can edit (once Sanity is connected)

- Site settings: brand, tagline, contacts, SEO, footer
- Home page **sections** (add / remove / reorder): Hero, Who we are, Mission & vision, Values, Services, Projects, Contact, **Team** (schema ready, not shown on page in v1)
- Projects with group themes, galleries, optional testimonials

Invite **two admins** in the Sanity project members UI — no custom user system.

## Contact form

1. Create a Telegram bot via [@BotFather](https://t.me/BotFather), get the token (or use the existing `@taologos_bot`).
2. Open Telegram, message the bot (**Start**), then run:
   ```bash
   ./scripts/telegram-chat-id.sh
   ```
3. Put `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in `.env.local` (never commit them).
4. Optional: set `RESEND_API_KEY` for visitor thank-you emails.
5. Optional fallback: `CONTACT_NOTIFY_EMAIL` + `RESEND_API_KEY` emails the company if Telegram is down/unset.

In local `npm run dev` without company delivery configured, submissions are accepted and logged to the server console.

## Amharic later

Documents include a `language` field (`en` / `am`). Ship English only for now; add Amharic documents + locale routing when ready. `Noto Sans Ethiopic` is already loaded for Ethiopic script support.

## Deploy

1. Push this repo to GitHub.
2. Import in Vercel; add env vars.
3. Point the client domain DNS to Vercel.
4. Create a Sanity project, paste the project ID, invite two editors.

## Brand notes

- Palette: deep navy/black + orange accent (from company profile)
- Not a PDF flip-book — modern long-scroll profile with grouped projects
- Mission / vision / values copy rewritten for a Grade Six contractor (approved)
