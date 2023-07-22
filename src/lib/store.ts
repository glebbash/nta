const { WebrtcProvider } = await import('y-webrtc');
const { syncedStore, getYjsDoc } = await import('@syncedstore/core');
const { svelteSyncedStore } = await import('@syncedstore/svelte');

import { browser } from '$app/environment';
import type { Todo } from '$lib';

export function getDataStore() {
    const store = syncedStore({ todos: [] as Todo[] });
    const svelteStore = svelteSyncedStore(store);

    if (browser) {
        const doc = getYjsDoc(store);
        new WebrtcProvider('syncedstore-todos-2', doc, {
            signaling: ['wss://yjs-signaling.deno.dev/']
        });
    }

    return { svelteStore, store };
}
