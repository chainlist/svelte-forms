<script lang="ts">
	import { browser } from '$app/env';
	import { onMount } from 'svelte';
	import 'prismjs/themes/prism.css';

	import { html } from '../docs/Install.md';

	async function loadPrism() {
		const Prism = await import('prismjs');
		await import('prismjs/components/prism-bash');
		await import('prismjs/components/prism-typescript');
		await import('prismjs/plugins/toolbar/prism-toolbar');
		await import('prismjs/plugins/normalize-whitespace/prism-normalize-whitespace');
		await import('prism-svelte');
		Prism.manual = true;

		return Prism;
	}

	onMount(async () => {
		if (browser) {
			const Prism = await loadPrism();
			Prism.highlightAll();
		}
	});
</script>

<section class="px-20">
	{@html html}
</section>
