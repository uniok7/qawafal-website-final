import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Phone, Clock, Facebook, Instagram, MessageCircle, Send } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { API } from "@/lib/format";
import { useWaLink } from "@/hooks/useWaLink";
import { WhatsAppIcon } from "@/components/FloatingWhatsApp";

function ComposerCard({ t }) {
  const [message, setMessage] = useState("");
  const wa = useWaLink();
  return (
    <div className="bg-white rounded-2xl border border-[var(--line)] p-6 sm:p-8" data-testid="contact-composer">
      <div className="flex items-center gap-3 mb-5">
        <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#DCFCE7] text-[#15803D]">
          <WhatsAppIcon className="w-6 h-6" />
        </span>
        <div>
          <h2 className="font-bold text-lg">{t.contactPage.waTitle}</h2>
          <p className="text-sm text-ink-3">{t.contactPage.waSub}</p>
        </div>
      </div>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={4}
        placeholder={t.contactPage.msgPlaceholder}
        data-testid="contact-message-input"
        className="w-full px-4 py-3 rounded-xl border border-[var(--line)] text-sm focus:outline-none focus:border-brand transition-colors mb-4"
      />
      <a
        href={wa(message.trim() || t.whatsapp.general)}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="contact-whatsapp-send"
        className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-wa text-white font-semibold hover:bg-wa-hover transition-colors"
      >
        <Send className="w-4 h-4 rtl:rotate-180" />
        {t.contactPage.msgSend}
      </a>
    </div>
  );
}

function InstagramSlot({ instagram }) {
  // No handle yet: show nothing rather than a placeholder chip.
  if (!instagram) return null;
  const href = instagram.startsWith("http") ? instagram : `https://instagram.com/${instagram.replace(/^@/, "")}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="contact-instagram"
      className="flex items-center justify-center w-11 h-11 rounded-full bg-[#F3F4F6] text-ink hover:bg-brand hover:text-white transition-colors"
    >
      <Instagram className="w-5 h-5" />
    </a>
  );
}

function DetailsColumn({ t, settings }) {
  const phone = settings?.phone || "+968 7114 6738";
  const fb = settings?.facebook ? `https://${settings.facebook.replace(/^https?:\/\//, "")}` : "";
  const hasInstagram = settings?.instagram && settings.instagram !== "[FILL IN]";
  const hours = settings
    ? [settings.opening_time, settings.closing_time]
        .filter((v) => v && v !== "[FILL IN]")
        .join(" - ")
    : "";

  return (
    <div className="space-y-4">
      <a
        href={`tel:${phone.replace(/\s/g, "")}`}
        data-testid="contact-phone-card"
        className="flex items-center gap-4 bg-white rounded-2xl border border-[var(--line)] p-5 hover:border-brand transition-colors"
      >
        <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--brand-muted)] text-brand shrink-0">
          <Phone className="w-5 h-5" />
        </span>
        <div>
          <p className="text-sm text-ink-3">{t.contactPage.callTitle}</p>
          <p className="font-bold" dir="ltr">{phone}</p>
        </div>
      </a>

      <div className="flex items-center gap-4 bg-white rounded-2xl border border-[var(--line)] p-5" data-testid="contact-hours-card">
        <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--brand-muted)] text-brand shrink-0">
          <Clock className="w-5 h-5" />
        </span>
        <div>
          <p className="text-sm text-ink-3">{t.footer.hours}</p>
          <p className="font-bold" dir="ltr">{hours}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[var(--line)] p-5" data-testid="contact-socials-card">
        <p className="text-sm text-ink-3 mb-3">{t.footer.follow}</p>
        <div className="flex items-center gap-3">
          {fb && (
            <a
              href={fb}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="contact-facebook"
              className="flex items-center justify-center w-11 h-11 rounded-full bg-[#F3F4F6] text-ink hover:bg-brand hover:text-white transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
          )}
          <InstagramSlot instagram={hasInstagram ? settings.instagram : ""} />
        </div>
      </div>
    </div>
  );
}

export default function Contact() {
  const { t } = useLang();
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await axios.get(`${API}/settings`)).data,
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 sm:py-14" data-testid="contact-page">
      <div className="mb-10 max-w-2xl">
        <span className="inline-flex items-center gap-2 text-sm font-medium mb-4 px-3 py-1 rounded-full bg-[var(--brand-muted)] text-brand">
          <MessageCircle className="w-4 h-4" />
          {t.nav.contact}
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">{t.contactPage.title}</h1>
        <p className="text-ink-2 text-base">{t.contactPage.subtitle}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 items-start">
        <ComposerCard t={t} />
        <DetailsColumn t={t} settings={settings} />
      </div>
    </div>
  );
}
