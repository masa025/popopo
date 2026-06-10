// POPOPO お出かけマップ — Service Worker
// 方針:
//  - HTML/CSS/JS: network-first（常に最新を優先、オフライン時のみキャッシュ）
//  - 画像・フォント: cache-first（一度見たものは即表示）
//  - クロスオリジン（気象庁API・Firebase等）には一切関与しない
const CACHE_NAME = 'popopo-cache-v1';
const CORE_ASSETS = [
  './',
  'index.html',
  'style.css',
  'app.js',
  'scripts/i18n.js',
  'manifest.webmanifest',
  'assets/favicon-32.png',
  'assets/favicon-512.png',
  'assets/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // 外部API（気象庁・Firebase等）には触れない
  if (url.origin !== self.location.origin) return;

  const isStaticAsset = /\.(png|jpg|jpeg|gif|webp|svg|ico|woff2?)$/i.test(url.pathname);

  if (isStaticAsset) {
    // cache-first
    event.respondWith(
      caches.match(req).then((hit) => {
        if (hit) return hit;
        return fetch(req).then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        });
      })
    );
  } else {
    // network-first（オフライン時はキャッシュ、ナビゲーションは index.html へ）
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then((hit) => hit || (req.mode === 'navigate' ? caches.match('index.html') : Response.error()))
        )
    );
  }
});
