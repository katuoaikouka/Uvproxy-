/* eslint-disable no-undef */
self.__uv$config = {
  /**
   * プロキシのベースパス
   */
  prefix: "/service/uv/",

  /**
   * URLの難読化方式
   * Ultraviolet.codec.xor | Ultraviolet.codec.base64 | Ultraviolet.codec.plain
   */
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,

  /**
   * ハンドラースクリプトのパス
   */
  handler: "/uv/uv.handler.js",

  /**
   * クライアントスクリプトのパス
   */
  client: "/uv/uv.client.js",

  /**
   * バンドルスクリプトのパス
   */
  bundle: "/uv/uv.bundle.js",

  /**
   * 設定スクリプト自体のパス
   */
  config: "/uv/uv.config.js",

  /**
   * サービスワーカーのパス
   */
  sw: "/uv/uv.sw.js",
};
