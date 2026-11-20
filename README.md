# Nexavo AI — AI tools & digital subscriptions store (Next.js + Tailwind)

A complete working store, rebuilt from the aitoolspro.org sample layout:
browse/search 349 premium subscriptions, register & login, cart, checkout,
license delivery, an interactive customer dashboard, an interactive admin
panel, a Safepay settings page, and a Cohere AI chatbot. Every link in the
site goes to a real page.

**Pakistan-only sales, prices in PKR only.** Payments go through **Safepay**
(card / JazzCash / Easypaisa / Raast in one hosted checkout) when it is
connected. Until then, manual JazzCash / Easypaisa / bank transfer and the
test payment still work.

**Brand note:** the catalogue lists third-party subscriptions (ChatGPT,
Gemini, Canva, CapCut, Adobe, Figma, Spotify, Zoom, Notion, Microsoft 365,
VPNs and more) resold as access plans. Nexavo AI is not affiliated with, or
endorsed by, any of those brands. See `CATALOGUE.md` for the full list.

## Quick start
- Windows: install Node.js LTS (https://nodejs.org), then double-click `setup.bat`. Next time use `start.bat`.
- Mac/Linux: `./setup.sh`
- Manual: `npm install` then `npm run dev` -> http://localhost:3000

The database is created automatically (file `local.db`, or Turso when
`TURSO_DATABASE_URL` is set) and seeds the full 349-tool catalogue on first
run. No other setup is needed to test.

## Default admin login (CHANGE THIS before going live!)
- URL: /admin | Email: `admin@nexavo.test` | Password: `Admin@12345`
- Change it with `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env.local` BEFORE the first run (or delete local.db and restart).

## Pages
- Public: `/`, `/tools`, `/tools/[slug]`, `/pricing`, `/blog`, `/blog/[slug]`, `/about`, `/contact`, `/privacy`, `/terms`, `/login`, `/register`, `/cart`
- Customer: `/checkout`, `/checkout/success`, `/dashboard` (search your tools, copy license keys, warranty/delivery status), `/dashboard/orders` (search + status filter), `/dashboard/settings`
- Admin: `/admin` (revenue chart last 7 days, payment-method breakdown, top sellers, orders with search + status/method filters), `/admin/tools` (add/edit/delete tools incl. brand, duration, access type, warranty, delivery), `/admin/users`, `/admin/messages`, `/admin/settings` (Safepay + Cohere status and connect-later checklist)
- Chatbot: floating button on every page → `POST /api/chat` (Cohere when configured, FAQ fallback otherwise)

## Catalogue
349 tools in 13 categories (AI Chat, AI Video, AI Image, Writing, Coding,
Design, Video Editing, Audio, Productivity, Learning, VPN & Security,
Entertainment, Business), 100+ brands, Rs 199 – Rs 191,300 (most under Rs 17,000; a few high-credit Veo/KLING admin packs are higher). Prices are the
sample's USD price × Rs 280, rounded to the nearest Rs 50, minimum Rs 199.
Each tool lists brand, duration, access type (Private / Shared / Invite /
CDK / Redeem Link / Slot / API Key), warranty and delivery (Instant /
Manual review). Full list: `CATALOGUE.md`.

Existing databases migrate automatically on next deploy (`lib/db.js`):
new `brand / duration / access_type / warranty / delivery` columns are added
if missing, the 349 sample tools are inserted/upserted if absent, and the old
fictional tools (ChatPilot, PixelForge, etc.) are set inactive — never
deleted, so old orders still work.

## Exact-copy notes (v2 — matches the aitoolspro.org sample)
- **Design system taken from the sample's own CSS:** warm cream background `#FBF9F5`, ink `#282330`, muted `#625B6B`, amber primary `#F3A620` (hover `#DE910C`, dark amber `#AD5A00`), white clay cards (20-24px radius, soft shadow, warm border), Inter / Inter Tight / Manrope type, 12px-radius buttons, 1384px max width.
- **Homepage in the sample's exact order:** hero "Premium AI Tools at Unbeatable Prices" + search + benefits, brand marquee, "Find the Right Tool Faster" brand grid (sample counts: ChatGPT 66, Codex 49, Google Veo 37, Grok 36, YouTube 36, Gemini 33, Claude 31, KLING 30, CapCut 27, Adobe 22 — full-site counts, the homepage list itself is 349), "Subscriptions available right now", "How It Works in 4 Simple Steps", "Trusted by 2,800+ Creators & Pros" (Hamza K., Sarah M., Bilal A.) + WELCOME10, "Featured this week", "Tested before delivery to your panel", "Instant Access to Your Tools in Four Simple Steps", "What actually sets our reseller rates", "How to choose an AI tool plan that fits how you work", "Questions Buyers Ask Us First", "Know the plan before you pay", then Pricing + CTA.
- **Catalogue:** all 349 products from the sample homepage, in the sample's order, with the sample's names/brands/durations/access/warranty. Prices are sample USD x Rs 280, rounded to nearest Rs 50, min Rs 199. Brand/product images copied from the sample into `public/images/` (69 tools have a real image; the rest show a branded initial tile + category icon — no blank tiles).
- **WhatsApp:** floating button bottom-left on every page + footer/contact link, `https://wa.me/923416985286` with prefilled text "Hi Nexavo AI, I need help with an order." Number lives in `lib/site.js` / `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- **Chatbot:** replies are formatted with **bold**, bullet/numbered lists and clickable `[tool](/tools/slug)` links (see `components/Chatbot.js` + `lib/chat.js`). It answers only from live DB data.
- **What was adapted (not copied):** brand Nexavo AI (not AI Tools Pro), PKR instead of $, Safepay (card/JazzCash/Easypaisa/Raast) + manual payment instead of Binance/Crypto, WordPress/WooCommerce replaced by Next.js — so admin, checkout, dashboards and the chatbot are Nexavo's own, not WordPress admin. No sample logo was reused.

## How buying works (fully automatic)
1. Customer adds tools to the cart and goes to checkout (login required).
2. Payment methods:
   - **Safepay** — card / JazzCash / Easypaisa / Raast / bank transfer on Safepay's hosted
     checkout. Appears automatically when `SAFEPAY_SECRET_KEY` + `SAFEPAY_API_KEY` are set.
     Amounts are sent in PKR (paisa). Safepay fees (standard plan): cards 2.9% + Rs 30,
     wallets / Raast 1.5%, no setup or monthly fee — confirm your own rate in writing.
   - **Test payment** — instantly marks the order paid, no money. Turn it off on a live site with `DISABLE_DEMO_PAYMENT=1`.
   - **Manual payment** (JazzCash / Easypaisa / bank) — customer pays you and enters the transaction ID; you press **Approve** in /admin. Edit the instructions with `PAYMENT_INSTRUCTIONS`.
3. When Safepay confirms payment, the order is fulfilled **automatically** — no admin action:
   - Safepay sends a signed webhook to `/api/webhooks/safepay` (`payment.succeeded`).
     The webhook is verified (HMAC, `X-SFPY-SIGNATURE`), deduped on `X-SFPY-EVENT-ID`,
     and the tracker is re-checked with Safepay (`tracker.state === TRACKER_ENDED`)
     before anything is marked paid.
   - The customer gets a license key per tool (`NV-XXXX-XXXX-XXXX`), a download
     token link (valid 7 days, 5 downloads) for any file attached to the tool,
     and a delivery email via Resend with all of it. The same license + download
     link are saved in `/dashboard`.
   - If the customer closes the tab before returning, the webhook still fulfils
     the order. The success page also re-checks the tracker as a backup — the
     redirect alone is never treated as proof of payment.
   Prices are always re-read from the database on the server, so customers cannot change them.

## Safepay setup (do this before taking real money)
Safepay is **not connected yet** — no account and no keys. The store works
without it (see manual/test payment above). When you are ready:
1. Apply for a Safepay merchant account at getsafepay.com — you need CNIC, NTN and a
   bank account. Use the **sandbox** account first.
2. In the Safepay dashboard, copy your sandbox `SAFEPAY_API_KEY` and `SAFEPAY_SECRET_KEY`
   into `.env.local` / Vercel env vars, with `SAFEPAY_ENV=sandbox`.
3. In the dashboard (Developers > Webhooks) add your webhook URL and copy the signing
   secret into `SAFEPAY_WEBHOOK_SECRET`:
   - Local test: use a tunnel (e.g. `npx ngrok http 3000`) — Safepay cannot reach localhost.
   - Live: `https://yourdomain.com/api/webhooks/safepay`
4. Test with Safepay's test cards (see Safepay docs > Express Checkout > test cards).
   Test a full order, then check: order is `paid` in /admin, license + download link
   are in /dashboard, and the delivery email arrived.
5. Apply for a live account, switch the keys to live values and set `SAFEPAY_ENV=production`,
   set `DISABLE_DEMO_PAYMENT=1`, and re-test with a real Rs 100 order of your own.
   The status is shown on `/admin/settings` — keys are never printed there.

## AI chatbot (Cohere)
- The floating chat button on every page answers questions about this store
  only — tools, PKR prices, payment, delivery, warranty — using live data
  from the database (`lib/chat.js`).
- **Not connected yet:** no Cohere key. The bot still answers from the store
  FAQ + live catalogue and says so.
- To enable live AI: get a key at https://dashboard.cohere.com/api-keys and
  add `COHERE_API_KEY` (and optionally `COHERE_MODEL`, default
  `command-r-plus`) in Vercel → Settings → Environment Variables, then
  redeploy. The key is server-only and is never sent to the browser.
  Status is shown on `/admin/settings`. Rate limit: 20 messages/minute per IP.

## Delivery email (Resend)
- Set `RESEND_API_KEY` and `EMAIL_FROM` in `.env.local`. Free tier: 3,000 emails/month.
- **Verify your sending domain in Resend (SPF + DKIM + DMARC)** before going live —
  until then Resend only delivers to the email that owns the Resend account.
- If no Resend key is set, checkout still works — the email step is skipped and the
  license + download link stay in the customer's dashboard.

## Files / PDFs
- Do NOT put customer PDFs in `public/` — anyone could guess the URL.
- Put the file in private storage (Supabase Storage private bucket or Cloudflare R2)
  and paste its link as the tool's **File URL** in /admin/tools. The customer gets
  an expiring link (`/api/downloads/<token>`, 7 days, 5 downloads) instead of the
  raw file URL. For a web tool with no file, leave File URL empty — the customer
  gets the Launch link + license key instead.

## Put it online (Vercel) — replacing the existing deployment
1. Keep your existing Vercel project and its env vars (Turso, auth secret,
   admin email/password) — do not delete them. Replace the repo contents
   with this folder (same repo, new commit), or import this folder as the
   new source for the same project.
2. Add the new env vars when you have them: `COHERE_API_KEY` (later),
   `SAFEPAY_ENV`, `SAFEPAY_API_KEY`, `SAFEPAY_SECRET_KEY`,
   `SAFEPAY_WEBHOOK_SECRET` (later). Existing vars stay as they are.
3. Deploy. The database migrates itself on first run (new columns + new
   catalogue, old fictional tools hidden). Without Turso, Vercel uses a
   temporary database that resets, which is fine only for a demo.

## Customize
- Brand name: search "Nexavo" in `components/Logo.js`, `components/Footer.js`, `app/layout.js`.
- Colors / animations: `tailwind.config.js` (sample palette: warm cream `#FBF9F5`, ink `#282330`, amber `#F3A620` primary, sky `#0EA5E9`, pink `#DB2777`, Manrope/Inter) and `app/globals.css` (page-transition + chatbot animations). Plans: `lib/tools.js` (prices are whole PKR). Blog posts: `lib/blog.js`.
- Privacy and Terms pages are generic templates — have them reviewed before launch.
- Currency is PKR. A plan is charged once per purchase (no automatic recurring billing yet).
