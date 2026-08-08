import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Phone, Clock, MapPin, Facebook, Instagram } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { API } from "@/lib/format";
import { WhatsAppIcon } from "@/components/FloatingWhatsApp";

const FILL_IN = "[FILL IN]";

function BrandBlock({ t, isAr }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand text-white font-bold text-lg">
          ق
        </span>
        <div className="flex flex-col leading-tight">
          <span className="font-ar font-bold text-lg">{t.brand}</span>
          <span className="text-xs text-white/60">{t.brandSub}</span>
        </div>
      </div>
      <p className="text-sm text-white/70 leading-relaxed max-w-xs">
        {isAr
          ? "متجر عائلي متنوع في العراقي، عبري، محافظة الظاهرة — منذ 2010."
          : "A family-run variety store in Al Araqi, Ibri, Al Dhahirah — since 2010."}
      </p>
    </div>
  );
}

function ContactList({ t, isAr, settings }) {
  const phone = settings?.phone || "+968 7114 6738";
  return (
    <div>
      <h4 className="text-sm font-semibold uppercase tracking-wide text-white/50 mb-4">
        {t.footer.contact}
      </h4>
      <ul className="space-y-3 text-sm">
        <li className="flex items-center gap-3">
          <Phone className="w-4 h-4 text-brand shrink-0" />
          <a href={`tel:${phone.replace(/\s/g, "")}`} dir="ltr" data-testid="footer-phone">
            {phone}
          </a>
        </li>
        <li className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-brand shrink-0" />
          <span>
            {t.footer.openDaily} {settings?.opening_time || "8:00 AM"}
            {settings?.closing_time && settings.closing_time !== FILL_IN
              ? ` ${t.footer.to} ${settings.closing_time}`
              : ""}
          </span>
        </li>
        <li className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-brand shrink-0 mt-0.5" />
          <span>{isAr ? "العراقي، عبري، محافظة الظاهرة، عُمان" : "Al Araqi, Ibri, Al Dhahirah, Oman"}</span>
        </li>
      </ul>
    </div>
  );
}

function instagramHref(instagram) {
  if (instagram.startsWith("http")) return instagram;
  return `https://instagram.com/${instagram.replace(/^@/, "")}`;
}

function SocialLinks({ t, settings }) {
  const facebook = settings?.facebook ? `https://${settings.facebook.replace(/^https?:\/\//, "")}` : "";
  const instagram = settings?.instagram && settings.instagram !== FILL_IN ? settings.instagram : "";
  const iconCls =
    "flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-brand transition-colors";
  const placeholderCls =
    "flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-white/40 border border-dashed border-white/20";

  return (
    <div>
      <h4 className="text-sm font-semibold uppercase tracking-wide text-white/50 mb-4">
        {t.footer.follow}
      </h4>
      <div className="flex items-center gap-3">
        {facebook ? (
          <a href={facebook} target="_blank" rel="noopener noreferrer" data-testid="footer-facebook" className={iconCls}>
            <Facebook className="w-5 h-5" />
          </a>
        ) : (
          <span data-testid="footer-facebook" className={placeholderCls}>
            <Facebook className="w-5 h-5" />
          </span>
        )}
        {instagram ? (
          <a
            href={instagramHref(instagram)}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="footer-instagram"
            className={iconCls}
          >
            <Instagram className="w-5 h-5" />
          </a>
        ) : null}
        <a
          href={`https://wa.me/${settings?.whatsapp || "96871146738"}`}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="footer-whatsapp"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-wa transition-colors"
        >
          <WhatsAppIcon className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}

export function Footer() {
  const { t, isAr } = useLang();
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await axios.get(`${API}/settings`)).data,
  });

  return (
    <footer data-testid="site-footer" className="bg-ink text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-3">
        <BrandBlock t={t} isAr={isAr} />
        <ContactList t={t} isAr={isAr} settings={settings} />
        <SocialLinks t={t} settings={settings} />
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 text-center text-xs text-white/50">
          © {new Date().getFullYear()} {t.brand} — {t.footer.rights}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
