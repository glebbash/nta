import { html, render } from "./preact-htm.js";

const dataTextArea = document.querySelector("#data");
const templateTextArea = document.querySelector("#input");
const outputDiv = document.querySelector("#output");

renderTemplate();
templateTextArea.addEventListener("input", renderTemplate);
dataTextArea.addEventListener("input", renderTemplate);

async function renderTemplate() {
  try {
    const data = JSON.parse(dataTextArea.value);
    const template = templateTextArea.value;

    outputDiv.innerHTML = "";
    render(await eval(template), outputDiv);
  } catch (e) {
    outputDiv.innerHTML = e;
  }
}
