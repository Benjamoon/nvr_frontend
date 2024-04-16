<script>
    import { onMount } from "svelte";
    import { CamerasStore, CredentialsStore } from "../stores";
    import { toast } from "svelte-sonner";

    onMount(async ()=>{
        // Cant get the cameras without credentials...
        if ($CredentialsStore == false) {
            return
        }

        // We already have the cameras!
        if ($CamerasStore) {
            return
        }

        let res = await fetch(`${$CredentialsStore.url}/cameras`, {
            headers: {
                ["Authorization"]: `Basic ${window.btoa($CredentialsStore.username + ":" + $CredentialsStore.password)}`,
            },
        });

        // Assuming bad credentials!
        if (res.status != 200) {
            toast.error("Failed to GET /cameras. Logging out")
            $CredentialsStore = false
            return
        }

        let json = await res.json()

        CamerasStore.set(json)
    })
</script>

{#if $CamerasStore != false}
    <slot />
{:else}
    Loading Cameras...
{/if}