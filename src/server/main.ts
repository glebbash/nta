import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import ViteExpress from "vite-express";

const PORT = process.env.PORT || 5173;

main();

function main() {
  const app = express();

  app.get("/api/hello", (_, res) => {
    res.send("Hello from the server!");
  });

  ViteExpress.listen(app, +PORT, () => {
    console.log(`Server is listening on port ${PORT}...`);
  });
}
