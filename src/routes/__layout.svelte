<script lang="ts">
	import { setContext } from 'svelte';
	import kebab from 'lodash.kebabcase';

	import '../app.css';

	const docs = [
		import('../docs/1_Install.md'),
		import('../docs/2_Examples.md'),
		import('../docs/3_Form.md'),
		import('../docs/4_Field.md'),
		import('../docs/5_Config.md'),
		import('../docs/6_Contribute.md')
	];

	setContext('docs', docs);
	const cssBuffer = 'pl-0 pl-2 pl-4 pl-8';
</script>

<nav class="bg-gray-300 pt-32 pb-10 pl-10 fixed top-0 w-96 h-full">
	<ul>
		{#each docs as asyncDoc}
			{#await asyncDoc then doc}
				{#each doc.toc as toc}
					<li class:main-link={toc.level == 2} class:sub-link={toc.level != 2}>
						<a href="#{kebab(toc.content)}" rel="external">{toc.content}</a>
					</li>
				{/each}
			{/await}
		{/each}
	</ul>
</nav>

<div id="content" class="pl-96 pt-32 pb-24">
	<slot />
</div>
