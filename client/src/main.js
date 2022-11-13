import { html, React, ReactDOM } from "./deps.js";
import { CurrentPageContext } from "./components/CurrentPage.js";
import { createComponent } from "./utils/create-component.js";

const App = () => {
  const [currentPage, setCurrentPage] = React.useState("/pages/page1.json");
  const currentPage$ = { get: () => currentPage, set: setCurrentPage };

  return html`
    <${CurrentPageContext.Provider} value=${currentPage$}>
      ${createComponent({ type: "Load", url: "/pages/_ui.json" })}
    <//>
  `;
};

ReactDOM.createRoot(document.querySelector("#root")).render(html`<${App} />`);
