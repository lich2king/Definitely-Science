importScripts('../epoxy/index.js');
importScripts('uv.bundle.js');
importScripts('uv.config.js');
importScripts(__uv$config.sw || 'uv.sw.js');

const uv = new UVServiceWorker();

const blacklist = {};
let blacklistReady = loadBlacklist(); // Start loading immediately

let keywordBlacklist = [];
let keywordBlacklistReady = loadKeywordBlacklist();

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

async function loadKeywordBlacklist() {
  try {
    const response = await fetch('/assets/blacklist-keywords.json');
    keywordBlacklist = (await response.json()).map(k => k.toLowerCase());
    Object.freeze(keywordBlacklist);
    console.log('[SW] Keyword blacklist loaded');
  } catch (err) {
    console.warn('[SW] Keyword blacklist failed:', err);
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

          await keywordBlacklistReady;

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
            return new Response(`
              <html><body style="margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#000;color:#fff;font-family:sans-serif;flex-direction:column;">
                <h1 style="font-size:3em;margin:0.2em 0;">Blocked</h1>
                <p style="font-size:1.2em;">Access to this domain is restricted.</p>
              </body></html>
            `, {
              status: 406,
              headers: { 'Content-Type': 'text/html' }
            });
          }

          const domainLower = domain.toLowerCase();
          if (keywordBlacklist.some(keyword => domainLower.includes(keyword))) {
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
