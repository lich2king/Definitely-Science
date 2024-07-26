"use strict";
/**
 * enigma sw
 */

importScripts("/enigma/bareTransport.js")

const allowedHostnames = ["localhost", "127.0.0.1"];


async function registerSW(epoxy) {
  if (!navigator.serviceWorker) {
    if (
      location.protocol !== "https:" &&
      !allowedHostnames.includes(location.hostname)
    )
      throw new Error("Service workers cannot be registered without https.");

    throw new Error("Your browser doesn't support service workers.");
  }

  await navigator.serviceWorker.register("/uv/sw.js");

	if (epoxy)
	{
		let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
		await BareMux.SetTransport("EpxMod.EpoxyClient", { wisp: wispUrl });
	}
	else
	{
		let bareUrl = location.protocol + "//" + location.host + "/bare/";
		await BareMux.SetTransport("BareMod.BareClient", bareUrl);
	}
  
}
