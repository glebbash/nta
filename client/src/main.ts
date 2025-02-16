import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Collaboration from "@tiptap/extension-collaboration";
import Document from "@tiptap/extension-document";
import Placeholder from "@tiptap/extension-placeholder";
import * as Y from "yjs";

import "./style.css";
import { Sidebar } from "./sidebar.ts";
import { Settings } from "./settings.ts";
import { LocalSync } from "./local-sync.ts";

const localSync = await LocalSync.load("nta-2");
let editor: Editor | undefined;
let currentDoc: Y.Doc | undefined;

await main();

async function main() {
  setupOverKeyboardBar(document.querySelector(".over-keyboard-bar")!);
  document.querySelector("#tab-btn")!.addEventListener("click", () => {
    if (editor === undefined) {
      return;
    }

    editor.chain().focus().sinkListItem("listItem").run();
  });
  document.querySelector("#untab-btn")!.addEventListener("click", () => {
    if (editor === undefined) {
      return;
    }

    editor.chain().focus().liftListItem("listItem").run();
  });

  const settingsDoc = new Y.Doc();
  localSync.syncDoc(settingsDoc, "settings");

  const settings = new Settings(settingsDoc);
  settings.onNavigate = (file) => {
    sidebar.displaySelected(file);
    loadFile(file);
  };

  const fileSystemDoc = new Y.Doc();
  localSync.syncDoc(fileSystemDoc, "filesystem");

  const sidebar = new Sidebar(
    document.querySelector<HTMLElement>("#sidebar")!,
    fileSystemDoc
  );
  sidebar.onFileSelected = (file) => {
    settings.navigateTo(file);
  };

  document.querySelector(".rename")!.addEventListener("click", () => {
    const currentFile = settings.getCurrentFile();
    if (currentFile === null) {
      alert("No file selected");
      return;
    }

    const newName = prompt("Enter new name:", currentFile);
    if (newName) {
      sidebar.renameFile(currentFile, newName);
    }
  });

  document.querySelector(".delete")!.addEventListener("click", () => {
    const currentFile = settings.getCurrentFile();
    if (currentFile === null) {
      alert("No file selected");
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to delete ${currentFile}?`
    );
    if (confirmed) {
      sidebar.deleteFile(currentFile);
    }
  });

  const collapseButton = document.getElementById("collapse-sidebar-button")!;
  collapseButton.addEventListener("click", () => {
    collapseButton.classList.toggle("collapsed");
    document.getElementById("sidebar")!.classList.toggle("collapsed");
  });
}

async function loadFile(file: string) {
  if (editor !== undefined) {
    editor.destroy();
  }

  currentDoc = new Y.Doc();
  await localSync.syncDoc(currentDoc, file);

  editor = new Editor({
    element: document.querySelector("#editor")!,
    extensions: [
      Document.extend({
        content: "heading block*",
      }),
      Placeholder.configure({
        placeholder: ({ node, pos }) => {
          if (pos === 0 && node.type.name === "heading") {
            return "<title>";
          }
          return "";
        },
      }),
      Color.configure({ types: [TextStyle.name, ListItem.name] }),
      TextStyle.configure({}),
      StarterKit.configure({ history: false, document: false }),
      Collaboration.configure({
        document: currentDoc,
      }),
    ],
  });
}

function setupOverKeyboardBar(bar: HTMLElement) {
  window.visualViewport!.addEventListener("resize", updateOverlay);
  window.visualViewport!.addEventListener("scroll", updateOverlay);

  function updateOverlay() {
    const keyboardHeight = window.innerHeight - window.visualViewport!.height;
    if (keyboardHeight <= 0) {
      bar.style.display = "none";
      return;
    }

    bar.style.display = "block";
    bar.style.bottom =
      window.innerHeight -
      (window.visualViewport!.offsetTop + window.visualViewport!.height) +
      "px";
  }
}
