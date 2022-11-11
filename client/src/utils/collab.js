import { collabServiceCtx, Doc, WebsocketProvider } from "../deps.js";

const autoConnect = true;

const options = [
  { color: "#5e81AC", name: "milkdown user 1" },
  { color: "#8FBCBB", name: "milkdown user 2" },
  { color: "#dbfdbf", name: "milkdown user 3" },
  { color: "#D08770", name: "milkdown user 4" },
];
const rndInt = Math.floor(Math.random() * 4);

export function setupCollab(editor, options) {
  editor.action((ctx) => {
    const collabService = ctx.get(collabServiceCtx);
    const collabManager = new CollabManager(collabService, options);
    collabManager.flush(options.initialContent);
  });
}

export class CollabManager {
  room = "milkdown";
  doc;
  wsProvider;

  constructor(collabService, options) {
    this.collabService = collabService;
    this.options = options;
  }

  flush(template) {
    this.doc?.destroy();
    this.wsProvider?.destroy();

    this.doc = new Doc();
    const url = "wss://8000-glebbash-nta-81skakuqyl8.ws-eu75.gitpod.io/collab";
    this.wsProvider = new WebsocketProvider(url, this.room, this.doc, {
      connect: autoConnect,
    });
    this.wsProvider.awareness.setLocalStateField("user", options[rndInt]);
    this.wsProvider.on("status", (payload) => {
      this.options.onStatusChange?.(payload.status);
    });

    this.collabService
      .bindDoc(this.doc)
      .setAwareness(this.wsProvider.awareness);
    this.wsProvider.once("synced", (isSynced) => {
      if (isSynced) {
        this.collabService.applyTemplate(template).connect();
      }
    });
  }

  connect() {
    this.wsProvider.connect();
    this.collabService.connect();
  }

  disconnect() {
    this.collabService.disconnect();
    this.wsProvider.disconnect();
  }

  applyTemplate(template) {
    this.collabService
      .disconnect()
      .applyTemplate(template, () => true)
      .connect();
  }
}
