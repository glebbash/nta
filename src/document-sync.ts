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
  private socket?: HocuspocusProviderWebsocket;

  constructor(private setup?: DocumentSyncSetup) {
    if (!this.setup) {
      return;
    }

    this.socket = new HocuspocusProviderWebsocket({
      url: this.setup.url,
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
    });
  }
}
