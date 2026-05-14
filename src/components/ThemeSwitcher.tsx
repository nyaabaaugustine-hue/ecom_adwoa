"use client";
import { useState, useEffect, useRef } from "react";
import { Palette, Check, X, ChevronRight } from "lucide-react";

export interface ColorTheme {
  id: string;
  name: string;
  label: string;
  primary: string;        // main brand colour (hex)
  primaryLight: string;   // hover tint
  primaryDark: string;    // pressed
  accent: string;         // secondary highlight
  gradient: string;       // CSS gradient string for previews
  description: string;
}

export const themes: ColorTheme[] = [
  {
    id: "rose-pink",
    name: "Rose Pink",
    label: "Default",
    primary: "#ec4899",
    primaryLight: "#fdf2f8",
    primaryDark: "#db2777",
    accent: "#f9a8d4",
    gradient: "linear-gradient(135deg,#ec4899,#f43f5e)",
    description: "Classic feminine rose",
  },
  {
    id: "gold-amber",
    name: "Gold Amber",
    label: "Luxe",
    primary: "#f59e0b",
    primaryLight: "#fffbeb",
    primaryDark: "#d97706",
    accent: "#fcd34d",
    gradient: "linear-gradient(135deg,#f59e0b,#ea580c)",
    description: "Warm Ghanaian gold",
  },
  {
    id: "emerald-green",
    name: "Emerald",
    label: "Nature",
    primary: "#10b981",
    primaryLight: "#f0fdf4",
    primaryDark: "#059669",
    accent: "#6ee7b7",
    gradient: "linear-gradient(135deg,#10b981,#0891b2)",
    description: "Fresh botanical green",
  },
  {
    id: "royal-purple",
    name: "Royal Purple",
    label: "Regal",
    primary: "#8b5cf6",
    primaryLight: "#f5f3ff",
    primaryDark: "#7c3aed",
    accent: "#c4b5fd",
    gradient: "linear-gradient(135deg,#8b5cf6,#ec4899)",
    description: "Regal violet hues",
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    label: "Calm",
    primary: "#0ea5e9",
    primaryLight: "#f0f9ff",
    primaryDark: "#0284c7",
    accent: "#7dd3fc",
    gradient: "linear-gradient(135deg,#0ea5e9,#6366f1)",
    description: "Cool coastal blue",
  },
  {
    id: "coral-red",
    name: "Coral",
    label: "Bold",
    primary: "#ef4444",
    primaryLight: "#fef2f2",
    primaryDark: "#dc2626",
    accent: "#fca5a5",
    gradient: "linear-gradient(135deg,#ef4444,#f97316)",
    description: "Vibrant African coral",
  },
];

const THEME_KEY = "adwoas-theme";

function applyTheme(theme: ColorTheme) {
  const root = document.documentElement;
  root.style.setProperty("--color-primary", theme.primary);
  root.style.setProperty("--color-primary-light", theme.primaryLight);
  root.style.setProperty("--color-primary-dark", theme.primaryDark);
  root.style.setProperty("--color-accent", theme.accent);
}

export function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<ColorTheme>(themes[0]);
  const [hovered, setHovered] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Load saved theme on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) {
        const found = themes.find((t) => t.id === saved);
        if (found) {
          setActive(found);
          applyTheme(found);
        }
      }
    } catch {}
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selectTheme = (theme: ColorTheme) => {
    setActive(theme);
    applyTheme(theme);
    try { localStorage.setItem(THEME_KEY, theme.id); } catch {}
    setTimeout(() => setOpen(false), 300);
  };

  const preview = hovered ? themes.find((t) => t.id === hovered) : null;

  return (
    <>
      {/* Floating toggle button */}
      <button
        ref={btnRef}
        onClick={() => setOpen((o) => !o)}
        aria-label="Change colour theme"
        className="fixed bottom-6 left-6 z-[90] flex items-center justify-center w-12 h-12 rounded-full shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          background: active.gradient,
          boxShadow: `0 4px 24px ${active.primary}55, 0 2px 8px rgba(0,0,0,0.3)`,
        }}
      >
        {open ? (
          <X size={18} className="text-white" />
        ) : (
          <Palette size={18} className="text-white" />
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          className="fixed bottom-22 left-6 z-[90] w-72 rounded-3xl shadow-2xl overflow-hidden"
          style={{
            bottom: "5rem",
            background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)",
            animation: "themePanelIn 0.28s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          {/* Panel Header */}
          <div className="px-5 pt-5 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-sm tracking-wide">Colour Theme</h3>
                <p className="text-slate-400 text-[11px] mt-0.5">Personalise your experience</p>
              </div>
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: active.gradient }}
              >
                <Palette size={14} className="text-white" />
              </div>
            </div>

            {/* Active theme preview bar */}
            <div
              className="mt-4 h-1.5 rounded-full"
              style={{ background: active.gradient }}
            />
          </div>

          {/* Theme Grid */}
          <div className="p-4 grid grid-cols-3 gap-2.5">
            {themes.map((theme) => {
              const isActive = active.id === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => selectTheme(theme)}
                  onMouseEnter={() => setHovered(theme.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="relative flex flex-col items-center gap-1.5 p-2.5 rounded-2xl transition-all duration-200 group"
                  style={{
                    background: isActive
                      ? `${theme.primary}18`
                      : hovered === theme.id
                      ? "rgba(255,255,255,0.06)"
                      : "rgba(255,255,255,0.03)",
                    border: isActive
                      ? `1.5px solid ${theme.primary}55`
                      : "1.5px solid rgba(255,255,255,0.06)",
                    transform: hovered === theme.id && !isActive ? "translateY(-2px)" : "none",
                  }}
                >
                  {/* Colour swatch */}
                  <div
                    className="w-10 h-10 rounded-xl shadow-lg relative flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
                    style={{
                      background: theme.gradient,
                      boxShadow: isActive ? `0 4px 16px ${theme.primary}55` : `0 2px 8px ${theme.primary}33`,
                    }}
                  >
                    {isActive && (
                      <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-black/20">
                        <Check size={16} className="text-white" strokeWidth={3} />
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div className="text-center">
                    <p className="text-white text-[10px] font-semibold leading-tight">{theme.name}</p>
                    <p
                      className="text-[9px] font-bold uppercase tracking-wider mt-0.5"
                      style={{ color: theme.primary }}
                    >
                      {theme.label}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Description / preview bar */}
          <div className="px-4 pb-4">
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: (preview ?? active).primary }}
              />
              <p className="text-slate-300 text-[11px] flex-1">
                {(preview ?? active).description}
              </p>
              <ChevronRight size={12} className="text-slate-500" />
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 pb-4 flex items-center justify-between">
            <span className="text-slate-500 text-[10px]">
              Active: <span className="text-white font-semibold">{active.name}</span>
            </span>
            <button
              onClick={() => selectTheme(themes[0])}
              className="text-slate-500 text-[10px] hover:text-white transition-colors underline underline-offset-2"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </>
  );
}
