import type { ReactNode } from "react";
import { Link } from "react-router";
import { ArrowUpRight, ChevronRight } from "./Icons";
import styles from "./ChevronLink.module.css";

interface Props {
  to: string;
  children: ReactNode;
  /** External links open in a new tab and show an ↗ glyph instead of ›. */
  external?: boolean;
  className?: string;
  "aria-label"?: string;
}

/** Apple's signature "Learn more ›" text link. */
export function ChevronLink({ to, children, external, className, ...rest }: Props) {
  const cls = [styles.link, className].filter(Boolean).join(" ");
  if (external) {
    return (
      <a className={cls} href={to} target="_blank" rel="noopener" {...rest}>
        {children}
        <ArrowUpRight className={styles.icon} />
      </a>
    );
  }
  return (
    <Link className={cls} to={to} prefetch="intent" {...rest}>
      {children}
      <ChevronRight className={styles.icon} />
    </Link>
  );
}
