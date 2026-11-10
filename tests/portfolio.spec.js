import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("loads complete academic content, fonts, and images without errors", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("requestfailed", (request) => errors.push(`${request.url()}: ${request.failure().errorText}`));
  await page.goto("./");
  await expect(page).toHaveTitle("Neha Gaur | Mathematical Logic");
  await expect(page.getByRole("heading", { name: "Neha Gaur.", exact: true })).toBeVisible();
  await expect(page.locator(".hero-affiliation")).toContainText("TU Wien");
  await expect(page.locator(".education-note")).toContainText("Banaras Hindu University");
  await expect(page.locator(".publication")).toHaveCount(6);
  await page.locator(".nature-section").scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator("img").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0))).toBe(true);
  const fontStatus = await page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts].every((font) => font.status === "loaded");
  });
  expect(fontStatus).toBe(true);
  expect(errors).toEqual([]);
});

test("includes every conference presentation and participation entry from the CV", async ({ page }) => {
  const entries = [
    {
      year: "2026", role: "Two contributed talks",
      details: [
        "TACL 2026", "12th Conference on Topology, Algebra, and Categories in Logic", "Kraków, Poland",
        "A Unified Categorical Duality for Preminimal Negation and Beyond: Extending Compatibility Semantics Along Dunn’s Negation Hierarchy",
        "Quad Rings and Quad Algebras: From Duality to Logical Perspective"
      ]
    },
    {
      year: "2026", role: "Contributed talk",
      details: ["WIL 2026", "10th Women in Logic Workshop", "Lisbon, Portugal", "Quad Algebras and a 4-Valued Non-Classical Logic"]
    },
    {
      year: "2026", role: "Attendee",
      details: ["ISLA 2026", "11th Indian School on Logic and its Applications", "Krea University, India"]
    },
    {
      year: "2025", role: "Contributed short talk",
      details: ["WIL 2025", "9th Women in Logic Workshop", "Birmingham, UK", "A Rough Set Semantics for 4-valued Logic of Double Stone Algebras"]
    },
    {
      year: "2025", role: "Attendee",
      details: ["FSCD 2025", "10th International Conference on Formal Structures for Computation and Deduction", "Birmingham, UK"]
    },
    {
      year: "2025", role: "Paper presentation",
      details: ["IWM 2025", "Indian Women in Mathematics Annual Conference", "IIT Patna, India", "Categorical Aspects of Distributive Lattices with Preminimal Negations and its Extensions"]
    },
    {
      year: "2025", role: "Paper presentation",
      details: ["28th Conference on Applications of Logic in Philosophy and the Foundations of Mathematics", "Szklarska Poręba, Poland", "A Study on Logic Naturally Associated to Double Stone Algebras"]
    },
    {
      year: "2025", role: "Attendee",
      details: ["AWPL 2025", "6th Asian Workshop on Philosophical Logic", "Jadavpur University, Kolkata, India"]
    },
    {
      year: "2025", role: "Poster",
      details: ["ICLA 2025", "11th Indian Conference on Logic and its Applications", "ISI Kolkata, India", "Descriptive Compatibility Frames and its Extensions"]
    },
    {
      year: "2024", role: "Attendee",
      details: ["SAT 2024", "27th International Conference on Theory and Applications of Satisfiability Testing", "Pune, India"]
    },
    {
      year: "2023", role: "Contributed talk",
      details: ["ICLA 2023", "10th Indian Conference on Logic and its Applications", "IIT Indore, India", "Categorical Duality of Compatibility Frames"]
    },
    {
      year: "2022", role: "Contributed talk",
      details: ["ISLA 2022", "9th Indian School on Logic and its Applications", "IIT Kanpur, India", "Modal Logic"]
    }
  ];
  await page.goto("./");
  await expect(page.getByRole("heading", { name: "Conference presentations & participation" })).toBeVisible();
  await expect(page.locator(".talk")).toHaveCount(entries.length);
  for (const [index, { year, role, details }] of entries.entries()) {
    const entry = page.locator(".talk").nth(index);
    await expect(entry).toBeVisible();
    await expect(entry.locator(".talk-year")).toHaveText(year);
    await expect(entry.locator(".talk-role")).toHaveText(role);
    for (const detail of details) await expect(entry).toContainText(detail);
  }
  await expect(page.locator('.talk[data-participation="attendance"]')).toHaveCount(4);
  await expect(page.locator('.talk[data-participation="presentation"]')).toHaveCount(8);
  await expect(page.locator(".talk-titles li")).toHaveCount(9);
});

