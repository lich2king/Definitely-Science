// This file overwrites the stock UV config.js

self.__uv$config = {
  prefix: "/enigma/service/",
  bare: "/ov/",
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "/enigma/uv.handler.js",
  client: "/enigma/uv.client.js",
  bundle: "/enigma/uv.bundle.js",
  config: "/enigma/uv.config.js",
  sw: "/enigma/uv.sw.js",
};