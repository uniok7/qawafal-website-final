import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BadgePercent, CalendarDays } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { API, resolveImage } from "@/lib/format";
import { useReveal } from "@/hooks/useReveal";
import UploadPhoto from "@/components/UploadPhoto";

function OfferCard({ offer, isAr, t, index }) {
  const title = isAr ? offer.title_ar : offer.title_en || offer.title_ar;
  return (
    <article
      data-testid={`offer-card-${offer.id}`}
      className="reveal bg-white rounded-2xl border border-[var(--line)] overflow-hidden flex flex-col hover:border-brand hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.07)] transition-all duration-300 ease-out"
      style={{ transitionDelay: `${(index % 6) * 60}ms` }}
    >
      <div className="aspect-[16/9] bg-[#F3F4F6]">
        {offer.image ? (
          <img src={resolveImage(offer.image)} alt={title} loading="lazy" className="w-full h-full object-cover" />
        ) : (
          <UploadPhoto className="w-full h-full rounded-none border-0" />
        )}
      </div>
      <div className="p-5 flex flex-col gap-2 flex-1">
        <h3 className="font-ar font-bold text-lg leading-snug">{title}</h3>
        {offer.description_ar && isAr && (
          <p className="text-sm text-ink-2 leading-relaxed">{offer.description_ar}</p>
        )}
        {offer.end_date && (
          <p className="mt-auto pt-2 inline-flex items-center gap-2 text-xs font-medium text-brand">
            <CalendarDays className="w-4 h-4" />
            {t.offersPage.until} <span dir="ltr">{offer.end_date}</span>
          </p>
        )}
      </div>
    </article>
  );
}

export default function Offers() {
  const { t, isAr } = useLang();
  const { data: offers = [], isLoading } = useQuery({
    queryKey: ["offers"],
    queryFn: async () => (await axios.get(`${API}/offers`)).data,
  });
  const ref = useReveal(offers.length);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 sm:py-14" data-testid="offers-page">
      <div className="mb-10 max-w-2xl">
        <span className="inline-flex items-center gap-2 text-sm font-medium mb-4 px-3 py-1 rounded-full bg-[var(--brand-muted)] text-brand">
          <BadgePercent className="w-4 h-4" />
          {t.nav.offers}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">{t.offersPage.title}</h1>
        <p className="text-ink-2 text-base">{t.offersPage.subtitle}</p>
      </div>

      {!isLoading && offers.length === 0 ? (
        <div
          data-testid="offers-empty"
          className="flex flex-col items-center justify-center text-center py-20 px-6 rounded-2xl border-2 border-dashed border-[#D1D5DB] bg-white"
        >
          <BadgePercent className="w-12 h-12 text-ink-3 mb-4" strokeWidth={1.2} />
          <h3 className="text-lg font-semibold text-ink mb-1">{t.offersPage.emptyTitle}</h3>
          <p className="text-sm text-ink-3">{t.offersPage.emptySub}</p>
        </div>
      ) : (
        <div ref={ref} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="offers-grid">
          {offers.map((o, i) => (
            <OfferCard key={o.id} offer={o} isAr={isAr} t={t} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
