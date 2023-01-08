export type PageCtx = {
  mode: "edit" | "view";
};

export type ItemCtx = {
  pageCtx: PageCtx;
  selected: () => boolean;
};

export type Item = { id: string } & (
  | { type: "text"; value: string }
  | { type: "switch"; checked: boolean }
);
