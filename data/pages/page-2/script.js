import { getCurrentPageUrl } from '/data/_system/scripts/system/view.js';

button.addEventListener('click', () => {
  alert(`separate ${getCurrentPageUrl()}`);
});
