<script>
	import { form, field } from 'svelte-forms';
	import { min, pattern, required } from 'svelte-forms/validators';

	const name = field('name', '', [required(), pattern(/\d+/)]);
	const myForm = form(name);
</script>

<section>
	<input type="text" bind:value={$name.value} />

	{JSON.stringify(name, null, 2)}

	<button disabled={!$myForm.valid}>Send form</button>
</section>

<pre>
	{JSON.stringify($name, null, 2)}
</pre>

<pre>
	{JSON.stringify($myForm, null, 2)}
</pre>
