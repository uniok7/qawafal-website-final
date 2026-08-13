import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Menu, X, Search, Globe } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { API, resolveImage } from "@/lib/format";

const navItems = [
  { key: "home", to: "/" },
  { key: "catalog", to: "/catalog" },
  { key: "schoolBag", to: "/school-bag" },
  { key: "offers", to: "/offers" },
  { key: "delivery", to: "/delivery" },
  { key: "branches", to: "/branches" },
  { key: "about", to: "/about" },
  { key: "contact", to: "/contact" },
];

export function Header() {
  const { t, toggle, lang } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await axios.get(`${API}/settings`)).data,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      data-testid="site-header"
      className={`sticky top-0 z-40 transition-shadow duration-300 ${
        scrolled ? "shadow-[0_2px_20px_rgba(0,0,0,0.06)]" : ""
      } bg-white/90 backdrop-blur-md border-b border-[var(--line)]`}
    >
      {/* Top brand bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          <Link to="/" data-testid="header-logo" className="flex items-center gap-3 min-w-0">
            {settings?.logo_url ? (
              <img
                src={resolveImage(settings.logo_url)}
                alt={t.brand}
                className="h-10 sm:h-12 w-auto max-w-[160px] object-contain shrink-0"
              />
            ) : (
              <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand text-white font-bold text-lg shrink-0">
                ق
              </span>
            )}
            <span className="hidden sm:flex flex-col leading-tight min-w-0">
              <span className="font-ar font-bold text-brand text-base sm:text-lg truncate">
                {t.brand}
              </span>
              <span className="text-[11px] sm:text-xs text-ink-3 truncate">{t.brandSub}</span>
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/search"
              data-testid="header-search-link"
              aria-label={t.nav.search}
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full text-ink-2 hover:bg-[var(--brand-muted)] hover:text-brand transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              onClick={toggle}
              data-testid="language-toggle"
              className="flex items-center gap-1.5 px-3 h-10 rounded-full border border-[var(--line)] text-sm font-medium text-ink hover:border-brand hover:text-brand transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>{t.lang}</span>
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              data-testid="mobile-menu-toggle"
              aria-label="menu"
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full text-ink hover:bg-[var(--brand-muted)] transition-colors"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop nav */}
      <nav className="hidden lg:block border-t border-[var(--line)] bg-brand">
        <div className="max-w-7xl mx-auto px-6">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link
                  to={item.to}
                  data-testid={`nav-${item.key}`}
                  className={`inline-flex items-center h-12 px-4 text-sm font-medium text-white/90 hover:text-white hover:bg-white/10 transition-colors ${
                    location.pathname === item.to ? "bg-white/15 text-white" : ""
                  }`}
                >
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <nav data-testid="mobile-nav" className="lg:hidden border-t border-[var(--line)] bg-white">
          <ul className="max-w-7xl mx-auto px-4 py-2">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link
                  to={item.to}
                  data-testid={`mobile-nav-${item.key}`}
                  className="flex items-center h-12 px-2 text-base font-medium text-ink border-b border-[var(--line)] last:border-0"
                >
                  {t.nav[item.key]}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/search"
                data-testid="mobile-nav-search"
                className="flex items-center gap-2 h-12 px-2 text-base font-medium text-brand"
              >
                <Search className="w-5 h-5" /> {t.nav.search}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

export default Header;
