import { loadPageContent } from '../system/load-page-content.js';
import { getCurrentPageUrl } from '../system/view.js';
import { getAbsoluteUrl } from '../utils/get-absolute-url.js';

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

  async load(/** @type {string} */ url) {
    if (!url) {
      return;
    }

    const pageUrl = getAbsoluteUrl(url, getCurrentPageUrl());

    const pageContent = await loadPageContent(`/data/${pageUrl}`);

    this.innerHTML = pageContent;

    document.dispatchEvent(
      new CustomEvent('page-added', {
        detail: { src: pageUrl, container: this },
      }),
    );
  }
}

customElements.define('sub-page', SubPage);
