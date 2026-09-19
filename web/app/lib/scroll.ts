import { type RefObject, useEffect } from "react";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Writes the element's scroll progress (0 → 1) into the CSS variable `--p`, so CSS
 * can drive transforms without re-rendering React. Progress starts when the
 * element's top enters the bottom of the viewport and reaches 1 when its top
 * hits `endAt` (a fraction of the viewport height from the top).
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  endAt = 0.5,
  onProgress?: (p: number) => void,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion()) {
      el.style.setProperty("--p", "1");
      onProgress?.(1);
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const top = el.getBoundingClientRect().top;
      const p = Math.min(1, Math.max(0, (vh - top) / (vh - vh * endAt)));
      el.style.setProperty("--p", p.toFixed(4));
      onProgress?.(p);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, endAt, onProgress]);
}

/** Adds `data-visible` once the element has entered the viewport. */
export function useRevealOnce(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reducedMotion() || !("IntersectionObserver" in window)) {
      el.dataset.visible = "true";
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.dataset.visible = "true";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}
