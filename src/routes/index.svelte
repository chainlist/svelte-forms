<script lang="ts">
	import { browser } from '$app/env';
	import { getContext, onMount } from 'svelte';
	import 'prismjs/themes/prism.css';

	async function loadPrism() {
		const Prism = await import('prismjs');
		await import('prismjs/components/prism-bash');
		await import('prismjs/components/prism-typescript');
		await import('prismjs/plugins/toolbar/prism-toolbar');
		await import('prismjs/plugins/normalize-whitespace/prism-normalize-whitespace');
		await import('prism-svelte');

		return Prism;
	}

	onMount(async () => {
		if (browser) {
			const Prism = await loadPrism();
			Prism.highlightAll();
		}
	});

	const docs = getContext('docs') as Promise<any>[];
</script>

<section class="px-20 space-y-32">
	<h1>svelte-forms documentation</h1>
	{#each docs as asyncDoc}
		{#await asyncDoc then doc}
			<section class="space-y-7 relative group">
				<a
					href="https://github.com/chainlist/svelte-forms/edit/master/src/docs/{doc.attributes
						.filename}"
					class="absolute top-5 right-5 text-gray-600 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200"
				>
					edit documentation
				</a>
				{@html doc.html}
			</section>
		{/await}
	{/each}
</section>
