import express from "express";
import ViteExpress from "vite-express";

const app = express();

app.get("/hello", (_, res) => {
  res.send("Hello from express");
});

const port = process.env.PORT || 5173;
ViteExpress.listen(app, +port, () =>
  console.log(`Server is listening on port ${port}...`)
);
