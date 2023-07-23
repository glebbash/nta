<script lang="ts">
  import { getDataStore } from '$lib/store';
  import CodeMirror from 'svelte-codemirror-editor';
  import { markdown } from '@codemirror/lang-markdown';
  import { githubDark } from '@uiw/codemirror-theme-github';

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

<div class="row">
  <div class="col col-12" hidden={$data.uiState.noteOpen}>
    <div class="paper container padding-small">
      <details class="margin-small" bind:open={$data.uiState.nextActionsOpen}>
        <summary style="user-select: none;">Next Actions</summary>
        <ul>
          {#each nextActions as note}
            <li>
              <a href="/" on:click|preventDefault={() => openNote(note.id)}>
                {note.title}
              </a>
              <button class="badge margin-left-small" on:click={() => (note.meta.list = 'inbox')}>
                . . .
              </button>
            </li>
          {:else}
            Empty
          {/each}
        </ul>
      </details>
      <details class="margin-small" bind:open={$data.uiState.inboxOpen}>
        <summary style="user-select: none;">Inbox</summary>
        <ul>
          {#each inbox as note}
            <li>
              <a href="/" on:click|preventDefault={() => openNote(note.id)}>
                {note.title}
              </a>
              <button
                class="badge margin-left-small"
                on:click={() => (note.meta.list = 'next actions')}
              >
                . . .
              </button>
            </li>
          {:else}
            Empty
          {/each}
        </ul>
      </details>
      <form on:submit|preventDefault={addToInbox}>
        <input
          class="margin-small"
          autocomplete="off"
          placeholder=". . ."
          bind:value={inboxInput}
        />
      </form>
      <details class="margin-small">
        <summary style="user-select: none;">Data</summary>
        <pre>{JSON.stringify($data, null, 2)}</pre>
      </details>
    </div>
  </div>
  <div class="col col-12" hidden={!$data.uiState.noteOpen}>
    <div class="paper container padding-small">
      <div class="row">
        <button class="col col-2" on:click={closeNote}>&lt;</button>
        <input class="col col-10" type="text" bind:value={currentNote.title} />
      </div>
      <pre class="margin-bottom-small">{JSON.stringify(currentNote.meta)}</pre>
      <div style="all:unset;">
        <CodeMirror bind:value={currentNote.content} extensions={[markdown()]} theme={githubDark} />
      </div>
    </div>
  </div>
</div>

<style>
  :global(html) {
    background-color: black;
  }
</style>
