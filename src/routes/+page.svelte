<script lang="ts">
	import type { Todo } from '$lib';
	import { getDataStore } from '$lib/store';

	const { svelteStore } = getDataStore();

	let newTodo = '';

	const addTodo = () => {
		const value = newTodo && newTodo.trim();

		if (!value) {
			return;
		}
		$svelteStore.todos.push({
			title: value,
			completed: false
		});
		newTodo = '';
	};

	const removeTodo = (todo: Todo) => {
		$svelteStore.todos.splice($svelteStore.todos.indexOf(todo), 1);
	};
</script>

<main>
	<h1>Todo Svelte</h1>
	<form on:submit|preventDefault={addTodo}>
		<input autocomplete="off" placeholder="What needs to be done?" bind:value={newTodo} />
	</form>
	<ul>
		{#each $svelteStore.todos as todo}
			<li>
				<div>
					<label>
						<input type="checkbox" bind:checked={todo.completed} />
						{todo.title}
					</label>
					<button on:click={() => removeTodo(todo)}>Delete</button>
				</div>
			</li>
		{/each}
	</ul>
</main>
