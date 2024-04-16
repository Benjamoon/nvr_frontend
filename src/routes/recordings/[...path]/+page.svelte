<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import { onMount } from "svelte";

    let { data } = $props();
    let objectUrl = $derived.by(()=>{
        if (data.files instanceof Blob) {
            return URL.createObjectURL(data.files);
        }

        return ""
    })
</script>

<div class="flex items-center justify-center flex-wrap gap-2">
    {#if data.files instanceof Blob}
        <!-- svelte-ignore a11y-media-has-caption -->
        <video controls autoplay>
            <source src={objectUrl} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
    {:else}
        {#each data.files as file}
            <Button href={`${data.currentPath}/${file}`}>
                {file}
            </Button>
        {/each}
    {/if}
</div>
