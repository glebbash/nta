import { createElement, ReactElement, useState } from "react";
import * as components from "../components/_mod";

export function useDataState<
  O extends Record<string, unknown>,
  K extends keyof O
>(data: O, key: K) {
  const [value, setValue] = useState(data[key]);

  return [
    value,
    (value: O[K]) => {
      data[key] = value;
      return setValue(value);
    },
  ];
}

export function createComponent(
  data: { type: keyof typeof components; [key: string]: unknown },
  state: unknown
): ReactElement {
  const { type } = data;

  if (components[type] === undefined) {
    data = { type: "Error", message: `unknown component: ${type}` };
  }

  return createElement(components[type] as never, { data, state });
}
