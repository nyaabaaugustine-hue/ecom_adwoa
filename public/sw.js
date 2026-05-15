// ============================================================
// Adwoa's Beauty PWA Service Worker  (v3 — clean, no Workbox)
// Strategy: Cache-first for static assets, Network-first for pages
// Offline fallback: cached homepage or /offline.html
// ============================================================

const CACHE_NAME   = 'adwoas-beauty-v3';
const OFFLINE_URL  = '/offline.html';
const STATIC_CACHE = 'adwoas-static-v3';

// Core pages & assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/shop',
  '/fashion',
  '/skincare',
  '/cosmetics',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

// ── Skip-waiting message from clients ─────────────────────────────────────
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ── Install: pre-cache core assets ────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // addAll can fail if any URL 404s; use individual puts so one missing
      // file doesn't abort the whole install
      return Promise.allSettled(
        PRECACHE_ASSETS.map((url) =>
          fetch(url)
            .then((resp) => {
              if (resp.ok) cache.put(url, resp);
            })
            .catch(() => { /* ignore individual failures */ })
        )
      );
    })
  );
  self.skipWaiting();
});

// ── Activate: enable nav-preload + purge old caches ───────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Enable Navigation Preload if supported (native, no Workbox needed)
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }
      // Purge old caches
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== STATIC_CACHE)
          .map((key) => caches.delete(key))
      );
    })()
  );
  self.clients.claim();
});

// ── Fetch ─────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Skip cross-origin, chrome-extension, HMR
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/_next/webpack-hmr')) return;

  // API calls — network only, never cache
  if (url.pathname.startsWith('/api/')) return;

  // Static _next/static assets — cache-first (content-hashed, safe forever)
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Navigation requests — network-first with nav-preload, offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const preloadResp = await event.preloadResponse;
          if (preloadResp) {
            const clone = preloadResp.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, clone));
            return preloadResp;
          }
          const networkResp = await fetch(request);
          if (networkResp.ok) {
            const clone = networkResp.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          }
          return networkResp;
        } catch {
          const cache   = await caches.open(CACHE_NAME);
          const cached  = await cache.match(request);
          if (cached) return cached;
          const offline = await cache.match(OFFLINE_URL);
          return offline || new Response('You are offline', { status: 503 });
        }
      })()
    );
    return;
  }

  // Everything else — network-first with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, clone));
        }
        return response;
      })
      .catch(() =>
        caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL))
      )
  );
});
