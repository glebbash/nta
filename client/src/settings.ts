import * as Y from "yjs";

export class Settings {
  private history!: Y.Array<string>;

  public onNavigate: (file: string) => void = () => {};

  constructor(private ydoc: Y.Doc) {
    this.history = this.ydoc.getArray<string>("history");
    this.history.observe(() => {
      const file = this.getCurrentFile();
      if (file !== null) {
        this.onNavigate(file);
      }
    });
  }

  navigateTo(file: string) {
    this.history.push([file]);
  }

  getCurrentFile(): string | null {
    if (this.history.length === 0) {
      return null;
    }

    return this.history.get(this.history.length - 1);
  }
}
