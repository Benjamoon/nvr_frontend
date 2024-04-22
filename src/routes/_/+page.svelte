<script lang="ts">
	import { onMount } from 'svelte';
	import CameraCard from './CameraCard.svelte';
	import { AuthStore, MakeNVRRequest } from '$lib/nvr';

    interface CameraData {
        name: string,
        logs: string[]
    }

	let cameras: CameraData[] = [];

	onMount(async () => {
		try {
			if ($AuthStore) {
				let res = await MakeNVRRequest(
					`${$AuthStore.url}/cameras`,
					$AuthStore.username,
					$AuthStore.password
				);

                cameras = res
                console.log(cameras)
			}
		} catch (err) {
			console.error(err);
            cameras = []
		}
	});
</script>

<main class="min-h-[93vh] w-[100vw] bg-gray-100 py-10 dark:bg-gray-900">
	<div class="container mx-auto px-1 md:px-6">
		<div class="flex flex-col gap-8 md:gap-12">
			<div class="grid gap-4 md:gap-6">
				<h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 md:text-4xl">
					Your cameras
				</h1>
			</div>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
                {#each cameras as camera}
				    <CameraCard cameraName={camera.name} logs={camera.logs} />
                {/each}
			</div>
		</div>
	</div>
</main>
