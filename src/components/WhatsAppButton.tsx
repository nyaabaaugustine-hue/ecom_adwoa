"use client";

import { useState, useEffect } from "react";

const WA_NUMBER = "233558122767";
const WA_MESSAGE = encodeURIComponent("Hi Adwoa's Beauty! 👋 I'd like to know more about your products.");

export function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse] = useState(true);
  const [tooltip, setTooltip] = useState(true);

  // Fade in after 2s, hide tooltip after 6s
  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 2000);
    const tipTimer = setTimeout(() => setTooltip(false), 8000);
    return () => { clearTimeout(showTimer); clearTimeout(tipTimer); };
  }, []);

  // Re-pulse every 12s to draw attention
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(false);
      setTimeout(() => setPulse(true), 100);
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed left-5 bottom-24 z-[150] flex flex-col items-start gap-2"
      style={{ filter: "drop-shadow(0 8px 24px rgba(37,211,102,0.35))" }}
    >
      {/* Tooltip bubble */}
      {tooltip && (
        <div
          className="relative bg-white text-gray-800 text-xs font-semibold px-3.5 py-2 rounded-2xl shadow-lg border border-gray-100 whitespace-nowrap animate-fade-in ml-1"
          style={{ animationFillMode: "both" }}
        >
          Chat with us on WhatsApp 💬
          {/* Arrow pointing down-left toward button */}
          <span
            className="absolute -bottom-2 left-5 w-0 h-0"
            style={{
              borderLeft: "7px solid transparent",
              borderRight: "7px solid transparent",
              borderTop: "8px solid white",
            }}
          />
        </div>
      )}

      {/* Main button */}
      <a
        href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        className="relative flex items-center justify-center w-14 h-14 rounded-full transition-transform duration-200 hover:scale-110 active:scale-95"
        style={{
          background: "linear-gradient(135deg, #25d366 0%, #128c7e 100%)",
        }}
      >
        {/* Ripple pulse ring */}
        {pulse && (
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: "rgba(37,211,102,0.4)", animationDuration: "1.8s" }}
          />
        )}

        {/* WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          className="w-8 h-8 relative z-10"
          fill="white"
        >
          <path d="M24 4C12.95 4 4 12.95 4 24c0 3.55.93 6.88 2.56 9.77L4 44l10.53-2.52A19.87 19.87 0 0 0 24 44c11.05 0 20-8.95 20-20S35.05 4 24 4zm0 36.4a16.4 16.4 0 0 1-8.36-2.3l-.6-.36-6.25 1.49 1.55-5.97-.39-.62A16.38 16.38 0 0 1 7.6 24C7.6 15.09 15.09 7.6 24 7.6S40.4 15.09 40.4 24 32.91 40.4 24 40.4zm8.97-12.24c-.49-.25-2.9-1.43-3.35-1.59-.45-.16-.78-.25-1.1.25-.33.49-1.27 1.59-1.56 1.92-.29.33-.57.37-1.06.12-.49-.25-2.07-.76-3.94-2.43-1.46-1.3-2.44-2.9-2.73-3.39-.29-.49-.03-.76.22-1 .22-.22.49-.57.74-.86.25-.29.33-.49.49-.82.16-.33.08-.62-.04-.86-.12-.25-1.1-2.66-1.51-3.64-.4-.96-.8-.83-1.1-.84l-.94-.02c-.33 0-.86.12-1.31.62-.45.49-1.72 1.68-1.72 4.1s1.76 4.76 2 5.09c.25.33 3.46 5.28 8.39 7.4 1.17.51 2.08.81 2.79 1.03 1.17.37 2.24.32 3.08.19.94-.14 2.9-1.19 3.31-2.33.41-1.14.41-2.12.29-2.33-.12-.21-.45-.33-.94-.57z"/>
        </svg>

        {/* Online indicator dot */}
        <span
          className="absolute top-1 right-1 w-3 h-3 rounded-full border-2 border-white"
          style={{ background: "#4ade80" }}
        />
      </a>
    </div>
  );
}
