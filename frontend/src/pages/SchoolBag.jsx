import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Backpack, Minus, Plus, Check } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { API, formatOMR, resolveImage } from "@/lib/format";
import { useWaLink } from "@/hooks/useWaLink";
import UploadPhoto from "@/components/UploadPhoto";
import { WhatsAppIcon } from "@/components/FloatingWhatsApp";

function buildWhatsAppMessage({ t, isAr, selectedBag, selectedItems, qtys, total }) {
  const itemName = (item) => (isAr ? item.name_ar : item.name_en || item.name_ar);
  const lines = [t.bag.waIntro];
  if (selectedBag) {
    lines.push(`- ${itemName(selectedBag)} — ${Number(selectedBag.price).toFixed(3)} ${t.common.currency}`);
  }
  selectedItems.forEach((i) => {
    const q = qtys[i.id];
    lines.push(`- ${itemName(i)}${q > 1 ? ` ×${q}` : ""} — ${(i.price * q).toFixed(3)} ${t.common.currency}`);
  });
  lines.push(`${t.bag.waTotal}: ${total.toFixed(3)} ${t.common.currency}`);
  return lines.join("\n");
}

function QtyControls({ item, qty, onQty }) {
  return (
    <div className="flex items-center justify-between px-3.5 pb-3.5 -mt-1">
      <button
        onClick={() => onQty(qty - 1)}
        data-testid={`bag-item-minus-${item.id}`}
        className="flex items-center justify-center w-8 h-8 rounded-full border border-[var(--line)] hover:border-brand hover:text-brand transition-colors"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="font-bold text-sm" data-testid={`bag-item-qty-${item.id}`}>{qty}</span>
      <button
        onClick={() => onQty(qty + 1)}
        data-testid={`bag-item-plus-${item.id}`}
        className="flex items-center justify-center w-8 h-8 rounded-full border border-[var(--line)] hover:border-brand hover:text-brand transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function ItemCard({ item, isAr, t, selected, qty, onToggle, onQty, single }) {
  const name = isAr ? item.name_ar : item.name_en || item.name_ar;
  return (
    <div
      data-testid={`bag-item-${item.id}`}
      className={`relative rounded-2xl border-2 bg-white overflow-hidden transition-all duration-200 ${
        selected ? "border-brand shadow-[0_6px_20px_rgba(208,37,47,0.12)]" : "border-[var(--line)] hover:border-ink-3"
      }`}
    >
      <button onClick={onToggle} data-testid={`bag-item-toggle-${item.id}`} className="w-full text-start">
        <div className="aspect-[4/3] bg-[#F3F4F6]">
          {item.image ? (
            <img src={resolveImage(item.image)} alt={name} loading="lazy" className="w-full h-full object-cover" />
          ) : (
            <UploadPhoto className="w-full h-full rounded-none border-0" />
          )}
        </div>
        <div className="p-3.5">
          <h4 className="font-ar font-semibold text-sm leading-snug line-clamp-2 mb-1">{name}</h4>
          <p className="text-brand font-bold text-sm" dir="ltr">
            {formatOMR(item.price, t.common.currency)}
          </p>
        </div>
      </button>
      {selected && (
        <span className="absolute top-2.5 start-2.5 flex items-center justify-center w-7 h-7 rounded-full bg-brand text-white">
          <Check className="w-4 h-4" strokeWidth={3} />
        </span>
      )}
      {selected && !single && <QtyControls item={item} qty={qty} onQty={onQty} />}
    </div>
  );
}

function StepSection({ num, title, sub, testId, children }) {
  return (
    <section className="mt-12 sm:mt-16" data-testid={testId}>
      <div className="flex items-center gap-4 mb-6">
        <span className="flex items-center justify-center w-11 h-11 rounded-full bg-brand text-white font-bold text-lg shrink-0">
          {num}
        </span>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
          <p className="text-sm text-ink-3">{sub}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">{children}</div>
    </section>
  );
}

function PageHero({ t }) {
  return (
    <div className="bg-ink text-white">
      <div className="max-w-7xl mx-auto px-6 py-14 sm:py-20">
        <span className="inline-flex items-center gap-2 text-sm font-medium mb-4 px-3 py-1 rounded-full bg-brand">
          <Backpack className="w-4 h-4" />
          {t.nav.schoolBag}
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold mb-3">{t.bag.title}</h1>
        <p className="text-white/80 text-base sm:text-lg max-w-xl">{t.bag.subtitle}</p>
      </div>
    </div>
  );
}

function TotalBar({ t, count, total, message }) {
  const wa = useWaLink();
  return (
    <div
      className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-[var(--line)] shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
      data-testid="bag-total-bar"
    >
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs text-ink-3 mb-0.5">
            {count} {t.bag.itemsCount}
          </p>
          <p className="text-xl sm:text-2xl font-bold text-brand" dir="ltr" data-testid="bag-total">
            {formatOMR(total, t.common.currency)}
          </p>
        </div>
        {count > 0 ? (
          <a
            href={wa(message)}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="bag-whatsapp-send"
            className="inline-flex items-center gap-2.5 px-6 sm:px-9 py-3.5 rounded-full bg-wa text-white font-semibold text-sm sm:text-base hover:bg-wa-hover transition-colors"
          >
            <WhatsAppIcon className="w-5 h-5" />
            {t.bag.send}
          </a>
        ) : (
          <span
            data-testid="bag-whatsapp-disabled"
            className="inline-flex items-center gap-2.5 px-6 sm:px-9 py-3.5 rounded-full bg-[#E5E7EB] text-ink-3 font-semibold text-sm sm:text-base cursor-not-allowed"
          >
            <WhatsAppIcon className="w-5 h-5" />
            {t.bag.selectBagFirst}
          </span>
        )}
      </div>
    </div>
  );
}

function UnavailableState({ t }) {
  return (
    <div className="max-w-3xl mx-auto px-6 py-28 text-center" data-testid="school-bag-unavailable">
      <Backpack className="w-14 h-14 text-ink-3 mx-auto mb-6" strokeWidth={1.2} />
      <h1 className="text-3xl font-bold mb-3">{t.bag.unavailableTitle}</h1>
      <p className="text-ink-2">{t.bag.unavailableSub}</p>
    </div>
  );
}

function EmptyState({ t }) {
  return (
    <div
      data-testid="school-bag-empty"
      className="flex flex-col items-center justify-center text-center py-20 px-6 rounded-2xl border-2 border-dashed border-[#D1D5DB] bg-white mt-12"
    >
      <Backpack className="w-12 h-12 text-ink-3 mb-4" strokeWidth={1.2} />
      <h3 className="text-lg font-semibold text-ink mb-1">{t.bag.emptyTitle}</h3>
      <p className="text-sm text-ink-3">{t.bag.emptySub}</p>
    </div>
  );
}

// Selection state + derived totals for the bag builder.
function useBagSelection(items) {
  const [bagId, setBagId] = useState(null);
  const [qtys, setQtys] = useState({}); // itemId -> qty

  const bags = items.filter((i) => i.group === "bag");
  const stationery = items.filter((i) => i.group === "stationery");
  const extras = items.filter((i) => i.group === "extra");

  const selectedBag = bags.find((b) => b.id === bagId);
  const selectedItems = useMemo(
    () => items.filter((i) => i.group !== "bag" && qtys[i.id] > 0),
    [items, qtys]
  );

  const total =
    (selectedBag?.price || 0) + selectedItems.reduce((sum, i) => sum + i.price * qtys[i.id], 0);
  const count = (selectedBag ? 1 : 0) + selectedItems.reduce((s, i) => s + qtys[i.id], 0);

  const toggleBag = (item) => setBagId((prev) => (prev === item.id ? null : item.id));
  const toggleItem = (item) => setQtys((q) => ({ ...q, [item.id]: q[item.id] > 0 ? 0 : 1 }));
  const setQty = (item, n) => setQtys((q) => ({ ...q, [item.id]: Math.max(0, n) }));

  return { bags, stationery, extras, selectedBag, selectedItems, qtys, total, count, bagId, toggleBag, toggleItem, setQty };
}

export default function SchoolBag() {
  const { t, isAr } = useLang();

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => (await axios.get(`${API}/settings`)).data,
  });

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["school-bag-items"],
    queryFn: async () => (await axios.get(`${API}/school-bag-items`)).data,
  });

  const sel = useBagSelection(items);
  const { bags, stationery, extras, selectedBag, selectedItems, qtys, total, count, bagId, toggleBag, toggleItem, setQty } = sel;

  if (settings && settings.school_bag_visible === false) {
    return <UnavailableState t={t} />;
  }

  const stepNum2 = bags.length > 0 ? 2 : 1;
  const stepNum3 = (bags.length > 0 ? 1 : 0) + (stationery.length > 0 ? 1 : 0) + 1;
  const message = buildWhatsAppMessage({ t, isAr, selectedBag, selectedItems, qtys, total });

  const multiProps = (item) => ({
    item,
    isAr,
    t,
    selected: qtys[item.id] > 0,
    qty: qtys[item.id] || 0,
    onToggle: () => toggleItem(item),
    onQty: (n) => setQty(item, n),
  });

  return (
    <div data-testid="school-bag-page" className="pb-32">
      <PageHero t={t} />

      <div className="max-w-7xl mx-auto px-6">
        {!isLoading && items.length === 0 ? (
          <EmptyState t={t} />
        ) : (
          <>
            {bags.length > 0 && (
              <StepSection num={1} title={t.bag.step1} sub={t.bag.step1Sub} testId="bag-step-1">
                {bags.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    isAr={isAr}
                    t={t}
                    single
                    selected={bagId === item.id}
                    onToggle={() => toggleBag(item)}
                  />
                ))}
              </StepSection>
            )}

            {stationery.length > 0 && (
              <StepSection num={stepNum2} title={t.bag.step2} sub={t.bag.step2Sub} testId="bag-step-2">
                {stationery.map((item) => (
                  <ItemCard key={item.id} {...multiProps(item)} />
                ))}
              </StepSection>
            )}

            {extras.length > 0 && (
              <StepSection num={stepNum3} title={t.bag.step3} sub={t.bag.step3Sub} testId="bag-step-3">
                {extras.map((item) => (
                  <ItemCard key={item.id} {...multiProps(item)} />
                ))}
              </StepSection>
            )}
          </>
        )}
      </div>

      {items.length > 0 && <TotalBar t={t} count={count} total={total} message={message} />}
    </div>
  );
}
