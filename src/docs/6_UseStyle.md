---
filename: 6_UseStyle.md
---

## use:style

```typescript
function style({ field: store: Readable<Field<any>>, valid = "valid", invalid = "invalid", dirty = "dirty" });
```

`use:style` will help you to **automaticaly** set the class of your HTML field to `valid` or `invalid` only if the field is `dirty`.

You can of course override the class names by setting your own.

You will need to use to `:global()` CSS keyword to customize to look of those classes.

```svelte
<script>
  import { field, style } from 'svelte-forms';

  const name = field('name');
</script>

<input text="text" use:style={{ field: name }}>
<input text="text" use:style={{ field: name, valid: "foo", invalid: "bar" }}>

<style>
  input {
    outline: none;
  }

  :global(.invalid), :global(.bar) {
    border: 1px solid red;
  }

  :global(.valid), :global(.foo) {
    border: 1px solid green;
  }

  :global(.dirty) {
    border: 1px dashed black;
  }
</style>
```
