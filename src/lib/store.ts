import { IndexeddbPersistence } from 'y-indexeddb'
import { WebrtcProvider } from 'y-webrtc';
import { syncedStore, getYjsDoc } from '@syncedstore/core';
import { svelteSyncedStore } from '@syncedstore/svelte';

import { browser } from '$app/environment';
import type { Note } from '$lib';

export function getDataStore() {
    const roomName = 'syncedstore-todos-2';
    const store = syncedStore({ notes: [] as Note[] });
    const data = svelteSyncedStore(store);

    if (browser) {
        const doc = getYjsDoc(store);
        new WebrtcProvider(roomName, doc, {
            signaling: ['wss://yjs-signaling.deno.dev/']
        });
        new IndexeddbPersistence(roomName, doc);
    }

    return { data };
}
