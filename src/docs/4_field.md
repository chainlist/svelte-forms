---
filename: 4_Field.md
---

## field

```typescript
function field<T>(
	name: string,
	value: T,
	validators: Validator[] = [],
	options: FieldOptions = defaultOptions
);
```

`field()` returns a writable store and is a convenient function to create a new form input that will serve a your input controller.

You can directly use the store to set the field value programatically if you need to.

```typescript
import { field } from 'svete-forms';
import { get } from 'svelte/store';

const name = field('name', '');

// Prefered method to set value programatically
name.set('New value');
// or
$name = 'New value';

// You can also do that
const fieldObj = get(name);
fieldObject.value = 'New value';

name.set(fieldObj);
// or
$name = fieldObj;

// All cases work
```

### functions

In addition there is two different functions that can be called on the store:

- `reset()` which resets the field itself
- `validate()` which launches a validation on itself
- `setDirty(dirty: boolean)` which allows manually setting a field as clean or dirty when necessary

### options

```typescript
type FieldOptions = {
	valid: boolean; // default: true. Determines if the field is valid or not by default
	checkOnInit: boolean; // default: false. Launches a validation when the input is first rendered
	validateOnChange: boolean; // default: true. Launches a validations every time the input changes
	stopAtFirstError: boolean; // default: false. Stop checking for others validators if one fails
};
```

> There is no global form options to setup. Only per field options

### example

```svelte
<script>
  import { form, field } from 'svelte-forms';
  import { required } from 'svelte-forms/validators';

  const name = field('name', '', [required()], {
    validateOnChange: false
  });
  const myForm = form(name);
</script>

<section>
  <input type="text" bind:value={$name.value}>

  {#if $myForm.hasError('name.required')}
    <div>Name is required</div>
  {/if}

  <button on:click={name.validate}>Validate field</button>
</section>
```
