import * as Y from "yjs";
import { NoteEntry } from "./types.js";

type NoteEntryWithId = { id: string; meta: NoteEntry };

export type Action =
  | { id: "createDoc"; title: string; docTitle: string }
  | { id: "testApi"; title: string }
  | { id: "openDoc"; title: string; docId: string }
  | { id: "deleteCurrentDoc"; title: string };

const STATIC_ACTIONS: Record<string, Action> = {
  TEST_API: { id: "testApi", title: ".api // Test API calls" },
  DELETE_DOC: { id: "deleteCurrentDoc", title: ".del // Delete current doc" },
};

export class CommandPalette {
  private open = false;
  private selectedActionIndex = 0;
  private actions: Action[] = [STATIC_ACTIONS.TEST_API];
  private dialogElement!: HTMLDialogElement;
  private inputElement!: HTMLInputElement;

  constructor(
    private notes: Y.Map<NoteEntry>,
    private onAction: (action: Action, input: string) => Promise<boolean>
  ) {
    this.initUI();
  }

  private initUI() {
    this.dialogElement = document.body.appendChild(
      document.createElement("dialog")
    );
    this.dialogElement.classList.add("command-palette");
    this.dialogElement.addEventListener("click", (e) => {
      if (e.target === this.dialogElement) {
        this.closeDialog();
      }
    });

    this.inputElement = this.dialogElement.appendChild(
      document.createElement("input")
    );
    this.inputElement.type = "search";
    this.inputElement.placeholder = "Search // .all - list all";
    this.inputElement.autofocus = true;
    this.inputElement.spellcheck = false;
    this.inputElement.addEventListener("input", () => {
      this.updateUI();
    });

    const list = this.dialogElement.appendChild(document.createElement("div"));
    list.classList.add("actions-list");

    document.addEventListener("keydown", (e) => this.onKeyDown(e));
  }

  private updateUI() {
    this.updateActions();

    const list = document.querySelector(".actions-list")!;
    list.innerHTML = "";

    this.actions.forEach((action, i) => {
      const item = list.appendChild(document.createElement("div"));
      item.classList.add("action-item");
      item.textContent = action.title;
      if (i === this.selectedActionIndex) {
        item.classList.add("selected");
      }
      item.addEventListener("click", async () => {
        const shouldClose = await this.onAction(
          action,
          this.inputElement.value
        );
        if (shouldClose) {
          this.closeDialog();
        }
      });
    });
  }

  private async updateActions() {
    this.actions = [];

    const input = this.inputElement.value.toLowerCase();

    if (input.length >= 2) {
      const matchingDocs: NoteEntryWithId[] = [];
      for (const [id, meta] of this.notes.entries()) {
        if (input === ".all") {
          matchingDocs.push({ id, meta });
          continue;
        }

        const title = (meta.get("title") as string) ?? "";
        if (title.toLowerCase().includes(input)) {
          matchingDocs.push({ id, meta });
        }
      }

      const openDocsActions = matchingDocs.map(
        (doc) =>
          ({
            id: "openDoc",
            title: `.open : ${doc.meta.get("title") ?? ""}`,
            docId: doc.id,
          } as Action)
      );
      this.actions.push(...openDocsActions);
    }

    if (input.startsWith(".")) {
      for (const staticAction of Object.values(STATIC_ACTIONS)) {
        if (staticAction.title.toLowerCase().includes(input)) {
          this.actions.push(staticAction);
        }
      }
    }

    if (!input.startsWith(".") && input !== "") {
      this.actions.push({
        id: "createDoc",
        title: `.make : ${this.inputElement.value}`,
        docTitle: this.inputElement.value,
      });
    }
  }

  private async onKeyDown(e: KeyboardEvent) {
    if (!this.open) {
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      this.selectedActionIndex = Math.max(0, this.selectedActionIndex - 1);
      return this.updateUI();
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      this.selectedActionIndex = Math.min(
        this.actions.length - 1,
        this.selectedActionIndex + 1
      );
      return this.updateUI();
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const action = this.actions[this.selectedActionIndex];
      const shouldClose = await this.onAction(action, this.inputElement.value);
      if (shouldClose) {
        this.closeDialog();
      } else {
        this.updateUI();
      }
    }
  }

  public openDialog() {
    this.open = true;
    this.dialogElement.showModal();
    this.inputElement.focus();
    this.inputElement.value = "";
    this.selectedActionIndex = 0;
    this.updateUI();
  }

  public closeDialog() {
    this.open = false;
    this.dialogElement.close();
  }
}
