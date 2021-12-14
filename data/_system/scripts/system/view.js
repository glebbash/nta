import { getAbsoluteUrl } from '../utils/get-absolute-url.js';

/** @type {{view: import("../components/sub-page").SubPage | null}} */
const settings = {
  view: null,
  pageUrl: '/_system/no-page.html',
};

document.addEventListener('view-set', (event) => {
  const { src, container } = event.detail;

  console.log('view set', { src });

  settings.view = container;
});

export async function loadPage(pageUrl) {
  await settings.view?.load(pageUrl);
  settings.pageUrl = getAbsoluteUrl(pageUrl, settings.pageUrl);
}

export function getCurrentPageUrl() {
  return settings.pageUrl;
}
