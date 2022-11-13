import { ReactDOM } from "./deps.js";
import { createComponent } from "./utils/create-component.js";

ReactDOM.createRoot(
  document.querySelector("#root"),
).render(
  createComponent({ type: "Load", url: "/pages/_system/ui.json" }),
);
