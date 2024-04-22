<script lang="ts">
	import { AuthStore, MakeNVRRequest } from '$lib/nvr';
	import type { DateValue } from '@internationalized/date';

	import { onDestroy, onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	import videojs from 'video.js';
	import 'video.js/dist/video-js.css';

    import "videojs-playlist";

	import 'videojs-playlist-ui';
    import 'videojs-playlist-ui/dist/videojs-playlist-ui.css'

	interface Props {
		date: DateValue;
		camera: string;
	}

	let { date, camera }: Props = $props();

	let rawRecordingFiles: string[] = $state([]);
	let recordingFiles = $derived.by(() => {
		return rawRecordingFiles.map((file: string) => {
			if ($AuthStore) {
				return {
					sources: [
						{
							src: `${$AuthStore.url}/recordings/${date.year}/${date.month.toString().padStart(2, '0')}/${date.day.toString().padStart(2, '0')}/${camera}/${file}`,
							type: 'video/mp4'
						}
					],
					name: file
				};
			}
		});
	});

	onMount(async () => {
		if (!$AuthStore) {
			console.error('No auth!');
			return;
		}

		try {
			let res = await MakeNVRRequest(
				`${$AuthStore.url}/recordings/${date.year}/${date.month.toString().padStart(2, '0')}/${date.day.toString().padStart(2, '0')}/${camera}`,
				$AuthStore.username,
				$AuthStore.password
			);

			if (res) {
				rawRecordingFiles = res;
				rawRecordingFiles.sort();

				let videoPlayer = videojs('myVideoPlayer');
                
                // @ts-ignore
                videoPlayer.playlist(recordingFiles);
                
                // @ts-ignore
                videoPlayer.playlist.autoadvance(0);

                // @ts-ignore
                videoPlayer.playlistUi();
			}
		} catch (err) {
			console.error(err);
			rawRecordingFiles = [];
			toast.error('Failed to fetch recordings.');
		}
	});

	onDestroy(() => {
		if (videojs.getPlayer("myVideoPlayer")) {
			videojs.getPlayer("myVideoPlayer").dispose();
		}
	});
</script>

<style>
    :global(.vjs-playlist) {
        @apply  rounded-xl h-[70vh] w-72;
    }

    :global(.vjs-playlist-item-list) {
        @apply flex flex-col;
    }

    :global(.vjs-playlist .vjs-playlist-now-playing-text) {
        @apply m-0
    }
    
    :global(.vjs-playlist .vjs-playlist-title-container) {
        @apply p-0
    }

    :global(.vjs-playlist .vjs-up-next-text) {
        @apply h-0 overflow-hidden
    }

    :global(.vjs-playlist-vertical .vjs-playlist-thumbnail-placeholder) {
        @apply h-12
    }
</style>


<div class="container flex flex-col gap-2 pb-20">
	<!-- svelte-ignore a11y-media-has-caption -->
    <div class="flex">
        <div class="vjs-playlist"></div>
        <video id="myVideoPlayer" class="video-js vjs-default-skin h-[70vh] w-full" controls preload="auto"></video>
    </div>
</div>
