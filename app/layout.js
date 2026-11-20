import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import Chatbot from "@/components/Chatbot";
import { getUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Nexavo AI - Buy AI tools & digital subscriptions in Pakistan",
  description: "ChatGPT, Gemini, Canva, CapCut, Adobe, Figma, Spotify and 80+ premium subscriptions in PKR. Pay with Safepay, JazzCash, Easypaisa or Raast. Instant delivery in Pakistan.",
};

export default async function RootLayout({ children }) {
  const user = await getUser();
  return (
    <html lang="en">
      <body className="font-sans">
        <CartProvider>
          <Navbar user={user} />
          <CartDrawer />
          <PageTransition>
            <main>{children}</main>
          </PageTransition>
          <Footer />
          <Chatbot />
        </CartProvider>
      </body>
    </html>
  );
}
