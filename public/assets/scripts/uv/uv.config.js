/*global Ultraviolet*/
self.__uv$config = {
    prefix: '/service/',
    bare: '/bare/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/assets/scripts/uv/uv.handler.js',
    client: '/assets/scripts/uv/uv.client.js',
    bundle: '/assets/scripts/uv/uv.bundle.js',
    config: '/assets/scripts/uv/uv.config.js',
    sw: '/assets/scripts/uv/uv.sw.js',
};