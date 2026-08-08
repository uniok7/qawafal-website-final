import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { PlayCircle, Truck, MapPin, ArrowLeft, PackageOpen } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { API, waLink, resolveImage, formatOMR, formatOMRCompact } from "@/lib/format";
import { useReveal } from "@/hooks/useReveal";
import UploadPhoto from "@/components/UploadPhoto";
import ProductCard from "@/components/ProductCard";
import { WhatsAppIcon } from "@/components/FloatingWhatsApp";

function HeroMedia({ video, image, t }) {
  if (video) {
    return (
      <video
        src={resolveImage(video)}
        autoPlay
        muted
        loop
        playsInline
        data-testid="hero-video"
        className="absolute inset-0 w-full h-full object-cover"
      />
    );
  }
  if (image) {
    return (
      <img
        src={resolveImage(image)}
        alt=""
        data-testid="hero-image"
        className="absolute inset-0 w-full h-full object-cover"
      />
    );
  }
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/40 border-2 border-dashed border-white/15 m-4 rounded-2xl">
      <PlayCircle className="w-12 h-12" strokeWidth={1.2} />
      <span className="text-sm font-medium">{t.home.heroVideoNote}</span>
    </div>
  );
}

function Hero() {
  const { t } = useLang();
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await axios.get(`${API}/settings`)).data,
  });

  return (
    <section className="relative overflow-hidden" data-testid="hero-section">
      <div className="relative h-[70vh] min-h-[460px] max-h-[720px] w-full bg-ink flex items-center justify-center">
        <HeroMedia video={settings?.hero_video_url} image={settings?.hero_image_url} t={t} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/55 to-black/45" />
        {/* Extra scrim behind the headline: the storefront photo has the brand
            name painted on the fascia, which competes with the hero copy. */}
        <div className="absolute inset-0 bg-black/25" />

        <div className="relative z-10 max-w-7xl w-full mx-auto px-6">
          <div className="max-w-xl">
            <span className="inline-block text-white/90 text-sm font-medium mb-4 px-3 py-1 rounded-full bg-brand/90">
              {t.home.heroKicker}
            </span>
            <h1 className="text-white font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight mb-4">
              {t.home.heroTitle}
            </h1>
            <p className="text-white/85 text-base sm:text-lg leading-relaxed mb-8">
              {t.home.heroSubtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={waLink(t.whatsapp.general, settings?.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="hero-whatsapp-cta"
                className="inline-flex items-center gap-2 px-7 h-14 rounded-full bg-wa text-white font-semibold text-base hover:bg-wa-hover hover:scale-[1.02] transition-transform duration-300"
              >
                <WhatsAppIcon className="w-5 h-5" />
                {t.home.heroCta}
              </a>
              <Link
                to="/catalog"
                data-testid="hero-shop-cta"
                className="inline-flex items-center gap-2 px-7 h-14 rounded-full bg-white text-ink font-semibold text-base hover:bg-white/90 transition-colors"
              >
                {t.home.shopNow}
                <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DeliveryStrip() {
  const { t, isAr } = useLang();
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await axios.get(`${API}/settings`)).data,
  });
  const text = settings
    ? `${isAr ? settings.delivery_area_ar : settings.delivery_area_en} — ${t.deliveryPage.minOrderLabel}: ${formatOMRCompact(settings.min_order, t.common.currency)}`
    : t.delivery.strip;
  return (
    <div className="bg-brand text-white" data-testid="delivery-strip">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-center gap-3 text-center">
        <Truck className="w-5 h-5 shrink-0" />
        <span className="text-sm sm:text-base font-medium">{text}</span>
      </div>
    </div>
  );
}

function CategoryTile({ cat, isAr, index }) {
  const label = isAr ? cat.name_ar : cat.name_en;
  // First tile spans wider on desktop for an editorial bento feel
  const wide = index === 0;
  return (
    <Link
      to={`/catalog/${cat.slug}`}
      data-testid={`category-tile-${cat.slug}`}
      className={`reveal group relative overflow-hidden rounded-2xl bg-ink ${
        wide ? "sm:col-span-2 sm:row-span-2" : ""
      }`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div className={`${wide ? "aspect-square sm:aspect-auto sm:h-full" : "aspect-[4/3]"} w-full`}>
        {cat.image_url ? (
          <img
            src={cat.image_url}
            alt={label}
            loading="lazy"
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
          />
        ) : (
          <UploadPhoto className="w-full h-full" />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-end justify-between">
        <h3 className={`font-ar font-semibold text-white ${wide ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"}`}>
          {label}
        </h3>
        <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm text-white group-hover:bg-brand transition-colors">
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        </span>
      </div>
    </Link>
  );
}

function Categories() {
  const { t, isAr } = useLang();
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => (await axios.get(`${API}/categories`)).data,
  });
  const ref = useReveal(categories.length);

  return (
    <section ref={ref} className="max-w-7xl mx-auto px-6 py-16 sm:py-24" data-testid="categories-section">
      <div className="mb-10 max-w-2xl">
        <h2 className="text-3xl sm:text-4xl font-bold mb-3">{t.home.categoriesTitle}</h2>
        <p className="text-ink-2 text-base">{t.home.categoriesSub}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 auto-rows-fr gap-3 sm:gap-4">
        {categories.map((cat, i) => (
          <CategoryTile key={cat.id} cat={cat} isAr={isAr} index={i} />
        ))}
      </div>
    </section>
  );
}

function NewThisWeek() {
  const { t } = useLang();
  const { data: products = [] } = useQuery({
    queryKey: ["products", "new"],
    queryFn: async () => (await axios.get(`${API}/products`, { params: { is_new: true, limit: 8 } })).data,
  });
  const ref = useReveal(products.length + 1);

  return (
    <section ref={ref} className="bg-[var(--surface-muted,#F3F4F6)]" data-testid="new-week-section">
      <div className="max-w-7xl mx-auto px-6 py-16 sm:py-24">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">{t.home.newTitle}</h2>
          <p className="text-ink-2 text-base">{t.home.newSub}</p>
        </div>

        {products.length === 0 ? (
          <div
            data-testid="new-week-empty"
            className="reveal flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl border-2 border-dashed border-[#D1D5DB] bg-white"
          >
            <PackageOpen className="w-12 h-12 text-ink-3 mb-4" strokeWidth={1.2} />
            <h3 className="text-lg font-semibold text-ink mb-1">{t.home.emptyNewTitle}</h3>
            <p className="text-sm text-ink-3">{t.home.emptyNewSub}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function BranchCard({ branch, isAr, t, index }) {
  const name = isAr ? branch.name_ar : branch.name_en;
  const address = isAr ? branch.address_ar : branch.address_en;
  return (
    <div
      data-testid={`branch-card-${index}`}
      className="reveal bg-white rounded-2xl border border-[var(--line)] p-6 flex flex-col hover:border-brand hover:-translate-y-1 transition-all duration-300 ease-out"
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-[var(--brand-muted)] text-brand">
          <MapPin className="w-5 h-5" />
        </span>
        <h3 className="font-ar font-semibold text-xl">{name}</h3>
      </div>
      <p className="text-ink-2 text-sm leading-relaxed flex-1 mb-5">{address}</p>
      {branch.maps_url ? (
        <a
          href={branch.maps_url}
          target="_blank"
          rel="noopener noreferrer"
          data-testid={`branch-map-link-${index}`}
          className="inline-flex items-center gap-2 self-start px-5 h-11 rounded-full border border-brand text-brand font-medium text-sm hover:bg-brand hover:text-white transition-colors"
        >
          <MapPin className="w-4 h-4" />
          {t.home.viewMap}
        </a>
      ) : null}
    </div>
  );
}

function Branches() {
  const { t, isAr } = useLang();
  const { data: branches = [] } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => (await axios.get(`${API}/branches`)).data,
  });
  const ref = useReveal(branches.length);

  return (
    <section ref={ref} className="max-w-7xl mx-auto px-6 py-16 sm:py-24" data-testid="branches-section">
      <div className="mb-10 max-w-2xl">
        <h2 className="text-3xl sm:text-4xl font-bold mb-3">{t.home.branchesTitle}</h2>
        <p className="text-ink-2 text-base">{t.home.branchesSub}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {branches.map((b, i) => (
          <BranchCard key={b.id} branch={b} isAr={isAr} t={t} index={i} />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div data-testid="home-page">
      <Hero />
      <DeliveryStrip />
      <Categories />
      <NewThisWeek />
      <Branches />
    </div>
  );
}
