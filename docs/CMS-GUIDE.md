# How to edit the Taologos website

## For the client (recommended)

Open:

`https://YOUR-DOMAIN/edit`

Default accounts (change password on first login):

- `superadmin@taologos.com` / `admin1234`
- `admin@taologos.com` / `admin1234`
- `binyamt3@gmail.com` / `admin1234`
- `taologos04@gmail.com` / `admin1234`

Passwords are stored in Sanity as **bcrypt hashes** on `cmsUser` documents (never plain text).

### What you can do in `/edit`

- Click the page (looks like the live site) to edit header, sections, and footer
- Add / remove / reorder list items (values, services, credentials, contacts, projects, etc.)
- Insert a new section with the **+** line between sections (template picker)
- Upload or drag images
- **Save section** or **Save all**
- Superadmin: **Users** button to create admins, reset passwords, deactivate accounts

`/cms` still opens Studio for advanced use — clients should use **`/edit` only**.

## Env vars for `/edit`

In Vercel:

- `SANITY_API_WRITE_TOKEN` — Editor token (so `/edit` can save content and manage users)
- `EDIT_SESSION_SECRET` — long random string used to **sign** the login cookie (not a user password). Without it, someone could forge a “logged in” cookie. Generate any long random value, e.g. a password manager string.
- `EDIT_SESSION_MAX_AGE_SECONDS` — default `604800` (7 days)
- `SEED_SECRET` — for `/api/seed` and backup user ensure

## Seed

Local: `npm run seed:sanity`  
Or: `https://YOUR-SITE/api/seed?secret=YOUR_SEED_SECRET`

## Studio (advanced)

`/studio` — structured Sanity documents. Prefer `/edit` for day-to-day changes.
