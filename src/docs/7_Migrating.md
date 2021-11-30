---
filename: 7_Migrating.md
---

## migrate from v1

### form initialization

```typescript
/// v1
import { form } from 'svelte-forms';

const myForm = form(() => {
  return {
    name: { value: '', validators: ['required', 'max:2'] }
  }
}));

// v2
import { form, field } from 'svelte-forms';
import { required, max } from 'svelte-forms/validators';

const name = field('name', '', [required(), max(2)]);
const myForm(name);
```

### use:bindClass

- `bindClass` is renamed `style`
- use `field` instead of `form` as now the validation is made per field

```svelte

<!-- V1 -->
<!-- const myForm = form(...); -->
<input type="text" use:bindClass={{ form: myForm, field: 'name' }}>

<!-- V2 -->
<!-- const name = field('name', ''); -->
<input type="text" use:style={{ field: name }}>

```

### validators

- validators are now to be called directly, thus providing type safe auto-completion
- validators now return a function that return an object `{ valid: boolean, name: string = 'validator_name' }`

```typescript
// V1
function max(value: any, args: any[]) {
	const maxValue = parseFloat(args[0]);
	const value = isNaN(val) ? val.length : parseFloat(val);

	return value <= maxValue;
}

// V2
function max(n: number) {
	return (value: any) => {
		const val = isNaN(value) ? value.length : parseFloat(value);

		return { valid: !isNaN(value) || val <= n, name: 'max' };
	};
}
```
