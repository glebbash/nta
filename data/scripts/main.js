import './components/sub-page.js';
import './components/page-link.js';
import { loadPage } from './system/view.js';
import { setupPage } from './system/setup-page.js';

document.addEventListener('page-added', (event) => {
  const { src, container } = event.detail;

  console.log('page added', { src });

  setupPage({ src, container });
});

document.addEventListener('view-set', loadPageFromQuery);

function loadPageFromQuery() {
  const url = new URL(window.location.href);

  const page = url.searchParams.get('page') ?? '_system/no-page.html';

  console.log('loading', page, 'from query');

  loadPage(page);
}
