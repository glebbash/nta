import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Collaboration from "@tiptap/extension-collaboration";
import Document from "@tiptap/extension-document";
import Placeholder from "@tiptap/extension-placeholder";
import * as Y from "yjs";
import { IndexeddbPersistence } from "y-indexeddb";

import "./style.css";
import { Sidebar } from "./sidebar.ts";
import { Settings } from "./settings.ts";

let editor: Editor;
let currentDoc: Y.Doc;

const settingsDoc = new Y.Doc();
new IndexeddbPersistence("settings", settingsDoc);
const sidebarDoc = new Y.Doc();
new IndexeddbPersistence("sidebar", sidebarDoc);

const settings = new Settings(settingsDoc);
settings.onNavigate = (file) => {
  loadFile(file);
};

const sidebar = new Sidebar(
  document.querySelector<HTMLElement>("#sidebar")!,
  sidebarDoc
);
sidebar.onFileSelected = (file) => {
  settings.navigateTo(file);
};

function loadFile(file: string) {
  if (editor) {
    editor.destroy();
  }

  currentDoc = new Y.Doc();
  new IndexeddbPersistence(file, currentDoc);

  editor = new Editor({
    element: document.querySelector("#editor")!,
    extensions: [
      Document.extend({
        content: "heading block*",
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === "heading") {
            return "<title>";
          }

          return "<content>";
        },
      }),
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({ types: [ListItem.name] } as never),
      StarterKit.configure({ history: false, document: false }),
      Collaboration.configure({
        document: currentDoc,
      }),
    ],
  });
}
