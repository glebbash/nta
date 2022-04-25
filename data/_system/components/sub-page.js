import { loadPageContent } from '../scripts/system/server.js';
import { getCurrentPageUrl } from '../scripts/system/view.js';
import { getAbsoluteUrl } from '../scripts/utils/get-absolute-url.js';

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
