"use client";

import { useEffect, useState, useCallback } from "react";
import { X, Download, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAProvider() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [installed, setInstalled] = useState(false);

  // Register service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => console.log("SW registered:", reg.scope))
          .catch((err) => console.warn("SW registration failed:", err));
      });
    }
  }, []);

  // Capture beforeinstallprompt — fires when browser decides app is installable
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show banner on every load (unless already installed / dismissed this session)
      const dismissed = sessionStorage.getItem("pwa-banner-dismissed");
      if (!dismissed) {
        // Small delay so the page has rendered first
        setTimeout(() => setShowBanner(true), 1500);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Detect if already installed
    window.addEventListener("appinstalled", () => {
      setInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    // iOS Safari — no beforeinstallprompt; show manual instructions
    const isIos =
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      !(window.navigator as any).standalone;
    const dismissed = sessionStorage.getItem("pwa-banner-dismissed");
    if (isIos && !dismissed) {
      setTimeout(() => setShowBanner(true), 1500);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setInstalled(true);
    }
    setDeferredPrompt(null);
    setShowBanner(false);
  }, [deferredPrompt]);

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem("pwa-banner-dismissed", "1");
  };

  const isIos =
    typeof navigator !== "undefined" &&
    /iphone|ipad|ipod/i.test(navigator.userAgent) &&
    !(window.navigator as any).standalone;

  if (!showBanner || installed) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[200] animate-slide-up"
      role="dialog"
      aria-label="Install app banner"
    >
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",
          borderTop: "1px solid rgba(251,191,36,0.3)",
        }}
        className="px-4 py-4 shadow-2xl"
      >
        <div className="max-w-lg mx-auto flex items-center gap-4">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg"
            style={{ background: "linear-gradient(135deg, #ec4899, #f59e0b)" }}>
            <span className="text-white font-bold text-2xl font-serif">A</span>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm leading-tight">
              Install Adwoa&apos;s Beauty App
            </p>
            {isIos ? (
              <p className="text-gray-400 text-xs mt-0.5 leading-snug">
                Tap <strong className="text-amber-400">Share</strong> then{" "}
                <strong className="text-amber-400">Add to Home Screen</strong> for the best experience
              </p>
            ) : (
              <p className="text-gray-400 text-xs mt-0.5 leading-snug">
                Shop faster, get notifications &amp; browse offline
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {!isIos && deferredPrompt && (
              <button
                onClick={handleInstall}
                className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-amber-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-md hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                <Download size={13} />
                Install
              </button>
            )}
            <button
              onClick={handleDismiss}
              className="text-gray-500 hover:text-white transition-colors p-1"
              aria-label="Dismiss"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
