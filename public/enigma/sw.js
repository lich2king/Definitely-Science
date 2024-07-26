importScripts("/epoxy/index.js");
importScripts("/enigma/bareTransport.js");
importScripts("/enigma/uv.bundle.js");
importScripts("/enigma/uv.config.js");
//importScripts(__uv$config.sw || "uv.sw.js");
importScripts("/enigma/uv.sw.js");

const uv = new UVServiceWorker();

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      if (event.request.url.startsWith(location.origin + __uv$config.prefix)) {
        return await uv.fetch(event);
      }
      return await fetch(event.request);
    })()
  );
});