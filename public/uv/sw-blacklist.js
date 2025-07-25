importScripts('../epoxy/index.js');
importScripts('uv.bundle.js');
importScripts('uv.config.js');
importScripts(__uv$config.sw || 'uv.sw.js');

const uv = new UVServiceWorker();

const blacklist = {};
fetch('/assets/json/blacklist.json')
  .then(response => response.json())
  .then(domains => {
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
  });


self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      if (uv.route(event)) {

        const domain = new URL(
            uv.config.decodeUrl(
              new URL(event.request.url).pathname.replace(uv.config.prefix, '')
            )
          ).hostname,
          domainTld = domain.replace(/.+(?=\.\w)/, '');


        if (
          blacklist.hasOwnProperty(domainTld) &&
          blacklist[domainTld].test(domain.slice(0, -domainTld.length))
        )
          return new Response(new Blob(), { status: 406 });

        return await uv.fetch(event);
      }
      return await fetch(event.request);
    })()
  );
});
