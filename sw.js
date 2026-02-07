const CACHE = "valentine-cache-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./photos/1.jpg",
  "./photos/2.jpg",
  "./photos/3.jpg",
  "./photos/4.jpg",
  // If you add music, also add it here, e.g. "./music/love.mp3"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((resp) => {
        // cache new GET requests (best effort)
        if (event.request.method === "GET") {
          const copy = resp.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy)).catch(()=>{});
        }
        return resp;
      }).catch(() => cached);
    })
  );
});
