// ============================================================
// Adwoa's Beauty PWA Service Worker  (v2 — fixed & upgraded)
// Strategy: Cache-first for static assets, Network-first for pages
// Offline fallback: cached homepage or /offline.html
// ============================================================

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE_NAME   = 'adwoas-beauty-v2';
const OFFLINE_URL  = '/offline.html';   // fixed: was ToDo-replace-this-name.html
const STATIC_CACHE = 'adwoas-static-v2';

// Core pages & assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/shop',
  '/fashion',
  '/skincare',
  '/cosmetics',
  '/manifest.json',
];

// ── Skip-waiting message from clients ─────────────────────────
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ── Install: pre-cache core assets ────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// ── Activate: purge old caches ────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== STATIC_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch ─────────────────────────────────────────────────────
if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Skip cross-origin, chrome-extension, hot-reload
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/_next/webpack-hmr')) return;

  // API calls — network only, no caching
  if (url.pathname.startsWith('/api/')) return;

  // Static assets (_next/static) — cache-first
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

  // Navigation requests — network-first with navigation preload, offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Use preload response if available (faster)
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
          const cache    = await caches.open(CACHE_NAME);
          const cached   = await cache.match(request);
          if (cached) return cached;
          const offline  = await cache.match(OFFLINE_URL);
          return offline || new Response('Offline', { status: 503 });
        }
      })()
    );
    return;
  }

  // Everything else — network-first
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
