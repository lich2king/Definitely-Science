importScripts('../epoxy/index.js');
importScripts('uv.bundle.js');
importScripts('uv.config.js');
importScripts(__uv$config.sw || 'uv.sw.js');

const uv = new UVServiceWorker();

const blacklist = {};
let blacklistReady = loadBlacklist(); // Start loading immediately

async function loadBlacklist() {
  try {
    const response = await fetch('/assets/blacklist.json');
    if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

    const domains = await response.json();

    for (const domain of domains) {
      const tldMatch = domain.match(/\.\w+$/);
      if (!tldMatch) continue;

      const domainTld = tldMatch[0];
      if (!blacklist[domainTld]) {
        blacklist[domainTld] = [];
      }

      const baseDomain = domain.slice(0, -domainTld.length);
      const escapedDomain = encodeURIComponent(baseDomain)
        .replace(/[()]/g, '\\$&')
        .replace(/(\*\.)|\./g, (match, wildcard) =>
          wildcard ? '(?:.+\\.)?' : '\\.'
        );

      blacklist[domainTld].push(escapedDomain);
    }

    for (const tld in blacklist) {
      blacklist[tld] = new RegExp(`^(?:${blacklist[tld].join('|')})$`);
    }

    Object.freeze(blacklist);
    console.log('[SW] Blacklist loaded successfully');
  } catch (err) {
    console.warn('[SW] Blacklist failed to load:', err);
  }
}

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      try {
        if (uv.route(event)) {
          // ✅ Wait for blacklist to finish loading (or fail)
          await blacklistReady;
          //await loadBlacklist();

          const decodedUrl = uv.config.decodeUrl(
            new URL(event.request.url).pathname.replace(uv.config.prefix, '')
          );
          const domain = new URL(decodedUrl).hostname;
          const domainTld = domain.replace(/.+(?=\.\w)/, '');

          if (
            Object.keys(blacklist).length > 0 &&
            blacklist[domainTld] instanceof RegExp &&
            blacklist[domainTld].test(domain.slice(0, -domainTld.length))
          ) {
            return new Response(new Blob(), { status: 406 });
          }

          return await uv.fetch(event);
        }

        return await fetch(event.request);
      } catch (err) {
        console.error('[SW] Fetch handler error:', err);
        return new Response('Internal Service Worker Error', { status: 500 });
      }
    })()
  );
});
