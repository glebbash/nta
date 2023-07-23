import { IndexeddbPersistence } from 'y-indexeddb';
import { WebrtcProvider } from 'y-webrtc';
import { syncedStore, getYjsDoc } from '@syncedstore/core';
import { svelteSyncedStore } from '@syncedstore/svelte';

import { browser } from '$app/environment';
import { APP_DATA } from '$lib';

export function getDataStore() {
  const roomName = 'nta-2';
  const store = syncedStore(APP_DATA);

  if (browser) {
    const doc = getYjsDoc(store);
    new WebrtcProvider(roomName, doc, {
      signaling: ['wss://yjs-signaling.deno.dev/']
    });
    new IndexeddbPersistence(roomName, doc);
  }

  return { data: svelteSyncedStore(store) };
}
