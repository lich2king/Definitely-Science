"use strict";
/**
 * eclipse sw
 */

const allowedHostnames = ["localhost", "127.0.0.1"];

async function registerEclipseSW() {
  if (!navigator.serviceWorker) {
    if (
      location.protocol !== "https:" &&
      !allowedHostnames.includes(location.hostname)
    )
      throw new Error("Service workers cannot be registered without https.");

    throw new Error("Your browser doesn't support service workers.");
  }

	navigator.serviceWorker.register("/eclipse/sw.js", {
		scope: "/eclipse/",
	  })

  //await navigator.serviceWorker.register(SW);

  // Register the EpoxyClient transport to be used for network requests
  //let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
  //await BareMux.SetTransport("EpxMod.EpoxyClient", { wisp: wispUrl });
}
