import express from "express";
import { createServer } from "node:http";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import wisp from "wisp-server-node";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const server = createServer();

// 静的ファイルの配信 (publicフォルダ)
app.use(express.static(path.join(__dirname, "public")));

// Ultraviolet 本体ファイルの配信
app.use("/uv/", express.static(uvPath));

// サーバー起動処理
server.on("request", (req, res) => {
  app(req, res);
});

// Wisp (WebSocket) のアップグレード処理
server.on("upgrade", (req, socket, head) => {
  if (req.url.endsWith("/wisp/")) {
    wisp.routeRequest(req, socket, head);
  } else {
    socket.end();
  }
});

const PORT = process.env.PORT || 8080;
server.listen({ port: PORT }, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
