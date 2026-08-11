# Publishing checklist

Two files to drop into your existing `la_kitchen_collective` Astro project:

- `src/pages/index.astro` → replaces your current homepage
- `src/styles/global.css` → replaces your current stylesheet

No new images needed — the page uses two logos already in your repo:
`/logos/original-version-isologotype.png` (hero) and `/logos/sand-logotype.png` (footer).

Fonts load from Google Fonts (Archivo + Figtree) via a `<link>` in the page head.

## Before you deploy

1. `npm install && npm run dev` and check it locally at http://localhost:4321.
2. Your other pages (`facility`, `membership`, `faq`, `how-it-works`, `contact`) still
   exist and use the old CSS class names, which this stylesheet does not include. Either
   delete them for now or keep a copy of your old `global.css` for them — the new one is
   written only for the homepage.
3. Nothing links to those other pages from this homepage. That's intentional; add
   navigation back when the pages have real content.

## Deploy

1. Commit and push to GitHub.
2. In Netlify: Add new site → Import an existing project → pick the repo.
3. Build command `npm run build`, publish directory `dist`. Netlify usually detects
   both automatically for Astro.
4. Deploy. On the first successful build, Netlify scans the HTML and registers both
   forms: `waitlist-hero` (the email field in the hero) and `waitlist` (the full form).
5. Site configuration → Forms → Form notifications → add an email notification so
   submissions land in your inbox. Submissions are also listed in the Forms tab.

Netlify shows its own generic thank-you page after a submit. To use your own, create
`src/pages/thanks.astro` and add `action="/thanks"` to each form tag.

## Domain

Netlify gives you a `*.netlify.app` URL immediately. Add your real domain under
Domain management → Add a domain, then point your registrar's nameservers or add the
records Netlify shows you.

## Worth adding before you promote the site

- A contact email address. Right now the form is the only way to reach you.
- Real photography, once you have it — of the site, the build-out, or local makers.
- Verify the Homemade Food Act paragraph against current NMED guidance before launch.
