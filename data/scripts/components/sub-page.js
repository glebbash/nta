import { loadPageContent } from '../system/pages.js';

export class SubPage extends HTMLElement {
  connectedCallback() {
    const src = this.getAttribute('src');

    if (this.hasAttribute('view')) {
      setTimeout(() => {
        document.dispatchEvent(
          new CustomEvent('view-set', { detail: { src, container: this } }),
        );
      });
    }

    this.load(src);
  }

  async load(/** @type {string} */ src) {
    if (!src) {
      return;
    }

    const pageContent = await loadPageContent(`/data/${src}`);

    this.innerHTML = pageContent;

    document.dispatchEvent(
      new CustomEvent('page-added', { detail: { src, container: this } }),
    );
  }
}

customElements.define('sub-page', SubPage);
