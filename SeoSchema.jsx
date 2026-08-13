import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API, resolveImage } from "@/lib/format";

// A value is publishable only if present and not a [FILL IN] placeholder.
const filled = (v) => Boolean(v) && !String(v).includes("[FILL IN]");
// "8:00 AM" / "10:30 PM" -> "08:00" / "22:30"; returns null if unparseable.
function to24h(value) {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(String(value).trim());
  if (!m) return null;
  let h = parseInt(m[1], 10) % 12;
  if (m[3].toUpperCase() === "PM") h += 12;
  return `${String(h).padStart(2, "0")}:${m[2]}`;
}

function buildSameAs(settings) {
  const sameAs = [];
  if (filled(settings.facebook)) {
    sameAs.push(`https://${settings.facebook.replace(/^https?:\/\//, "")}`);
  }
  if (filled(settings.instagram)) {
    sameAs.push(
      settings.instagram.startsWith("http")
        ? settings.instagram
        : `https://instagram.com/${settings.instagram.replace(/^@/, "")}`
    );
  }
  return sameAs;
}

function buildOpeningHours(settings) {
  const open = filled(settings.opening_time) ? to24h(settings.opening_time) : null;
  const close = filled(settings.closing_time) ? to24h(settings.closing_time) : null;
  return open && close ? [`Mo-Su ${open}-${close}`] : undefined;
}

function pickStreet(branch) {
  if (filled(branch.address_en)) return branch.address_en;
  if (filled(branch.address_ar)) return branch.address_ar;
  return undefined;
}

function buildStore(branch, settings, base, sameAs, openingHours) {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${base}/branches#branch-${branch.order}`,
    name: `مركز القوافل العربية للتسوق — ${branch.name_ar}`,
    alternateName: `Qawafal Al Arabia Shopping Centre — ${branch.name_en}`,
    url: `${base}/branches`,
    image: filled(settings.hero_image_url) ? resolveImage(settings.hero_image_url) : undefined,
    logo: filled(settings.logo_url) ? resolveImage(settings.logo_url) : undefined,
    telephone: filled(branch.phone) ? branch.phone.replace(/\s/g, "") : undefined,
    currenciesAccepted: "OMR",
    address: {
      "@type": "PostalAddress",
      streetAddress: pickStreet(branch),
      addressLocality: "Ibri",
      addressRegion: "Al Dhahirah",
      addressCountry: "OM",
    },
    hasMap: filled(branch.maps_url) ? branch.maps_url : undefined,
    openingHours,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };
}

export function buildStores(branches, settings, base) {
  const sameAs = buildSameAs(settings);
  const openingHours = buildOpeningHours(settings);
  return branches.map((b) => buildStore(b, settings, base, sameAs, openingHours));
}

function injectJsonLd(stores) {
  let script = document.getElementById("ld-localbusiness");
  if (!script) {
    script = document.createElement("script");
    script.id = "ld-localbusiness";
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(stores);
}

// Injects schema.org LocalBusiness (Store) JSON-LD for both branches,
// built from live data so it stays correct as the admin fills details in.
export default function SeoSchema() {
  const { data: branches = [] } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => (await axios.get(`${API}/branches`)).data,
  });
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await axios.get(`${API}/settings`)).data,
  });

  useEffect(() => {
    if (!settings || branches.length === 0) return;
    injectJsonLd(buildStores(branches, settings, window.location.origin));
  }, [settings, branches]);

  return null;
}
