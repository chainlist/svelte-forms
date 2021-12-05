<script lang="ts">
	import { form, field, combined } from 'svelte-forms';
	import { required, matchField, not, between, min, max } from 'svelte-forms/validators';

	function name() {
		return async (value: string) => {
			const users = (await fetch('https://jsonplaceholder.typicode.com/users').then((r) =>
				r.json()
			)) as any[];
			const exists = (v: string) => !!users.find((u) => u.username === value);

			return { valid: !exists(value), name: 'check_name' };
		};
	}

	const firstname = field('firstname', '', [required(), name()]);
	const lastname = field('lastname', '', [required()]);
	const fullname = combined('fullname', [firstname, lastname], ([f, l]) => f.value + ' ' + l.value);

	const myForm = form(firstname, lastname, fullname);
</script>

<section class="p-10">
	<input type="text" bind:value={$firstname.value} />
	<input type="text" bind:value={$lastname.value} />

	<div class="flex flex-col gap-4">
		<span>{JSON.stringify($firstname)}</span>
		<span>{JSON.stringify($lastname)}</span>
		<span>{JSON.stringify($fullname)}</span>
		<span>{JSON.stringify($myForm)}</span>
	</div>

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
