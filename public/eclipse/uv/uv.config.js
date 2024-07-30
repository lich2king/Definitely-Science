/*global Ultraviolet*/
self.__uv$config = {
    prefix: '/eclipse/service/',
    bare: '/bare/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/eclipse/uv/uv.handler.js',
    client: '/eclipse/uv/uv.client.js',
    bundle: '/eclipse/uv/uv.bundle.js',
    config: '/eclipse/uv/uv.config.js',
    sw: '/eclipse/uv/uv.sw.js',
};