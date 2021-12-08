<script lang="ts">
	import { setContext } from 'svelte';
	import { scale } from 'svelte/transition';
	import kebab from 'lodash.kebabcase';
	import UAParser from 'ua-parser-js';
	import Icon from 'svelte-awesome';
	import { bars, close } from 'svelte-awesome/icons';
	import '../app.css';

	const device = new UAParser().getDevice().type || 'desktop';
	let open = device === 'desktop';

	const docs = [
		import('../docs/1_Install.md'),
		import('../docs/2_Examples.md'),
		import('../docs/3_Form.md'),
		import('../docs/4_Field.md'),
		import('../docs/5_Combined.md'),
		import('../docs/6_Validators.md'),
		import('../docs/7_UseStyle.md'),
		import('../docs/8_Migrating.md'),
		import('../docs/9_Contribute.md')
	];

	setContext('docs', docs);
	const cssBuffer = 'pl-0 pl-2 pl-4 pl-8 border-t-0 border-r-0 border-t-1';

	function toggle() {
		if (device === 'mobile') {
			open = !open;
		}
	}
</script>

<svelte:head>
	<title>svelte-forms: Forms validation made easy</title>
</svelte:head>

<button
	on:click={() => (open = !open)}
	class="fixed bottom-5 p-4 left-2 rounded-md sm:hidden z-50 bg-white border-l-1 border-b-1 border-gray-200 text-gray-70000 flex items-center"
	class:border-t-0={open}
	class:border-r-0={open}
	class:border-t-1={!open}
	class:border-r-1={!open}
>
	{#if open}
		<Icon data={close} scale={1.25} />
	{:else}
		<Icon data={bars} />
	{/if}
</button>

{#if open}
	<nav
		class="pt-32 pb-20 pl-24 sm:pl-10 fixed top-4 left-2 bottom-5 sm:pb-10 right-2 border-1 sm:border-0 border-gray-200 bg-white rounded-xl sm:bg-gray-300 sm:sm:rounded-none sm:top-0 sm:left-0 sm:right-0 sm:w-96 sm:h-full overflow-auto z-40 origin-bottom-left"
		in:scale={{ duration: 300 }}
		out:scale={{ duration: 300 }}
		on:click={toggle}
	>
		<ul>
			{#each docs as asyncDoc}
				{#await asyncDoc then doc}
					{#each doc.toc as toc}
						<li class:main-link={toc.level == 2} class:sub-link={toc.level != 2}>
							<a class="hover:underline" href="#{kebab(toc.content)}" rel="external"
								>{toc.content}</a
							>
						</li>
					{/each}
				{/await}
			{/each}
		</ul>
	</nav>
{/if}

<div id="content" class="pl-0 pt-10 sm:pl-96 sm:pt-32 pb-24">
	<slot />
</div>
