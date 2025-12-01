const CACHE_VERSION = "pawzy-v2";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;

const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/manifest.json",
  "/image/pawzy-favicon-32.png",
  "/image/pawzy-favicon-192.png",
  "/image/pawzy-apple-180.png"
];

// Install SW
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate SW (delete old caches)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => {
        if (!key.includes(CACHE_VERSION)) {
          return caches.delete(key);
        }
      }))
    )
  );
});

// Fetch Strategy
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // HTML pages → Network First
  if (req.headers.get("accept").includes("text/html")) {
    event.respondWith(networkFirst(req));
  } else {
    // CSS, JS, images → Cache First
    event.respondWith(cacheFirst(req));
  }
});

// Cache First
async function cacheFirst(req) {
  const cache = await caches.match(req);
  return cache || fetch(req);
}

// Network First
async function networkFirst(req) {
  const cache = await caches.open(DYNAMIC_CACHE);

  try {
    const fresh = await fetch(req);
    cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    return cache.match(req);
  }
}
