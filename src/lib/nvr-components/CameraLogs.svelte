<script>
    import { CredentialsStore } from "$lib/stores";
    import { onDestroy, onMount } from "svelte";
    import { toast } from "svelte-sonner";

    let { camera_name } = $props()

    let logs = $state()
    let interval = 0;

    onMount(()=>{
        interval = setInterval(async ()=>{
            if ($CredentialsStore) {
                let address = `${$CredentialsStore.url}/cameras/${camera_name}?rand=${Math.random()}`

                let res = await fetch(address, {
                    headers: {
                        ["Authorization"]: `Basic ${window.btoa($CredentialsStore.username + ":" + $CredentialsStore.password)}`
                    }
                })

                // Logs arent soper important so tis okay
                if (res.status != 200) {
                    return;
                }

                const json = await res.json()

                logs = json.logs
            }
        }, 1000)
    })

    onDestroy(()=>{
        clearInterval(interval)
    })

</script>

{#if $CredentialsStore}
    <!-- <iframe bind:this={iframe} on:load={iframe_loaded} src={`${$CredentialsStore.url}/cameras/${camera_name}/live`} title={`${camera_name}`} /> -->
    <div class="flex gap-1 flex-col-reverse">
        {#each logs as log}
            <span>{log}</span>
        {/each}
    </div>
{/if}