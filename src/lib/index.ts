// place files you want to import through the `$lib` alias in this folder.

export type Note = {
    title: string;
    content: string;
    meta: Record<string, unknown>;
}