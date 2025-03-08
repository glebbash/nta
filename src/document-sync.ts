import * as Y from "yjs";
import {
  HocuspocusProvider,
  HocuspocusProviderWebsocket,
} from "@hocuspocus/provider";

export type DocumentSyncSetup = {
  type: "hocuspocus";
  url: string;
  token: string;
};

export class DocumentSync {
  public status: "connected" | "connecting" | "disconnected" = "disconnected";
  public onStatus?: () => void;

  private socket?: HocuspocusProviderWebsocket;

  constructor(private setup?: DocumentSyncSetup) {
    if (!this.setup) {
      return;
    }

    this.socket = new HocuspocusProviderWebsocket({
      url: this.setup.url,
      onStatus: ({ status }) => {
        this.status = status;
        this.onStatus?.();
      },
    });
  }

  track(doc: Y.Doc, docId: string) {
    if (!this.setup) {
      return;
    }

    return new HocuspocusProvider({
      name: docId,
      document: doc,
      websocketProvider: this.socket!,
      token: this.setup.token,
      onAuthenticationFailed: () => {
        this.status = "disconnected";
        this.onStatus?.();
      },
    });
  }
}
