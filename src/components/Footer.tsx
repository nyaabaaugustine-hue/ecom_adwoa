import { Heart, Instagram, Facebook, Twitter, Youtube, MapPin, Phone, Mail } from "lucide-react";

const socialLinks = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter, label: "Twitter / X", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

const footerLinks = {
  Shop: ["New Arrivals", "Best Sellers", "Ankara Collection", "Kente Styles", "Sale Items"],
  Categories: ["Fashion", "Cosmetics", "Skincare", "Hair Care", "Accessories"],
  Support: ["Contact Us", "Track Order", "Returns & Exchanges", "Size Guide", "FAQs"],
  Company: ["About Us", "Our Story", "Artisan Partners", "Press", "Blog"],
};

const paymentMethods = [
  { name: "MTN MoMo", bg: "bg-yellow-400", text: "text-yellow-900" },
  { name: "Vodafone Cash", bg: "bg-red-500", text: "text-white" },
  { name: "AirtelTigo", bg: "bg-blue-600", text: "text-white" },
  { name: "Visa", bg: "bg-blue-800", text: "text-white" },
  { name: "Mastercard", bg: "bg-orange-500", text: "text-white" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Kente stripe top */}
      <div className="h-1 bg-gradient-to-r from-red-600 via-yellow-400 via-green-600 to-red-600" />

      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
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
            {/* Contact mini */}
            <div className="space-y-2 mb-5 text-xs text-gray-500">
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
            <div className="flex gap-2">
              {socialLinks.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 bg-gray-800 hover:bg-amber-500 hover:text-gray-900 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold text-amber-400 mb-4 text-xs uppercase tracking-widest">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <p className="text-gray-500 text-[10px] uppercase tracking-widest text-center mb-4 font-semibold">
            Secure Payment Methods
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {paymentMethods.map(({ name, bg, text }) => (
              <span
                key={name}
                className={`${bg} ${text} text-xs font-bold px-3 py-1.5 rounded-lg`}
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>
            &copy; {currentYear} Adwoa&apos;s Beauty &amp; Fashion. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5">
            Developed By TGNE Solutions . Tema
          </p>
          <div className="flex gap-5">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link) => (
              <a
                key={link}
                href="#"
                className="hover:text-white transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