test("includes all additional research achievements with exact years and ranks", async ({ page }) => {
  const entries = [
    { year: "2026", details: ["Ernst Mach Worldwide Grant", "OeAD", "Six-month postdoctoral fellowship at TU Wien"] },
    { year: "2026", details: ["FWF Elise Richter project", "Participation", "Skolemization and Equality", "RIC1287724", "TU Wien"] },
    { year: "2026", details: ["Women in Logic Workshop", "Travel grant"] },
    { year: "2025", details: ["Women in Logic Workshop", "Travel grant"] },
    { year: "2025", details: ["28th Conference on Applications of Logic in Philosophy and the Foundations of Mathematics", "Travel grant"] },
    { year: "2022", details: ["UGC Senior Research Fellowship", "University Grants Commission, India"] },
    { year: "2020", details: ["UGC Junior Research Fellowship", "University Grants Commission, India"] },
    { year: "2019", details: ["UGC-NET (JRF)", "All India Rank 163"] },
    { year: "2019", details: ["IIT-GATE", "All India Rank 625"] },
    { year: "2016", details: ["IIT-JAM", "All India Rank 1048"] }
  ];
  await page.goto("./");
  await expect(page.getByRole("heading", { name: "Additional research achievements" })).toBeVisible();
  await expect(page.locator(".achievement")).toHaveCount(entries.length);
  for (const [index, { year, details }] of entries.entries()) {
    const entry = page.locator(".achievement").nth(index);
    await expect(entry).toBeVisible();
    await expect(entry.locator(".achievement-year")).toHaveText(year);
    for (const detail of details) await expect(entry).toContainText(detail);
  }
  await expect(page.locator(".outreach-panel")).toContainText("Set Theory and Logic");
  await expect(page.locator(".outreach-panel")).toContainText("BITS Hyderabad");
  await expect(page.getByText("Selected recognition", { exact: true })).toHaveCount(0);
});

test("publication categories show the right papers and status", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Journal articles" }).click();
  await expect(page.locator(".publication:visible")).toHaveCount(3);
  await expect(page.locator('.publication[data-type="preprint"]:visible')).toHaveCount(0);
  await expect(page.locator(".publication-count")).toHaveText("3 journal articles");
  await expect(page.getByRole("button", { name: "Journal articles" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Preprints" }).click();
  await expect(page.locator(".publication:visible")).toHaveCount(3);
  await expect(page.locator('.publication[data-type="journal"]:visible')).toHaveCount(0);
  await expect(page.locator(".publication-count")).toHaveText("3 preprints");
  await page.getByRole("button", { name: "All work" }).click();
  await expect(page.locator(".publication:visible")).toHaveCount(6);
});

test("scholarly links open new tabs and leave the portfolio open", async ({ page, context }) => {
  const allowedHosts = new Set(["doi.org", "www.researchgate.net", "orcid.org"]);
  await context.route((url) => allowedHosts.has(url.hostname), (route) =>
    route.fulfill({ contentType: "text/html", body: "<title>External destination</title><p>Article or researcher profile</p>" })
  );
  await page.goto("./");
  const portfolioUrl = page.url();
  const links = await page.locator('a[href^="https://"]').evaluateAll((elements) =>
    elements.map((element) => ({ href: element.href, target: element.target, rel: element.rel }))
  );
  expect(links).toHaveLength(13);
  for (const [index, { href, target, rel }] of links.entries()) {
    expect(target).toBe("_blank");
    expect(rel.split(/\s+/)).toEqual(expect.arrayContaining(["noopener", "noreferrer"]));
    const link = page.locator('a[href^="https://"]').nth(index);
    await expect(link).toHaveAccessibleName(/opens in a new tab/);
    const [newTab] = await Promise.all([
      page.waitForEvent("popup"),
      link.click()
    ]);
    await expect(newTab).toHaveURL(href);
    await expect(newTab).toHaveTitle("External destination");
    expect(await newTab.evaluate(() => window.opener)).toBeNull();
    expect(context.pages()).toHaveLength(2);
    await expect(page).toHaveURL(portfolioUrl);
    await expect(page).toHaveTitle("Neha Gaur | Mathematical Logic");
    await newTab.close();
    expect(context.pages()).toHaveLength(1);
  }
});

test("navigation works with mobile menu, keyboard dismissal, and section focus", async ({ page, isMobile }) => {
  await page.goto("./");
  const navigation = page.getByRole("navigation", { name: "Main navigation" });
  if (isMobile) {
    const toggle = page.getByRole("button", { name: "Menu" });
    await expect(navigation).toBeHidden();
    await toggle.click();
    await expect(navigation).toBeVisible();
    await expect(page.getByRole("button", { name: "Close" })).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(navigation).toBeHidden();
    await expect(toggle).toBeFocused();
    await toggle.click();
  }
  await navigation.getByRole("link", { name: "Publications", exact: true }).click();
  await expect(page).toHaveURL(/#publications$/);
  if (isMobile) {
    await expect(navigation).toBeHidden();
    await expect(page.locator("#publications")).toBeFocused();
  }
});

test("copy citation succeeds and contains the correct DOI", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("./");
  await page.getByRole("button", { name: "Copy citation" }).first().click();
  await expect(page.locator(".toast")).toHaveText("Citation copied to your clipboard.");
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("10.1007/s11225-025-10204-x");
  expect(copied).toContain("Gaur, N.");
});

test("blocked clipboard access reveals a selectable citation and explicit message", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: async () => { throw new DOMException("Permission denied", "NotAllowedError"); } },
      configurable: true
    });
  });
  await page.goto("./");
  await page.getByRole("button", { name: "Copy citation" }).first().click();
  await expect(page.locator(".citation").first()).toBeVisible();
  await expect(page.locator(".citation").first()).toBeFocused();
  await expect(page.locator(".toast")).toContainText("Copy was unavailable");
});

