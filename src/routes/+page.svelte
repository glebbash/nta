<script lang="ts">
  import CodeMirror from 'svelte-codemirror-editor';
  import { markdown } from '@codemirror/lang-markdown';
  import { githubDark } from '@uiw/codemirror-theme-github';

  import { getDataStore } from '$lib/store';
  import Collapsible from '../components/collapsible.svelte';

  const { data } = getDataStore();

  $: nextActions = $data.notes.filter((node) => node.meta.list === 'next actions');
  $: inbox = $data.notes.filter((note) => note.meta.list === 'inbox');

  let inboxInput = '';
  const addToInbox = () => {
    const value = inboxInput && inboxInput.trim();
    if (!value) {
      return;
    }

    $data.notes.push({
      id: crypto.randomUUID(),
      title: value,
      content: '',
      meta: { list: 'inbox' },
    });
    inboxInput = '';
  };

  $: currentNote = $data.notes.find((note) => note.id === $data.uiState.currentNoteId) ?? {
    title: '',
    content: '',
    meta: {},
  };
  const openNote = (noteId: string) => {
    $data.uiState.currentNoteId = noteId;
    $data.uiState.noteOpen = true;
  };
  const closeNote = () => {
    $data.uiState.noteOpen = false;
  };
</script>

<div>
  <div hidden={$data.uiState.noteOpen}>
    <div>
      <details bind:open={$data.uiState.nextActionsOpen}>
        <summary class="select-none">Next Actions</summary>
        <ul>
          {#each nextActions as note}
            <li>
              <a href="/" on:click|preventDefault={() => openNote(note.id)}>
                {note.title}
              </a>
              <button on:click={() => (note.meta.list = 'inbox')}> . . . </button>
            </li>
          {:else}
            Empty
          {/each}
        </ul>
      </details>
      <details bind:open={$data.uiState.inboxOpen}>
        <summary class="select-none">Inbox</summary>
        <ul>
          {#each inbox as note}
            <li>
              <a href="/" on:click|preventDefault={() => openNote(note.id)}>
                {note.title}
              </a>
              <button on:click={() => (note.meta.list = 'next actions')}> . . . </button>
            </li>
          {:else}
            Empty
          {/each}
        </ul>
      </details>
      <form on:submit|preventDefault={addToInbox}>
        <input autocomplete="off" placeholder=". . ." bind:value={inboxInput} />
      </form>
      <Collapsible title="Data">
        <pre>{JSON.stringify($data, null, 2)}</pre>
      </Collapsible>
    </div>
  </div>
  <div hidden={!$data.uiState.noteOpen}>
    <div>
      <div>
        <button on:click={closeNote}>&lt;</button>
        <input type="text" bind:value={currentNote.title} />
      </div>
      <pre>{JSON.stringify(currentNote.meta)}</pre>
      <CodeMirror bind:value={currentNote.content} extensions={[markdown()]} theme={githubDark} />
    </div>
  </div>
</div>
