// ============================================================
// Adwoa's Beauty PWA Service Worker
// Caches core assets for offline-first experience
// ============================================================

const CACHE_NAME = "adwoas-beauty-v1";
const OFFLINE_URL = "/";

// Assets to pre-cache on install
const PRECACHE_ASSETS = [
  "/",
  "/shop",
  "/fashion",
  "/skincare",
  "/cosmetics",
  "/manifest.json",
];

// ── Install ──────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// ── Activate ─────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch — Network-first, fall back to cache ────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== "GET") return;

  // Skip cross-origin requests and chrome-extension
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Skip Next.js internal routes / HMR
  if (url.pathname.startsWith("/_next/webpack-hmr")) return;
  if (url.pathname.startsWith("/api/")) {
    // API calls: network only, no caching
    return;
  }

  // Static assets (_next/static): cache-first
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Navigation & pages: network-first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          return cached || caches.match(OFFLINE_URL);
        });
      })
  );
});
