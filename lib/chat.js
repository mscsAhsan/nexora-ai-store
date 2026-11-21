// Nexavo AI chatbot — Cohere (server only) with a local FAQ fallback.
// The Cohere key is NEVER sent to the browser. If COHERE_API_KEY is missing
// or Cohere errors, we still answer from live DB data + the store FAQ.
import { getTools } from "./data";
import { plans } from "./tools";
import { safepayConfigured } from "./safepay";

export function cohereConfigured() {
  return Boolean(process.env.COHERE_API_KEY);
}
export function cohereModel() {
  // command-r-plus was deprecated by Cohere on 15 Sept 2025 — using it as
  // the default made every Cohere call fail and silently fall back to FAQ,
  // even with a correct key. Use the live Command A model instead.
  return process.env.COHERE_MODEL || "command-a-03-2025";
}

export async function storeContext() {
  const tools = await getTools({ all: false }).catch(() => []);
  const top = tools.slice(0, 60).map((t) =>
    `${t.name} (${t.brand || t.category}) — Rs ${Number(t.price || 0).toLocaleString("en-PK")} — ${t.duration || ""} — ${t.accessType || ""} access — ${t.warranty || ""} — ${t.delivery || "Instant"} delivery — link /tools/${t.slug}`
  ).join("\n");
  const planLines = plans.map((p) => `${p.name}: Rs ${p.monthly}/month — ${p.desc}`).join("\n");
  const pay = safepayConfigured()
    ? "Safepay is CONNECTED: pay by local card, JazzCash, Easypaisa, Raast or bank transfer on Safepay's secure hosted checkout. Safepay fees: cards 2.9% + Rs 30, wallets 1.5%, Raast 1.5%."
    : "Safepay is NOT connected yet (no merchant account). Customers can pay by manual JazzCash / Easypaisa / bank transfer (admin approves the order after the transaction ID is submitted) or use the test payment to try the flow.";
  return `You are the Nexavo AI store assistant. Nexavo AI is a Pakistan-only marketplace selling third-party AI and digital subscriptions (ChatGPT, Gemini, Canva, CapCut, Adobe, Figma, Spotify, Zoom, Notion, Microsoft 365, VPNs and more) in PKR. Nexavo AI is NOT affiliated with, or endorsed by, any of those brands — they are third-party subscriptions resold as access plans.
RULES: Answer ONLY about this store. Use ONLY the catalogue, plans and payment info below — never invent a price, tool, duration or warranty. If a tool is not in the list, say it is not listed and suggest a similar one or /tools. If unsure, say so and point to /contact or the support team. Never ask for passwords, card numbers or OTPs.
ANSWER FORMAT (always use this structure, never one plain paragraph):
- One short intro line.
- Then a bullet list, one bullet per tool: "- **[Tool name](/tools/slug)** — **Rs X** — duration — access — warranty". Use the tool's real /tools/slug link from the catalogue.
- Then one short line with the next step (e.g. "Add it to your cart on [the tool page](/tools/slug), sign in and pay at checkout.").
- Use **bold** for tool names and prices, '-' bullets for lists, and markdown links [text](/tools/slug). Keep the whole answer short.

CATALOGUE (name — price — duration — access — warranty — delivery):
${top}

PLANS:
${planLines}

PAYMENTS: ${pay}
HOW TO BUY: 1) Browse /tools and add to cart. 2) Sign in / register. 3) Checkout and pay. 4) Instant-delivery items appear in the customer dashboard (/dashboard) and by email in under 60 seconds; items needing manual review say so on the listing. Every plan is protected by the warranty shown on its listing; if a subscription stops working inside its warranty, support replaces it.
DELIVERY / WARRANTY / REFUNDS: In-stock automated products arrive in moments. Warranty and replacement eligibility differ by product and are shown on the listing. An account is required to buy — it keeps order history, delivery details and support records in one place.
CONTACT: /contact for support. First order gets 10% off with code WELCOME10 at checkout.`;
}

