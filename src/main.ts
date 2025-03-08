import * as Y from "yjs";
import { prosemirrorJSONToYXmlFragment } from "y-prosemirror";
import { Editor, generateJSON, getSchema } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Collaboration from "@tiptap/extension-collaboration";
import Document from "@tiptap/extension-document";
import Link from "@tiptap/extension-link";

import { DocumentStore } from "./document-store.js";
import { DocumentSync, DocumentSyncSetup } from "./document-sync.js";
import { NoteEntry } from "./types.js";
import { CommandPalette } from "./command-palette.js";

const USER_KEY_ITEM_ID = "userKey";
const SYNC_SETUP_ITEM_ID = "syncSetup";
const TIPTAP_EXTENSIONS = [
  Link.configure({
    HTMLAttributes: { rel: null, target: null },
    protocols: [{ scheme: "note" }],
  }),
  TextStyle.configure({}),
  StarterKit.configure({ history: false }),
];
const TIPTAP_SCHEMA = getSchema(TIPTAP_EXTENSIONS);

await main().catch((err) => {
  alert("ERROR: " + err);
});

async function main() {
  let editor: Editor | undefined;
  let currentNoteId: string | undefined;
  let currentDoc: Y.Doc | undefined;

  let userKey = localStorage.getItem(USER_KEY_ITEM_ID);
  if (userKey === null) {
    userKey = uuid();
    localStorage.setItem(USER_KEY_ITEM_ID, userKey);
  }

  const local = await DocumentStore.load("nta");

  let setup: DocumentSyncSetup | undefined;
  if (localStorage.getItem(SYNC_SETUP_ITEM_ID)) {
    const [url, token] = localStorage.getItem(SYNC_SETUP_ITEM_ID)!.split("::");
    setup = { type: "hocuspocus", url, token };
  }
  const remote = new DocumentSync(setup);

  const sharedStateDoc = new Y.Doc();
  local.track(sharedStateDoc, `${userKey}/sharedState`);
  remote.track(sharedStateDoc, `${userKey}/sharedState`);
  sharedStateDoc.on("subdocs", ({ loaded, added, removed }) => {
    for (const doc of loaded) {
      local.track(doc, `${userKey}/docs/${doc.guid}`);
      remote.track(doc, `${userKey}/docs/${doc.guid}`);
    }

    // TODO: what to do with these?
    [added, removed];
  });

  const localStateDoc = new Y.Doc();
  local.track(localStateDoc, `${userKey}/localState`);

  const uiState = localStateDoc.getMap("uiState");
  const navigationHistory = localStateDoc.getArray<string>("navigationHistory");
  navigationHistory.observe(async () => {
    if (navigationHistory.length === 0) {
      return;
    }

    currentNoteId = navigationHistory.get(navigationHistory.length - 1);
    await loadNote();
  });

  // handle internal links
  document.addEventListener("pointerdown", async (e) => {
    const link = e.target as HTMLAnchorElement | undefined;
    if (link?.tagName === "A" && link.href.startsWith("note:")) {
      e.preventDefault();
      navigationHistory.push([link.href.slice("note:".length)]);
    }
  });

  const notes = sharedStateDoc.getMap<NoteEntry>("notes");

  // setup command palette
  {
    const cp = new CommandPalette(notes, async (action) => {
      if (action.id === "docOpen") {
        navigationHistory.push([action.args.docId]);
        return true;
      }

      if (action.id === "docMake") {
        const noteId = uuid();
        notes.set(
          noteId,
          new Y.Map([
            ["title", action.args.docTitle],
            ["content", new Y.Doc({ guid: noteId, autoLoad: true })],
          ])
        );
        navigationHistory.push([noteId]);
        return true;
      }

      if (action.id === "docNuke") {
        if (currentNoteId === undefined) {
          alert("No note selected");
          return true;
        }

        const noteTitle =
          (notes.get(currentNoteId)?.get("title") as string) ?? "<untitled>";

        const confirmed = confirm(
          `Are you sure you want to delete ${noteTitle}?`
        );
        if (confirmed) {
          editor?.destroy();
          notes.delete(currentNoteId);
          navigationHistory.doc!.transact(() => {
            for (let i = navigationHistory.length - 1; i >= 0; i--) {
              if (navigationHistory.get(i) === currentNoteId) {
                navigationHistory.delete(i, 1);
              }
            }
          });
        }
        return true;
      }

      if (action.id === "changeUserKey") {
        const confirmed = confirm(
          "Are you sure you want to change the user key?"
        );
        if (!confirmed) {
          return true;
        }

        const newUserKey = prompt("New user key");
        if (newUserKey === null || newUserKey === "") {
          alert("No user key provided. Skipping action.");
          return true;
        }

        localStorage.setItem(USER_KEY_ITEM_ID, newUserKey);
        window.location.reload();

        return true;
      }

      if (action.id === "sync") {
        const syncSetup = prompt(
          "Enter HocusPocus connection string in the following format: `<url>::<token>`.\n" +
            "TipTap Cloud the <url> part is: `wss://<app-id>.collab.tiptap.cloud`"
        );
        if (syncSetup === null || syncSetup === "") {
          alert("No API key provided. Skipping action.");
          return true;
        }

        localStorage.setItem(SYNC_SETUP_ITEM_ID, syncSetup);
        window.location.reload();
        return true;
      }

      if (action.id === "importFromJson") {
        const backupFile = await getUploadedJsonFile<
          Record<string, { meta: Record<string, unknown>; content: string }>
        >();
        if (backupFile === null) {
          alert("Invalid or missing file. Skipping action.");
          return true;
        }

        for (const [docId, { meta, content }] of Object.entries(backupFile)) {
          const doc = new Y.Doc({ autoLoad: true });
          await loadYDocContentFromHtml(doc, content);
          notes.set(
            docId,
            new Y.Map([...Object.entries(meta), ["content", doc]])
          );
        }

        alert("Loaded");

        return true;
      }

      if (action.id === "loadContentFromHtml") {
        if (editor === undefined || currentNoteId === undefined) {
          alert("Create an empty note first");
          return true;
        }

        const htmlContent = prompt("HTML content");
        if (!htmlContent) {
          alert("No HTML provided. Skipping action.");
          return true;
        }

        await loadYDocContentFromHtml(currentDoc!, htmlContent);

        return true;
      }

      action satisfies never;
      return false;
    });

    const commandPaletteButton = document.querySelector(
      "button.open-command-palette"
    )!;
    window.addEventListener("online", () => {
      commandPaletteButton.classList.remove("offline");
    });
    window.addEventListener("offline", () => {
      commandPaletteButton.classList.add("offline");
    });
    commandPaletteButton.addEventListener("click", () => {
      cp.openDialog();
    });

    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === "p") {
        e.preventDefault();
        cp.openDialog();
      }
    });
  }

  // setup title editor
  {
    const titleEditor = new Editor({
      element: document.querySelector(".editor-title")!,
      extensions: [
        Document.extend({ content: "heading" }),
        TextStyle.configure({}),
        StarterKit.configure({ history: false, document: false }),
      ],
      content: tiptapSingleH1Doc("<untitled>"),
    });
    titleEditor.on("update", async () => {
      if (currentNoteId === undefined) {
        return;
      }

      const workingTitle = titleEditor.getJSON().content?.[0].content?.[0].text;
      notes.get(currentNoteId)?.set("title", workingTitle ?? "");
    });
    notes.observeDeep(updateTitle);
    navigationHistory.observeDeep(updateTitle);

    function updateTitle() {
      if (currentNoteId === undefined) {
        return;
      }

      const title = notes.get(currentNoteId)?.get("title") as string;
      titleEditor.commands.setContent(tiptapSingleH1Doc(title ?? " "));
    }
  }

  // setup sidebar
  {
    const sidebar = document.querySelector<HTMLElement>("#sidebar")!;
    notes.observeDeep(renderSidebar);
    navigationHistory.observe(renderSidebar);

    let sidebarToggleCount = 0;
    const sidebarOpenButton = document.querySelector(
      "button.collapse-sidebar"
    )!;
    sidebarOpenButton.addEventListener("click", () => {
      uiState.set("sidebarOpen", !uiState.get("sidebarOpen"));
    });
    uiState.observe(() => {
      if (uiState.get("sidebarOpen") ?? false) {
        sidebarOpenButton.classList.add("active");
        sidebar.classList.add("open");
      } else {
        sidebarOpenButton.classList.remove("active");
        sidebar.classList.remove("open");
      }

      if (sidebarToggleCount++ === 0) {
        sidebar.classList.add("no-transition");
        sidebar.offsetHeight;
        sidebar.classList.remove("no-transition");
      }
    });

    function renderSidebar() {
      const list = sidebar.querySelector(".items")!;
      list.innerHTML = "";

      for (const [noteId, note] of notes.entries()) {
        const listItem = list.appendChild(document.createElement("li"));
        listItem.innerHTML = `<span></span>`;

        let title = note.get("title") as string;
        if (!title?.trim()) {
          title = "<untitled>";
        }
        listItem.querySelector("span")!.textContent = title;

        if (noteId === currentNoteId) {
          listItem.classList.add("selected");
        }

        listItem.addEventListener("click", () => {
          navigationHistory.push([noteId]);

          if (isMobile()) {
            uiState.set("sidebarOpen", false);
          }
        });
      }
    }
  }

  // setup properties view
  if (/* TODO: enable when I will be adding properties support */ false) {
    const docPropertiesView = document.querySelector<HTMLElement>(
      ".doc-properties-content"
    )!;

    let propertiesToggleCount = 0;
    const showPropertiesButton = document.querySelector(
      "button.show-properties"
    )!;
    showPropertiesButton.addEventListener("click", () => {
      uiState.set("propertiesOpen", !uiState.get("propertiesOpen"));
    });
    uiState.observe(() => {
      if (uiState.get("propertiesOpen") ?? false) {
        showPropertiesButton.classList.add("active");
        docPropertiesView.style.height = docPropertiesView.scrollHeight + "px";
      } else {
        showPropertiesButton.classList.remove("active");
        docPropertiesView.style.height = null as never;
      }

      if (propertiesToggleCount++ === 0) {
        docPropertiesView.classList.add("no-transition");
        docPropertiesView.offsetHeight;
        docPropertiesView.classList.remove("no-transition");
      }
    });
  }

  if (isMobile()) {
    // fix for chrome android
    window.addEventListener("resize", () => {
      window.scrollTo(0, 0);
    });

    setupOverKeyboardBar(
      document.querySelector(".over-keyboard-bar")!,
      (element) => element.classList.contains("tiptap")
    );
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

  async function loadNote() {
    if (editor !== undefined) {
      editor.destroy();
    }

    currentDoc = notes.get(currentNoteId!)!.get("content") as Y.Doc;

    editor = new Editor({
      element: document.querySelector(".editor")!,
      extensions: [
        ...TIPTAP_EXTENSIONS,
        Collaboration.configure({ document: currentDoc }),
      ],
    });
  }
}

