# Neha Gaur | Mathematical Logic

A responsive academic portfolio for Neha Gaur, built with plain HTML, CSS, and JavaScript. No framework, paid service, tracking, cookies, or build step is required.

**Website:** https://pranjal-gaur.github.io/neha-gaur-portfolio/

## Updating content

- Edit `site/index.html` for the introduction, research, publications, career, talks, and contact details.
- Replace `site/assets/Neha-Gaur-CV.pdf` to update the downloadable CV.
- Replace the images in `site/assets/` to change the portrait or woodland banner.
- Edit `site/styles.css` for colours, type, spacing, and responsive layouts.
- Publications have `data-type="journal"` or `data-type="preprint"`. When adding entries, also update the filter counts and the initial publication count.
- Keep the page description, structured data, and dated affiliation in sync when Neha's position changes. The supplied CV lists the TU Wien appointment as September 2026 to February 2027.

The supplied CV and introduction are the primary content sources. The three journal DOIs were checked against Crossref on 10 November 2026; journal metadata follows those records rather than uncertain volume or issue details in the CV. Preprints link to the supplied ResearchGate profile, not to guessed article URLs. ResearchGate blocked automated access, so its live profile content was not independently checked.

Scholarly links open in a new tab, including paper titles, paper buttons, ResearchGate, ORCID, and the project DOI, leaving the portfolio open. Use native `target="_blank"` links with `rel="noopener noreferrer"` and accessible new-tab notices. Embedded previews may not support new tabs; use the public website in a regular browser rather than changing the site's navigation to work around a preview limitation. Journal DOIs lead to publishers, whose verification screens or subscription requirements are outside this website's control. Direct preprint links require verified individual URLs or files the author has permission to publish.

The supplied CV and contact email were approved for public publication. Do not add private contact information or confidential material.

## Local preview

With Node.js 20.19+ installed:

```shell
npm ci
npm run dev
```

Open `http://127.0.0.1:4173/neha-gaur-portfolio/`.

The site also works without JavaScript: navigation, all publications, DOI links, contact links, and the CV remain available. JavaScript adds mobile navigation, publication filters, copy-citation buttons, and the current footer year.

## Checks

```shell
npx playwright install chromium
npm test
```

The browser checks cover desktop and mobile layouts, navigation, publication filtering, new-tab scholarly links that preserve the portfolio tab, citation copying and fallback, accessibility, assets, CV downloads, and JavaScript-disabled rendering. External-navigation regression checks intercept publisher/profile requests to test the click behaviour without depending on third-party availability.

## Deployment

GitHub Pages is configured to use **GitHub Actions**. Each push to `main` runs `.github/workflows/pages.yml`, which uploads only the `site/` directory. Development tooling and test files are not included in the deployed website.

If the repository or host changes, update the canonical URL, social metadata, structured data, sitemap, robots file, the 404 page's base path, and the preview server's project prefix.

## Assets and rights

The portrait, woodland photo, CV, and personal content were supplied for this portfolio. No redistribution licence is granted for those materials. Both photos are locally optimised; the original supplied CV is served unchanged.

DM Sans and Cormorant Garamond are self-hosted to avoid third-party font requests. Their SIL Open Font License notices are included in `site/assets/fonts/`.
