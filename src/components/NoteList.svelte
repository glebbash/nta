<script lang="ts">
  import type { Note } from '$lib';
  import { createEventDispatcher } from 'svelte';

  export let notes: Note[];

  const dispath = createEventDispatcher<{ open: Note; detailsClick: Note }>();
</script>

<ul class="ml-3">
  {#each notes as note}
    <li>
      <a href="/" on:click|preventDefault={() => dispath('open', note)}>
        {note.title}
      </a>
      <button
        class="border-2 border-black px-2 rounded-full"
        on:click={() => dispath('detailsClick', note)}
      >
        ->
      </button>
    </li>
  {:else}
    Empty
  {/each}
</ul>
