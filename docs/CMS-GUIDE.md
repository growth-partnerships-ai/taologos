# How to edit EVERY part of the Taologos website

## Open the CMS (Studio)

| | URL |
|---|---|
| Live | `https://YOUR-DOMAIN/studio` or `/cms` |
| Local | `http://localhost:3000/studio` |

Use [sanity.io/manage](https://www.sanity.io/manage) only for invites, CORS, and API tokens — **not** for page editing.

## Seed from Vercel (no VS Code / no terminal)

Vercel has **no “run npm script” button**. Env vars go here:

1. Vercel dashboard → your project → **Settings** → **Environment Variables**
2. Add:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` = `k8clerei`
   - `NEXT_PUBLIC_SANITY_DATASET` = `production`
   - `SANITY_API_WRITE_TOKEN` = Editor token from Sanity Manage → API → Tokens
   - `SEED_SECRET` = any long password you invent (example: `taologos-seed-2026`)
3. **Redeploy** the project (Deployments → … → Redeploy) so env vars apply
4. In your browser open once:
   `https://YOUR-VERCEL-URL/api/seed?secret=taologos-seed-2026`
5. You should see `{"ok":true,...}`
6. Open `https://YOUR-VERCEL-URL/studio` to edit
7. Delete `SEED_SECRET` (and optionally the write token) from Vercel env when finished

Do **not** put `npm run seed:sanity` in the Vercel Build Command.

## What edits what

| Studio item | Controls |
|---|---|
| **Site settings** | Brand name, subtitle, tagline, logo, **nav links**, header CTA, **Menu/Close** labels, **all contacts**, SEO, footer, skip-link & nav aria labels |
| **Home page → Page sections** | **Add / remove / reorder / disable** every section; all section copy, **eyebrows**, images, form labels, project field labels & group headings |
| **Projects** | Each portfolio project: details, **photos** (one or many), **client testimonial** |

### Labels that used to look “fixed” (now editable)

Every small label on the page is a CMS field — including section eyebrows (Company, Portfolio, Trust…), Location/Type/Scope, “Presented to”, contact form Name/Phone/Email/Message/Submit, and Menu/Close.
### Per project (Projects → open one)

- **Project photos** — upload/replace as many images as you want (first = main card)
- **Client testimonial** — Quote + Attribution (optional; leave blank until you have a real quote)

### Section types you can add on Home page

Hero · Who we are · Mission & vision · Values · Services · Projects · Recognition · Team · Contact  

Drag to reorder. Set **Enabled = off** to hide without deleting. Always **Publish**.

## After seeding

- Change phone/email → Site settings → Publish  
- Hide Team → Home page → Team section → Enabled off → Publish  
- New project → Projects → Create → then link it under Home → Projects section (or leave refs empty to show all)  
- New certificate → Home → Recognition section → add item + upload image  

The public site reads **published** Sanity content (with a short cache). Hard-refresh after publish if you do not see changes immediately.
