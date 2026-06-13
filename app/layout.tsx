import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/storefront/CartContext";
import { CartWidget } from "@/components/storefront/CartWidget";
import { Nav } from "@/components/Nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Chai Pe Charcha — Karahi, BBQ, Pizza & Chai in Hyderabad",
  description:
    "Order karahi, BBQ, pizza, paratha, chai and more from Chai Pe Charcha. Delivery, takeaway and dine-in across Hyderabad.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <CartProvider>
          <Nav />
          {children}
          <CartWidget />
        </CartProvider>
      </body>
    </html>
  );
}
