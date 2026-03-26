import { Server } from "@hocuspocus/server";
import { SQLite } from "@hocuspocus/extension-sqlite";

process.loadEnvFile("./data/.env");

const server = new Server({
  extensions: [new SQLite({ database: "./data/db.sqlite" })],
  async onAuthenticate({ token }) {
    if (token !== process.env.TOKEN) {
      throw new Error("Not authorized");
    }
  },
});

server.listen(Number(process.env.PORT));
