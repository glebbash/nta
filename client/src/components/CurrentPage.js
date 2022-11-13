import { html, React } from "../deps.js";
import { createComponent } from "../utils/create-component.js";

export const CurrentPageContext = React.createContext();

export const CurrentPage = () => {
  const page = (currentPage) =>
    createComponent({ type: "Page", url: currentPage.get() });

  return html`
    <${CurrentPageContext.Consumer}>${page}</>
  `;
};
