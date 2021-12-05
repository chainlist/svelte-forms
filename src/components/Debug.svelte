<script lang="ts">
	import type { Field } from '$lib/createFieldStore';
	import type { Readable } from 'svelte/store';
	import { slide } from 'svelte/transition';

	export let field: Readable<Field<any>>;

	let open = false;

	$: if (!$field.errors?.length) {
		open = false;
	} else {
		open = true;
	}

	const cssBuffer = 'bg-green-200 bg-red-200 bg-yellow-200 border-red-500';
</script>

<div class="font-mono" on:click={() => (open = !open)}>
	<span
		class="p-2 inline-block rounded-lg transition-colors duration-200 border-2 border-dashed border-transparent"
		class:bg-green-200={$field.valid}
		class:bg-red-200={$field.invalid}
		class:bg-yellow-200={$field.pending}
		class:border-red-500={$field.dirty}
	>
		{$field.name ?? 'form'}<span>{$field.errors.length ? `(${$field.errors.length})` : ''}</span>
	</span>

	{#if open}
		<div transition:slide={{ duration: 200 }}>
			{$field.errors?.join(', ')}
		</div>
	{/if}
</div>

<style>
</style>
