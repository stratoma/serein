import { test, expect } from "@playwright/test";

const BASE = "/serein";

test.describe("SEREIN ingredient panel product links", () => {
  test("clicking a product link from an ingredient panel navigates to the correct homepage anchor", async ({
    page,
  }) => {
    await page.goto(`${BASE}/ingredients`);

    await expect(
      page.getByRole("heading", { name: /What's Inside/i })
    ).toBeVisible();

    const sheaRow = page.getByRole("button", { name: /Shea Butter/i });
    await sheaRow.click();

    const findItIn = page.getByText("Find it in:", { exact: false });
    await expect(findItIn).toBeVisible();

    const suppleOudLink = page.getByRole("link", { name: "Supple Oud", exact: true });
    await expect(suppleOudLink).toBeVisible();
    await expect(suppleOudLink).toHaveAttribute("href", /\/serein\/?#supple-oud/);

    await suppleOudLink.click();

    await expect(page).toHaveURL(/#supple-oud/);

    await expect(page.locator("#supple-oud")).toBeVisible();

    await expect(page.getByRole("heading", { name: /Supple Oud/i }).first()).toBeVisible();
  });

  test("Morrow Trio link from ingredient panel reaches the Morrow Trio homepage section", async ({
    page,
  }) => {
    await page.goto(`${BASE}/ingredients`);

    await expect(
      page.getByRole("heading", { name: /What's Inside/i })
    ).toBeVisible();

    const sheaRow = page.getByRole("button", { name: /Shea Butter/i });
    await sheaRow.click();

    const morrowTrioLink = page.getByRole("link", { name: "Morrow Trio", exact: true });
    await expect(morrowTrioLink).toBeVisible();
    await expect(morrowTrioLink).toHaveAttribute("href", /\/serein\/?#morrow-trio/);

    await morrowTrioLink.click();

    await expect(page).toHaveURL(/#morrow-trio/);

    await expect(page.locator("#morrow-trio")).toBeVisible();

    await expect(
      page.getByText(/Your ritual,?\s*wherever you are/i)
    ).toBeVisible();
  });

  test("product links in ingredient panels use correct BASE_URL prefix", async ({
    page,
  }) => {
    await page.goto(`${BASE}/ingredients`);

    const sheaRow = page.getByRole("button", { name: /Shea Butter/i });
    await sheaRow.click();

    await expect(page.getByText("Find it in:", { exact: false })).toBeVisible();

    const panelLinks = page.locator(
      'a[href*="#supple-oud"], a[href*="#mint-moss"], a[href*="#lithe-bloom"], a[href*="#morrow-trio"]'
    ).filter({ hasText: /^(Supple Oud|Mint \+ Moss|Lithe Bloom|Morrow Trio)$/ });

    const count = await panelLinks.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const href = await panelLinks.nth(i).getAttribute("href");
      expect(href).toMatch(/^\/serein\/?#/);
    }
  });
});
