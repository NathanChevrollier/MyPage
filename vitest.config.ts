import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "~": fileURLToPath(new URL("./web/app", import.meta.url)) },
  },
  test: {
    include: ["web/app/**/*.test.ts", "status/src/**/*.test.ts"],
    environment: "node",
  },
});
