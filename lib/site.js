// Single place for the public WhatsApp contact. Change the number here (or
// set NEXT_PUBLIC_WHATSAPP_NUMBER in Vercel) and every button/link updates.
export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923416985286";
export const WHATSAPP_DEFAULT_TEXT = "Hi Nexavo AI, I need help with an order.";
export function whatsappUrl(text = WHATSAPP_DEFAULT_TEXT) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
export function whatsappDisplay() {
  return `+${WHATSAPP_NUMBER}`;
}
