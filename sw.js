// Oreh Chronicles: the pictures come from the cache once seen; the page itself is always asked fresh, and the cache only stands in
// when there is no connection. The cache is named after this build's art, and older caches are dropped.
const CACHE = "oreh-ai-e3007beeff";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  const keep = (res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return res; };
  if (url.pathname.includes("/art/") || url.pathname.includes("/icons/")) {
    e.respondWith(caches.match(req).then((hit) => hit ?? fetch(req).then(keep)));
    return;
  }
  e.respondWith(fetch(req.mode === "navigate" ? new Request(req.url, { cache: "no-store", credentials: "same-origin" }) : req).then(keep).catch(() => caches.match(req)));
});
