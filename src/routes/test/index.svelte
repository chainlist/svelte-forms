<script>
	import { form, field } from 'svelte-forms';
	import { required } from 'svelte-forms/validators';

	const name = field('name', '', [required()]);
	const password = field('password', 'my_password', [required()]);
	const myForm = form(name, password);
</script>

<section>
	<input type="text" bind:value={$name.value} />
	<input type="password" bind:value={$password.value} />

	<button on:click={name.reset}>Reset name</button>
	<button on:click={password.reset}>Reset password</button>
	<button on:click={myForm.reset}>Reset form</button>
</section>
