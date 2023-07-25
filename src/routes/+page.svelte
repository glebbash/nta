<script lang="ts">
  import CodeMirror from 'svelte-codemirror-editor';
  import { markdown } from '@codemirror/lang-markdown';
  import { githubDark } from '@uiw/codemirror-theme-github';

  import type { APP_DATA } from '$lib';
  import { getDataStore } from '$lib/store';
  import Collapsible from '../components/Collapsible.svelte';
  import NoteList from '../components/NoteList.svelte';

  const { data } = getDataStore();

  $: notes = $data.notes;
  $: uiState = ($data.uiState ?? {}) as (typeof APP_DATA)['uiState'];
  $: nextActions = notes.filter((node) => node.meta.list === 'next actions');
  $: inbox = notes.filter((note) => note.meta.list === 'inbox');
  $: currentNote = notes.find((note) => note.id === uiState.currentNoteId) ?? {
    title: '',
    content: '',
    meta: {},
  };

  let inboxNoteTitle = '';
  const addInboxNote = () => {
    const value = inboxNoteTitle && inboxNoteTitle.trim();
    if (!value) {
      return;
    }

    notes.push({
      id: crypto.randomUUID(),
      title: value,
      content: '',
      meta: { list: 'inbox' },
    });
    inboxNoteTitle = '';
  };

  const openNote = (noteId: string) => {
    uiState.currentNoteId = noteId;
    uiState.noteOpen = true;
  };

  const closeNote = () => {
    uiState.noteOpen = false;
  };
</script>

<div class="md:mx-28">
  <div hidden={uiState.noteOpen}>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-1 p-1 items-start">
      <Collapsible title="Next Actions" bind:open={uiState.nextActionsOpen}>
        <NoteList
          notes={nextActions}
          on:open={(e) => openNote(e.detail.id)}
          on:detailsClick={(e) => (e.detail.meta.list = 'inbox')}
        />
      </Collapsible>
      <Collapsible title="Inbox" bind:open={uiState.inboxOpen}>
        <NoteList
          notes={inbox}
          on:open={(e) => openNote(e.detail.id)}
          on:detailsClick={(e) => (e.detail.meta.list = 'next actions')}
        />
      </Collapsible>
      <form on:submit|preventDefault={addInboxNote} class="col-span-2">
        <input
          class="border-2 border-black p-1 w-full"
          autocomplete="off"
          placeholder="Add to Inbox"
          bind:value={inboxNoteTitle}
        />
      </form>
    </div>
  </div>

  <div hidden={!uiState.noteOpen}>
    <div>
      <button on:click={closeNote}>&lt;</button>
      <input class="border-2 border-black" type="text" bind:value={currentNote.title} />
    </div>
    <pre>{JSON.stringify(currentNote.meta)}</pre>
    <CodeMirror bind:value={currentNote.content} extensions={[markdown()]} theme={githubDark} />
  </div>
</div>
