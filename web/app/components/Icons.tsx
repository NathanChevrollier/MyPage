import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = { "aria-hidden": true, focusable: false } as const;

export const ChevronRight = (p: IconProps) => (
  <svg {...base} viewBox="0 0 9 16" width="0.5em" height="0.9em" fill="none" {...p}>
    <path
      d="M1.5 1.5 7.5 8l-6 6.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChevronLeftIcon = (p: IconProps) => (
  <svg {...base} viewBox="0 0 9 16" width="0.5em" height="0.9em" fill="none" {...p}>
    <path
      d="M7.5 1.5 1.5 8l6 6.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ArrowUpRight = (p: IconProps) => (
  <svg {...base} viewBox="0 0 16 16" width="0.8em" height="0.8em" fill="none" {...p}>
    <path
      d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const GitHubIcon = (p: IconProps) => (
  <svg {...base} viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor" {...p}>
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
  </svg>
);

export const LinkedInIcon = (p: IconProps) => (
  <svg {...base} viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor" {...p}>
    <path d="M13.63 13.63h-2.37V9.92c0-.89-.02-2.03-1.24-2.03-1.24 0-1.43.97-1.43 1.96v3.78H6.22V6h2.28v1.04h.03c.32-.6 1.09-1.24 2.25-1.24 2.4 0 2.85 1.58 2.85 3.64v4.19ZM3.56 4.96a1.38 1.38 0 1 1 0-2.75 1.38 1.38 0 0 1 0 2.75Zm1.19 8.67H2.37V6h2.38v7.63ZM14.82 0H1.18C.53 0 0 .52 0 1.15v13.7C0 15.48.53 16 1.18 16h13.64c.65 0 1.18-.52 1.18-1.15V1.15C16 .52 15.47 0 14.82 0Z" />
  </svg>
);

export const MailIcon = (p: IconProps) => (
  <svg {...base} viewBox="0 0 20 16" width="1.1em" height="1em" fill="none" {...p}>
    <rect x="1" y="1" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" />
    <path d="m2 3 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

export const DownloadIcon = (p: IconProps) => (
  <svg {...base} viewBox="0 0 16 16" width="1em" height="1em" fill="none" {...p}>
    <path
      d="M8 2v8.5M4.5 7 8 10.5 11.5 7M2.5 13.5h11"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
