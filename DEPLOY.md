# Deployment & Performance Checklist ✅

1. Prepare assets
   - Run `npm install` to get dev tools (sharp, csso-cli).
   - Normalize image filenames (no spaces, lowercase): `.\scripts\rename-images.ps1` (Windows PowerShell).
   - Generate responsive WebP images: `npm run optimize-images` (creates `*-400.webp`, `*-800.webp`, `*-1200.webp`).

2. Minify CSS & JS
   - `npm run minify-css` (this produces `Styles/work.min.css`).
   - `npm run minify-js` (this produces `Scripts/script.min.js`).
   - Update `<link rel="preload" href="/Styles/work.min.css" ...>` in HTML and replace script include with the minified file for production.

3. Configure caching (example for Netlify)
   - Add `_headers` (sample provided) to root. This gives long cache to static assets and short cache for HTML.

4. Deploy
   - Recommended: Netlify or Vercel or GitHub Pages with a CDN in front. Netlify handles _headers automatically.
   - Ensure HTTPS is enabled and domain configured.

5. Test
   - Use Chrome Lighthouse (Performance / Best Practices / Accessibility) and aim for high scores.
   - Check images served as WebP, CSS is minified, and fonts load with font-display: swap.

6. Final notes
   - Add analytics/environment variables in production only (do not commit secrets).
   - Consider adding a small CI step to run `npm run optimize-images` in your build pipeline.

7. Contact form guidance
   - If using EmailJS (client-side): **do not** commit keys. Instead set the following GitHub Secrets and the CI workflow will inject them at build time:
     - `EMAILJS_PUBLIC_KEY`
     - `EMAILJS_SERVICE_ID`
     - `EMAILJS_TEMPLATE_ID`
     - `EMAILJS_NOTIFICATION_TEMPLATE`
   - **Security note:** I found literal EmailJS keys previously committed in this file. If those keys are active, **rotate/regenerate them immediately** in your EmailJS dashboard and remove them from the Git history (use tools like `git filter-repo` or BFG to scrub history). If you want, I can help with step-by-step guidance for rotation and safe history cleanup.
   - The form already reads these values from `data-` attributes that the CI replaces at build time. Example: `data-emailjs-public-key="%%EMAILJS_PUBLIC_KEY%%"` in `Pages/Contact.html`.
   - Server-side (recommended): implement a small server endpoint (e.g., Netlify Functions, Azure Functions) that sends email using a secure provider (SendGrid, Mailgun, SES). This avoids exposing API keys to the client.
   - Spam prevention: add reCAPTCHA v3 or hCaptcha in production and rate-limit submission endpoints.
   - Netlify users: the page includes `data-netlify="true"` and a honeypot field (`bot-field`) for basic protection; enable form notifications in Netlify admin or use a serverless function to handle submissions.

Good luck — if you want I can add a GitHub Actions-to-Netlify deploy step that runs only when `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` secrets are present.