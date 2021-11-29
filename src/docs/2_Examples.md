---
filename: 2_Examples.md
---

## some examples

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
