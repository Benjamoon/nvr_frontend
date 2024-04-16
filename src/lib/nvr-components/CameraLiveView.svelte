<script>
    import { CredentialsStore } from "$lib/stores";
    import { onDestroy, onMount } from "svelte";
    import { toast } from "svelte-sonner";

    let { camera_name } = $props()

    let image = $state()
    let interval = 0;

    onMount(()=>{
        interval = setInterval(async ()=>{
            if ($CredentialsStore) {
                let address = `${$CredentialsStore.url}/cameras/${camera_name}/live?rand=${Math.random()}`

                let res = await fetch(address, {
                    headers: {
                        ["Authorization"]: `Basic ${window.btoa($CredentialsStore.username + ":" + $CredentialsStore.password)}`
                    }
                })

                if (res.status != 200) {
                    $CredentialsStore = false;

                    toast.error("Failed to get live view. Assuming incorrect credentials. Logged Out.")
                    return;
                }

                const blob = await res.blob();
                const objectUrl = URL.createObjectURL(blob);

                image.src = objectUrl
            }
        }, 1000)
    })

    onDestroy(()=>{
        clearInterval(interval)
    })

</script>

{#if $CredentialsStore}
    <!-- <iframe bind:this={iframe} on:load={iframe_loaded} src={`${$CredentialsStore.url}/cameras/${camera_name}/live`} title={`${camera_name}`} /> -->
    <img class="max-w-full" bind:this={image} alt="live view" />
{/if}