import {
  type RefObject,
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Picture } from "~/components/Picture";
import { ProjectArt } from "~/components/ProjectArt";
import { media } from "~/content/media";
import { byTier } from "~/content/projects";
import { useI18n } from "~/i18n";
import styles from "./HeroStage.module.css";

const INTERVAL_MS = 3800;

const loadHero3D = () => import("./Hero3D");
const Hero3D = lazy(loadHero3D);

/** Desktop-class device with WebGL2, no reduced motion, no data saver. */
function canRender3D(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.innerWidth < 1024) return false;
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData) return false;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

const noopSubscribe = () => () => {};

/**
 * A laptop whose screen cycles through the flagship projects inside a browser
 * window showing each subdomain — the site's whole idea in one picture.
 */
export function HeroStage({ progress }: { progress: RefObject<number> }) {
  const { lang } = useI18n();
  const flagships = byTier("flagship");
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const use3D = useSyncExternalStore(noopSubscribe, canRender3D, () => false);
  const [ready3D, setReady3D] = useState(false);
  const onReady = useCallback(() => setReady3D(true), []);
  // The 3D scene only matters once the visitor scrolls (the lid opens on scroll), so it
  // is mounted on first interaction — keeping the initial load free of WebGL work.
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!use3D) return;
    const events = ["scroll", "pointermove", "touchstart", "keydown"] as const;
    const arm = () => setArmed(true);
    events.forEach((e) => window.addEventListener(e, arm, { once: true, passive: true }));
    const idle = setTimeout(arm, 6000);
    const prefetch = setTimeout(() => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1));
      ric(() => void loadHero3D());
    }, 1500);
    return () => {
      events.forEach((e) => window.removeEventListener(e, arm));
      clearTimeout(idle);
      clearTimeout(prefetch);
    };
  }, [use3D]);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(([entry]) => {
      clearInterval(timer);
      if (entry?.isIntersecting) {
        timer = setInterval(() => setActive((i) => (i + 1) % flagships.length), INTERVAL_MS);
      }
    });
    io.observe(el);
    return () => {
      io.disconnect();
      clearInterval(timer);
    };
  }, [flagships.length]);

  const current = flagships[active]!;
  const host = current.url ? new URL(current.url).host : `${current.slug}.chevrolliernathan.fr`;

  return (
    <div ref={ref} className={styles.stage} data-3d={ready3D}>
      {use3D && armed && (
        <div className={styles.canvas}>
          <Suspense fallback={null}>
            <Hero3D progress={progress} active={active} lang={lang} onReady={onReady} />
          </Suspense>
        </div>
      )}
      <div className={styles.laptop}>
        <div className={styles.lid}>
          <div className={styles.screen}>
            <div className={styles.browserBar} aria-hidden="true">
              <span className={styles.lights}>
                <i />
                <i />
                <i />
              </span>
              <span className={styles.address}>
                <svg viewBox="0 0 10 12" width="8" height="10" aria-hidden="true">
                  <path
                    d="M2 5V3.5a3 3 0 0 1 6 0V5h.5A1.5 1.5 0 0 1 10 6.5v4A1.5 1.5 0 0 1 8.5 12h-7A1.5 1.5 0 0 1 0 10.5v-4A1.5 1.5 0 0 1 1.5 5H2Zm1.3 0h3.4V3.5a1.7 1.7 0 0 0-3.4 0V5Z"
                    fill="currentColor"
                  />
                </svg>
                <span key={host} className={styles.host}>
                  {host}
                </span>
              </span>
            </div>
            <div className={styles.viewport}>
              {flagships.map((p, i) => {
                const hero = media[p.slug]?.hero;
                return (
                  <div
                    key={p.slug}
                    className={styles.slide}
                    data-active={i === active}
                    aria-hidden={i !== active}
                  >
                    {hero ? (
                      <Picture
                        asset={hero}
                        sizes="(min-width: 1100px) 1000px, 92vw"
                        priority={i === 0}
                        className={styles.shot}
                      />
                    ) : (
                      <ProjectArt project={p} size="tile" className={styles.shot} />
                    )}
                    <div className={styles.caption}>
                      <strong>{p.name}</strong>
                      <span>{p.copy[lang].tagline}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className={styles.base} aria-hidden="true">
          <span className={styles.notch} />
        </div>
        <p className="visually-hidden" aria-live="polite">
          {current.name}
        </p>
      </div>
    </div>
  );
}
