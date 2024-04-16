<script>
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { CredentialsStore } from "$lib/stores";
    import { toast } from "svelte-sonner";
    import { goto } from "$app/navigation";

    let url = $state("http://localhost:8000");
    let username = $state("");
    let password = $state("");

    const attemptLogin = async () => {
        // Check the URL
        try {
            new URL(url);
        } catch {
            toast.error("Invalid URL.");
            return false;
        }

        // Check username
        if (username == "") {
            toast.error("Invalid Username");
            return false;
        }

        // Check password
        if (password == "") {
            toast.error("Invalid Password");
            return false;
        }

        // Try getting /cameras
        let res = await fetch(`${url}/cameras`, {
            headers: {
                ["Authorization"]: `Basic ${window.btoa(username + ":" + password)}`,
            },
        });

        if (res.status != 200) {
            toast.error("Invalid Credentials!");
            return;
        }

        CredentialsStore.set({
            username,
            password,
            url: url,
        });

        toast.success("Logged in!")
    };
</script>

{#if $CredentialsStore == false}
    <div
        class="container mx-auto mt-20 text-center flex flex-col items-center justify-center"
    >
        <span class="text-3xl">You are not logged in!</span>
        <span class="text-xl"
            >Please authenticate with an NVR server to continue.</span
        >

        <div class="max-w-4xl p-3 flex flex-col gap-3">
            <div class="flex flex-col items-start gap-2 w-full">
                <Label>NVR Url</Label>
                <Input bind:value={url} />
            </div>

            <div class="flex flex-col items-start gap-2 w-full">
                <Label>Username</Label>
                <Input bind:value={username} />
            </div>

            <div class="flex flex-col items-start gap-2 w-full">
                <Label>Password</Label>
                <Input type="password" bind:value={password} />
            </div>

            <Button on:click={attemptLogin}>Login</Button>
        </div>
    </div>
{:else}
    <slot />
{/if}
