<script>
    import AuthWrapper from "$lib/nvr-components/AuthWrapper.svelte";
    import CameraLiveView from "$lib/nvr-components/CameraLiveView.svelte";
    import CameraLogs from "$lib/nvr-components/CameraLogs.svelte";
    import CameraObjectWrapper from "$lib/nvr-components/CameraObjectWrapper.svelte";
    import { CamerasStore } from "$lib/stores";
</script>

<AuthWrapper>
    <CameraObjectWrapper>
        {#if $CamerasStore}
            <!-- Camera logs -->
            <span class="text-3xl">Full Logs</span>
            <div class="">
                {#each $CamerasStore as camera}
                    <div class="flex flex-col gap-2 justify-between border">
                        <span class="text-3xl">{camera.name} Logs</span>
                        <CameraLogs camera_name={camera.name} />
                    </div>
                {/each}
            </div>
        {/if}
    </CameraObjectWrapper>
</AuthWrapper>
