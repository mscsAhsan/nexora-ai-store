// PKR formatting - single place so every page shows the same thing.
// Prices in the DB are whole rupees (e.g. 1999 = Rs 1,999). Never show $.
export function formatPKR(amount) {
  const n = Number(amount || 0);
  return "Rs " + n.toLocaleString("en-PK", { maximumFractionDigits: 0 });
}

// Safepay wants the amount in the lowest denomination (paisa).
// Rs 1,999 -> 199900 paisa. Always round - never send a float.
export function toPaisa(rupees) {
  return Math.round(Number(rupees || 0) * 100);
}

export function fromPaisa(paisa) {
  return Math.round(Number(paisa || 0) / 100);
}

export const fmtDate = (s) => (s ? new Date(s).toISOString().slice(0, 16).replace("T", " ") : "");
