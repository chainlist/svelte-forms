<script lang="ts">
	import { field } from '$lib/field';
	import { form } from '$lib/form';
	import { required } from '$lib/validators/required';
	import { url } from '$lib/validators/url';

	function pwd(value: string) {
		return { valid: value === 'pwd', name: 'pwd' };
	}

	async function checkName(value: string) {
		const users: any[] = await fetch('https://jsonplaceholder.typicode.com/users').then((r) =>
			r.json()
		);

		return { valid: !users.find((d) => d.name === value), name: 'already_taken' };
	}

	const name = field('name', '', [required, url]);

	const myForm = form(name);
</script>

<h1>Svelte store test</h1>

<div>{JSON.stringify($myForm)}</div>

<label for="name">
	Name:
	<input type="text" id="name" bind:value={$name.value} />

	{#if $myForm.hasError('name.required')}
		<div>Name is required</div>
	{/if}

	<button on:click={() => name.validate()}>Validate name</button>

	<pre>{JSON.stringify($name, null, 2)}</pre>
</label>
