export { default as React } from "https://esm.sh/react@18.2.0?x";
export { default as ReactDOM } from "https://esm.sh/react-dom@18.2.0/client?deps=react@18.2.0";
export {
  signal,
  useSignal,
} from "https://esm.sh/@preact/signals-react@1.2.1?deps=react@18.2.0,react-dom@18.2.0";

import { createElement } from "https://esm.sh/react@18.2.0?x";
import htm from "https://esm.sh/htm@3.1.1";
export const html = htm.bind(createElement);
