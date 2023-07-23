// place files you want to import through the `$lib` alias in this folder.

export const APP_DATA = {
  notes: [] as Note[],
  uiState: {} as {
    nextActionsOpen: boolean;
    inboxOpen: boolean;
  } & Record<string, unknown>
};

export type Note = {
  title: string;
  content: string;
  meta: Record<string, unknown>;
};
