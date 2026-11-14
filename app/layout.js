import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";
import Footer from "@/components/Footer";
import { getUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Nexora AI - Find & buy the best AI tools",
  description: "Compare, try and purchase top AI tools for writing, design, video and coding.",
};

export default async function RootLayout({ children }) {
  const user = await getUser();
  return (
    <html lang="en">
      <body className="font-sans">
        <CartProvider>
          <Navbar user={user} />
          <CartDrawer />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
