import { html, render } from "https://esm.sh/htm/preact";
import { signal } from "https://esm.sh/@preact/signals";
import useWebSocket, {
  ReadyState,
} from "https://esm.sh/react-use-websocket?alias=react:preact/compat,react-dom:preact/compat";

function App() {
  const input = signal("");
  const { sendMessage, readyState } = useWebSocket(
    `wss://${window.location.hostname}/ws`,
    {
      onMessage: (event) => alert(`message received: ${event.data}`),
    }
  );

  return html`
    <div>
      <p>Socket state: ${ReadyState[readyState]}</p>
      <input
        type="text"
        value=${input}
        onInput=${(e) => (input.value = e.target.value)}>
      </input>
      <button
        type="button"
        onClick=${() => sendMessage(input.value)}
        disabled=${readyState !== ReadyState.OPEN}
      >
        Send
      </button>
    </div>
  `;
}

render(html`<${App} />`, document.body);
