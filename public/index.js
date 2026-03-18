// Ultraviolet 設定
self.__uv$config = {
  prefix: "/service/uv/",
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "/uv/uv.handler.js",
  client: "/uv/uv.client.js",
  bundle: "/uv/uv.bundle.js",
  config: "/uv/uv.config.js",
  sw: "/uv/uv.sw.js",
};

// Service Worker の登録
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js", {
      scope: __uv$config.prefix,
    });
  });
}

// DuckDuckGo 検索 & URL整形関数
function search(input) {
  try {
    return new URL(input).toString();
  } catch (err) {
    // ドットが含まれ、スペースがない場合はURLとみなす
    if (input.includes(".") && !input.includes(" ")) {
      return `http://${input}`;
    }
    // それ以外は DuckDuckGo で検索
    return `https://duckduckgo.com/?q=${encodeURIComponent(input)}`;
  }
}

// フォーム送信イベント
document.getElementById("idk").addEventListener("submit", async (e) => {
  e.preventDefault();
  const rawUrl = document.getElementById("url").value;
  const fixedUrl = search(rawUrl);

  // UVでエンコードしてiframeのsrcを更新
  const encodedUrl = __uv$config.prefix + __uv$config.encodeUrl(fixedUrl);
  document.getElementById("iframe").src = encodedUrl;
});
