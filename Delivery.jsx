import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { Truck, Wallet, Clock, Search, MessageCircle, PackageCheck, ArrowLeft } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { API, formatOMR, formatOMRCompact, waLink } from "@/lib/format";
import { WhatsAppIcon } from "@/components/FloatingWhatsApp";
function InfoCard({ icon: Icon, label, value, testId }) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--line)] p-6 flex items-center gap-4" data-testid={testId}>
      <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--brand-muted)] text-brand shrink-0">
        <Icon className="w-6 h-6" />
      </span>
      <div>
        <p className="text-sm text-ink-3 mb-0.5">{label}</p>
        <p className="font-bold text-lg leading-snug">{value}</p>
      </div>
    </div>
  );
}

function Step({ num, icon: Icon, title, desc }) {
  return (
    <div className="relative bg-white rounded-2xl border border-[var(--line)] p-6">
      <span className="absolute -top-4 start-6 flex items-center justify-center w-9 h-9 rounded-full bg-brand text-white font-bold text-sm">
        {num}
      </span>
      <Icon className="w-8 h-8 text-brand mb-4 mt-2" strokeWidth={1.5} />
      <h3 className="font-bold text-lg mb-1.5">{title}</h3>
      <p className="text-sm text-ink-2 leading-relaxed">{desc}</p>
    </div>
  );
}

function deliveryArea(settings, isAr) {
  if (!settings) return "";
  return isAr ? settings.delivery_area_ar : settings.delivery_area_en;
}

export default function Delivery() {
  const { t, isAr } = useLang();
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await axios.get(`${API}/settings`)).data,
  });

  const area = deliveryArea(settings, isAr);
  const hours = settings
    ? [settings.opening_time, settings.closing_time]
        .filter((v) => v && v !== "[FILL IN]")
        .join(" - ")
    : "";

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 sm:py-14" data-testid="delivery-page">
      <div className="mb-10 max-w-2xl">
        <span className="inline-flex items-center gap-2 text-sm font-medium mb-4 px-3 py-1 rounded-full bg-[var(--brand-muted)] text-brand">
          <Truck className="w-4 h-4" />
          {t.nav.delivery}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">{t.deliveryPage.title}</h1>
        <p className="text-ink-2 text-base">{t.deliveryPage.subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-16">
        <InfoCard icon={Truck} label={t.deliveryPage.areaLabel} value={area || "—"} testId="delivery-area-card" />
        <InfoCard
          icon={Wallet}
          label={t.deliveryPage.minOrderLabel}
          value={settings ? formatOMRCompact(settings.min_order, t.common.currency) : "—"}
          testId="delivery-min-order-card"
        />
        <InfoCard icon={Clock} label={t.footer.hours} value={<span dir="ltr">{hours}</span>} testId="delivery-hours-card" />
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold mb-10">{t.deliveryPage.howTitle}</h2>
      <div className="grid gap-6 sm:grid-cols-3 mb-14">
        <Step num={1} icon={Search} title={t.deliveryPage.step1t} desc={t.deliveryPage.step1d} />
        <Step num={2} icon={MessageCircle} title={t.deliveryPage.step2t} desc={t.deliveryPage.step2d} />
        <Step num={3} icon={PackageCheck} title={t.deliveryPage.step3t} desc={t.deliveryPage.step3d} />
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          href={waLink(t.whatsapp.general, settings?.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="delivery-whatsapp-cta"
          className="inline-flex items-center gap-2 px-7 h-13 py-3.5 rounded-full bg-wa text-white font-semibold hover:bg-wa-hover transition-colors"
        >
          <WhatsAppIcon className="w-5 h-5" />
          {t.home.heroCta}
        </a>
        <Link
          to="/catalog"
          data-testid="delivery-browse-cta"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-brand text-brand font-semibold hover:bg-brand hover:text-white transition-colors"
        >
          {t.deliveryPage.browse}
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
}
