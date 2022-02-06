---
filename: 5_Combined.md
---

## combined

```typescript
export function combined(
	name: string,
	fields: Field[],
	reducer: (fields: Field[]) => T,
	validators: Validator[] = [],
	options: FieldOptions = defaultFieldOptions
): Readable<Field<T>>;
```

`combined()` returns a readable store that is somewhat considered as a `field` that combines multiple fields together to have a single output.

- Any binded field will pass their errors prefixed with the field name.

```typescript
const firstname = field('firstname', '', [required()]);
const lastname = field('lastname', '', [required()]);
const fullname = combined('fullname', [firstname, lastname], ([firstname, lastname]) => [firstname.value, lastname.value].join(' '));

const myForm(firstname, lastname, fullname);

firstname.validate();
lastname.validate();

// fullname.errors will contain the following error ['firstname.required', 'lastname.required']
```

- You can also pass some validators to that function as well. These validators will get the reduced value that comes from your custom function as the 3rd argument.

### functions

> combined create an object that is strictly **reactive**. Thus we cannot interact with it through functions calls

### options

```typescript
type CombinedOptions = {
	stopAtFirstError: boolean; // default: false. Stop checking for others validators if one fails
};
// Only available for validators that are set for that field. Not for the binded fields.
```

### example

```svelte
<script>
  import { form, field, combined } from 'svelte-forms';
  import { required } from 'svelte-forms/validators';

  const firstname = field('firstname', '', [required()]);
  const lastname = field('lastname', '', [required()]);
  const fullname = combined('fullname', [firstname, lastname], ([firstname, lastname]) => [firstname.value, lastname.value].join(' '));

  const myForm = form(fullname);
</script>

<section>
  <input type="text" bind:value={$firstname.value}>
  <input type="text" bind:value={$lastname.value}>

  {#if $myForm.hasError('firstname.required')}
    <div>Firstname is required</div>
  {/if}

  {#if $myForm.hasError('lastname.required')}
    <div>Lastname is required</div>
  {/if}

  <div>Welcome {$fullname.value}</div>

  <button on:click={fullname.validate}>Validate field</button>
</section>
```
