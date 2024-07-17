importScripts("/eclipse/uv/uv.bundle.js")
importScripts("/eclipse/uv/uv.config.js")
//importScripts(__uv$config.sw || "/eclipse/-/sw.js?v=2")
importScripts("/eclipse/uv/uv.sw.js")

const uv = new UVServiceWorker()



self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async function () {

      if (event.request.url.startsWith(location.origin + "/eclipse/")) {
        return await uv.fetch(event)
      }

      return await fetch(event.request)
    })()
  )
})
