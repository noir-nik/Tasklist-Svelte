<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let { duration, cancelCallback }: { duration: number; cancelCallback: () => void } = $props();

	let progress: number = $state(1.0);
	let interval: number;

	const step = 20;

	onMount(() => {
		interval = window.setInterval(() => {
			console.log('1', progress);
			progress -= 1 / (duration / step);
			if (progress <= 0) {
				window.clearInterval(interval);
			}
		}, step);
	});
</script>

<div class="fixed bottom-10 right-0 left-0 flex justify-center bg-red-6001">
	<div class="max-w-4xl w-full px-4 bg-green-6001 flex justify-end">
		<div class="px-4 mx-4 w-full max-w-xs bg-gray-800 rounded-full h-9 text-white flex items-center justify-between" in:fade = {{ duration: 100 }}>
			<span class="">Task deleted</span>
			<div class="flex items-center">
				<div class="text-gray-800">
					<svg height="16" width="16" viewBox="0 0 20 20">
						<circle
							r="5"
							cx="10"
							cy="10"
							fill="transparent"
							stroke="white"
							transform="rotate(-90) translate(-20)"
							stroke-width="10"
							stroke-dasharray="{progress * 31.4} 31.4"
						/>
						<circle r="8" cx="10" cy="10" fill="currentColor" />
					</svg>
				</div>
				<button
					class="cursor-pointer hover:underline px-2"
					onclick={() => {
						window.clearInterval(interval);
						cancelCallback();
					}}
				>
					Cancel
				</button>
			</div>
		</div>
	</div>
</div>

<!-- <PieTimer value={progress} /> -->
