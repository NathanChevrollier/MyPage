import type { ReactNode } from "react";
import { Link } from "react-router";
import styles from "./Button.module.css";

interface Props {
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  size?: "md" | "lg";
  children: ReactNode;
  download?: boolean;
  external?: boolean;
}

export function Button({
  to,
  href,
  onClick,
  variant = "primary",
  size = "md",
  children,
  download,
  external,
}: Props) {
  const cls = `${styles.button} ${styles[variant]} ${size === "lg" ? styles.lg : ""}`;
  if (to) {
    return (
      <Link className={cls} to={to} prefetch="intent">
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a
        className={cls}
        href={href}
        download={download}
        {...(external ? { target: "_blank", rel: "noopener" } : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={cls} onClick={onClick}>
      {children}
    </button>
  );
}
