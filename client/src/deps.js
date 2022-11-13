export { default as React } from "https://esm.sh/react@18.2.0";
export { default as ReactDOM } from "https://esm.sh/react-dom@18.2.0";

import { createElement } from "https://esm.sh/react@18.2.0";
import htm from "https://esm.sh/htm@3.1.1";
export const html = htm.bind(createElement);
