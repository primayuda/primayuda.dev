/* eslint-disable @next/next/no-img-element */
import { useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const logoClassName =
  "size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-border overflow-hidden object-contain flex-none bg-muted";

function subscribeToTheme(onStoreChange: () => void) {
  const observer = new MutationObserver(onStoreChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getIsDark() {
  return document.documentElement.classList.contains("dark");
}

function LogoFallback({ alt }: { alt: string }) {
  return (
    <div
      className={cn(
        logoClassName,
        "flex items-center justify-center text-[10px] font-semibold text-muted-foreground uppercase"
      )}
      aria-label={alt}
    >
      {alt.slice(0, 2)}
    </div>
  );
}

export function CompanyLogo({
  lightSrc,
  darkSrc,
  alt,
}: {
  lightSrc?: string;
  darkSrc?: string;
  alt: string;
}) {
  const [imageError, setImageError] = useState(false);
  const isDark = useSyncExternalStore(subscribeToTheme, getIsDark, () => false);
  const src = isDark ? (darkSrc ?? lightSrc) : (lightSrc ?? darkSrc);

  if (!src || imageError) {
    return <LogoFallback alt={alt} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={logoClassName}
      loading="lazy"
      decoding="async"
      onError={() => setImageError(true)}
    />
  );
}
