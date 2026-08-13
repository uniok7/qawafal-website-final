import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { Store, MapPin, ArrowLeft } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { API, resolveImage } from "@/lib/format";

// Local file — never an external URL, which would break when that host goes away.
const STOREFRONT = "/images/storefront-dusk.webp";

function Stat({ value, label }) {
  return (
    <div className="text-center px-6 py-5 rounded-2xl bg-white border border-[var(--line)]">
      <p className="text-3xl font-bold text-brand mb-1" dir="ltr">{value}</p>
      <p className="text-sm text-ink-2">{label}</p>
    </div>
  );
}

export default function About() {
  const { t, isAr } = useLang();
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await axios.get(`${API}/settings`)).data,
  });
  const heroImg = settings?.hero_image_url || STOREFRONT;

  return (
    <div data-testid="about-page">
      <div className="relative h-[45vh] min-h-[320px] bg-ink overflow-hidden">
        <img src={resolveImage(heroImg)} alt={t.brand} className="absolute inset-0 w-full h-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-10">
          <span className="inline-flex items-center gap-2 self-start text-sm font-medium mb-4 px-3 py-1 rounded-full bg-brand text-white">
            <Store className="w-4 h-4" />
            {t.nav.about}
          </span>
          <h1 className="text-white text-4xl sm:text-5xl font-bold">{t.aboutPage.title}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] items-start">
          <div>
            <p className="text-lg leading-relaxed text-ink mb-5">{t.aboutPage.p1}</p>
            <p className="text-base leading-relaxed text-ink-2 mb-8">{t.aboutPage.p2}</p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/catalog"
                data-testid="about-catalog-cta"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-brand text-white font-semibold hover:bg-brand-hover transition-colors"
              >
                {t.home.shopNow}
                <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              </Link>
              <Link
                to="/branches"
                data-testid="about-branches-cta"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-brand text-brand font-semibold hover:bg-brand hover:text-white transition-colors"
              >
                <MapPin className="w-4 h-4" />
                {t.nav.branches}
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3" data-testid="about-stats">
            <Stat value="2010" label={t.aboutPage.statSince} />
            <Stat value="2" label={t.aboutPage.statBranches} />
            <Stat value="7" label={t.aboutPage.statDepartments} />
          </div>
        </div>
      </div>
    </div>
  );
}
