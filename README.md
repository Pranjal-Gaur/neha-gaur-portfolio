# Neha Gaur | Mathematical Logic

A responsive academic portfolio for Neha Gaur, built with plain HTML, CSS, and JavaScript. No framework, paid service, tracking, cookies, or build step is required.

**Website:** https://neha-gaur.pages.dev/

## Updating content

- Edit `site/index.html` for the introduction, research, publications, career, talks, hobbies, and contact details.
- The Contact section lists Gmail and TU Wien email addresses. Keep each displayed address identical to its `mailto:` destination. Email addresses use the sans-serif font with lining numerals so the digit `1` is not mistaken for a lowercase `i`.
- Replace `site/assets/Neha-Gaur-CV.pdf` to update the downloadable CV.
- Replace the images in `site/assets/` to change the portrait or mountain background. Preserve or update the background's attribution, licence, and modification notice in the hobbies section and `site/assets/mount-everest-license.txt`.
- Edit `site/styles.css` for colours, type, spacing, and responsive layouts. When changing styles, update the stylesheet version query in `site/index.html` and `site/404.html` so returning visitors receive the new CSS.
- Publications have `data-type="journal"` or `data-type="preprint"`. When adding entries, also update the filter counts and the initial publication count.
- Keep all conference presentations and participation in `.talks-panel`, and all additional research achievements in `.achievement-list`. These are complete lists from the supplied CV, not selected highlights: 12 conference entries (including both TACL talks) and 10 achievements. Preserve event names, locations, roles, talk titles, award years, and examination ranks.
- Keep the page description, structured data, and dated affiliation in sync when Neha's position changes. The supplied CV lists the TU Wien appointment as September 2026 to February 2027.

The supplied CV and introduction are the primary content sources. The three journal DOIs were checked against Crossref on 10 November 2026; journal metadata follows those records rather than uncertain volume or issue details in the CV. Preprints link to the supplied ResearchGate profile, not to guessed article URLs. ResearchGate blocked automated access, so its live profile content was not independently checked.

The 2025 date for the 28th Conference on Applications of Logic in Philosophy and the Foundations of Mathematics comes from its matching travel-grant entry in the CV. Attendance is labelled separately from talks, paper presentations, and posters. FWF project participation is listed as participation rather than an individual grant award.

Scholarly links open in a new tab, including paper titles, paper buttons, ResearchGate, ORCID, and the project DOI, leaving the portfolio open. Use native `target="_blank"` links with `rel="noopener noreferrer"` and accessible new-tab notices. Embedded previews may not support new tabs; use the public website in a regular browser rather than changing the site's navigation to work around a preview limitation. Journal DOIs lead to publishers, whose verification screens or subscription requirements are outside this website's control. Direct preprint links require verified individual URLs or files the author has permission to publish.

The supplied CV and both listed contact emails were approved for public publication. The TU Wien email was supplied separately from the CV; the downloadable PDF remains unchanged. Do not add private contact information or confidential material.

The hiking and mountain-trekking interests were supplied separately from the CV. They do not imply that Neha has climbed Mount Everest. The decorative mountain image is a fixed whole-page background with a 94% cream tint, leaving only 6% of the photograph visible so text takes priority. Translucent section backgrounds soften it further. The former woodland banner has been replaced by the "Beyond mathematics" hobbies section.

## Local preview

With Node.js 20.19+ installed:

```shell
npm ci
npm run dev
```

Open `http://127.0.0.1:4173/`. The preview also serves `/neha-gaur-portfolio/` for compatibility with the original GitHub Pages address.

The site also works without JavaScript: navigation, all publications, DOI links, contact links, and the CV remain available. JavaScript adds mobile navigation, publication filters, copy-citation buttons, and the current footer year.

## Checks

```shell
npx playwright install chromium
npm test
```

The browser checks cover desktop and mobile layouts, complete conference and achievement content, hobbies and background attribution, navigation, publication filtering, new-tab external links that preserve the portfolio tab, citation copying and fallback, accessibility, canonical metadata, assets and CV downloads at both hosting base paths, and JavaScript-disabled rendering. External-navigation regression checks intercept publisher/profile and attribution requests to test the click behaviour without depending on third-party availability.

## Deployment

The primary website is hosted for free on **Cloudflare Pages**, using the GitHub-connected `neha-gaur` project. Each push to `main` automatically deploys the site with these settings:

- Repository: `Pranjal-Gaur/neha-gaur-portfolio`
- Production branch: `main`
- Framework preset: **None**
- Build command: empty
- Build output directory: `site`
- Root directory: repository root (empty)

The original address, https://pranjal-gaur.github.io/neha-gaur-portfolio/, remains available. GitHub Pages uses **GitHub Actions**: each push to `main` runs `.github/workflows/pages.yml`, which uploads only the `site/` directory. Neither host publishes development tooling or test files.

Search and social metadata identify the Cloudflare address as canonical. The 404 page uses absolute canonical URLs for its assets and home link so it works at nested missing paths on either host without JavaScript.

If the primary hostname changes, update the canonical URL, social metadata, structured data, sitemap, robots file, the 404 page's URLs, the regression checks, this README, and the repository's homepage setting. Keep the preview server's project prefix in sync if the GitHub repository is renamed.

## Assets and rights

The portrait, original woodland photo (retained but no longer displayed), CV, and personal content were supplied for this portfolio. No redistribution licence is granted for those materials. The supplied photos are locally optimised; the original supplied CV is served unchanged.

The mountain background is ["Everest, Himalayas" by Vyacheslav Argenberg](https://commons.wikimedia.org/wiki/File:Everest,_Himalayas.jpg), used under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). It was resized to 1600 x 1067 and converted to WebP, with viewport cropping and a light CSS tint for display. Attribution and the licence link appear in the hobbies section; provenance is also included in `site/assets/mount-everest-license.txt`. This photograph retains its CC BY 4.0 licence and is excluded from the site's "All rights reserved" notice. The Britannica reference image used during design previews is not part of the published site.

DM Sans and Cormorant Garamond are self-hosted to avoid third-party font requests. Their SIL Open Font License notices are included in `site/assets/fonts/`.
