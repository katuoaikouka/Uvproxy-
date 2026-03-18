import express from 'express';
import http from 'node:http';
import { createBareServer } from "@tomphttp/bare-server-node";
import cors from 'cors';
import path from 'node:path';

const server = http.createServer();
const app = express();
const rootDir = process.cwd();
const bareServer = createBareServer('/bare/');
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// publicフォルダ内の静的ファイルを配信
app.use(express.static(path.join(rootDir, "public")));

// 検索用API
app.get("/api/search", async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (!q) return res.status(400).json({ error: "missing q" });

  const engines = [
    "https://duckduckgo.com/?q=%s",
    "https://www.startpage.com/sp/search?q=%s",
    "https://search.brave.com/search?q=%s"
  ];

  const query = encodeURIComponent(q);

  for (const tpl of engines) {
    const url = tpl.replace("%s", query);
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2000);
      const r = await fetch(url, {
        method: "GET",
        signal: controller.signal,
        headers: { "User-Agent": "Mozilla/5.0" }
      });
      clearTimeout(timer);
      if (r.ok) return res.json({ url });
    } catch (e) { /* next */ }
  }
  return res.status(502).json({ error: "no search engine available" });
});

// Bare Server ルーティング
server.on('request', (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on('upgrade', (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

server.listen(PORT, () => {
  console.log(`Server Listening on http://localhost:${PORT}`);
});

function shutdown() {
  server.close(() => {
    bareServer.close();
    process.exit(0);
  });
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
