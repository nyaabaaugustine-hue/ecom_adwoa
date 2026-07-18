import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import { PWAProvider } from "../components/PWAProvider";
import { WhatsAppButton } from "../components/WhatsAppButton";
import { Toaster } from "sonner";
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

const SOURCE_LOGO_ID = "v1784297096/adjologo_jhcfap.png";
const CLOUDINARY_BASE = "https://res.cloudinary.com/dwsl2ktt2/image/upload";

// Cloudinary generates these on the fly from the same source logo — no new
// asset upload needed. Using the raw logo directly for the favicon and
// social-share image (as before) caused two problems:
//  1. It was declared as 1200x630 (og:image) and 180x180 (apple-touch-icon)
//     when the actual file is a small square logo — the size mismatch is
//     exactly what makes WhatsApp/Facebook/Twitter fail to render a preview,
//     or crop it oddly.
//  2. The logo has a transparent background, so cropping/stretching it to
//     fill a 1200x630 box looks broken. c_pad + a brand-color background
//     keeps the whole logo visible, centered, on a clean canvas instead.
const FAVICON_32 = `${CLOUDINARY_BASE}/w_32,h_32,c_fill,q_auto,f_png/${SOURCE_LOGO_ID}`;
const FAVICON_16 = `${CLOUDINARY_BASE}/w_16,h_16,c_fill,q_auto,f_png/${SOURCE_LOGO_ID}`;
const APPLE_TOUCH_ICON = `${CLOUDINARY_BASE}/w_180,h_180,c_fill,q_auto,f_png/${SOURCE_LOGO_ID}`;
const OG_IMAGE = `${CLOUDINARY_BASE}/w_1200,h_630,c_pad,b_rgb:ec4899,q_auto,f_png/${SOURCE_LOGO_ID}`;

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
  // Favicon — explicitly sized so browsers, WhatsApp, and other crawlers
  // pick the right variant instead of falling back to the raw (large,
  // transparent) logo file.
  icons: {
    icon: [
      { url: FAVICON_16, sizes: "16x16", type: "image/png" },
      { url: FAVICON_32, sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: APPLE_TOUCH_ICON, sizes: "180x180", type: "image/png" }],
    shortcut: FAVICON_32,
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
    url: "https://adwoasbeauty.com",
    locale: "en_GH",
    type: "website",
    // This is the image shown when the link is shared on WhatsApp, Facebook,
    // Twitter etc. Correctly sized + padded on brand color (see OG_IMAGE
    // comment above) so it actually renders instead of being rejected or
    // stretched.
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Adwoa's Beauty & Fashion",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Adwoa's Beauty — Ghana's Premier Women's Marketplace",
    description:
      "Authentic Ghanaian fashion, cosmetics & skincare. Free delivery across Ghana.",
    images: [OG_IMAGE],
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
        {/* Favicon links kept in sync with metadata.icons above for browsers
            that read <head> directly rather than Next's generated tags */}
        <link rel="icon" href={FAVICON_32} type="image/png" sizes="32x32" />
        <link rel="icon" href={FAVICON_16} type="image/png" sizes="16x16" />
        <link rel="shortcut icon" href={FAVICON_32} type="image/png" />
        <link rel="apple-touch-icon" href={APPLE_TOUCH_ICON} />
        {/* PWA / Apple */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-sans antialiased">
        {children}
        {/* Global toast notifications — used across auth, checkout, and admin actions */}
        <Toaster position="top-center" richColors closeButton />
        {/* Floating WhatsApp chat button */}
        <WhatsAppButton />
        {/* PWA install prompt + service-worker registration */}
        <PWAProvider />
        {/* Paystack Inline JS */}
        <Script
          src="https://js.paystack.co/v1/inline.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
