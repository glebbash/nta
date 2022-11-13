import { signal } from "../deps.js";
import { createComponent } from "../utils/create-component.js";

export const currentPage = signal("/pages/page1.json");

export const CurrentPage = () => {
  return createComponent({ type: "Page", url: currentPage.value });
};
