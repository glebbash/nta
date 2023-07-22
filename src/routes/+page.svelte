<script lang="ts">
	import { getDataStore } from '$lib/store';

	const { data } = getDataStore();

	let newTodo = '';

	const addNote = () => {
		const value = newTodo && newTodo.trim();
		if (!value) {
			return;
		}

		$data.notes.push({ title: value, content: '', meta: { list: 'inbox' } });
		newTodo = '';
	};

	$: nextActions = $data.notes.filter((node) => node.meta.list === 'next actions');
	$: inbox = $data.notes.filter((note) => note.meta.list === 'inbox');
</script>

<main>
	<h2>Next Actions</h2>
	<ul>
		{#each nextActions as note}
			<li>
				<a href="/" on:click|preventDefault={() => (note.meta.list = 'inbox')}>{note.title}</a><br
				/>
			</li>
		{/each}
	</ul>
	<h2>Inbox</h2>
	<ul>
		{#each inbox as note}
			<li>
				<a href="/" on:click|preventDefault={() => (note.meta.list = 'next actions')}
					>{note.title}</a
				><br />
			</li>
		{/each}
	</ul>
	<form on:submit|preventDefault={addNote}>
		<input autocomplete="off" placeholder="..." bind:value={newTodo} />
	</form>
</main>
