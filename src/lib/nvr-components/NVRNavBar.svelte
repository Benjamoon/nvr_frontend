<script>
    import Button from "$lib/components/ui/button/button.svelte";
    import {CredentialsStore} from "$lib/stores"
</script>

<div class="h-20 container mx-auto flex items-center justify-between">
    <div>
        <Button href="/">
            <span class="text-3xl">NVR</span>
        </Button>
        {#if $CredentialsStore}
            <span class="text-sm">Connected to {$CredentialsStore.url} as {$CredentialsStore.username}</span>
        {:else}
            <span class="text-sm">Disconnected</span>
        {/if}
    </div>
    <div class="flex items-center justify-center gap-2">
        <Button href="/recordings">
            View Recordings
        </Button>
        <Button variant="destructive" on:click={()=>{
            $CredentialsStore = false
        }}>
            Logout
        </Button>
    </div>
</div>