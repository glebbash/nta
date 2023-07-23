<script lang="ts">
  import { getDataStore } from '$lib/store';

  const { data } = getDataStore();

  $: nextActions = $data.notes.filter((node) => node.meta.list === 'next actions');
  $: inbox = $data.notes.filter((note) => note.meta.list === 'inbox');

  let inboxInput = '';
  const addToInbox = () => {
    const value = inboxInput && inboxInput.trim();
    if (!value) {
      return;
    }

    $data.notes.push({ title: value, content: '', meta: { list: 'inbox' } });
    inboxInput = '';
  };
</script>

<main>
  <details bind:open={$data.uiState.nextActionsOpen}>
    <summary>Next Actions</summary>
    <ul>
      {#each nextActions as note}
        <li>
          <a href="/" on:click|preventDefault={() => (note.meta.list = 'inbox')}>{note.title}</a><br
          />
        </li>
      {/each}
    </ul>
  </details>
  <details bind:open={$data.uiState.inboxOpen}>
    <summary>Inbox</summary>
    <ul>
      {#each inbox as note}
        <li>
          <a href="/" on:click|preventDefault={() => (note.meta.list = 'next actions')}
            >{note.title}</a
          ><br />
        </li>
      {/each}
    </ul>
  </details>
  <form on:submit|preventDefault={addToInbox}>
    <input autocomplete="off" placeholder="..." bind:value={inboxInput} />
  </form>
  <pre>{JSON.stringify($data, null, 2)}</pre>
</main>
