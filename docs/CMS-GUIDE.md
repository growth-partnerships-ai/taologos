# How to edit the Taologos website (CMS)

## Where is the CMS?

Not on [sanity.io/manage](https://www.sanity.io/manage) alone — that page is project billing/members.

**Content editing is in Studio:**

| Where | URL |
|---|---|
| On your live site | `https://YOUR-DOMAIN/studio` |
| Shortcut | `https://YOUR-DOMAIN/cms` |
| Locally | `http://localhost:3000/studio` |

Log in with the Sanity account that was invited (binyam / matshimelis).

## Why does it look empty?

Schemas were set up, but **no documents were created yet**.  
Until you create & publish documents, the public site uses built-in seed content.

## What to click (left sidebar)

1. **Site settings (contacts, SEO)**  
   Phones, emails, address, brand name, footer, SEO.

2. **Home page — add / remove sections** ← **this is the important one**  
   - Open it  
   - Find **Page sections**  
   - Click **Add item**  
   - Choose: Hero, Who we are, Mission & vision, Values, Services, Projects, Recognition, Contact, or Team  
   - Fill the fields  
   - Drag rows to **reorder**  
   - Set **Enabled** off to hide without deleting  
   - Click **Publish**

3. **Projects**  
   Create one document per project (title, client, group, photos, etc.).

## First-time setup (5 minutes)

1. Open `/studio`  
2. Click **Site settings** → fill contacts → **Publish**  
3. Click **Home page** → **Add item** for each section you want → **Publish**  
4. Click **Projects** → **Create** → add a few → **Publish**  
5. Refresh the public homepage

## Sanity Manage vs Studio

- **Manage** = invite users, CORS, plan, API tokens  
- **Studio** (`/studio`) = edit website content  

If Studio won’t load: in Manage → API → CORS, add your site URL with **Allow credentials**.
