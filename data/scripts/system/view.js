/** @type {{view: import("../components/sub-page").SubPage | null}} */
const settings = {
  view: null,
};

document.addEventListener('view-set', (event) => {
  const { src, container } = event.detail;

  console.log('view set', { src });

  settings.view = container;
});

export async function loadPage(absoluteUrl) {
  await settings.view?.load(absoluteUrl);
}
