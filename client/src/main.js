import { html, ReactDOM } from "./deps.js";
import { createComponent } from "./utils/create-component.js";

const App = () => {
  return createComponent({ type: "Load", url: "/pages/_ui.json" });
};

ReactDOM.createRoot(document.querySelector("#root")).render(html`<${App} />`);
