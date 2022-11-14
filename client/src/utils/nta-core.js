import { React, signal } from "../deps.js";
import * as components from "../components/_mod.js";

// TODO: add better start page
export const currentPage = signal("/pages/page1.json");
export const editable = signal(false);

export function useDataState(data, key) {
  const [value, setValue] = React.useState(data[key]);

  return [value, (value) => {
    data[key] = value;
    return setValue(value);
  }];
}

export function useSetSignal(signal) {
  const [, setValue] = React.useState(signal.value);

  return (value) => setValue(signal.value = value);
}

export function createComponent(data) {
  const { type } = data;

  if (components[type] === undefined) {
    data = { type: "Error", message: `unknown component: ${type}` };
  }

  return React.createElement(components[type], { data });
}
