<script>
	import { form, field } from 'svelte-forms';
	import { required, matchField, not, between } from 'svelte-forms/validators';

	const password = field('password', '', [required()]);
	const confirmation = field('password_confirmation', '', [matchField(password)]);

	const age = field('age', 0, [not(between(0, 17))]);

	const myForm = form(password, confirmation, age);
</script>

<section class="p-10">
	<input type="text" bind:value={$password.value} />
	<input type="text" bind:value={$confirmation.value} />
	<input type="number" bind:value={$age.value} />

	{#if $myForm.hasError('password_confirmation.match_field')}
		<p>Password don't match</p>
	{/if}

	{#if $myForm.hasError('age.between')}
		<p>should be between</p>
	{/if}

	{JSON.stringify($myForm)}
	<br />
	<button on:click={password.reset}>Reset name</button>
	<button on:click={confirmation.reset}>Reset password</button>
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
