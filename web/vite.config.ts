import { reactRouter } from "@react-router/dev/vite";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [reactRouter()],
  resolve: {
    alias: { "~": fileURLToPath(new URL("./app", import.meta.url)) },
  },
  css: {
    modules: { localsConvention: "camelCaseOnly" },
  },
  build: {
    // three.js lands in its own lazy chunk; keep an eye on everything else.
    chunkSizeWarningLimit: 700,
    // One small stylesheet (~9 KB gz) beats five render-blocking requests on mobile.
    cssCodeSplit: false,
  },
  server: {
    proxy: { "/api": "http://127.0.0.1:3101" },
  },
});
