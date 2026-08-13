import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MapPin, ArrowLeft, PackageX, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useLang } from "@/context/LanguageContext";
import { API, formatOMR, hasPrice, resolveImage, productOrderMessage, shareLink } from "@/lib/format";
import { useWaLink } from "@/hooks/useWaLink";
import { useReveal } from "@/hooks/useReveal";
import UploadPhoto from "@/components/UploadPhoto";
import ProductCard from "@/components/ProductCard";
import { WhatsAppIcon } from "@/components/FloatingWhatsApp";

function Gallery({ images, name }) {
  const [selected, setSelected] = useState(0);
  useEffect(() => setSelected(0), [images]);
  if (!images || images.length === 0) {
    return <UploadPhoto className="w-full aspect-square" />;
  }
  return (
    <div>
      <div className="aspect-square rounded-2xl overflow-hidden bg-[#F3F4F6] border border-[var(--line)]">
        <img
          src={resolveImage(images[selected] || images[0])}
          alt={name}
          data-testid="product-main-image"
          className="w-full h-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
          {images.slice(0, 5).map((img, i) => (
            <button
              key={img}
              onClick={() => setSelected(i)}
              data-testid={`product-thumb-${i}`}
              className={`shrink-0 rounded-xl overflow-hidden border-2 transition-colors ${
                selected === i ? "border-brand" : "border-transparent hover:border-[var(--line)]"
              }`}
              style={{ width: 72, height: 72 }}
            >
              <img src={resolveImage(img)} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function NotFound({ t }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-28 text-center" data-testid="product-not-found">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--brand-muted)] text-brand mb-6">
        <PackageX className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-bold mb-3">{t.product.notFound}</h1>
      <p className="text-ink-2 mb-8">{t.product.notFoundSub}</p>
      <Link
        to="/catalog"
        className="inline-flex items-center gap-2 px-6 h-12 rounded-full bg-brand text-white font-medium hover:bg-brand-hover transition-colors"
      >
        <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        {t.product.backToCatalog}
      </Link>
    </div>
  );
}

function AvailabilityCard({ t, isAr, product, branches }) {
  const availableBranches =
    product.branches?.length > 0 ? branches.filter((b) => product.branches.includes(b.id)) : null;
  return (
    <div
      className="flex items-start gap-3 p-4 rounded-2xl bg-[#F9FAFB] border border-[var(--line)] mb-8"
      data-testid="product-availability"
    >
      <MapPin className="w-5 h-5 text-brand shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold mb-0.5">{t.product.availability}</p>
        <p className="text-sm text-ink-2">
          {availableBranches
            ? availableBranches.map((b) => (isAr ? b.name_ar : b.name_en)).join(" · ")
            : t.product.allBranches}
        </p>
      </div>
    </div>
  );
}

function OrderActions({ t, product, name }) {
  const wa = useWaLink();
  const copyShare = () => {
    navigator.clipboard.writeText(shareLink(product.id));
    toast.success(t.product.copied);
  };
  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={wa(productOrderMessage(t, name, product.price, product.id))}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="product-whatsapp-order"
        className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-10 h-14 rounded-full bg-wa text-white font-semibold text-base hover:bg-wa-hover hover:scale-[1.01] transition-transform duration-300"
      >
        <WhatsAppIcon className="w-5 h-5" />
        {t.product.order}
      </a>
      <button
        onClick={copyShare}
        data-testid="product-share-btn"
        className="inline-flex items-center justify-center gap-2 px-6 h-14 rounded-full border border-[var(--line)] text-ink-2 font-medium text-sm hover:border-brand hover:text-brand transition-colors"
      >
        <Share2 className="w-4 h-4" />
        {t.product.share}
      </button>
    </div>
  );
}

function ProductInfo({ t, isAr, product, branches, name, description }) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Link
          to={`/catalog/${product.category_slug}`}
          data-testid="product-category-link"
          className="text-sm text-brand font-medium hover:underline"
        >
          {t.nav.catalog}
        </Link>
        {product.is_new && (
          <span className="px-2.5 py-1 rounded-full bg-brand text-white text-[11px] font-semibold">
            {t.product.new}
          </span>
        )}
      </div>

      <h1 className="font-ar text-3xl sm:text-4xl font-bold leading-tight mb-4" data-testid="product-name">
        {name}
      </h1>

      <div className="flex items-center gap-4 mb-6">
        {hasPrice(product.price) ? (
          <span className="text-3xl font-bold text-brand" dir="ltr" data-testid="product-price">
            {formatOMR(product.price, t.common.currency)}
          </span>
        ) : (
          <span className="text-xl font-semibold text-ink-2" data-testid="product-price">
            {t.common.priceOnRequest}
          </span>
        )}
        <span
          data-testid="product-stock-badge"
          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
            product.in_stock ? "bg-[#DCFCE7] text-[#15803D]" : "bg-[#FEE2E2] text-[#B91C1C]"
          }`}
        >
          {product.in_stock ? t.common.inStock : t.common.outStock}
        </span>
      </div>

      {description && (
        <p className="text-ink-2 text-base leading-relaxed mb-6 whitespace-pre-line" data-testid="product-description">
          {description}
        </p>
      )}

      <AvailabilityCard t={t} isAr={isAr} product={product} branches={branches} />
      <OrderActions t={t} product={product} name={name} />
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const { t, isAr } = useLang();

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => (await axios.get(`${API}/products/${id}`)).data,
    retry: false,
  });

  const { data: branches = [] } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => (await axios.get(`${API}/branches`)).data,
  });

  const { data: related = [] } = useQuery({
    queryKey: ["products", "related", product?.category_slug],
    enabled: !!product,
    queryFn: async () =>
      (await axios.get(`${API}/products`, { params: { category: product.category_slug, limit: 5 } })).data,
  });

  const ref = useReveal(related.length + (product?.id || ""));
  useEffect(() => window.scrollTo(0, 0), [id]);

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-6 py-24 text-center text-ink-3">…</div>;
  }
  if (isError || !product) {
    return <NotFound t={t} />;
  }

  const name = isAr ? product.name_ar : product.name_en || product.name_ar;
  const description = isAr ? product.description_ar : product.description_en || product.description_ar;
  const relatedItems = related.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 sm:py-14" data-testid="product-detail-page">
      <div className="grid gap-8 lg:gap-14 lg:grid-cols-2">
        <Gallery images={product.images} name={name} />
        <ProductInfo t={t} isAr={isAr} product={product} branches={branches} name={name} description={description} />
      </div>

      {relatedItems.length > 0 && (
        <section ref={ref} className="mt-16 sm:mt-24" data-testid="related-products">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">{t.product.related}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {relatedItems.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
