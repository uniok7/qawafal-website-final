import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { API } from "@/lib/format";

function BranchBlock({ branch, isAr, t, index }) {
  const name = isAr ? branch.name_ar : branch.name_en;
  const address = isAr ? branch.address_ar : branch.address_en;
  const mapQuery = branch.address_en || branch.address_ar;
  const hasLocation = !!branch.maps_url;

  return (
    <div
      className="bg-white rounded-2xl border border-[var(--line)] overflow-hidden"
      data-testid={`branches-page-card-${index}`}
    >
      <div className="aspect-[16/8] bg-[#F3F4F6]">
        {hasLocation ? (
          <iframe
            title={name}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`}
            data-testid={`branch-map-embed-${index}`}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div
            data-testid={`branch-map-missing-${index}`}
            className="w-full h-full flex flex-col items-center justify-center gap-2 text-ink-3 border-b-2 border-dashed border-[#D1D5DB]"
          >
            <MapPin className="w-8 h-8" strokeWidth={1.2} />
            <span className="text-xs font-medium">{t.branchesPage.mapMissing}</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h2 className="font-ar font-bold text-2xl mb-4">{name}</h2>
        <ul className="space-y-3 text-sm mb-6">
          {address && (
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-brand shrink-0 mt-0.5" />
              <span className="text-ink-2">{address}</span>
            </li>
          )}
          {branch.phone && (
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-brand shrink-0" />
              <a href={`tel:${branch.phone.replace(/\s/g, "")}`} dir="ltr" className="hover:text-brand" data-testid={`branch-phone-${index}`}>
                {branch.phone}
              </a>
            </li>
          )}
          {branch.hours && (
            <li className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-brand shrink-0" />
              <span dir="ltr" className="text-ink-2">{branch.hours}</span>
            </li>
          )}
        </ul>
        {hasLocation && (
          <a
            href={branch.maps_url}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={`branch-open-maps-${index}`}
            className="inline-flex items-center gap-2 px-5 h-11 rounded-full border border-brand text-brand font-medium text-sm hover:bg-brand hover:text-white transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            {t.home.viewMap}
          </a>
        )}
      </div>
    </div>
  );
}

export default function Branches() {
  const { t, isAr } = useLang();
  const { data: branches = [] } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => (await axios.get(`${API}/branches`)).data,
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 sm:py-14" data-testid="branches-page">
      <div className="mb-10 max-w-2xl">
        <span className="inline-flex items-center gap-2 text-sm font-medium mb-4 px-3 py-1 rounded-full bg-[var(--brand-muted)] text-brand">
          <MapPin className="w-4 h-4" />
          {t.nav.branches}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">{t.branchesPage.title}</h1>
        <p className="text-ink-2 text-base">{t.branchesPage.subtitle}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {branches.map((b, i) => (
          <BranchBlock key={b.id} branch={b} isAr={isAr} t={t} index={i} />
        ))}
      </div>
    </div>
  );
}
