import { Link } from "react-router-dom";
import { Hammer, ArrowLeft } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

export function ComingSoon({ titleKey }) {
  const { t } = useLang();
  const title = titleKey ? t.nav[titleKey] : t.common.comingSoon;
  return (
    <div className="max-w-3xl mx-auto px-6 py-28 text-center" data-testid="coming-soon-page">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--brand-muted)] text-brand mb-6">
        <Hammer className="w-8 h-8" />
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold mb-3">{title}</h1>
      <p className="text-ink-2 text-base mb-8">{t.common.comingSoonSub}</p>
      <Link
        to="/"
        data-testid="coming-soon-home-link"
        className="inline-flex items-center gap-2 px-6 h-12 rounded-full bg-brand text-white font-medium hover:bg-brand-hover transition-colors"
      >
        <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        {t.common.backHome}
      </Link>
    </div>
  );
}

export default ComingSoon;
