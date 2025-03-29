<script lang="ts">
	let titlePlaceholder = 'Enter title';
	let bodyPlaceholder = 'Enter description';
	let title = $state('');
	let body = $state('');

	let { addTask } = $props();

	const onSubmit = () => {
		if (title && body) {
			addTask({ title, body });
			title = '';
			body = '';
		}
	};
</script>

<form class="flex flex-col rounded">
	<div class="flex-1">
		<input autocomplete="off" name="title" type="text" bind:value={title} placeholder="{titlePlaceholder}" class="w-full p-2 rounded mb-2 bg-white dark:bg-gray-800 border-none">
		<textarea autocomplete="off" name="body" bind:value={body} placeholder={bodyPlaceholder} class="w-full p-2 rounded bg-white dark:bg-gray-800 stroke-pink-800 resize-none overflow-hidden" rows={Math.max(body.split(/\r?\n/).length, 5)}></textarea>
	</div>
	<div>
		<button onclick={onSubmit} class="bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-2 px-5 rounded mt-1 float-right
		shadow-md">Add</button>
	</div>
</form>

