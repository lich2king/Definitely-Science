importScripts('/scram/scramjet.all.js');

const { ScramjetServiceWorker } = $scramjetLoadWorker();

const scramjet = new ScramjetServiceWorker();

// console.warn("[SW] loaded");
// self.addEventListener("install", () => console.warn("[SW] installing"));
// self.addEventListener("activate", () => console.warn("[SW] activated"));
// self.addEventListener("fetch", e => console.warn("[SW] fetch:", e.request.url));

async function handleRequest(event) 
{
  await scramjet.loadConfig();
  if (scramjet.route(event)) 
  {
    return scramjet.fetch(event);
  }
  return fetch(event.request);
}

self.addEventListener('fetch', (event) => 
{
  event.respondWith(handleRequest(event));
});