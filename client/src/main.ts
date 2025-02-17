import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Collaboration from "@tiptap/extension-collaboration";
import Document from "@tiptap/extension-document";
import Placeholder from "@tiptap/extension-placeholder";
import * as Y from "yjs";

import { Sidebar } from "./sidebar.ts";
import { Settings } from "./settings.ts";
import { LocalSync } from "./local-sync.ts";

const hideLoading = showLoading();
const localSync = await LocalSync.load("nta-2");
hideLoading();

let editor: Editor | undefined;
let currentDoc: Y.Doc | undefined;

await main();

async function main() {
  const settingsDoc = new Y.Doc();
  localSync.syncDoc(settingsDoc, "settings");

  const settings = new Settings(settingsDoc);
  settings.onNavigate = (file) => {
    sidebar.displaySelected(file);
    loadFile(file);
  };

  const fileSystemDoc = new Y.Doc();
  localSync.syncDoc(fileSystemDoc, "filesystem");

  const uiState = settingsDoc.getMap("uiState");

  const collapseButton = document.getElementById("collapse-sidebar-button")!;
  collapseButton.addEventListener("click", () => {
    uiState.set("sidebarCollapsed", !uiState.get("sidebarCollapsed"));
  });

  uiState.observe(() => {
    const collapsed = uiState.get("sidebarCollapsed") ?? false;
    const sidebar = document.getElementById("sidebar")!;
    if (collapsed) {
      collapseButton.classList.add("collapsed");
      sidebar.classList.add("collapsed");
    } else {
      collapseButton.classList.remove("collapsed");
      sidebar.classList.remove("collapsed");
    }
  });

  const sidebar = new Sidebar(
    document.querySelector<HTMLElement>("#sidebar")!,
    fileSystemDoc
  );
  sidebar.onFileSelected = (file) => {
    settings.navigateTo(file);
    if (isMobile()) {
      collapseButton.classList.add("collapsed");
      document.getElementById("sidebar")!.classList.add("collapsed");
    }
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

  if (isMobile()) {
    // fix for chrome android
    window.addEventListener("resize", () => {
      window.scrollTo(0, 0);
    });

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
    document.querySelector("#undo-btn")!.addEventListener("click", () => {
      if (editor === undefined) {
        return;
      }

      editor.chain().focus().undo().run();
    });
    document.querySelector("#redo-btn")!.addEventListener("click", () => {
      if (editor === undefined) {
        return;
      }

      editor.chain().focus().redo().run();
    });
  }
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

function isMobile() {
  return (
    window.innerWidth < 768 &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );
}

function showLoading() {
  const loading = document.body.appendChild(document.createElement("div"));
  loading.style.position = "fixed";
  loading.style.top = "50%";
  loading.style.left = "50%";
  loading.style.transform = "translate(-50%, -50%)";
  loading.style.fontSize = "24px";
  loading.style.color = "var(--font-color)";

  let loaded = false;

  {
    const timerElement = loading.appendChild(document.createElement("span"));

    const start = Date.now();
    function updateTimer() {
      const millis = Date.now() - start;
      const seconds = (millis / 1000).toFixed(2);
      timerElement.textContent = `(${seconds}s) Loading ...`;

      if (!loaded) {
        requestAnimationFrame(updateTimer);
      }
    }

    updateTimer();
  }

  return () => {
    loaded = true;
    document.body.removeChild(loading);
  };
}
