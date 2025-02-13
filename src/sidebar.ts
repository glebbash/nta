import * as Y from "yjs";

export class Sidebar {
  private files!: Y.Array<string>;

  public onFileSelected: (file: string) => void = () => {};

  constructor(private element: HTMLElement, private ydoc: Y.Doc) {
    this.files = this.ydoc.getArray<string>("files");
    this.files.observe(() => {
      this.render();
    });
  }

  createFile(filename: string) {
    this.files.push([filename]);
  }

  deleteFile(index: number) {
    this.files.delete(index, 1);
  }

  renameFile(index: number, newName: string) {
    this.files.insert(index, [newName]);
    this.files.delete(index + 1, 1);
  }

  render() {
    this.element.innerHTML = "";

    const fileList = document.createElement("ul");
    this.files.forEach((file, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = file;
      listItem.addEventListener("click", () => {
        this.onFileSelected(file);
      });

      const renameButton = document.createElement("button");
      renameButton.textContent = "R";
      renameButton.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent file selection
        const newName = prompt("Enter new name:", file);
        if (newName) {
          this.renameFile(index, newName);
        }
      });
      listItem.appendChild(renameButton);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "X";
      deleteButton.addEventListener("click", (event) => {
        event.stopPropagation(); // Prevent file selection
        this.deleteFile(index);
      });
      listItem.appendChild(deleteButton);

      fileList.appendChild(listItem);
    });
    this.element.appendChild(fileList);

    const createButton = document.createElement("button");
    createButton.textContent = "+";
    createButton.addEventListener("click", () => {
      const filename = prompt("Enter filename:");
      if (filename) {
        this.createFile(filename);
      }
    });
    this.element.appendChild(createButton);
  }
}
