# INSTALL

To install `svelte-forms` do one of the following commands:

```bash
npm install svelte-forms@2.0
```

```bash
pnpm add svelte-forms@2.0
```

```bash
yarn add svelte-forms@2.0
```

```svelte
<script>
  import { form, field } from 'svelte-forms';
  import { required } from 'svlete-forms/validators';

  const name = field('name', [required()]);
  const myForm = form(name);
</script>;


<section>
  <input type="text" bind:value={$name.value} />

  <button disabled={!$form.valid}>Send form</button>
</section>
```
