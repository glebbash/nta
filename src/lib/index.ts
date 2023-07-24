// place files you want to import through the `$lib` alias in this folder.

export const APP_DATA = {
  notes: [] as Note[],
  uiState: {} as {
    nextActionsOpen: boolean;
    inboxOpen: boolean;
    noteOpen: boolean;
    currentNoteId: string;
  },
};

export type Note = {
  id: string;
  title: string;
  content: string;
  meta: Record<string, unknown>;
};
