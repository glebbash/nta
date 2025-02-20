import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Collaboration from "@tiptap/extension-collaboration";
import Document from "@tiptap/extension-document";
import * as Y from "yjs";

import { DocumentStore } from "./document-store.js";
import { DocumentSync } from "./document-sync.js";

type NoteEntry = Y.Map<unknown>;

let titleEditor!: Editor;
let editor: Editor | undefined;
let currentNoteId: string | undefined;
let currentDoc: Y.Doc | undefined;

await main().catch((err) => {
  alert("ERROR: " + err);
});

async function main() {
  const documents = await DocumentStore.load("nta");
  const sync = new DocumentSync();

  const localStateDoc = new Y.Doc();
  documents.track(localStateDoc, "localState");

  const uiState = localStateDoc.getMap("uiState");

  const navigationHistory = localStateDoc.getArray<string>("navigationHistory");
  navigationHistory.observe(async () => {
    if (navigationHistory.length === 0) {
      return;
    }

    currentNoteId = navigationHistory.get(navigationHistory.length - 1);
    await loadNote(documents, sync, notes, currentNoteId);
  });

  const sharedStateDoc = new Y.Doc();
  documents.track(sharedStateDoc, "sharedState");
  sync.track(sharedStateDoc, "sharedState");

  const notes = sharedStateDoc.getMap<NoteEntry>("notes");

  const sidebar = document.querySelector<HTMLElement>("#sidebar")!;
  const sidebarReload = () => {
    renderSidebar(sidebar, notes, currentNoteId, (noteId) => {
      navigationHistory.push([noteId]);

      if (isMobile()) {
        sidebar.classList.add("collapsed");
        document
          .getElementById("button.collapse-sidebar")!
          .classList.add("collapsed");
      }
    });
  };
  notes.observeDeep(sidebarReload);
  navigationHistory.observe(sidebarReload);

  sidebar
    .querySelector("button.create")!
    .addEventListener("click", async () => {
      const noteTitle = prompt("Enter title:");
      if (!noteTitle) {
        return;
      }

      const noteId = Date.now().toString();
      notes.set(noteId, new Y.Map([["title", noteTitle]]));
      navigationHistory.push([noteId]);
    });

  document
    .querySelector("button.delete")!
    .addEventListener("click", async () => {
      if (currentNoteId === undefined) {
        alert("No note selected");
        return;
      }

      const confirmed = confirm(
        `Are you sure you want to delete ${currentNoteId}?`
      );
      if (confirmed) {
        editor?.destroy();
        await documents.deleteDoc("notes/" + currentNoteId);
        notes.delete(currentNoteId);
        navigationHistory.doc!.transact(() => {
          for (let i = navigationHistory.length - 1; i >= 0; i--) {
            if (navigationHistory.get(i) === currentNoteId) {
              navigationHistory.delete(i, 1);
            }
          }
        });
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

  document
    .querySelector("button.collapse-sidebar")!
    .addEventListener("click", () => {
      uiState.set("sidebarCollapsed", !uiState.get("sidebarCollapsed"));
    });

  let sidebarToggleCount = 0;
  uiState.observe(() => {
    const collapsed = uiState.get("sidebarCollapsed") ?? false;

    const sidebar = document.getElementById("sidebar")!;
    const collapseButton = document.querySelector("button.collapse-sidebar")!;

    if (collapsed) {
      sidebar.classList.add("collapsed");
      collapseButton.classList.add("collapsed");
    } else {
      sidebar.classList.remove("collapsed");
      collapseButton.classList.remove("collapsed");
    }

    if (sidebarToggleCount === 0) {
      sidebar.classList.add("no-transition");
      sidebar.offsetHeight;
      sidebar.classList.remove("no-transition");
    }

    sidebarToggleCount += 1;
  });

  titleEditor = new Editor({
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

  const showPropertiesButton = document.querySelector(
    "button.show-properties"
  )!;
  const propertiesContent = document.querySelector<HTMLElement>(
    ".doc-properties-content"
  )!;
  showPropertiesButton.addEventListener("click", () => {
    showPropertiesButton.classList.toggle("active");
    if (propertiesContent.style.height) {
      propertiesContent.style.height = null as never;
    } else {
      propertiesContent.style.height = propertiesContent.scrollHeight + "px";
    }
  });
}

async function loadNote(
  documents: DocumentStore,
  sync: DocumentSync,
  notes: Y.Map<NoteEntry>,
  noteId: string
) {
  if (editor !== undefined) {
    editor.destroy();
  }

  if (currentDoc !== undefined) {
    currentDoc.destroy();
  }

  currentDoc = new Y.Doc();
  await documents.track(currentDoc, "notes/" + noteId);
  sync.track(currentDoc, "notes/" + noteId);

  titleEditor.commands.setContent(
    tiptapSingleH1Doc(notes.get(noteId)?.get("title") as string)
  );

  editor = new Editor({
    element: document.querySelector(".editor")!,
    extensions: [
      TextStyle.configure({}),
      StarterKit.configure({ history: false }),
      Collaboration.configure({ document: currentDoc }),
    ],
  });
}

function renderSidebar(
  container: Element,
  notes: Y.Map<NoteEntry>,
  currentNoteId: string | undefined,
  onNoteClick: (noteId: string) => void
) {
  const list = container.querySelector(".items")!;
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

    listItem.addEventListener("click", () => onNoteClick(noteId));
  }
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
