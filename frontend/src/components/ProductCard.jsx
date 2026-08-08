import { Link } from "react-router-dom";
import { useLang } from "@/context/LanguageContext";
import { formatOMR, resolveImage } from "@/lib/format";
import UploadPhoto from "@/components/UploadPhoto";

export function ProductCard({ product, index = 0 }) {
  const { t, isAr } = useLang();
  const name = isAr ? product.name_ar : product.name_en || product.name_ar;
  const image = product.images?.[0];

  return (
    <Link
      to={`/product/${product.id}`}
      data-testid={`product-card-${product.id}`}
      className="reveal group bg-white rounded-2xl border border-[var(--line)] overflow-hidden flex flex-col hover:border-brand hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.07)] transition-all duration-300 ease-out"
      style={{ transitionDelay: `${(index % 8) * 50}ms` }}
    >
      <div className="relative aspect-square bg-[#F3F4F6] overflow-hidden">
        {image ? (
          <img
            src={resolveImage(image)}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <UploadPhoto className="w-full h-full rounded-none border-0" />
        )}
        <div className="absolute top-3 start-3 flex flex-col gap-1.5">
          {product.is_new && (
            <span className="px-2.5 py-1 rounded-full bg-brand text-white text-[11px] font-semibold">
              {t.product.new}
            </span>
          )}
          {!product.in_stock && (
            <span className="px-2.5 py-1 rounded-full bg-ink text-white text-[11px] font-semibold">
              {t.common.outStock}
            </span>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <h3 className="font-ar font-semibold text-sm sm:text-base leading-snug line-clamp-2 flex-1">
          {name}
        </h3>
        <p className="text-brand font-bold text-base" dir="ltr" data-testid={`product-price-${product.id}`}>
          {formatOMR(product.price, t.common.currency)}
        </p>
      </div>
    </Link>
  );
}

export default ProductCard;
