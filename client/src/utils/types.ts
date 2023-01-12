export type Item = { id: string } & (
  | { type: "text"; value: string }
  | { type: "switch"; checked: boolean }
);
