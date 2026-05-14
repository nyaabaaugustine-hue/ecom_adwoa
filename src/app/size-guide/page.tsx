import { AnnouncementBar } from "../../components/AnnouncementBar";
import { Footer } from "../../components/Footer";
import { Header } from "../../components/Header";
import { Ruler, Info } from "lucide-react";

const sizeCharts = {
  tops: {
    headers: ["Size", "Bust (cm)", "Waist (cm)", "Hips (cm)"],
    rows: [
      ["XS", "76–80", "60–64", "84–88"],
      ["S", "80–84", "64–68", "88–92"],
      ["M", "84–88", "68–72", "92–96"],
      ["L", "88–94", "72–78", "96–102"],
      ["XL", "94–100", "78–84", "102–108"],
      ["2XL", "100–108", "84–92", "108–116"],
      ["3XL", "108–116", "92–100", "116–124"],
      ["4XL", "116–126", "100–110", "124–134"],
      ["5XL", "126–136", "110–120", "134–144"],
    ],
  },
  dresses: {
    headers: ["Size", "Bust (cm)", "Waist (cm)", "Hips (cm)", "Length (cm)"],
    rows: [
      ["XS", "76–80", "60–64", "84–88", "130–135"],
      ["S", "80–84", "64–68", "88–92", "132–137"],
      ["M", "84–88", "68–72", "92–96", "134–139"],
      ["L", "88–94", "72–78", "96–102", "136–141"],
      ["XL", "94–100", "78–84", "102–108", "138–143"],
      ["2XL", "100–108", "84–92", "108–116", "140–145"],
      ["3XL", "108–116", "92–100", "116–124", "142–147"],
    ],
  },
  bottoms: {
    headers: ["Size", "Waist (cm)", "Hips (cm)", "Inseam (cm)"],
    rows: [
      ["XS", "60–64", "84–88", "74"],
      ["S", "64–68", "88–92", "75"],
      ["M", "68–72", "92–96", "76"],
      ["L", "72–78", "96–102", "77"],
      ["XL", "78–84", "102–108", "78"],
      ["2XL", "84–92", "108–116", "79"],
      ["3XL", "92–100", "116–124", "80"],
    ],
  },
};

const tips = [
  { emoji: "📏", title: "How to Measure Bust", desc: "Measure around the fullest part of your chest, keeping the tape parallel to the floor. Breathe normally and don't pull the tape too tight." },
  { emoji: "📐", title: "How to Measure Waist", desc: "Measure around your natural waistline — the narrowest part of your torso, usually about 1 inch above your belly button." },
  { emoji: "🔵", title: "How to Measure Hips", desc: "Measure around the fullest part of your hips and buttocks, keeping the tape parallel to the floor." },
  { emoji: "📌", title: "Between Two Sizes?", desc: "We always recommend sizing up for a more comfortable fit, especially for fitted Ankara and Kente styles. All our fabrics can also be tailored locally." },
];

export const metadata = { title: "Size Guide — Adwoa's Beauty" };

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <Header cartCount={0} onCartClick={() => {}} onDashboardClick={() => {}} isAuthenticated={false} user={null} onLogout={() => {}} />

      <section className="bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 py-20 text-center overflow-hidden relative">
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto px-4 relative">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse flex" />
            <p className="text-pink-500 text-xs font-semibold tracking-[0.2em] uppercase">Perfect Fit Every Time</p>
          </div>
          <h1 className="text-5xl font-serif font-bold text-gray-900 mb-4">Size <span className="text-pink-500">Guide</span></h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Our comprehensive size guide helps you find your perfect fit. All measurements are in centimetres (cm).</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 space-y-14">

          {/* Measuring tips */}
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2"><Ruler size={22} className="text-pink-500" /> How to Measure</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {tips.map(t => (
                <div key={t.title} className="bg-pink-50 rounded-2xl p-5 border border-pink-100">
                  <span className="text-3xl mb-3 block">{t.emoji}</span>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">{t.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{t.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Size tables */}
          {(Object.entries(sizeCharts) as [string, { headers: string[]; rows: string[][] }][]).map(([key, chart]) => (
            <div key={key}>
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4 capitalize">{key === "tops" ? "Tops & Blouses" : key === "dresses" ? "Dresses & Kaftans" : "Bottoms & Skirts"}</h2>
              <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-pink-500 text-white">
                      {chart.headers.map(h => <th key={h} className="px-5 py-3.5 text-left font-bold">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {chart.rows.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        {row.map((cell, j) => (
                          <td key={j} className={`px-5 py-3 ${j === 0 ? "font-bold text-pink-600" : "text-gray-700"}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {/* Note */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
            <Info size={22} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-amber-800 mb-1">Custom Sizing Available</h3>
              <p className="text-amber-700 text-sm leading-relaxed">Don't see your size? All our Ankara and Kente pieces can be custom-made to your exact measurements. Contact us with your measurements and we'll create your perfect outfit within 5–7 business days.</p>
              <a href="/contact" className="mt-3 inline-block text-amber-700 font-bold underline hover:text-amber-900 text-sm">Request Custom Sizing →</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
