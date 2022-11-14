import { html, ReactDOM } from "./deps.js";
import { App } from "./components/_mod.js";

ReactDOM.createRoot(document.querySelector("#root")).render(html`<${App} />`);