function setupOverKeyboardBar(
  bar: HTMLElement,
  shouldOpenFor: (element: Element) => boolean
) {
  window.visualViewport!.addEventListener("resize", updateOverlay);
  window.visualViewport!.addEventListener("scroll", updateOverlay);

  function updateOverlay() {
    const keyboardHeight = window.innerHeight - window.visualViewport!.height;

    if (
      keyboardHeight <= 0 ||
      !document.activeElement ||
      !shouldOpenFor(document.activeElement)
    ) {
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

function tiptapSingleH1Doc(title: string) {
  return {
    type: "doc",
    content: [
      {
        type: "heading",
        content: [{ type: "text", text: title }],
        attrs: { level: 1 },
      },
    ],
  };
}

async function getUploadedJsonFile<T = unknown>(): Promise<T | null> {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.addEventListener("change", (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return resolve(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonString = e.target?.result as string;
          resolve(JSON.parse(jsonString));
        } catch {
          console.error("Invalid JSON file");
          resolve(null);
        }
      };
      reader.readAsText(file);
    });

    input.click();
  });
}

async function loadYDocContentFromHtml(ydoc: Y.Doc, html: string) {
  const contentJson = generateJSON(html, TIPTAP_EXTENSIONS);

  const contentFragment = ydoc.getXmlFragment("default");
  prosemirrorJSONToYXmlFragment(TIPTAP_SCHEMA, contentJson, contentFragment);
}

function uuid() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // for unsecure contexts
  return "xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx".replaceAll("x", () =>
    ((Math.random() * 16) | 0).toString(16)
  );
}