export async function localFaqAnswer(message, ctxTools) {
  const m = (message || "").toLowerCase();
  const tools = ctxTools || (await getTools({ all: false }).catch(() => []));
  const find = (kw) => {
    const cands = tools.filter((t) => (t.name + " " + (t.brand || "")).toLowerCase().includes(kw));
    // Prefer the standard "Plus" plan (e.g. ChatGPT Plus) over Pro/Ultra/free-trial variants, then cheapest.
    // If the user explicitly asked for "Pro", do not penalise Pro plans.
    const wantsPro = /\bpro\b/i.test(m);
    const rank = (n) => (/plus/i.test(n) ? 0 : 1) * 10 + (!wantsPro && /\bpro\b|ultra|\$500|free trial|trial/i.test(n) ? 1 : 0);
    cands.sort((a, b) => rank(a.name) - rank(b.name) || a.price - b.price);
    return cands[0];
  };
  const pick = (kw) => {
    const t = find(kw);
    return t
      ? `Here is the best match:\n\n- **[${t.name}](/tools/${t.slug})** — **Rs ${Number(t.price).toLocaleString("en-PK")}** — ${t.duration || "the listed period"} — ${t.accessType || ""} access — ${t.warranty || "warranty as listed"} — ${t.delivery || "Instant"} delivery\n\nAdd it to your cart on [the tool page](/tools/${t.slug}), sign in and pay at checkout.`
      : null;
  };
  if (m.includes("chatgpt")) return pick("chatgpt") || "ChatGPT plans start from Rs 950 (ChatGPT Go 3 Months). See all ChatGPT plans on /tools — search 'ChatGPT'.";
  if (m.includes("canva")) return pick("canva") || "Canva Pro starts at Rs 350 for 1 month (slot, full warranty). See /tools and search 'Canva'.";
  if (m.includes("gemini")) return pick("gemini") || "Gemini Plus starts at Rs 199 for 6 months (redeem link). See /tools and search 'Gemini'.";
  if (m.includes("capcut")) return pick("capcut") || "CapCut Pro is Rs 850 for 1 month. See /tools and search 'CapCut'.";
  if (m.includes("spotify")) return pick("spotify") || "Spotify Premium is Rs 1,300 for 1 month. See /tools and search 'Spotify'.";
  if (m.includes("pay") || m.includes("payment") || m.includes("safepay") || m.includes("jazzcash") || m.includes("easypaisa")) {
    return safepayConfigured()
      ? "You can pay in PKR with:\n\n- **Safepay** — local card, JazzCash, Easypaisa, Raast or bank transfer\n- **Manual** — JazzCash / Easypaisa / bank transfer (paste your transaction ID at checkout)\n\nPick a tool on [/tools](/tools), add it to your cart and pay at checkout."
      : "Safepay is **not connected yet**, so online card/wallet payment is not live. You can still order:\n\n- **Manual** — JazzCash / Easypaisa / bank transfer (paste your transaction ID at checkout, our team approves it)\n- **Test payment** — try the full flow with no money charged\n\nPick a tool on [/tools](/tools) and check out.";
  }
  if (m.includes("deliver") || m.includes("fast") || m.includes("instant") || m.includes("how long")) {
    return "Delivery is fast:\n\n- **Instant products** — access details in your [dashboard](/dashboard) and by email in under 60 seconds\n- **Manual-review products** — the listing says so, and our team delivers after review\n\nCheck the delivery note on the tool's listing before you pay.";
  }
  if (m.includes("warranty") || m.includes("refund") || m.includes("replace") || m.includes("stopped") || m.includes("not working")) {
    return "Every listing shows its warranty (for example Full warranty, 7-day or 30-day). If a subscription stops working inside its warranty, contact support from /contact and we will replace it. Warranty terms differ by product — check the listing before you pay.";
  }
  if (m.includes("buy") || m.includes("how do i") || m.includes("order") || m.includes("checkout")) {
    return "Buying takes 4 steps:\n\n- **1. Pick a tool** on [/tools](/tools) and add it to your cart\n- **2. Sign in** or register\n- **3. Pay** at checkout\n- **4. Get access** instantly in your [dashboard](/dashboard)\n\nUse code **WELCOME10** for 10% off your first order.";
  }
  if (m.includes("price") || m.includes("cheap") || m.includes("cost") || m.includes("discount") || m.includes("offer")) {
    const cheapest = [...tools].sort((a, b) => a.price - b.price).slice(0, 3);
    return `Prices are in PKR only and start at **Rs 199**. Cheapest right now:\n\n${cheapest.map((t) => `- **[${t.name}](/tools/${t.slug})** — **Rs ${Number(t.price).toLocaleString("en-PK")}**`).join("\n")}\n\nFirst order: 10% off with code **WELCOME10**. Browse everything on [/tools](/tools).`;
  }
  if (m.includes("account") || m.includes("sign") || m.includes("login") || m.includes("register")) {
    return "Yes, you need an account to buy — it keeps your order history, delivery details and support records in one place. Register at /register, then sign in at /login.";
  }
  return "I can help with:\n\n- **Buying** — how to order in 4 steps\n- **Prices** — any tool, in PKR\n- **Payment** — Safepay, JazzCash, Easypaisa, Raast\n- **Delivery & warranty** — how fast, and what is covered\n\nTry 'ChatGPT Plus price?' or browse [/tools](/tools). For anything else, contact support at [/contact](/contact).";
}

export async function askCohere(message) {
  const key = process.env.COHERE_API_KEY;
  if (!key) return null;
  const preamble = await storeContext();
  // Try the configured model first, then the dated R+ model as a fallback.
  const models = [...new Set([cohereModel(), "command-r-plus-08-2024"])];
  let lastErr = null;
  for (const model of models) {
    const res = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: { "Authorization": `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, message, preamble, temperature: 0.3, max_tokens: 400 }),
    });
    if (res.ok) {
      const data = await res.json();
      const text = (data.text || data.response?.text || "").trim();
      if (text) return text;
      return null;
    }
    lastErr = new Error(`Cohere ${res.status} for model ${model}`);
    console.error("[chat] Cohere failed:", lastErr.message);
  }
  throw lastErr || new Error("Cohere failed");
}
