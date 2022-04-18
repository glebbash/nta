import { getAbsoluteUrl } from '../utils/get-absolute-url.js';

const settings = {
  /** @type {import("../components/sub-page").SubPage | null} */
  view: null,
  pageUrl: '/_system/no-page.html',
};

document.addEventListener('view-set', (event) => {
  const { src, container } = event.detail;

  console.log('view set', { src });

  settings.view = container;
});

export async function loadPage(pageUrl) {
  console.log('viewing', { pageUrl });

  await settings.view?.load(pageUrl);
  settings.pageUrl = getAbsoluteUrl(pageUrl, settings.pageUrl);
}

export function getCurrentPageUrl() {
  return settings.pageUrl;
}
