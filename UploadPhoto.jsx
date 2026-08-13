import { ImagePlus } from "lucide-react";
import { useLang } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

// Elegant labelled empty-state placeholder for missing photos.
export function UploadPhoto({ className, label }) {
  const { t } = useLang();
  return (
    <div
      data-testid="upload-photo-placeholder"
      className={cn(
        "flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl bg-[#F3F4F6] border-[#D1D5DB] text-ink-3 select-none",
        className
      )}
    >
      <ImagePlus className="w-7 h-7" strokeWidth={1.5} />
      <span className="text-xs font-medium tracking-wide uppercase">
        {label || t.common.uploadPhoto}
      </span>
    </div>
  );
}

export default UploadPhoto;
