const CACHE_VERSION = "pawzy-v2";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;


const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/manifest.json",
  "/offline.html",
  "/image/pawzy-favicon-32.png",
  "/image/pawzy-favicon-192.png",
  "/image/pawzy-apple-180.png"
];

// INSTALL
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

// ACTIVATE
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (!key.includes(CACHE_VERSION)) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  // 🔥 Activate new service worker immediately
  self.clients.claim();
});

// FETCH
self.addEventListener("fetch", (event) => {
  const req = event.request;

  if (req.headers.get("accept").includes("text/html")) {
    event.respondWith(networkFirst(req));
  } else {
    event.respondWith(cacheFirst(req));
  }
});

// CACHE FIRST
async function cacheFirst(req) {
  const cached = await caches.match(req);
  return cached || fetch(req);
}

// NETWORK FIRST (offline fallback inside catch)
async function networkFirst(req) {
  const cache = await caches.open(DYNAMIC_CACHE);

  try {
    const fresh = await fetch(req);
    cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    // 🔥 Show offline page when internet is gone
    return cache.match("/offline.html");
  }
}
