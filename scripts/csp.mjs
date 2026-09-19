// Builds the Content-Security-Policy for the prerendered site.
//
// React Router prerendering emits inline <script> tags (hydration context, module
// bootstrap) whose content differs per page. Instead of allowing 'unsafe-inline',
// hash every inline script of every HTML file and allow exactly those hashes.
//
// Usage: node scripts/csp.mjs <build/client dir> <output nginx snippet>

import { createHash } from "node:crypto";
import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [root = "web/build/client", out = "web/build/csp.conf"] = process.argv.slice(2);

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) yield* htmlFiles(full);
    else if (name.endsWith(".html")) yield full;
  }
}

const hashes = new Set();
const inline = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
let files = 0;
for (const file of htmlFiles(root)) {
  files++;
  const html = readFileSync(file, "utf8");
  for (const [, body] of html.matchAll(inline)) {
    // JSON-LD is data, not executed; CSP does not apply to it, but hashing is harmless.
    if (body.trim())
      hashes.add(`'sha256-${createHash("sha256").update(body, "utf8").digest("base64")}'`);
  }
}

const policy = [
  "default-src 'self'",
  // 'wasm-unsafe-eval': the meshopt decoder (3D model) instantiates WebAssembly.
  `script-src 'self' 'wasm-unsafe-eval' ${[...hashes].sort().join(" ")}`,
  // Inline style attributes carry per-project CSS variables.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

writeFileSync(out, `add_header Content-Security-Policy "${policy}" always;\n`);
console.log(`CSP: ${hashes.size} inline script hashes from ${files} HTML files -> ${out}`);
