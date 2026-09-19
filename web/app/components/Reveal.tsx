import { type CSSProperties, type ReactNode, useRef } from "react";
import { useRevealOnce } from "~/lib/scroll";

interface Props {
  children: ReactNode;
  /** Seconds. */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "header";
}

/**
 * Fade-and-rise on first entry in the viewport — the default Apple reveal.
 * Content is only hidden once JS has marked the document (`.js` on <html>),
 * so the prerendered page stays fully readable without JavaScript.
 */
export function Reveal({ children, delay = 0, className, as: Tag = "div" }: Props) {
  const ref = useRef<HTMLElement>(null);
  useRevealOnce(ref);
  return (
    <Tag
      ref={ref as never}
      className={["reveal", className].filter(Boolean).join(" ")}
      style={delay ? ({ "--reveal-delay": `${delay}s` } as CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
