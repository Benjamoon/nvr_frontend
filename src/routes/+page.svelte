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
            <!-- Camera Live View Grid -->
            <div class="w-full h-screen grid grid-cols-1 lg:grid-cols-2">
                {#each $CamerasStore as camera}
                    <div>
                        <CameraLiveView camera_name={camera.name} />
                    </div>
                {/each}
            </div>
        {/if}
    </CameraObjectWrapper>
</AuthWrapper>
