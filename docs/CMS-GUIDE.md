# How to edit EVERY part of the Taologos website

## Open the CMS (Studio)

| | URL |
|---|---|
| Live | `https://YOUR-DOMAIN/studio` or `/cms` |
| Local | `http://localhost:3000/studio` |

Use [sanity.io/manage](https://www.sanity.io/manage) only for invites, CORS, and API tokens — **not** for page editing.

## Make everything editable (one-time seed)

Studio starts empty until documents exist. Seed the full page from our content:

1. Manage → **API** → **Tokens** → create token with **Editor** rights  
2. Add to `.env.local`:
   ```bash
   SANITY_API_WRITE_TOKEN=your_token_here
   ```
3. Run:
   ```bash
   npm run seed:sanity
   ```
4. Open `/studio` — you will see **Site settings**, **Home page**, and **Projects** filled in.

Then every visible block is editable. Upload images (logo, hero, projects, certificates) in Studio where marked.

## What edits what

| Studio item | Controls |
|---|---|
| **Site settings** | Brand name, subtitle, tagline, logo, **nav links**, header CTA, **all contacts**, SEO, footer |
| **Home page → Page sections** | **Add / remove / reorder / disable** every section; all section copy & images |
| **Projects** | Each portfolio project (title, client, group, photos, testimonial…) |

### Section types you can add on Home page

Hero · Who we are · Mission & vision · Values · Services · Projects · Recognition · Team · Contact  

Drag to reorder. Set **Enabled = off** to hide without deleting. Always **Publish**.

## After seeding

- Change phone/email → Site settings → Publish  
- Hide Team → Home page → Team section → Enabled off → Publish  
- New project → Projects → Create → then link it under Home → Projects section (or leave refs empty to show all)  
- New certificate → Home → Recognition section → add item + upload image  

The public site reads **published** Sanity content (with a short cache). Hard-refresh after publish if you do not see changes immediately.
