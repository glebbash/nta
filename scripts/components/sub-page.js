class SubPage extends HTMLElement {
  connectedCallback() {
    const src = this.getAttribute("src");

    if (this.hasAttribute("view")) {
      setTimeout(() => {
        document.dispatchEvent(
          new CustomEvent("view-set", { detail: { src, container: this } })
        );
      });
    }

    this.load(src);
  }

  async load(/** @type {string} */ src) {
    this.innerHTML = "";

    const pageContent = await fetch(src).then((res) => res.text());

    this.innerHTML = pageContent;

    document.dispatchEvent(
      new CustomEvent("page-added", { detail: { src, container: this } })
    );
  }
}

customElements.define("sub-page", SubPage);
