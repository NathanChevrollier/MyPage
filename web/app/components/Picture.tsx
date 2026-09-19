import { WIDTHS, type MediaAsset } from "~/content/media";
import { useI18n } from "~/i18n";

interface Props {
  asset: MediaAsset;
  /** Layout width hint for the browser, e.g. "(min-width: 1068px) 980px, 100vw". */
  sizes: string;
  priority?: boolean;
  className?: string;
}

const srcSet = (base: string, ext: string, max: number) =>
  WIDTHS.filter((w) => w <= max)
    .map((w) => `${base}-${w}.${ext} ${w}w`)
    .join(", ");

export function Picture({ asset, sizes, priority, className }: Props) {
  const { lang } = useI18n();
  const max = Math.max(asset.width, WIDTHS[0]);
  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(asset.base, "avif", max)} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(asset.base, "webp", max)} sizes={sizes} />
      <img
        className={className}
        src={`${asset.base}-1280.webp`}
        width={asset.width}
        height={asset.height}
        alt={asset.alt[lang]}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
      />
    </picture>
  );
}
