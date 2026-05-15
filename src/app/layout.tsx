import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { ThemeSwitcher } from "../components/ThemeSwitcher";
import { PWAProvider } from "../components/PWAProvider";
import { WhatsAppButton } from "../components/WhatsAppButton";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
  adjustFontFallback: false, // prevents build failure when Google Fonts is unreachable
  preload: false,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  adjustFontFallback: false, // prevents build failure when Google Fonts is unreachable
  preload: false,
});

const LOGO_URL =
  "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778724509/logo_fxelgm.png";

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
  manifest: "/manifest.json",
  // Favicon from Cloudinary logo
  icons: {
    icon: [
      { url: LOGO_URL, type: "image/png" },
    ],
    apple: LOGO_URL,
    shortcut: LOGO_URL,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Adwoa's Beauty",
  },
  openGraph: {
    title: "Adwoa's Beauty — Ghana's Premier Women's Marketplace",
    description:
      "Authentic Ghanaian fashion, cosmetics & skincare. Free delivery across Ghana.",
    siteName: "Adwoa's Beauty",
    locale: "en_GH",
    type: "website",
    // This is the image shown when the link is shared on WhatsApp, Facebook, Twitter etc.
    images: [
      {
        url: LOGO_URL,
        width: 1200,
        height: 630,
        alt: "Adwoa's Beauty & Fashion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Adwoa's Beauty — Ghana's Premier Women's Marketplace",
    description:
      "Authentic Ghanaian fashion, cosmetics & skincare. Free delivery across Ghana.",
    images: [LOGO_URL],
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
      <head>
        {/* Favicon — using Cloudinary logo directly */}
        <link rel="icon" href={LOGO_URL} type="image/png" />
        <link rel="shortcut icon" href={LOGO_URL} type="image/png" />
        <link rel="apple-touch-icon" href="https://res.cloudinary.com/dwsl2ktt2/image/upload/w_180,h_180,c_fill/v1778724509/logo_fxelgm.png" />
        {/* PWA / Apple */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-sans antialiased">
        {children}
        {/* Floating WhatsApp chat button */}
        <WhatsAppButton />
        {/* PWA install prompt + service-worker registration */}
        <PWAProvider />
        {/* Global floating theme switcher */}
        <ThemeSwitcher />
        {/* Paystack Inline JS */}
        <Script
          src="https://js.paystack.co/v1/inline.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
