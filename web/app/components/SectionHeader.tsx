import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import styles from "./SectionHeader.module.css";

interface Props {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  align?: "center" | "start";
}

export function SectionHeader({ eyebrow, title, lead, id, align = "center" }: Props) {
  return (
    <Reveal as="header" className={`${styles.header} ${align === "start" ? styles.start : ""}`}>
      {eyebrow && <p className={`t-eyebrow ${styles.eyebrow}`}>{eyebrow}</p>}
      <h2 id={id} className="t-headline t-balance">
        {title}
      </h2>
      {lead && <p className={`t-intro t-secondary t-pretty ${styles.lead}`}>{lead}</p>}
    </Reveal>
  );
}
