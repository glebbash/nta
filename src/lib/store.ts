import { browser } from '$app/environment';
import { IndexeddbPersistence } from 'y-indexeddb';
import { WebrtcProvider } from 'y-webrtc';
import { syncedStore, getYjsDoc } from '@syncedstore/core';
import { svelteSyncedStore } from '@syncedstore/svelte';

import { APP_DATA } from '$lib';

export function getDataStore() {
  const roomName = 'nta-2';
  const store = syncedStore(APP_DATA);

  const svelteStore = svelteSyncedStore(store);
  if (!browser) {
    return { data: svelteStore };
  }

  const doc = getYjsDoc(store);
  const local = new IndexeddbPersistence(roomName, doc);
  const remote = new WebrtcProvider(roomName, doc, {
    signaling: ['wss://yjs-signaling.deno.dev/']
  });

  let subscribers = 0;
  const customStore: typeof svelteStore = {
    set: svelteStore.set,
    subscribe: (run) => {
      subscribers++;
      const unsubscribe = svelteStore.subscribe(run);

      return () => {
        unsubscribe();
        subscribers--;
        if (subscribers === 0) {
          local.destroy();
          remote.destroy();
        }
      };
    },
  }

  return { data: customStore };
}
