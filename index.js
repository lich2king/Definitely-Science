import express from "express";
import { createServer } from "node:http";
import { join } from "node:path";
import { hostname } from "node:os";

import { createBareServer } from "@tomphttp/bare-server-node";
import cors from "cors";


const app = express();
const bareServer = createBareServer("/ov/")


app.use(express.static("public"));

app.use("ov", cors({ origin: true }));


// Error for everything else
app.use((req, res) => {
  res.status(404);
  res.sendFile(join(publicPath, "404.html"));
});

const server = createServer();

server.on("request", (req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
})

server.on("upgrade", (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
		bareServer.routeUpgrade(req, socket, head);
	  } else {
		socket.end();
	  }
});

let port = parseInt(process.env.PORT || "");

if (isNaN(port)) port = 80;

server.on("listening", () => {
  const address = server.address();

  console.log("Server:");
  console.log(`\thttp://${hostname()}:${address.port}`);
});

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

function shutdown() {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close();
  process.exit(0);
}

server.listen({
  port,
});