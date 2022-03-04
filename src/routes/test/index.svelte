<script>
	import { form, field } from 'svelte-forms';
	import { min, pattern, required } from 'svelte-forms/validators';

	const name = field('name', 'Default value', [required(), pattern(/\d+/)]);
	const myForm = form(name);
</script>

<section>
	<input type="text" bind:value={$name.value} />

	<button on:click={myForm.clear}>Clear</button>
	<button on:click={myForm.reset}>Reset</button>
	<button disabled={!$myForm.valid}>Send form</button>
</section>

<pre>
	{JSON.stringify($name, null, 2)}
</pre>

<pre>
	{JSON.stringify($myForm, null, 2)}
</pre>

<style>
	input {
		padding: 5px 10px;
		border: 1px solid black;
	}
</style>
