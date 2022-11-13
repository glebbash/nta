import { React } from "../deps.js";
import * as components from "../components/_mod.js";

export function createComponent(data) {
  const { type } = data;

  if (components[type] === undefined) {
    data = { type: "Error", message: `unknown component: ${type}` };
  }

  return React.createElement(components[type], { data });
}
