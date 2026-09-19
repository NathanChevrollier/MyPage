import { CanvasTexture, SRGBColorSpace } from "three";
import { media } from "~/content/media";
import type { Lang, Project } from "~/content/types";

const W = 1280;
const H = 800; // 16:10, same as the modelled display
const BAR = 56;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Draws what the laptop screen shows for a project: a browser window on its
 * subdomain, with the project's screenshot or, failing that, its brand artwork.
 * Mirrors the CSS laptop so switching between the two is seamless.
 */
export async function projectScreen(project: Project, lang: Lang): Promise<CanvasTexture> {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Content
  const hero = media[project.slug]?.hero;
  let drewImage = false;
  if (hero) {
    try {
      const img = await loadImage(`${hero.base}-1280.webp`);
      const scale = Math.max(W / img.width, (H - BAR) / img.height);
      ctx.drawImage(img, 0, BAR, img.width * scale, img.height * scale);
      drewImage = true;
    } catch {
      /* fall back to artwork */
    }
  }
  if (!drewImage) {
    ctx.fillStyle = "#0b0b0f";
    ctx.fillRect(0, BAR, W, H - BAR);
    const blob = (x: number, y: number, r: number, color: string) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(0, BAR, W, H - BAR);
    };
    blob(W * 0.28, H * 0.35, W * 0.45, project.accent);
    blob(W * 0.75, H * 0.72, W * 0.5, project.accent2);
    // Glass orb
    const cx = W / 2;
    const cy = BAR + (H - BAR) / 2;
    const r = (H - BAR) * 0.3;
    const orb = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.4, r * 0.05, cx, cy, r);
    orb.addColorStop(0, "rgba(255,255,255,0.55)");
    orb.addColorStop(0.35, project.accent);
    orb.addColorStop(1, "rgba(0,0,0,0.85)");
    ctx.fillStyle = orb;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Caption
  const shade = ctx.createLinearGradient(0, H * 0.6, 0, H);
  shade.addColorStop(0, "transparent");
  shade.addColorStop(1, "rgba(0,0,0,0.55)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, H * 0.6, W, H * 0.4);
  const font = '-apple-system, BlinkMacSystemFont, "Inter Variable", "Segoe UI", sans-serif';
  ctx.fillStyle = "#fff";
  ctx.font = `700 64px ${font}`;
  ctx.fillText(project.name, 52, H - 92);
  ctx.globalAlpha = 0.85;
  ctx.font = `400 30px ${font}`;
  ctx.fillText(project.copy[lang].tagline, 52, H - 46);
  ctx.globalAlpha = 1;

  // Browser chrome
  ctx.fillStyle = "#1c1c1e";
  ctx.fillRect(0, 0, W, BAR);
  ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(34 + i * 26, BAR / 2, 8, 0, Math.PI * 2);
    ctx.fill();
  });
  const host = project.url ? new URL(project.url).host : `${project.slug}.chevrolliernathan.fr`;
  ctx.font = `500 22px ${font}`;
  const tw = ctx.measureText(host).width;
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.beginPath();
  ctx.roundRect(W / 2 - tw / 2 - 40, 12, tw + 80, BAR - 24, 9);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.72)";
  ctx.textAlign = "center";
  ctx.fillText(host, W / 2, BAR / 2 + 8);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.flipY = false; // glTF UV convention
  texture.anisotropy = 8;
  return texture;
}
