<script>
	import { form, field, combined } from 'svelte-forms';
	import { required, matchField, not, between, min, max } from 'svelte-forms/validators';

	const firstname = field('firstname', '');
	const lastname = field('lastname', '', [required()]);
	const fullname = combined(
		'fullname',
		[firstname, lastname],
		([f, l]) => f.value + ' ' + l.value,
		[max(10)]
	);

	const myForm = form(firstname, lastname, fullname);
</script>

<section class="p-10">
	<input type="text" bind:value={$firstname.value} />
	<input type="text" bind:value={$lastname.value} />

	{JSON.stringify($myForm)}

	<h1>Welcome {$fullname.value}</h1>

	<br />
	<button on:click={firstname.reset}>Reset name</button>
	<button on:click={lastname.reset}>Reset password</button>
	<button on:click={myForm.reset}>Reset form</button>
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
