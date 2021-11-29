import "./components/sub-page.js";

const settings = {
  view: null,
};

document.addEventListener("page-added", (event) => {
  const { src, container } = event.detail;

  console.log("page-added", src);

  container.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      console.log("link", link.href, "clicked on page", src);

      const target = settings.view ?? container;
      target.load(link.href);
    });
  });
});

document.addEventListener("view-set", (event) => {
  const { src, container } = event.detail;

  console.log("view-set", src);

  settings.view = container;
});
