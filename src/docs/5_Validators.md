---
filename: 5_Validators.md
---

## Validators

- validators now need to be called directly, thus providing type safe auto-completion
- validators now return a function that return an object `{ valid: boolean, name: string = 'validator_name' }`

Check [custom validators](#custom-validator) for more info

### required

```typescript
function required() => { valid: boolean, name : 'required' };
```

```typescript
import { field } from 'svelte-forms';
import { required } from 'svelte-forms/validators';

const name = field('name', [required()]);
```

### email

```typescript
function email() => { valid: boolean, name : 'email' };
```

```typescript
import { field } from 'svelte-forms';
import { email } from 'svelte-forms/validators';

const name = field('name', [email()]);
```

### url

```typescript
function url() => { valid: boolean, name : 'url' };
```

```typescript
import { field } from 'svelte-forms';
import { url } from 'svelte-forms/validators';

const name = field('name', [url()]);
```

### min

```typescript
function min(n: number) => { valid: boolean, name : 'min' };
```

```typescript
import { field } from 'svelte-forms';
import { min } from 'svelte-forms/validators';

const name = field('name', [min(3)]);

// also works with numerical value
const age = field('age', 0, [min(18)]);
```

### max

```typescript
function max(n: number) => { valid: boolean, name : 'max' };
```

```typescript
import { field } from 'svelte-forms';
import { max } from 'svelte-forms/validators';

const name = field('name', [max(10)]);

// also works with numerical value
const age = field('age', 0, [max(18)]);
```

### between

```typescript
function between(n: number) => { valid: boolean, name : 'between' };
```

```typescript
import { field } from 'svelte-forms';
import { between } from 'svelte-forms/validators';

const name = field('name', '', [between(3, 10)]);

// equivalent to
const name = field('name', '', [min(3), max(10)]);

// also works with numerical value
const age = field('age', 0, [between(0, 18)]);
```

### matchField

```typescript
function matchField(store: Readable<Field<any>>) => { valid: boolean, name : 'match_field' };
```

```typescript
import { form, field } from 'svelte-forms';
import { matchField } from 'svelte-forms/validators';

const password = field('password', '');
const passwordConfirmation = field('passwordConfirmation', '', [matchField(password)]);
const myForm = form(password, passwordConfirmation);

if ($myForm.hasError('passwordConfirmation.match_field')) {
	alert('password do not match');
}
```

### not

Special validator to inverse the result of the passed validator.

- The returned name will be the name of the passed validator as well, see the next example

```typescript
function not(validator: Validator) => { valid: boolean, name : validation.name };
```

```typescript
import { form, field } from 'svelte-forms';
import { not, between } from 'svelte-forms/validators';

const age = field('age', 0, [not(between(0, 17))]);

const myForm = form(age);

if ($myForm.hasError('age.between')) {
	alert('you should not be between 0 and 18 to access this website');
}
```

### custom validator

A validator is just a function that returns a function `(value: any) => { valid: boolean, name: 'name_of_the_validator' }`. Nothing else.

Of course this validator can be asynchronus and return a promise.

> If your validators takes parameters, they need to be put on the main function and not the returned one

```svelte
<script lang="ts">
  import { field } from 'svelte-forms';

  function checkName() {
    return async (value: string) => {
      const users: any[] = await fetch('https://jsonplaceholder.typicode.com/users').then((r) => r.json());

      return { valid: !users.find((d) => d.name === value), name: 'already_taken' };
    };
  }

  function validatorWithParams(str: string) {
    return (value: string) => ({ valid: value === str, name: 'it_does_not_match' })
  }

  const name = field('name', [checkName(), validatorWithParams('it should match this')])
</script>

<input type="text" bind:value={$name.value} />
```
