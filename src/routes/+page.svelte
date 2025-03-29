<script lang="ts">
	import { onMount } from 'svelte';
	import TaskForm from '../components/TaskForm.svelte';
	import TaskList from '../components/TaskList.svelte';
	import type { StoredTask, Task } from '../components/types';
	import TaskPreview from '../components/TaskPreview.svelte';
	import { taskIdsPendingRemoval, taskPreview } from '../components/TaskStorage';

	let title = 'Todo list';

	let bIsDarkMode = $state(false);

	let icon = $derived(bIsDarkMode ? '☀️' : '🌙');

	const toggleDarkMode = () => {
		document.documentElement.classList.toggle('dark');
		bIsDarkMode = !bIsDarkMode;
		icon = bIsDarkMode ? '☀️' : '🌙';
	};

	onMount(() => {
		bIsDarkMode = document.documentElement.classList.contains('dark');
	});

	let tasks = $state<StoredTask[]>([]);

	const calcStatistics = (tasks: StoredTask[]) => {
		let total = /* $derived */ tasks.length;
		let done = /* $derived */ 0;
		tasks.forEach((task) => {
			if (task.done) {
				done += 1;
			}
		});

		for (const [id, _] of $taskIdsPendingRemoval) {
			total -= 1;
			const task = tasks.find((task) => task.id === id);

			// task?.done && (done -= 1);
			if (task?.done) {
				done -= 1;
			}
		}

		const percentage = Math.round((done / total) * 100);
		return { total, undone: total - done, done, percentage };
	};

	const stats = $derived(calcStatistics(tasks));

	const fetchTasks = async () => {
		const response = await fetch('https://jsonplaceholder.typicode.com/todos' + '?_limit=5');
		const json = await response.json();

		const makeTitle = (task: { title: string }) => {
			const truncated = task.title.slice(0, 20);
			return truncated.length === task.title.length ? truncated : `${truncated}...`;
		};

		tasks = json.map((task: { userId: number; id: number; title: string; completed: boolean }) => ({
			title: makeTitle({ title: task.title }),
			body: task.title,
			id: task.id,
			createdAt: Date.now(),
			done: task.completed,
		}));
	};

	onMount(fetchTasks);

	const addTask = (task: Task) => {
		console.log(task);
		tasks.push({
			...task,
			id: crypto.randomUUID(),
			createdAt: Date.now(),
			done: false,
		});
	};
</script>

<main class="max-w-4xl mx-auto">
	<div class=" p-6 space-y-4">
		<div class="flex items-center justify-between my-4">
			<h1 class="text-3xl font-bold text-p dark:text-gray-100">{title}</h1>
			<button class="float-right text-2xl" name="Toggle dark mode" onclick={toggleDarkMode}>{icon}</button>
		</div>
		<TaskForm {addTask} />
		<hr />
		<div>
			<h2 class="text-2xl font-bold px-2 dark:text-gray-100">Tasks</h2>
			<p class="text-gray-500 dark:text-gray-400 px-2">You have {stats.undone > 0 ? stats.undone : 'no'} task{stats.undone != 1 ? 's' : ''} to do</p>
		</div>
		<section>
			<TaskList {tasks} removeTaskCallback={(id: string) => (tasks = tasks.filter((task) => task.id !== id))}></TaskList>
			<!-- <TaskList {tasks} removeTaskCallback={(id: string) => {}}></TaskList> -->
		</section>
		{#if $taskPreview}
			<TaskPreview task={$taskPreview as StoredTask} onclick={() => ($taskPreview = null)}></TaskPreview>
		{/if}
	</div>
</main>
