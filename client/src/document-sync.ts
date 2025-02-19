import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";

const signaling = ["wss://yjs-signaling-69.fly.dev/"];

export class DocumentSync {
  public static ORIGIN = this;

  // TODO: use custom provider to also sync changes of unloaded documents
  track(doc: Y.Doc, docId: string) {
    return new WebrtcProvider(docId, doc, { signaling });
  }
}
