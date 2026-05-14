import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { ThemeSwitcher } from "../components/ThemeSwitcher";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Adwoa's Beauty — Ghana's Premier Women's Marketplace",
    template: "%s | Adwoa's Beauty",
  },
  description:
    "Shop authentic Ghanaian fashion, Ankara, Kente, cosmetics, skincare, and beauty products. Quality women's products with fast delivery across all 16 regions of Ghana.",
  keywords: [
    "Ghana fashion",
    "Ankara dress",
    "Kente",
    "African fashion",
    "Ghana beauty",
    "shea butter",
    "natural skincare",
    "Ghanaian cosmetics",
    "Accra shopping",
    "Kumasi delivery",
    "MTN MoMo payment",
  ],
  authors: [{ name: "Adwoa's Beauty" }],
  creator: "Adwoa's Beauty",
  metadataBase: new URL("https://adwoasbeauty.com"),
  openGraph: {
    title: "Adwoa's Beauty — Ghana's Premier Women's Marketplace",
    description:
      "Authentic Ghanaian fashion, cosmetics & skincare. Free delivery across Ghana.",
    siteName: "Adwoa's Beauty",
    locale: "en_GH",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ec4899",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {/* Global floating theme switcher — rendered outside page trees */}
        <ThemeSwitcher />
        {/* Paystack Inline JS — loaded lazily, available on window.PaystackPop */}
        <Script
          src="https://js.paystack.co/v1/inline.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
