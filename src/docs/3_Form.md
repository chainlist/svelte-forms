---
filename: 3_Form.md
---

## form

```typescript
function form(...fields: Writable<Field<any>>[]) => Readable<{
  dirty: boolean;
  valid: boolean;
  errors: string[];
  hasError: (s: string) => boolean
}>
```

`form(...fields)` returns a store and is a convenient function to bind all your `field` all together and reflect their internal state.

### functions

In addition there is two different functions that can be called on the store:

- `reset()` which resets all the binded `field`
- `validate()` which launches a manual validation of all the binded `field`
- `getField(name: string): Writable<Field<any>>` which returns a previously binded `field`. Useful when you pass your form around components.

### hasError

> There is also the method `hasError(s: string)` that can be called.
> It is a method because it is not binded to the store directly but on its content.
> You will then need to use the `$` in front of your variable to access the method `hasError`

```svelte
<script>
  myForm.hasError('name.required'); // will throw an error "hasError is not a function"
  $myForm.hasError('name.required'); // will work
</script>
```

### example

```svelte
<script>
  import { form, field } from 'svelte-forms';
  import { required } from 'svelte-forms/validators';

  const name = field('name', '', [required()]);
  const myForm = form(name);
</script>

<section>
  <input type="text" bind:value={$name.value}>

  {#if $myForm.hasError('name.required')}
    <div>Name is required</div>
  {/if}
</section>
```
