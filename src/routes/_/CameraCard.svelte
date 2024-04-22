<script lang="ts">
	import { AuthStore, MakeNVRRequest, extractFirstFPSFromLogArray } from '$lib/nvr';
	import { onDestroy, onMount } from 'svelte';
	import { fade, scale } from 'svelte/transition';

	let { cameraName, logs }: { cameraName: string, logs: string[] } = $props();

	let imageSrc = $state('');
	let showModal = $state(false);

	let interval = 0;

	onMount(() => {
		interval = setInterval(async () => {
			try {
				if ($AuthStore) {
					URL.revokeObjectURL(imageSrc);
					let res = await MakeNVRRequest(
						`${$AuthStore.url}/cameras/${encodeURIComponent(cameraName)}/live`,
						$AuthStore.username,
						$AuthStore.password,
                        "blob"
					);
					imageSrc = URL.createObjectURL(res);
					console.log(imageSrc);
				}
			} catch (err) {
				console.error(err);
				imageSrc = '';
			}

            console.log(logs)
		}, 1000);
	});

	onDestroy(() => {
		URL.revokeObjectURL(imageSrc);
		clearInterval(interval);
	});

    function toggleModal() {
        showModal = !showModal;
    }
</script>

{#snippet CheckIcon()}
	<svg
		class="h-4 w-4 text-green-400"
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<polyline points="20 6 9 17 4 12" />
	</svg>
{/snippet}

{#snippet XIcon()}
	<svg
		class="h-4 w-4 text-red-400"
		xmlns="http://www.w3.org/2000/svg"
		width="24"
		height="24"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path d="M18 6 6 18" />
		<path d="m6 6 12 12" />
	</svg>
{/snippet}

<button class="text-start overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800" onclick={toggleModal}>
	<div class="relative aspect-video">
		{#if imageSrc}
			<img
				alt={cameraName}
				class="aspect-auto h-full w-full object-cover"
				height={300}
				src={imageSrc}
				width={400}
			/>
		{:else}
			<div class="aspect-video h-full w-full bg-gray-950"></div>
		{/if}
	</div>
	<div class="p-4">
		<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{cameraName}</h3>
		<div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
			{#if imageSrc}
				{@render CheckIcon()}
				<span>Online - {extractFirstFPSFromLogArray(logs)} FPS (encoding)</span>
			{:else}
				{@render XIcon()}
				<span>Offline</span>
			{/if}
		</div>
	</div>
</button>

{#if showModal}
    <button class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onclick={toggleModal} transition:fade>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <img src={imageSrc} alt={cameraName} class="max-w-full max-h-full cursor-default" transition:scale onclick={(e)=>{e.stopPropagation()}} />
    </button>
{/if}