test("all internal links and assets resolve at the GitHub project base path", async ({ page, request }) => {
  await page.goto("./");
  const links = await page.locator('a[href^="./"], img[src], link[rel="stylesheet"], script[src]').evaluateAll((elements) =>
    [...new Set(elements.map((element) => element.href || element.src))]
  );
  for (const url of links) {
    const response = await request.get(url);
    expect(response.ok(), url).toBe(true);
  }
  const anchors = await page.locator('a[href^="#"]').evaluateAll((elements) => elements.map((element) => element.hash.slice(1)));
  for (const id of anchors) await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
  await expect(page.locator('a[href="mailto:gaur.neha1947@gmail.com"]')).toHaveCount(1);
  await expect(page.locator('a[href="https://orcid.org/0009-0004-0774-3242"]')).toHaveCount(1);
  const pdf = await request.get("./assets/Neha-Gaur-CV.pdf");
  expect(pdf.headers()["content-type"]).toBe("application/pdf");
  expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("link", { name: /View my full CV/ }).click()
  ]);
  expect(download.suggestedFilename()).toBe("Neha-Gaur-CV.pdf");
});

test("the complete page passes WCAG A and AA automated checks", async ({ page }) => {
  await page.goto("./");
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.evaluate(() => document.fonts.ready);
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(result.violations.map(({ id, nodes }) => ({
    id,
    elements: nodes.map(({ target, failureSummary }) => ({ target, failureSummary }))
  }))).toEqual([]);
});

test("all content and navigation remain available without JavaScript", async ({ browser, baseURL, isMobile }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: isMobile ? { width: 390, height: 844 } : { width: 1440, height: 1000 }
  });
  const page = await context.newPage();
  await page.goto(baseURL);
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
  await expect(page.locator(".publication:visible")).toHaveCount(6);
  await expect(page.locator(".talk:visible")).toHaveCount(12);
  await expect(page.locator(".achievement:visible")).toHaveCount(10);
  await expect(page.getByRole("button", { name: "All work" })).toBeHidden();
  await expect(page.getByRole("button", { name: "Copy citation" }).first()).toBeHidden();
  await expect(page.getByRole("link", { name: /Download CV/ })).toBeVisible();
  await context.close();
});

test("responsive layouts have no horizontal overflow", async ({ page }) => {
  for (const width of [320, 375, 600, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("./");
    await page.evaluate(() => document.fonts.ready);
    const layout = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
      overflowing: [...document.querySelectorAll("main *")].filter((element) => {
        const bounds = element.getBoundingClientRect();
        return bounds.width && (bounds.right > innerWidth + 1 || bounds.left < -1);
      }).map((element) => element.getAttribute("class") || element.tagName).slice(0, 5)
    }));
    expect(layout.content, JSON.stringify({ width, ...layout })).toBeLessThanOrEqual(layout.viewport);
  }
});

test("reduced motion preference disables smooth scrolling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("./");
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
});
