<script>
	import { goto } from "$app/navigation";
    import Button from "$lib/components/ui/button/button.svelte";
	import { AuthStore } from "$lib/nvr";
	import { toast } from "svelte-sonner";

    const logout = () => {
        AuthStore.set(false);

        toast.info("Logged out!")
        goto("/")
    }
</script>

<nav class="w-screen min-h-16 flex items-center justify-center dark:bg-gray-800 bg-white">
    <div class="container flex items-center justify-between">
        <div class="flex items-center justify-center gap-2">
            <Button variant="ghost" href="/_/">
                <span class="text-3xl">NVR</span>
            </Button>
            <span class="text-sm">Connected to {$AuthStore && $AuthStore.url}</span>
        </div>
        <div class="flex items-center justify-center gap-2">
            <Button variant="secondary" href={"/_/recordings"}>Recordings</Button>
            <Button variant="destructive" onclick={logout}>Logout</Button>
        </div>
    </div>
</nav>

<slot />