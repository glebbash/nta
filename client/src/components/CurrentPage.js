import { createComponent, currentPage } from "../utils/nta-core.js";

export const CurrentPage = () => {
  return createComponent({ type: "Page", url: currentPage.value });
};
