import { getCurrentPageUrl } from '/data/_system/scripts/system/view.js';

export async function main() {
  button.addEventListener('click', () => {
    alert(getCurrentPageUrl());
  });
}
