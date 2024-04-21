<script>
    import Label from "$lib/components/ui/label/label.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
	import { AuthStore, MakeNVRRequest, getRootUrl } from "$lib/nvr";
	import { toast } from "svelte-sonner";
	import { goto } from "$app/navigation";

	let url = $state("")
	let username = $state("")
	let password = $state("")

	const attemptAuth = async ()=>{
		url = getRootUrl(url)

		try {
			let res = await MakeNVRRequest(`${url}/cameras`, username, password)
			console.log(res)
			toast.success("Logged in!")

			AuthStore.set({
				url: url,
				password: password,
				username: username
			})

			goto("/_/")
		} catch {
			toast.error("Incorrect credentials!")
		}
	}
</script>

<div class="flex h-screen w-full items-center justify-center ">
	<div class="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
		<div class="space-y-2 text-center">
			<h1 class="text-3xl font-bold">NVR Login</h1>
			<p class="text-gray-500 dark:text-gray-400">
				Enter your credentials to access the NVR system.
			</p>
		</div>
		<form class="space-y-4" onsubmit={attemptAuth}>
			<div>
				<Label for="nvr-url">NVR URL</Label>
				<Input bind:value={url} id="nvr-url" placeholder="https://nvr.example.com" required type="text" />
			</div>
			<div>
				<Label for="username">Username</Label>
				<Input bind:value={username} id="username" placeholder="johndoe" required type="text" />
			</div>
			<div>
				<Label for="password">Password</Label>
				<Input bind:value={password} id="password" required type="password" />
			</div>
			<Button class="w-full" type="submit">Login</Button>
		</form>
	</div>
</div>
