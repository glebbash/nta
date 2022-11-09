import { Doc } from 'https://esm.sh/yjs@13.5.42';
import { WebsocketProvider } from 'https://esm.sh/y-websocket@1.4.5';
import { defaultValueCtx, Editor, rootCtx } from 'https://esm.sh/@milkdown/core@6.5.0';
import { collaborative, collabServiceCtx } from 'https://esm.sh/@milkdown/plugin-collaborative@6.5.0';
import { math } from 'https://esm.sh/@milkdown/plugin-math@6.5.0';
import { gfm } from 'https://esm.sh/@milkdown/preset-gfm@6.5.0';
import { nord } from 'https://esm.sh/@milkdown/theme-nord@6.5.0';


const markdown = `
# Milkdown Collaborative Example

---

Now you can play!
`;

const options = [
    { color: '#5e81AC', name: 'milkdown user 1' },
    { color: '#8FBCBB', name: 'milkdown user 2' },
    { color: '#dbfdbf', name: 'milkdown user 3' },
    { color: '#D08770', name: 'milkdown user 4' },
];
const rndInt = Math.floor(Math.random() * 4);

const status$ = document.getElementById('status');
const connect$ = document.getElementById('connect');
const disconnect$ = document.getElementById('disconnect');

const autoConnect = true;

class CollabManager {
    room = 'milkdown';
    doc;
    wsProvider;

    constructor(collabService) {
        this.collabService = collabService;
    }

    flush(template) {
        this.doc?.destroy();
        this.wsProvider?.destroy();

        this.doc = new Doc();
        const url = 'wss://8000-glebbash-nta-81skakuqyl8.ws-eu75.gitpod.io/my-room';
        this.wsProvider = new WebsocketProvider(url, this.room, this.doc, { connect: autoConnect });
        this.wsProvider.awareness.setLocalStateField('user', options[rndInt]);
        this.wsProvider.on('status', (payload) => {
            if (status$) {
                status$.innerText = payload.status;
            }
        });

        this.collabService.bindDoc(this.doc).setAwareness(this.wsProvider.awareness);
        this.wsProvider.once('synced', async (isSynced) => {
            if (isSynced) {
                this.collabService.applyTemplate(template).connect();
            }
        });
    }

    connect() {
        this.wsProvider.connect();
        this.collabService.connect();
    }

    disconnect() {
        this.collabService.disconnect();
        this.wsProvider.disconnect();
    }

    applyTemplate(template) {
        this.collabService
            .disconnect()
            .applyTemplate(template, () => true)
            .connect();
    }
}

async function main() {
    const editor = await Editor.make()
        .config((ctx) => {
            ctx.set(rootCtx, document.getElementById('app'));
            ctx.set(defaultValueCtx, markdown);
        })
        .use(nord)
        .use(gfm)
        .use(math)
        .use(collaborative)
        .create();

    editor.action((ctx) => {
        const collabService = ctx.get(collabServiceCtx);
        const collabManager = new CollabManager(collabService);
        collabManager.flush(markdown);

        if (connect$) {
            connect$.onclick = () => {
                collabManager.connect();
            };
        }

        if (disconnect$) {
            disconnect$.onclick = () => {
                collabManager.disconnect();
            };
        }
    });

    return editor;
}

main();
