<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import type { StoredTask } from '../components/types';
	// import Overlay from 'svelte-overlay';
	type Props = {
		task: StoredTask;
		onclick: () => void;
	};
	let { task, onclick }: Props = $props();

	let isEditing = $state(false);

	let editingTitle = $state(task.title);
	let editingBody = $state(task.body);

	const toggleEdit = () => {
		isEditing = !isEditing;
	};

	const saveEdit = () => {
		task.title = editingTitle;
		task.body = editingBody;
		isEditing = false;
	};
	function clamp(number, min, max) {
		return Math.max(min, Math.min(number, max));
	}
</script>

<div
	out:fade={{ duration: 70 }}
	class="fixed w-screen max-h-screen top-0 left-0 z-10 inset-0 bg-black bg-opacity-50 flex items-center justify-center"
	role="dialog"
	aria-modal="true"
	aria-label="Task preview"
	{onclick}
	onkeydown={(e) => e.key === 'Escape' && onclick()}
	tabindex="0"
>
	<div
		in:fly={{ y: 20, duration: 100 }}
		role="tablist"
		class="bg-white dark:bg-gray-800 text-black dark:text-gray-100 p-8 rounded-md shadow-md max-w-2xl w-11/12 overflow-y-auto"
		style={`max-height: 80vh`}
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => e.stopPropagation()}
		tabindex="0"
	>
		<div class="flex justify-between items-center ">
			<h2 class="text-2xl font-bold text-p p-2 dark:text-gray-100">{task.title}</h2>
			<div class="flex gap-2">
				<button onclick={toggleEdit} class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
					{isEditing ? 'Cancel' : 'Edit'}
				</button>
				<button {onclick} class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"> Close </button>
			</div>
		</div>
		<!-- <hr /> -->
		<div class="mt-2 p-2">
			{#if isEditing}
				<textarea
					bind:value={editingBody}
					style={`height: ${clamp(editingBody.split(/\r?\n/).length * 20, 300, 600)}px`}
					class="w-full p-2 mt-2 rounded bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 resize-y overflow-y-auto"
				></textarea>
				<button onclick={saveEdit} class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2"> Save </button>
			{:else}
				<p class="whitespace-pre-wrap mt-4">{task.body}</p>
			{/if}
		</div>
	</div>
</div>
