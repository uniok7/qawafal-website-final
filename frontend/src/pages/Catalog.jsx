import { useState, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PackageOpen, ChevronDown } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { API } from "@/lib/format";
import { useReveal } from "@/hooks/useReveal";
import ProductCard from "@/components/ProductCard";

const PAGE_SIZE = 12;

function pageTitle(active, isAr, t) {
  if (!active) return t.catalog.allTitle;
  return isAr ? active.name_ar : active.name_en;
}

function chipClass(isActive) {
  const base = "shrink-0 px-4 h-10 inline-flex items-center rounded-full text-sm font-medium border transition-colors";
  if (isActive) return `${base} bg-brand text-white border-brand`;
  return `${base} border-[var(--line)] text-ink-2 hover:border-brand hover:text-brand`;
}

function CategoryChips({ categories, slug, isAr, t }) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6" data-testid="category-chips">
      <Link to="/catalog" data-testid="chip-all" className={chipClass(!slug)}>
        {t.catalog.all}
      </Link>
      {categories.map((c) => (
        <Link key={c.id} to={`/catalog/${c.slug}`} data-testid={`chip-${c.slug}`} className={chipClass(slug === c.slug)}>
          {isAr ? c.name_ar : c.name_en}
        </Link>
      ))}
    </div>
  );
}

function BrandChips({ brands, brand, onChange, isAr, t }) {
  // Nothing to filter by until at least two brands exist in this category.
  if (brands.length < 2) return null;
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-6" data-testid="brand-chips">
      <button type="button" onClick={() => onChange(null)} data-testid="brand-all" className={chipClass(!brand)}>
        {t.catalog.allBrands}
      </button>
      {brands.map((b) => (
        <button
          key={b.key}
          type="button"
          onClick={() => onChange(b.key)}
          data-testid={`brand-${b.key}`}
          className={chipClass(brand === b.key)}
        >
          <span dir="ltr">{isAr ? b.name_ar : b.name}</span>
          <span className="ms-2 text-[11px] opacity-60">{b.count}</span>
        </button>
      ))}
    </div>
  );
}

function SortSelect({ sort, onChange, t }) {
  return (
    <div className="relative">
      <select
        value={sort}
        onChange={(e) => onChange(e.target.value)}
        data-testid="sort-select"
        className="appearance-none h-11 ps-4 pe-10 rounded-full border border-[var(--line)] bg-white text-sm font-medium text-ink cursor-pointer focus:outline-none focus:border-brand"
      >
        <option value="newest">{t.catalog.sortNewest}</option>
        <option value="price_asc">{t.catalog.sortPriceAsc}</option>
        <option value="price_desc">{t.catalog.sortPriceDesc}</option>
      </select>
      <ChevronDown className="w-4 h-4 absolute end-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-ink-3" />
    </div>
  );
}

function EmptyState({ t }) {
  return (
    <div
      data-testid="catalog-empty"
      className="flex flex-col items-center justify-center text-center py-20 px-6 rounded-2xl border-2 border-dashed border-[#D1D5DB] bg-white"
    >
      <PackageOpen className="w-12 h-12 text-ink-3 mb-4" strokeWidth={1.2} />
      <h3 className="text-lg font-semibold text-ink mb-1">{t.catalog.emptyTitle}</h3>
      <p className="text-sm text-ink-3">{t.catalog.emptySub}</p>
    </div>
  );
}

export default function Catalog() {
  const { slug } = useParams();
  const { t, isAr } = useLang();
  const [sort, setSort] = useState("newest");
  const [limit, setLimit] = useState(PAGE_SIZE);

  // Brand lives in the URL (?brand=gissah) so a filtered view is shareable.
  const [searchParams, setSearchParams] = useSearchParams();
  const brand = searchParams.get("brand");
  const setBrand = (key) => {
    const next = new URLSearchParams(searchParams);
    if (key) next.set("brand", key);
    else next.delete("brand");
    setSearchParams(next, { replace: true });
  };

  useEffect(() => setLimit(PAGE_SIZE), [slug, sort, brand]);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await axios.get(`${API}/categories`)).data,
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["brands", slug || "all"],
    queryFn: async () => (await axios.get(`${API}/brands`, { params: { category: slug || undefined } })).data,
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", slug || "all", brand || "any", sort, limit],
    queryFn: async () =>
      (
        await axios.get(`${API}/products`, {
          params: { category: slug || undefined, brand: brand || undefined, sort, limit: limit + 1 },
        })
      ).data,
  });

  const hasMore = products.length > limit;
  const visible = products.slice(0, limit);
  const active = categories.find((c) => c.slug === slug);
  const ref = useReveal(visible.length + (slug || "") + sort + (brand || ""));

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 sm:py-14" data-testid="catalog-page">
      <h1 className="text-3xl sm:text-4xl font-bold mb-8">{pageTitle(active, isAr, t)}</h1>

      <CategoryChips categories={categories} slug={slug} isAr={isAr} t={t} />

      <BrandChips brands={brands} brand={brand} onChange={setBrand} isAr={isAr} t={t} />

      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-ink-3" data-testid="products-count">
          {visible.length} {t.catalog.product}
        </span>
        <SortSelect sort={sort} onChange={setSort} t={t} />
      </div>

      {!isLoading && visible.length === 0 ? (
        <EmptyState t={t} />
      ) : (
        <div ref={ref}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5" data-testid="products-grid">
            {visible.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
          {hasMore && (
            <div className="text-center mt-10">
              <button
                onClick={() => setLimit((l) => l + PAGE_SIZE)}
                data-testid="load-more-btn"
                className="px-8 h-12 rounded-full border border-brand text-brand font-medium hover:bg-brand hover:text-white transition-colors"
              >
                {t.catalog.loadMore}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
