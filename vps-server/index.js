import fs from "node:fs";
import https from "node:https";
import express from "express";
import expressWs from "express-ws";
import { Hocuspocus } from "@hocuspocus/server";
import { SQLite } from "@hocuspocus/extension-sqlite";

process.loadEnvFile("./data/.env");

const hocuspocus = new Hocuspocus({
  extensions: [new SQLite({ database: "data/db.sqlite" })],
  async onAuthenticate({ token }) {
    if (token !== process.env.TOKEN) {
      throw new Error("Not authorized");
    }
  },
});

const app = express();
const server = https.createServer(
  {
    key: fs.readFileSync("./data/key.pem"),
    cert: fs.readFileSync("./data/cert.pem"),
  },
  app,
);

app.get("/", (_req, res) => {
  res.send("Hello");
});

expressWs(app, server).app.ws("/", (ws, req) => {
  hocuspocus.handleConnection(ws, req);
});

server.listen(6969, "0.0.0.0", () => {
  console.log("server started");
});
