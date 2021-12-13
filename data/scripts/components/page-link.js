import { loadPage } from '../system/view.js';

class PageLink extends HTMLElement {
  connectedCallback() {
    const src = this.getAttribute('src');

    const text = this.innerHTML;

    this.innerHTML = `<a href="?page=${src}">${text}</a>`;

    this.querySelector('a').addEventListener('click', (event) => {
      event.preventDefault();

      loadPage(src);
    });
  }
}

customElements.define('page-link', PageLink);
