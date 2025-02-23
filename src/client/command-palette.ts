import * as Y from "yjs";
import { NoteEntry } from "./types.js";

type NoteEntryWithId = { id: string; meta: NoteEntry };

export type Action =
  | { id: "createDoc"; title: string; docTitle: string }
  | { id: "testApi"; title: string }
  | { id: "openDoc"; title: string; docId: string }
  | { id: "deleteCurrentDoc"; title: string };

const STATIC_ACTIONS: Record<string, Action> = {
  TEST_API: { id: "testApi", title: ".api - Test API calls" },
  DELETE_DOC: { id: "deleteCurrentDoc", title: ".del - Delete current doc" },
};

export class CommandPalette {
  private open = false;
  private inputValue = "";
  private selectedActionIndex = 0;
  private actions: Action[] = [STATIC_ACTIONS.TEST_API];
  private dialogElement!: HTMLDialogElement;
  private inputElement!: HTMLInputElement;

  constructor(
    private notes: Y.Map<NoteEntry>,
    private onAction: (action: Action, input: string) => Promise<boolean>
  ) {
    this.setupUI();
  }

  private setupUI() {
    this.dialogElement = document.body.appendChild(
      document.createElement("dialog")
    );
    this.dialogElement.style.padding = "6px";
    this.dialogElement.style.backgroundColor = "black";
    this.dialogElement.style.color = "white";
    this.dialogElement.style.border = "none";
    this.dialogElement.style.fontSize = "14pt";
    this.dialogElement.addEventListener("click", (e) => {
      if (e.target === this.dialogElement) {
        this.closeDialog();
      }
    });

    this.inputElement = this.dialogElement.appendChild(
      document.createElement("input")
    );
    this.inputElement.type = "text";
    this.inputElement.autofocus = true;
    this.inputElement.autocomplete = "off";
    this.inputElement.spellcheck = false;
    this.inputElement.style.width = "100%";
    this.inputElement.style.fontSize = "14pt";
    this.inputElement.style.border = "none";
    this.inputElement.style.outline = "none";
    this.inputElement.style.backgroundColor = "transparent";
    this.inputElement.style.color = "white";
    this.inputElement.placeholder = "Search notes or actions";
    this.inputElement.addEventListener("input", (e) => {
      this.inputValue = (e.target as HTMLInputElement).value;
      this.updateActions();
    });

    const list = this.dialogElement.appendChild(document.createElement("div"));
    list.classList.add("actions-list");

    const footer = this.dialogElement.appendChild(
      document.createElement("div")
    );
    footer.textContent = ".all - list all docs";
    footer.style.color = "var(--font-color-secondary)";

    document.addEventListener("keydown", this.onKeyDown.bind(this));
  }

  private updateUI() {
    const list = document.querySelector(".actions-list")!;
    list.innerHTML = "";

    this.actions.forEach((action, i) => {
      const item = list.appendChild(document.createElement("div"));
      item.textContent = action.title;
      item.style.backgroundColor =
        i === this.selectedActionIndex ? "orange" : "transparent";
      item.addEventListener("click", async () => {
        const shouldClose = await this.onAction(action, this.inputValue);
        if (shouldClose) {
          this.closeDialog();
        }
      });
    });
  }

  private async updateActions() {
    const input = this.inputValue.toLowerCase();
    const filteredActions: Action[] = [];

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
            title: `Open doc '${doc.meta.get("title") ?? ""}'`,
            docId: doc.id,
          } as Action)
      );
      filteredActions.push(...openDocsActions);
    }

    if (input.startsWith(".")) {
      for (const staticAction of Object.values(STATIC_ACTIONS)) {
        if (staticAction.title.toLowerCase().includes(input)) {
          filteredActions.push(staticAction);
        }
      }
    } else if (input !== "") {
      filteredActions.push({
        id: "createDoc",
        title: `Create doc '${this.inputValue}'`,
        docTitle: this.inputValue,
      });
    }

    this.actions = filteredActions;
    this.updateUI();
  }

  private async onKeyDown(e: KeyboardEvent) {
    if (!this.open) return;

    if (e.key === "ArrowUp") {
      e.preventDefault();
      this.selectedActionIndex = Math.max(0, this.selectedActionIndex - 1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      this.selectedActionIndex = Math.min(
        this.actions.length - 1,
        this.selectedActionIndex + 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const action = this.actions[this.selectedActionIndex];
      const shouldClose = await this.onAction(action, this.inputValue);
      if (shouldClose) {
        this.closeDialog();
      }
    }
    this.updateUI();
  }

  public openDialog() {
    this.open = true;
    this.dialogElement.showModal();
    this.inputElement.focus();
    this.inputValue = "";
    this.selectedActionIndex = 0;
    this.updateActions();
  }

  public closeDialog() {
    this.inputElement.value = "";

    this.open = false;
    this.dialogElement.close();
  }
}
