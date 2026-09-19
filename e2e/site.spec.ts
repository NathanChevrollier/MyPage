import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const pages = ["/", "/en", "/projets/nexus-dashboard", "/en/projects/scanlib", "/mentions-legales"];

test.describe("pages", () => {
  for (const path of pages) {
    test(`${path} renders without errors and passes axe`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("console", (m) => {
        // The status API is not served by the static preview server.
        if (m.type() === "error" && !m.text().includes("Failed to load resource"))
          errors.push(m.text());
      });
      await page.goto(path);
      await expect(page.locator("h1")).toBeVisible();
      await expect(page.locator("main#main")).toBeVisible();

      const axe = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        // Reveal animations start at opacity 0; axe would flag contrast on invisible text.
        .exclude(".reveal:not([data-visible='true'])")
        .analyze();
      expect(axe.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
      expect(errors).toEqual([]);
    });
  }
});

test("prerendered HTML is complete without JavaScript", async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Nathan Chevrollier");
  await expect(page.getByText("Tout votre univers. Sur un seul écran.").first()).toBeVisible();
  // Reveal-on-scroll must never hide content when JS is off.
  const hidden = await page
    .locator(".reveal")
    .evaluateAll((els) => els.filter((e) => getComputedStyle(e).opacity === "0").length);
  expect(hidden).toBe(0);
  await ctx.close();
});

test("language switch keeps the current page", async ({ page, isMobile }) => {
  await page.goto("/projets/scanlib");
  if (isMobile) await page.getByRole("button", { name: "Menu" }).click();
  await page.getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/projects\/scanlib$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});

test("project links open the live site in a new tab", async ({ page }) => {
  await page.goto("/");
  const visit = page.getByRole("link", { name: /Visiter Nexus Dashboard/ }).first();
  await expect(visit).toHaveAttribute("href", "https://nexus.chevrolliernathan.fr");
  await expect(visit).toHaveAttribute("target", "_blank");
  await expect(visit).toHaveAttribute("rel", /noopener/);
});

test("email address is not in the prerendered HTML", async ({ request }) => {
  const html = await (await request.get("/")).text();
  expect(html).not.toContain("@gmail.com");
});
