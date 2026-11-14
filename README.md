# Nexora AI - Full-stack AI Tools Store (Next.js + Tailwind)

A complete working store: browse/search tools, register & login, cart, checkout, license delivery,
user dashboard, and an admin panel. Every link in the site goes to a real page.

## Quick start
- Windows: install Node.js LTS (https://nodejs.org), then double-click `setup.bat`. Next time use `start.bat`.
- Mac/Linux: `./setup.sh`
- Manual: `npm install` then `npm run dev` -> http://localhost:3000

The database is created automatically (file `local.db`) with 10 sample tools. No other setup is needed to test.

## Default admin login (CHANGE THIS before going live!)
- URL: /admin | Email: `admin@nexora.test` | Password: `Admin@12345`
- Change it with `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env.local` BEFORE the first run (or delete local.db and restart).

## Pages
- Public: `/`, `/tools`, `/tools/[slug]`, `/pricing`, `/blog`, `/blog/[slug]`, `/about`, `/contact`, `/privacy`, `/terms`, `/login`, `/register`, `/cart`
- Customer: `/checkout`, `/checkout/success`, `/dashboard` (tools + license keys), `/dashboard/orders`, `/dashboard/settings`
- Admin: `/admin` (stats + approve orders), `/admin/tools` (add/edit/delete tools), `/admin/users`, `/admin/messages`

## How buying works
1. Customer adds tools to the cart and goes to checkout (login required).
2. Payment methods:
   - **Test payment** - instantly marks the order paid, no money. Turn it off on a live site with `DISABLE_DEMO_PAYMENT=1`.
   - **Manual payment** (JazzCash / Easypaisa / bank) - customer pays you and enters the transaction ID; you press **Approve** in /admin. Edit the instructions with `PAYMENT_INSTRUCTIONS`.
   - **Card via Stripe** - appears automatically when `STRIPE_SECRET_KEY` is set. It is written against Stripe's API but was NOT tested with a real key. Test with Stripe test keys first.
3. When an order is paid, the customer gets a license key per tool plus a "Launch tool" link (set the Access URL per tool in /admin/tools).
   Prices are always re-read from the database on the server, so customers cannot change them.

## Put it online (Vercel)
1. Create a free database at https://turso.tech and copy the URL + token.
2. Push this folder's contents to GitHub (files at the repo root, not inside a sub-folder).
3. Import the repo in Vercel and add Environment Variables:
   `AUTH_SECRET` (long random text), `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`,
   and optionally `STRIPE_SECRET_KEY`, `PAYMENT_INSTRUCTIONS`, `SUPPORT_EMAIL`. See `.env.example`.
4. Deploy. Without Turso, Vercel uses a temporary database that resets, which is fine only for a demo.

## Customize
- Brand name: search "Nexora" in `components/Logo.js`, `components/Footer.js`, `app/layout.js`.
- Colors / animations: `tailwind.config.js`. Plans: `lib/tools.js`. Blog posts: `lib/blog.js`.
- Privacy and Terms pages are generic templates - have them reviewed before launch.
- Currency is USD. A plan is charged once per purchase (no automatic recurring billing yet).
