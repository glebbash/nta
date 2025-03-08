import * as Y from "yjs";
import { NoteEntry } from "./types.js";

type BaseAction = {
  id: string;
  title: string;
  [key: string]: unknown;
};

type ActionTrigger = (ctx: {
  input: string;
  action: BaseAction;
  activeActions: BaseAction[];
  notes: Y.Map<NoteEntry>;
}) => void;

const COMMAND_ACTION_TRIGGER: ActionTrigger = (ctx) => {
  if (
    ctx.input.startsWith(".") &&
    ctx.action.title.toLowerCase().includes(ctx.input)
  ) {
    ctx.activeActions.push(ctx.action);
  }
};

export const ACTION_TRIGGERS = [
  {
    id: "docOpen",
    title: ".open : %title%",
    args: { docId: "" as string },
    trigger: (ctx) => {
      if (ctx.input.length < 2) {
        return;
      }

      for (const [docId, meta] of ctx.notes.entries()) {
        const title = (meta.get("title") as string) ?? "";
        if (ctx.input === ".all" || title.toLowerCase().includes(ctx.input)) {
          ctx.activeActions.push({
            ...ctx.action,
            title: ctx.action.title.replace("%title%", title),
            args: { docId },
          });
        }
      }
    },
  },
  {
    id: "docMake",
    title: ".make : %title%",
    args: { docTitle: "" as string },
    trigger: (ctx) => {
      if (ctx.input.startsWith(".") || ctx.input === "") {
        return;
      }

      ctx.activeActions.push({
        ...ctx.action,
        title: ctx.action.title.replace("%title%", ctx.input),
        args: { docTitle: ctx.input },
      });
    },
  },
  {
    id: "docNuke",
    title: ".nuke // delete current doc",
    trigger: COMMAND_ACTION_TRIGGER,
  },
  {
    id: "importFromJson",
    title: ".import // import notes from JSON backup",
    trigger: COMMAND_ACTION_TRIGGER,
  },
  {
    id: "loadContentFromHtml",
    title: ".load-html // (debug) load HTML into current document",
    trigger: COMMAND_ACTION_TRIGGER,
  },
  {
    id: "changeUserKey",
    title: ".key // *DANGER* change user key",
    trigger: COMMAND_ACTION_TRIGGER,
  },
  {
    id: "sync",
    title: ".sync // setup sync",
    trigger: COMMAND_ACTION_TRIGGER,
  },
  {
    id: "apiTest",
    title: ".api // test API calls",
    trigger: COMMAND_ACTION_TRIGGER,
  },
] as const satisfies (BaseAction & { trigger: ActionTrigger })[];
export type Action = (typeof ACTION_TRIGGERS)[number];

export class CommandPalette {
  private open = false;
  private selectedActionIndex = 0;
  private actions: Action[] = [];
  private dialogElement!: HTMLDialogElement;
  private inputElement!: HTMLInputElement;

  constructor(
    private notes: Y.Map<NoteEntry>,
    private onAction: (action: Action, input: string) => Promise<boolean>
  ) {
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

    this.inputElement.addEventListener("keydown", (e) => this.onKeyDown(e));
  }

  private updateUI() {
    this.actions = [];

    const ctx = {
      input: this.inputElement.value.toLowerCase(),
      action: 0 as never as BaseAction,
      activeActions: this.actions,
      notes: this.notes,
    };
    for (const actionTrigger of ACTION_TRIGGERS) {
      ctx.action = actionTrigger;
      actionTrigger.trigger(ctx);
    }

    const list = document.querySelector(".actions-list")!;
    list.innerHTML = "";

    for (let i = 0; i < this.actions.length; i++) {
      const action = this.actions[i];

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
        return this.closeDialog();
      }

      return this.updateUI();
    }

    if (e.key === "Escape") {
      e.preventDefault();

      return this.closeDialog();
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
