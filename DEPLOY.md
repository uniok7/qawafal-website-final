# Qawafal — Static Build & Deploy

The site now runs with **no server, no database, and no monthly cost.**

Content lives in one file: `frontend/src/data/site.json`.

---

## What changed from the Emergent version

| Before | Now |
|---|---|
| FastAPI + MongoDB backend | `frontend/src/data/site.json` |
| Admin panel at `/admin` | Edit the JSON file, then redeploy |
| Images on Emergent object storage | `frontend/public/images/` |
| Server-rendered WhatsApp previews (`/api/p/:id`) | Site-wide preview only (see Known limits) |
| Paid hosting | Cloudflare Pages / Netlify free tier |

The pages themselves were **not rewritten**. `frontend/src/lib/staticApi.js` intercepts the
same axios calls the pages already made and answers them from the JSON file. If you ever
want a real backend again, delete that one import from `index.js` and point
`API` in `lib/format.js` back at a server.

The old `backend/` folder is left in place for reference. It is not used or deployed.

---

## Run it locally

```bash
cd frontend
npm install
npm start
```

## Build it

```bash
cd frontend
npm run build
```

Output goes to `frontend/build/`.

---

## Deploy free on Cloudflare Pages

1. Push this repo to GitHub.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git.
3. Pick the repo, then set:
   - **Framework preset:** Create React App
   - **Build command:** `npm run build`
   - **Build output directory:** `build`
   - **Root directory:** `frontend`
4. Deploy.

SPA routing is handled by `not_found_handling = "single-page-application"` in
`wrangler.toml`, so `/catalog`, `/branches` etc. work on direct load and refresh.

Custom domain: add it in the Pages project settings and point your registrar's
DNS at Cloudflare. SSL is automatic and free.

---

## Editing content

Everything is in `frontend/src/data/site.json`. Edit, commit, push — the host rebuilds
automatically in about a minute.

### Adding a product

Add an object to the `products` array:

```json
{
  "id": "perfume-marj-60",
  "name_ar": "عطر مرج 60 مل",
  "name_en": "Marj EDP 60 ml",
  "category_slug": "perfume",
  "price": 17.500,
  "description_ar": "رائحة شرقية تدوم من الصباح حتى المساء",
  "description_en": "",
  "images": ["/images/products/marj-1.jpg", "/images/products/marj-2.jpg"],
  "in_stock": true,
  "branches": ["branch-2"],
  "is_new": true,
  "created_at": "2026-08-08T10:00:00Z"
}
```

- `id` — any unique string, no spaces. It becomes the product URL.
- `category_slug` — must match a slug in `categories`: `perfume`, `women`, `bags`,
  `school`, `electronics`, `home`, `toys`.
- `price` — a number, not a string. Displays as `17.500 ر.ع`.
- `images` — put the files in `frontend/public/images/products/` and reference them
  with a leading slash. First image is the primary.
- `branches` — array of branch ids: `branch-1`, `branch-2`, or both.
- `created_at` — controls "newest" sorting. ISO format.

### Adding an offer

```json
{
  "id": "offer-weekend",
  "title_ar": "عرض نهاية الأسبوع",
  "title_en": "Weekend Offer",
  "description_ar": "خصومات على العطور",
  "image": "/images/offers/weekend.jpg",
  "start_date": "2026-08-14",
  "end_date": "2026-08-16",
  "created_at": "2026-08-08T10:00:00Z"
}
```

Offers with a past `end_date` hide themselves automatically. Leave `end_date` empty
to keep one running indefinitely.

### School bag builder

Add to `school_bag_items`. `group` must be `bag`, `stationery`, or `extra`.
The page is hidden entirely by setting `settings.school_bag_visible` to `false`.

### Category images

All seven `image_url` fields are currently empty, so the site shows a labelled
placeholder rather than an unrelated stock photo. Add a real photo of that
department in the store and fill the field in.

---

## Still to fill in

These appear on the live site as `[FILL IN]`:

- `settings.closing_time`
- `settings.instagram`
- `branches[0].address_ar` / `address_en` / `maps_url` (Branch 1)

---

## Known limits of the static build

**Per-product WhatsApp previews.** The old backend rendered a page with per-product
Open Graph tags so a shared link showed the photo and Arabic name. A static host can't
do that per-product. Site-wide OG tags in `public/index.html` still work, so shared
links show the store name and logo — just not the specific product. To restore the full
behaviour later, add a Cloudflare Pages Function at `functions/p/[id].js` that returns
HTML with the right tags. Still free.

**No admin login.** If your dad's staff need a UI rather than editing JSON, add
Decap CMS or Sveltia CMS — both are free, sit on top of GitHub, and write to this same
JSON file. No server required.

**Search** routes to a "coming soon" page. It was never built. Worth doing once there
are enough products that browsing gets slow.

---

## Fixes already applied

- Removed `date-fns` / `react-day-picker` (version conflict that broke `npm install`)
  and the unused `ui/calendar.jsx` that imported them.
- Removed `@emergentbase/visual-edits`, a proprietary package hosted on Emergent's
  servers that would fail to install elsewhere.
- Arabic currency order corrected: `12.500 ر.ع`, not `ر.ع 12.500`.
- Whole-number minimum order now reads `5 ر.ع` rather than `5.000 ر.ع`.
- Darkened the hero scrim — the storefront photo has the brand name painted on the
  fascia, which was colliding with the headline text.

## Security note

The old backend had a hardcoded fallback admin password (`qawafal2010`) in
`backend/server.py`. Nothing uses it now that the admin panel is gone, but if you ever
revive that backend, set `ADMIN_PASSWORD` as a real environment variable first.
