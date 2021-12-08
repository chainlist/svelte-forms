<script lang="ts">
	import Debug from '$components/Debug.svelte';

	import { form, field, combined } from 'svelte-forms';
	import { required } from 'svelte-forms/validators';

	function name() {
		return async (value: string) => {
			const users = (await fetch('https://jsonplaceholder.typicode.com/users').then((r) =>
				r.json()
			)) as any[];
			const exists = (v: string) => !!users.find((u) => u.username === value);

			return { valid: !exists(value), name: 'check_name' };
		};
	}

	const newMax = (n: string) => {
		return (v: string) => {
			return { valid: v !== n, name: 'newMax' };
		};
	};

	const firstname = field('firstname', '', [required(), name()]);
	const lastname = field('lastname', '', [required()]);
	const fullname = combined(
		'fullname',
		[firstname, lastname],
		([f, l]) => [f.value, l.value].join(' '),
		[newMax('kevin guillouard')]
	);

	const myForm = form(firstname, lastname, fullname);
</script>

<section class="p-10">
	<input type="text" bind:value={$firstname.value} />
	<input type="text" bind:value={$lastname.value} />

	<div class="flex flex-col gap-4">
		<Debug field={firstname} />
		<Debug field={lastname} />
		<Debug field={fullname} />
	</div>

	<h1>Welcome {$fullname.value}</h1>

	<br />
	<div class="space-x-3">
		<button on:click={firstname.reset}>Reset name</button>
		<button on:click={lastname.reset}>Reset password</button>
		<button on:click={myForm.reset}>Reset form</button>
		<button on:click={myForm.validate}>Validate form</button>
	</div>
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
