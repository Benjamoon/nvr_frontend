<script lang="ts">
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';

	import { cn } from '$lib/utils.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import { onMount } from 'svelte';
	import { AuthStore, MakeNVRRequest, type CameraData } from '$lib/nvr';
	import { goto } from '$app/navigation';

    import RenderRecording from "./RenderRecording.svelte"

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let selectedDate: DateValue | undefined = $state(undefined);

	let cameras: CameraData[] = $state([]);

	let formattedCamerasForPicker = $derived.by(() => {
		return cameras.map((value) => {
			return {
				value: value.name,
				label: value.name
			};
		});
	});

	let selectedCameraPopoverOpen = $state(false);
	let selectedCamera: CameraData | undefined = undefined;
	let selectedCameraValue = $state('');
	let selectedCameraLabel = $derived(
		formattedCamerasForPicker.find((f) => f.value === selectedCameraValue)?.label ??
			'Select a camera...'
	);

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		selectedCameraPopoverOpen = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	onMount(async () => {
		try {
			if ($AuthStore) {
				let res = await MakeNVRRequest(
					`${$AuthStore.url}/cameras`,
					$AuthStore.username,
					$AuthStore.password
				);

				cameras = res;
			} else {
				goto('/');
			}
		} catch (err) {
			console.error(err);
			cameras = [];
		}
	});
</script>

<div class="container mx-auto p-3 lg:p-10">
	<div class="flex w-full items-center justify-between md:flex-row flex-col gap-4">
		<h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 md:text-4xl">
			Recordings
		</h1>

		<div class="flex gap-2">
			<!-- Date picker -->
			<Popover.Root>
				<Popover.Trigger asChild let:builder>
					<Button
						variant="outline"
						class={cn(
							'w-[280px] justify-start text-left font-normal',
							!selectedDate && 'text-muted-foreground'
						)}
						builders={[builder]}
					>
						<CalendarIcon class="mr-2 h-4 w-4" />
						{selectedDate ? df.format(selectedDate.toDate(getLocalTimeZone())) : 'Pick a date'}
					</Button>
				</Popover.Trigger>
				<Popover.Content class="w-auto p-0">
					<Calendar bind:value={selectedDate} initialFocus />
				</Popover.Content>
			</Popover.Root>

			<!-- Camera Picker -->
			<Popover.Root bind:open={selectedCameraPopoverOpen} let:ids>
				<Popover.Trigger asChild let:builder>
					<Button
						builders={[builder]}
						variant="outline"
						role="combobox"
						aria-expanded={selectedCameraPopoverOpen}
						class="w-[200px] justify-between"
					>
						{selectedCameraLabel}
						<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</Popover.Trigger>
				<Popover.Content class="w-[200px] p-0">
					<Command.Root>
						<Command.Input placeholder="Search cameras..." />
						<Command.Empty>No camera found.</Command.Empty>
						<Command.Group>
							{#each formattedCamerasForPicker as camera}
								<Command.Item
									value={camera.value}
									onSelect={(currentValue: string) => {
										selectedCameraValue = currentValue;
										closeAndFocusTrigger(ids.trigger);
									}}
								>
									<Check
										class={cn('mr-2 h-4 w-4', selectedCameraValue !== camera.value && 'text-transparent')}
									/>
									{camera.label}
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.Root>
				</Popover.Content>
			</Popover.Root>
		</div>
	</div>

	<div class="min-h-[80vh] w-full pt-10">
		{#if !selectedDate || !selectedCameraValue}
			<div class="flex h-full w-full items-center justify-center text-3xl">
				Select a date and camera to view...
			</div>
		{:else}
            {#key selectedDate}
                {#key selectedCameraValue}
                    <RenderRecording date={selectedDate} camera={selectedCameraValue} />
                {/key}
            {/key}
        {/if}
	</div>
</div>
