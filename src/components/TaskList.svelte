<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import TaskPreview from './TaskPreview.svelte';

	import type { StoredTask } from './types';
	import { taskIdsPendingRemoval, taskPreview } from './TaskStorage';
	import TaskCancelPopup from './TaskCancelPopup.svelte';
	import { fade } from 'svelte/transition';

	let { tasks, removeTaskCallback }: { tasks: StoredTask[]; removeTaskCallback: (id: string) => void } = $props();

	const popupDuration = 5000;
</script>

{#each tasks as task}
	{#if !$taskIdsPendingRemoval.has(task.id)}
		<div
			class="flex items-center justify-between hover:bg-gray-200 dark:hover:bg-gray-800 px-2 py-2 rounded-md cursor-pointer"
			role="button"
			tabindex="0"
			onclick={() => taskPreview.set(task)}
			onkeydown={(e) => e.key === 'Enter' && taskPreview.set(task)}
			in:fade
		>
			<div class="flex-auto justify-between {task.done ? 'line-through opacity-50' : ''}">
				<h2
					class="text-xl font-bold text-p dark:text-gray-100"
					style="display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;"
				>
					{task.title}
				</h2>
				<p
					class="text-gray-500 dark:text-gray-400"
					style="display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis;"
				>
					{task.body}
				</p>
			</div>
			<!-- Button + Icon -->
			<div class="flex items-center">
				<!-- Button -->
				<button
					class="
				disabled:opacity-50 p-1 mx-2
				inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium
				text-gray-800 hover:text-gray-600 dark:text-gray-200 dark:hover:text-gray-300
				1bg-red-500
				"
					onclick={(e) => {
						e.stopPropagation();
						task.done = !task.done;
					}}
				>
					Done
				</button>
				<!-- Icon -->
				<button
					class="inline-flex items-center justify-center rounded-md text-sm font-medium text-gray-800 hover:text-gray-700 dark:text-gray-200 dark:hover:text-gray-300 hover:translate-y-0.5"
					onclick={(e) => {
						e.stopPropagation();
						// if ($taskIdPendingRemoval != '') {
						// 	window.clearTimeout(timer as number);
						// 	removeTaskCallback($taskIdPendingRemoval);
						// }
						let timer = window.setTimeout(() => {
							removeTaskCallback(task.id);
							$taskIdsPendingRemoval.delete(task.id);
							$taskIdsPendingRemoval = $taskIdsPendingRemoval;
						}, popupDuration);
						$taskIdsPendingRemoval.set(task.id, timer);
						$taskIdsPendingRemoval = $taskIdsPendingRemoval;
					}}
					aria-label="Delete task"
				>
					<svg class="w-6" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m19 7-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"
						/>
					</svg>
				</button>
			</div>
		</div>
	{/if}
{/each}

{#each $taskIdsPendingRemoval as [id, timer] (id)}
	<TaskCancelPopup
		duration={popupDuration}
		cancelCallback={() => {
			window.clearTimeout(timer as number);
			$taskIdsPendingRemoval.delete(id);
			$taskIdsPendingRemoval = $taskIdsPendingRemoval;
		}}
	/>
{/each}
