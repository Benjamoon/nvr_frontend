<script>
    import "../app.pcss";
    import { Toaster } from "$lib/components/ui/sonner";
    import NvrNavBar from "$lib/nvr-components/NVRNavBar.svelte";
    import { navigating } from "$app/stores";
    import { fade } from "svelte/transition";
</script>

<Toaster richColors={true} />

{#if Boolean($navigating)}
    <div class="fixed w-full h-full z-10" in:fade={{ duration: 150 }}>
        <div
            class="absolute w-full h-full bg-white dark:bg-slate-700 opacity-50 z-10"
        ></div>
        <div
            class="absolute w-full h-full flex justify-center items-center z-20"
        >
            Loading...
        </div>
    </div>
{/if}

<NvrNavBar />
<slot />
