<script lang="ts">
	import Debug from '$components/Debug.svelte';

	import { form, field, combined } from 'svelte-forms';
	import { required } from 'svelte-forms/validators';
	import { writable } from 'svelte/store';

	const name = field('name', '');

	let someValueFromExternal = writable('');

	$: $name = $someValueFromExternal; // Doesn't work
</script>

<section class="p-10">
	<h1>Field</h1>

	<input type="text" bind:value={$someValueFromExternal} />

	{$name.value}
</section>

<style>
	section {
	}
	input {
		display: block;
		border: 1px solid gray;
		margin-bottom: 10px;
	}
</style>
