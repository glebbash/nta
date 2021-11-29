export type PageId = string;

export type PagePath = string[];

export type PageMeta = Record<string, unknown>;

export type Page = {
  id: string;
  name: string;
  path: PagePath;
  meta: PageMeta;
  content: string;
};

export type PageInfo = Pick<Page, "id" | "name">;
