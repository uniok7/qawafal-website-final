# Adding products (and brands)

Everything lives in one file: `frontend/src/data/site.json`.
Edit it on GitHub, commit, and Netlify rebuilds the live site in about a minute.

---

## Two steps for every product

### Step 1 — upload the photo

GitHub → `frontend` → `public` → `images` → **Add file → Upload files**

Drag the photo in. Use simple names, no spaces:
`gissah-marj-60.jpg`, not `IMG_2847 (1).jpg`

Commit.

### Step 2 — add it to the list

GitHub → `frontend` → `src` → `data` → **`site.json`** → pencil icon.

Find this line:

```json
"products": [],
```

Replace it with:

```json
"products": [
  {
    "id": "gissah-marj-60",
    "name_ar": "عطر مرج من قصة 60 مل",
    "name_en": "Gissah Marj EDP 60 ml",
    "brand": "Gissah",
    "brand_ar": "قصة",
    "category_slug": "perfume",
    "price": 25.000,
    "description_ar": "رائحة شرقية تدوم من الصباح حتى المساء",
    "images": ["/images/gissah-marj-60.jpg"],
    "in_stock": true,
    "branches": ["branch-2"],
    "is_new": true,
    "created_at": "2026-08-08T10:00:00Z"
  }
]
```

Commit. Done.

---

## Adding a second product

Copy everything from `{` to `}`, paste it after, and put a **comma** between them:

```json
"products": [
  {
    ... first product ...
  },
  {
    ... second product ...
  }
]
```

The last product before `]` has **no** comma after its `}`. That single rule causes
almost every broken edit.

---

## How brands work

Brands appear **automatically**. There is no separate brand list to maintain.

Add a product with `"brand": "Gissah"` and a Gissah filter chip appears on the
perfume page. Add one with `"brand": "Lattafa"` and that chip appears too.

- Chips only show when a category has **2 or more** brands.
- They're sorted by how many products each brand has.
- `brand_ar` is optional. Leave it out and the Latin name shows in both languages
  — which is normal for perfume brands.
- Spelling must match exactly. `"Gissah"` and `"gissah"` are the same brand, but
  `"Gisah"` creates a second, wrong one. Copy-paste the brand name every time.
- Leave `"brand"` out entirely for unbranded products.

### Shareable brand links

Filtering updates the address bar, so you can send someone a direct link:

```
https://qawafal.netlify.app/catalog/perfume?brand=gissah
```

Useful for WhatsApp replies — "here's all our Gissah."

---

## Field reference

| Field | Required | Notes |
|---|---|---|
| `id` | yes | Unique, no spaces. Becomes the product URL. |
| `name_ar` | yes | Arabic name — what most customers see. |
| `name_en` | yes | English name. |
| `brand` | no | Latin spelling. Drives the filter chips. |
| `brand_ar` | no | Arabic spelling, if the brand has one. |
| `category_slug` | yes | See list below. |
| `price` | yes | A **number**, no quotes: `25.000` not `"25.000"` |
| `description_ar` | no | One or two lines. |
| `images` | no | Array of paths. First one is the main photo. |
| `in_stock` | yes | `true` or `false` (no quotes). |
| `branches` | yes | `["branch-1"]`, `["branch-2"]`, or both. |
| `is_new` | no | `true` puts it in "new this week". |
| `created_at` | yes | Controls newest-first sorting. |

### Category slugs

`perfume` · `women` · `bags` · `school` · `electronics` · `home` · `toys`

---

## Category photos

The seven grey boxes on the homepage need real photos of each department.

1. Upload a photo to `frontend/public/images/` (e.g. `cat-perfume.jpg`)
2. In `site.json`, find the categories list and fill in `image_url`:

```json
{ "id": "cat-perfume", "slug": "perfume", "name_ar": "عطور", "name_en": "Perfume", "order": 1, "image_url": "/images/cat-perfume.jpg" },
```

---

## If the site breaks after an edit

You missed a comma, or added one too many. GitHub marks the bad line with a red
mark while you're editing. Netlify also keeps every previous version — go to
**Deploys**, find the last working one, and click **Publish deploy** to roll back
instantly.

---

## Still to fill in

In `site.json` under `settings` and `branches`:

- `closing_time`
- `instagram`
- Branch 1: `address_ar`, `address_en`, `maps_url`
