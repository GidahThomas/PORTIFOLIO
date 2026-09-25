# Gidah Thomas — Portfolio & CV

Personal portfolio and CV website for **Gidamasauda Thomas Gwasma (Gidah Thomas)** — Software Developer, Software Engineering student (University of Dodoma) and UI/UX Designer.

Plain HTML, CSS and JavaScript with [Bootstrap 5.3](https://getbootstrap.com/) available. No build step, no backend.

## Run locally

**Simplest:** double-click `index.html`. Everything works when opened directly from disk — fonts, photos, the CV popup, the printable CV page and the PDF download.

Or serve the folder with any static server:

```bash
npx http-server -p 5500 -c-1
```

and open http://localhost:5500. The contact form sends through FormSubmit, which only works from a hosted site (http/https), not from a file opened on disk.

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Single-page portfolio (Home, About, Projects, Experience, Skills, Education, Leadership, Interests, Services, CV, Contact) plus the opening CV popup |
| `js/data.js` | **All content** — profile, skills, projects, experience, education, leadership, services, links |
| `js/app.js` | Renders the page from `data.js`; page switching, theme toggle, mobile menu, active nav, project modal, skill filter, contact form |
| `js/cv-document.js` | **Shared CV renderer** — used by the opening popup, the CV section preview and `cv/`, so every copy of the CV is identical |
| `css/cv-document.css` | CV document styles (responds to its container: two columns when wide, one column on phones) |
| `js/icons.js` | Inline SVG icon set |
| `css/fonts.css`, `assets/fonts/` | Self-hosted Inter and Manrope fonts |
| `css/styles.css` | Styles, light/dark theme tokens, responsive layout |
| `cv/` | Printable A4 CV page (also reads `js/data.js`) |
| `assets/cv/Gidah-Thomas-CV.pdf` | Downloadable CV generated from `cv/` |
| `images/` | Photo, cropped headshot (`gidah-headshot.jpg`, used on the CV and for link previews) and optional project screenshots |
| `favicon.svg` | Browser-tab icon |
| `assets/vendor/bootstrap/` | Bootstrap 5.3.8 CSS and JS bundle (self-hosted, MIT licence) |

## Bootstrap

Bootstrap 5.3.8 is loaded on `index.html` and `cv/index.html`, so its utility classes (`d-flex`, `gap-3`, `mb-4`, …), components (alerts, badges, tooltips, collapse, …) and JavaScript (`window.bootstrap`) can be used anywhere.

- **The site's own design always wins.** Bootstrap's CSS is imported into a cascade layer (`@import … layer(bootstrap)`), so any rule in `css/styles.css` overrides Bootstrap regardless of selector specificity. Bootstrap only fills in where the site sets nothing.
- **Shared class names.** The site already uses `.btn`, `.btn-primary`, `.btn-lg`, `.btn-sm`, `.card`, `.container`, `.lead`, `.modal`, `.modal-backdrop` and `.modal-content` for its own components. The "Bootstrap compatibility" block near the top of `css/styles.css` resets the few Bootstrap properties that would otherwise leak into them. The project modal is the site's own, not a Bootstrap modal — don't add `data-bs-toggle="modal"` to it.
- **Theme.** Bootstrap's colour and font variables (`--bs-body-color`, `--bs-body-bg`, `--bs-border-color`, …) point at the site's tokens, and the theme toggle sets `data-bs-theme` alongside `data-theme`, so Bootstrap components follow light/dark mode.

## Pages

The portfolio shows **one section at a time** instead of one long scroll. Each `<section>` in `<main>` is a page, and the next one slides in from the side: from the right going forward, from the left going back. You can move between pages with:

- the header, mobile and footer menus, and any link to `#<section-id>` (e.g. the hero's **View My Work** → `#projects`);
- the pager under each page (**Previous / Next** plus page dots);
- the **←/→** arrow keys (not while typing in a field or while a popup or the menu is open);
- a horizontal **swipe** on touch screens.

**Each page fits the browser window.** The header stays at the top and the pager is pinned to the bottom. The current page fills the space between them and is centred when it is shorter. When a page has more content than fits (e.g. Projects), only that middle area (`#page-scroll`) scrolls, and a soft fade at its bottom edge shows there is more. Spacing tightens on shorter windows, so most pages fit without scrolling on a typical laptop. The full footer follows every page. On short pages it sits at the bottom of the window; on longer pages it is at the end of the scroll.

Each page has its own URL (`/#skills`, `/#contact`, …), so browser back/forward, bookmarks and shared links work. The logic is `setupPages()` in `js/app.js`; the styles are under "Pages" in `css/styles.css`. Page order follows the order of the sections in `index.html`, and page names come from `nav` in `data.js`. Without JavaScript, and when printing, all sections show stacked as before.

## Opening CV popup

On a visitor's first page load in a browser session, the site opens a CV viewer over the (blurred) portfolio with **View Full Portfolio**, **Download CV** and **Continue to Website**. It is skipped for deep links such as `/#contact`, is not shown again after being closed in the same session, and can be reopened any time from the **View CV** buttons (header, hero, mobile menu, CV section, footer). Set `cv.showOnLoad: false` in `data.js` to turn the automatic opening off.

## Typography

Headings use **Manrope** and text uses **Inter**. Both are bundled with the site (SIL Open Font License, licences in `assets/fonts/`) and **embedded as data URIs in `css/fonts.css`**, so the typography is identical in every browser, offline, when `index.html` is opened directly from disk (browsers block separate font files there), and with no third-party requests. The `.woff2` files in `assets/fonts/` are the source copies used to regenerate `fonts.css`. A metric-matched fallback keeps text from jumping while the fonts load. The type scale lives in CSS variables at the top of `css/styles.css`.

## Editing content

Everything is in **`js/data.js`**. Search it for `TODO` to find the placeholders still to fill in:

- `social.linkedin` — LinkedIn URL (the LinkedIn buttons appear once it is set)
- `projects[].github` / `projects[].live` — real repository / demo URLs only (the GitHub / Live demo buttons appear once set)
- `projects[].tech` — add the actual languages/frameworks each project used
- `projects[].image` — path to a real screenshot, e.g. `images/projects/supportdesk.png` (an illustrated preview is shown until then)
- `projects[].status` — status badge, e.g. "Completed" (hidden until set)
- `cv.references` — referees who have agreed to be listed (the CV says "Available upon request" until then)

## Updating the CV PDF

After changing `data.js`, regenerate the PDF so the download matches the website. From the `portfolio` folder in PowerShell (no server needed):

```powershell
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --headless=new --no-pdf-header-footer --virtual-time-budget=8000 --print-to-pdf="$PWD\assets\cv\Gidah-Thomas-CV.pdf" "file:///$($PWD -replace '\\','/')/cv/index.html"
```

Alternatively open `/cv/`, press **Print**, and choose **Save as PDF** (A4, margins: default, headers/footers off).

## Contact form

Messages are sent through [FormSubmit](https://formsubmit.co) to `gidamasaudathomas@gmail.com` — no backend needed. The **first submission after deploying** triggers a one-time confirmation email from FormSubmit that must be clicked to activate delivery. If sending fails, the form shows the email address as a fallback.

## Deployment

Works on any static host (GitHub Pages, Netlify, Vercel). The canonical / social-sharing URLs in `index.html` and `cv/index.html` assume `https://gidahthomas.github.io/portfolio/` — update them if you deploy elsewhere.
