import Image from "next/image";
import { Instagram, Facebook, Twitter, Youtube, MapPin, Phone, Mail, Shield, Zap } from "lucide-react";

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter, label: "Twitter / X", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

const footerLinks = {
  Shop: [
    { label: "New Arrivals", href: "/shop" },
    { label: "Best Sellers", href: "/shop" },
    { label: "Ankara Collection", href: "/fashion" },
    { label: "Kente Styles", href: "/fashion" },
    { label: "Sale Items", href: "/shop" },
  ],
  Categories: [
    { label: "Fashion", href: "/fashion" },
    { label: "Cosmetics", href: "/cosmetics" },
    { label: "Skincare", href: "/skincare" },
    { label: "Hair Care", href: "/shop" },
    { label: "Accessories", href: "/shop" },
  ],
  Support: [
    { label: "Contact Us", href: "/contact" },
    { label: "Track Order", href: "/track-order" },
    { label: "Returns & Exchanges", href: "/faqs" },
    { label: "Size Guide", href: "/size-guide" },
    { label: "FAQs", href: "/faqs" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Our Story", href: "/about" },
    { label: "Artisan Partners", href: "/about" },
    { label: "Press", href: "/contact" },
    { label: "Blog", href: "/blog" },
  ],
};

const paymentMethods = [
  { src: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778721236/mtn_fb2z77.jpg", alt: "MTN Mobile Money", w: 56, h: 40 },
  { src: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778721236/telecel_qpjsan.png", alt: "Telecel Cash", w: 56, h: 40 },
  { src: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778721236/airteltigo_egkalj.jpg", alt: "AirtelTigo Money", w: 56, h: 40 },
  { src: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778721235/visa_rgiuko.png", alt: "Visa", w: 56, h: 40 },
  { src: "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778721235/masetercard_eldi1v.png", alt: "Mastercard", w: 56, h: 40 },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-white relative overflow-hidden">
      {/* Kente stripe top */}
      <div className="h-1.5 bg-gradient-to-r from-red-600 via-yellow-400 via-green-600 to-red-600" />

      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px),
                            repeating-linear-gradient(-45deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px)`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-gray-900 font-bold text-2xl font-serif">A</span>
              </div>
              <div>
                <h3 className="font-bold text-xl leading-tight">Adwoa&apos;s</h3>
                <p className="text-amber-400 text-[9px] uppercase tracking-[0.2em] font-semibold mt-0.5">
                  Beauty &amp; Fashion
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Ghana&apos;s premier destination for authentic African fashion and
              beauty products. Made with love for every Ghanaian woman.
            </p>

            {/* Contact */}
            <div className="space-y-2.5 mb-6 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <MapPin size={13} className="text-amber-400 flex-shrink-0" />
                <span>Oxford Street, Osu, Accra, Ghana</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={13} className="text-amber-400 flex-shrink-0" />
                <span>+233 24 000 0000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={13} className="text-amber-400 flex-shrink-0" />
                <span>hello@adwoasbeauty.com</span>
              </div>
            </div>

            {/* Socials */}
            <div className="flex gap-2">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-gray-800 hover:bg-amber-500 hover:text-gray-900 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold text-amber-400 mb-4 text-xs uppercase tracking-widest">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm hover:translate-x-0.5 inline-block"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Payment Methods Section ── */}
        <div className="border-t border-gray-800 pt-10 mb-8">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield size={14} className="text-green-400" />
            <p className="text-gray-400 text-[11px] uppercase tracking-[0.22em] font-bold">
              100% Secure Payments
            </p>
            <Shield size={14} className="text-green-400" />
          </div>

          {/* Payment logos */}
          <div
            className="relative mx-auto rounded-2xl overflow-hidden"
            style={{
              maxWidth: 600,
              background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
              boxShadow: "0 0 0 1px rgba(251,191,36,0.15), 0 20px 50px rgba(0,0,0,0.5)",
            }}
          >
            <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            <div className="px-8 py-6">
              <p className="text-center text-gray-400 text-[10px] uppercase tracking-widest mb-5">We Accept</p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {paymentMethods.map((pm) => (
                  <div
                    key={pm.alt}
                    className="w-[68px] h-[44px] bg-white rounded-xl flex items-center justify-center p-1.5 shadow-md hover:scale-105 transition-transform duration-200"
                  >
                    <Image
                      src={pm.src}
                      alt={pm.alt}
                      width={pm.w}
                      height={pm.h}
                      className="object-contain w-full h-full"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <p className="text-[10px] text-gray-500">256-bit SSL · Powered by Paystack · PCI-DSS Compliant</p>
              </div>
            </div>
            <div className="h-0.5 bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
          </div>

          {/* SSL badges */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <div className="flex items-center gap-1.5 bg-gray-800/60 border border-gray-700 rounded-full px-3 py-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-800/60 border border-gray-700 rounded-full px-3 py-1">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">PCI Compliant</span>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            &copy; {currentYear} Adwoa&apos;s Beauty &amp; Fashion. All rights reserved.
          </p>

          {/* TGNE Solutions credit */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", border: "1px solid #334155" }}
          >
            <div
              className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #ec4899, #8b5cf6)" }}
            >
              <Zap size={9} className="text-white" />
            </div>
            <span className="text-slate-400 text-[10px] font-medium tracking-wide">
              Built by <span className="text-white font-bold">TGNE Solutions</span> · Tema
            </span>
          </div>

          <div className="flex gap-5">
            {[
              { label: "Privacy Policy", href: "#" },
              { label: "Terms of Service", href: "#" },
              { label: "Cookie Policy", href: "#" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
