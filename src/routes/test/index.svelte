<script>
	import { form, field } from 'svelte-forms';
	import { required, matchField } from 'svelte-forms/validators';

	const password = field('password', '', [required()]);
	const confirmation = field('password_confirmation', '', [matchField(password)]);
	const myForm = form(password, confirmation);
</script>

<section>
	<input type="text" bind:value={$password.value} />
	<input type="text" bind:value={$confirmation.value} />

	{#if $myForm.hasError('password_confirmation.match_field')}
		<p>Password don't match</p>
	{/if}

	<button on:click={password.reset}>Reset name</button>
	<button on:click={confirmation.reset}>Reset password</button>
	<button on:click={myForm.reset}>Reset form</button>
</section>
