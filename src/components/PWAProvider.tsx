"use client";

import { useEffect, useState, useCallback } from "react";
import { X, Download, Smartphone, Star, Zap, WifiOff, Bell } from "lucide-react";
import Image from "next/image";

const LOGO_URL = "https://res.cloudinary.com/dwsl2ktt2/image/upload/v1778724509/logo_fxelgm.png";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

// ── Reload counter (localStorage so it persists across hard reloads) ──────────
function getReloadCount(): number {
  try {
    return parseInt(localStorage.getItem("pwa-reload-count") || "0", 10);
  } catch {
    return 0;
  }
}
function incrementReloadCount(): number {
  try {
    const next = getReloadCount() + 1;
    localStorage.setItem("pwa-reload-count", String(next));
    return next;
  } catch {
    return 0;
  }
}
function resetReloadCount() {
  try {
    localStorage.setItem("pwa-reload-count", "0");
  } catch {}
}

export function PWAProvider() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [isIos, setIsIos] = useState(false);

  // ── Register service worker ──────────────────────────────────────────────
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("[SW] Registered:", reg.scope);
            reg.addEventListener("updatefound", () => {
              const newWorker = reg.installing;
              if (newWorker) {
                newWorker.addEventListener("statechange", () => {
                  if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                    newWorker.postMessage({ type: "SKIP_WAITING" });
                  }
                });
              }
            });
          })
          .catch((err) => console.warn("[SW] Registration failed:", err));
      });
    }
  }, []);

  // ── Detect iOS ───────────────────────────────────────────────────────────
  useEffect(() => {
    const ios =
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      !(window.navigator as any).standalone;
    setIsIos(ios);
  }, []);

  // ── PWA install prompt + timed trigger ───────────────────────────────────
  useEffect(() => {
    // Detect already-installed (standalone mode)
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setInstalled(true);
      return;
    }

    const permanentlyDismissed = localStorage.getItem("pwa-never-show") === "1";
    if (permanentlyDismissed) return;

    // Capture beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Store globally for footer button access
      (window as any).__deferredPrompt = e as BeforeInstallPromptEvent;
    };
    window.addEventListener("beforeinstallprompt", handler);

    // Listen for install request from footer button
    const installRequestHandler = () => {
      if (deferredPrompt) {
        setShowModal(true);
      } else {
        // No native prompt available, show manual instructions
        const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
        if (isIOS) {
          alert('Tap the Share button, then choose "Add to Home Screen"');
        }
      }
    };
    window.addEventListener("pwa-install-request", installRequestHandler);

    // Show modal 3 seconds after load
    const initialTimer = setTimeout(() => {
      setShowModal(true);
    }, 3000);

    // Then show every 1 minute
    const intervalTimer = setInterval(() => {
      setShowModal(true);
    }, 60000);

    // Detect successful install
    window.addEventListener("appinstalled", () => {
      setInstalled(true);
      setShowModal(false);
      setDeferredPrompt(null);
      resetReloadCount();
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("pwa-install-request", installRequestHandler);
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Install handler ──────────────────────────────────────────────────────
  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setInstalled(true);
        resetReloadCount();
      }
    } finally {
      setInstalling(false);
      setDeferredPrompt(null);
      (window as any).__deferredPrompt = null;
      setShowModal(false);
    }
  }, [deferredPrompt]);

  const handleDismiss = () => {
    setShowModal(false);
  };

  const handleNeverShow = () => {
    setShowModal(false);
    localStorage.setItem("pwa-never-show", "1");
  };

  if (!showModal || installed) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={handleDismiss}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[301] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Install Adwoa's Beauty App"
      >
        <div
          className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-modal-pop"
          style={{
            background: "linear-gradient(160deg, #0f0f1a 0%, #1a0a2e 50%, #0d1a3a 100%)",
            border: "1px solid rgba(236,72,153,0.25)",
          }}
        >
          {/* Top decorative glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full blur-3xl opacity-40 pointer-events-none"
            style={{ background: "radial-gradient(circle, #ec4899 0%, #8b5cf6 100%)" }}
          />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
            aria-label="Close"
          >
            <X size={16} />
          </button>

          <div className="relative px-7 pt-8 pb-7">
            {/* App icon */}
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl"
                  style={{
                    background: "linear-gradient(135deg, #ec4899 0%, #f59e0b 100%)",
                    boxShadow: "0 0 32px rgba(236,72,153,0.5)",
                  }}
                >
                  <span className="text-white font-bold text-4xl font-serif select-none">A</span>
                </div>
                {/* Sparkle badge */}
                <div
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}
                >
                  <Star size={11} fill="white" stroke="none" />
                </div>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center mb-1">
              <h2 className="text-white text-xl font-bold tracking-tight">
                Install Adwoa&apos;s Beauty
              </h2>
              <p className="text-pink-400 text-xs font-medium mt-0.5 tracking-widest uppercase">
                Ghana&apos;s Premier Women&apos;s Marketplace
              </p>
            </div>

            {/* Divider */}
            <div
              className="my-5 h-px w-full"
              style={{ background: "linear-gradient(to right, transparent, rgba(236,72,153,0.3), transparent)" }}
            />

            {/* Feature pills */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[
                { icon: <Zap size={14} />, label: "Faster", sub: "No browser lag" },
                { icon: <WifiOff size={14} />, label: "Offline", sub: "Browse anytime" },
                { icon: <Bell size={14} />, label: "Alerts", sub: "Order updates" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="flex flex-col items-center gap-1 rounded-xl py-3 px-2"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <span className="text-pink-400">{f.icon}</span>
                  <span className="text-white text-xs font-semibold">{f.label}</span>
                  <span className="text-white/40 text-[10px] text-center leading-tight">{f.sub}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            {isIos ? (
              <div
                className="rounded-2xl px-4 py-3 mb-4 text-center"
                style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)" }}
              >
                <p className="text-amber-400 text-xs font-medium leading-relaxed">
                  Tap the{" "}
                  <span className="inline-flex items-center gap-0.5 font-bold">
                    <Smartphone size={12} className="inline" /> Share
                  </span>{" "}
                  button, then choose{" "}
                  <span className="font-bold text-white">&ldquo;Add to Home Screen&rdquo;</span>
                </p>
              </div>
            ) : (
              <button
                onClick={handleInstall}
                disabled={installing || !deferredPrompt}
                className="w-full py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: installing
                    ? "rgba(236,72,153,0.4)"
                    : "linear-gradient(135deg, #ec4899 0%, #f59e0b 100%)",
                  boxShadow: "0 4px 24px rgba(236,72,153,0.35)",
                }}
              >
                {installing ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Installing…
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    Install Free App
                  </>
                )}
              </button>
            )}

            {/* Footer links */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <button
                onClick={handleDismiss}
                className="text-white/35 hover:text-white/60 text-xs transition-colors"
              >
                Maybe later
              </button>
              <span className="text-white/15 text-xs">·</span>
              <button
                onClick={handleNeverShow}
                className="text-white/35 hover:text-white/60 text-xs transition-colors"
              >
                Don&apos;t show again
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animations (injected once) */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modal-pop {
          0%   { opacity: 0; transform: scale(0.88) translateY(24px); }
          60%  { transform: scale(1.02) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in  { animation: fade-in 0.25s ease forwards; }
        .animate-modal-pop { animation: modal-pop 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards; }
      `}</style>
    </>
  );
}
