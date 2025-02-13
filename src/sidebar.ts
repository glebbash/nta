import * as Y from "yjs";

export class Sidebar {
  private files!: Y.Array<string>;
  private selectedFile: string | null = null;
  public onFileSelected: (file: string) => void = () => {};

  constructor(private element: HTMLElement, private ydoc: Y.Doc) {
    this.files = this.ydoc.getArray<string>("files");
    this.files.observe(() => {
      this.render();
    });
  }

  render() {
    this.element.innerHTML = `
      <div class="inbox">
        <div class="actions">
          <span class="title">Inbox</span>
          <button class="create">+</button>
          <button class="rename">R</button>
          <button class="delete">X</button>
        </div>
        <ul></ul>
      </div>
    `;
    const list = this.element.querySelector("ul")!;

    this.element
      .querySelector("button.create")!
      .addEventListener("click", () => {
        const file = prompt("Enter name:");
        if (file) {
          this.createFile(file);
        }
      });

    this.element
      .querySelector("button.rename")!
      .addEventListener("click", () => {
        if (this.selectedFile === null) {
          alert("No file selected");
          return;
        }

        const newName = prompt("Enter new name:", this.selectedFile);
        if (newName) {
          this.renameFile(this.selectedFile, newName);
        }
      });

    this.element
      .querySelector("button.delete")!
      .addEventListener("click", () => {
        if (this.selectedFile === null) {
          alert("No file selected");
          return;
        }

        const confirmed = confirm(
          `Are you sure you want to delete ${this.selectedFile}?`
        );
        if (confirmed) {
          this.deleteFile(this.selectedFile);
        }
      });

    for (const file of this.files) {
      const listItem = list.appendChild(document.createElement("li"));
      listItem.innerHTML = `
        <span>${file}</span>
      `;

      if (file === this.selectedFile) {
        listItem.classList.add("selected");
      }

      listItem.addEventListener("click", () => {
        this.onFileSelected(file);
      });
    }
  }

  displaySelected(selected: string) {
    this.selectedFile = selected;
    this.render();
  }

  createFile(newFile: string) {
    if (this.findFileIndex(newFile) !== null) {
      alert(`File ${newFile} already exists`);
      return;
    }

    this.files.push([newFile]);
  }

  deleteFile(file: string) {
    const index = this.findFileIndex(file);
    if (index === null) {
      alert(`File ${file} not found`);
      return;
    }

    this.files.delete(index, 1);
  }

  renameFile(oldFile: string, newFile: string) {
    const index = this.findFileIndex(oldFile);
    if (index === null) {
      alert(`File ${oldFile} not found`);
      return;
    }

    if (this.findFileIndex(newFile) !== null) {
      alert(`File ${newFile} already exists`);
      return;
    }

    this.files.insert(index, [newFile]);
    this.files.delete(index + 1, 1);
  }

  private findFileIndex(file: string) {
    for (let index = 0; index < this.files.length; index++) {
      if (this.files.get(index) === file) {
        return index;
      }
    }

    return null;
  }
}
