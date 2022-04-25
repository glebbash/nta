import register from 'https://unpkg.com/preact-custom-element?module';
import { html } from 'https://unpkg.com/htm/preact/index.mjs?module';
import { loadPage } from '../scripts/system/view.js';

const PageLink = ({ src, children }) => {
  return html`<a href="?page=${src}" onClick=${() => loadPage(src)}>
    ${children}
  </a>`;
};

register(PageLink, 'page-link', ['src'], { shadow: true });
