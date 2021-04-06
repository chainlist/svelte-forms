# Svelte Forms Validation [![Build Status](https://travis-ci.org/chainlist/svelte-forms.svg?branch=master)](https://travis-ci.org/chainlist/svelte-forms)

## Install

`npm i -D svelte-forms`

or

`yarn add -D svelte-forms`

## Update notes

As of version 1.1.0, the [field validation objects](#fieldValidationObject) are no longer directly located inside of the [form validation object](#formValidationObject) but rather in a sub-property of it (`fields`).

## How to use

### Basic

The `form` function needs a callback that returns a [fields configuration object](#fieldsConfigurationObject).

```html
<script>
  import { form, bindClass } from 'svelte-forms';

  let name = '';

  const myForm = form(() => ({
    name: { value: name, validators: ['required'] }
  }));
</script>

<style>
  :global(input.invalid) {
    border-color: red;
  }
</style>

<form>
  <input type="text" name="name" bind:value={name} use:bindClass={{ form: myForm
  }} />

  <button disabled="{!$myForm.valid}">Login</button>
</form>
```

### Advanced

```html
<script>
  import { form } from 'svelte-forms';

  let name = "";
  let email = "";

  const usernameIsNotTaken = async value =>
    fetch(`https://jsonplaceholder.typicode.com/users?username=${value}`)
      .then(d => d.json())
      .then(d => ({
        name: "usernameIsNotTaken",
        valid: !d.length
      }));

  const loginForm = form(
    () => ({
      name: {
        value: name,
        validators: ["required", "min:6", usernameIsNotTaken]
      },
      email: { value: email, validators: ["required", "email"] }
    }),
    {
      initCheck: true,
      validateOnChange: false,
      stopAtFirstError: false,
      stopAtFirstFieldError: false
    }
  );
</script>

<form>
  <input type="text" bind:value={name} />

  {#if $loginForm.fields.name.errors.includes('required')}
    <p>The name is required</p>
  {/if}

  {#if $loginForm.fields.name.errors.includes('min')}
    <p>The name should be at least 6 characters</p>
  {/if}

  {#if $loginForm.fields.name.pending}
    <p>Checking name availability..</p>
  {/if}

  {#if $loginForm.fields.name.errors.includes('usernameIsNotTaken')}
    <p>This username is already taken</p>
  {/if}

  <input
    type="email"
    bind:value={email}
    class:valid={$loginForm.fields.email.valid} />

  {#if $loginForm.fields.email.errors.includes('email')}
    <p>The email is invalid</p>
  {/if}

  <button on:click|preventDefault={() => loginForm.validate()}>
    Validate form
  </button>
  <button disabled={!$loginForm.valid}>Login</button>
</form>
```

### SSR and SvelteKit

[SvelteKit](https://kit.svelte.dev/docs) is the next iteration avec little brother of [Sapper](https://sapper.svelte.dev/), but `svelte-forms` doesn't work out of the box and a minor configuration change is needed.

In order to be able to use `svelte-forms` with svelte-kit and avoid the infamouse: `Function called outside of component initialization` you will _have_ to disable the `updateOnChange` configuration to `false` and manually launch a validation after each update of your component.
Because your component is mounted server-side & hydrated client-side, this has to be done in `onMount` function.

```html
<script>
  import { onMount, afterUpdate } from 'svelte';
  import { form } from 'svelte-forms';

  let myForm;

  onMount(() => {
    myForm = form(() => ({}), {
      validateOnChange: false
    });
  });

  afterUpdate(() => {
    myForm.validate();
  });
</script>
```

## API

### `form(callback: () => fieldConfigurationObject, config ): StoreObservable`

Creates a new form validator and returns a store observable, thus you can automatically subscribe with the famous `$` reserved token.

The store value represents a [form validation object](#formValidationObject).

As second parameter you can pass a configuration object with the following properties

| property                | description                                                                     |
| ----------------------- | ------------------------------------------------------------------------------- |
| `stopAtFirstError`      | Stops validation after first error encountered. Default: `false`                |
| `stopAtFirstFieldError` | Stops validation after first error encountered per field. Default: `true`       |
| `initCheck`             | Tells the form to validate or not the fields at initialization. Default: `true` |
| `validateOnChange`      | Tells the form to validate after changes to fields. Default: `true`             |

The form comes with a handy functions:

- `validate` that performs a validation on call.
- `reset` that reset the form if needed.

```javascript
const myForm = form(() => ({ name: { value: '', validators: ['required'] } }));

function manualValidation() {
  myForm.validate();
  myForm.reset();
}
```

### `bindClass({ form: StoreObservable, name: string, valid: string = 'valid', invalid: string = 'invalid', dirty: string = 'dirty' })`

> ```html
> <input type="text" name="username" use:bindClass={{ form: loginForm }} />
> <input type="text" use:bindClass={{ form: loginForm, name: "username" }} />
> ```

Automatically adds `valid` or `invalid` and `dirty` (default value) classes to the input:

- Adds `valid` or `invalid` **IF** the form is dirty **AND** every rule is matched.
- Adds `dirty` if field is dirty.

If `bindClass` is used on a DOM node that has an attribute `name`, it will check for this field.
Otherwise you can set the field by setting the `name` parameter.

You can override the classes by passing the parameters `valid` and `invalid`.

> ```html
> <input type="text" use:bindClass={{ form: loginForm, valid: 'ok', invalid:
> 'ko' }} />
> ```

### <a name="fieldsConfigurationObject"></a>Fields configuration Object

The keys of the object represent the name of the fields and their [validator configurations](#validatorConfigurationObject)

```javascript
{ name: { value: name, validators: ['required'], enabled: true, ...data } }
```

### <a name="validatorConfigurationObject"></a>Validator configuration object

| property     | description                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| `value`      | Reference the value to be check                                                                              |
| `validators` | An array representing the validations that need to be performed on the field. See [@validators](#validators) |
| `enabled`    | Boolean defining if the field should be included in the validation process. Default `true`                   |

Additional data may be included here (but has no effect).

### <a name="formValidationObject"></a>Form validation object

| property    | type      | description                                                                                                                                                                                                                                |
| ----------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `valid`     | _boolean_ | If the form is valid or not                                                                                                                                                                                                                |
| `dirty`     | _boolean_ | If any field has a different value than when the form was initialized                                                                                                                                                                      |
| `fields`    | _Object_  | An object where the keys are the names as described in the [fields configuration object](#fieldsConfigurationObject) and their respective [field validation objects](#fieldValidationObject) which represent the current state of the form |
| `oldFields` | _Object_  | An object where the keys are the names as described in the [fields configuration object](#fieldsConfigurationObject) and their respective [field validation objects](#fieldValidationObject) which represent the last state of the form    |

````javascript
let name = '';

const loginForm = form(() => ({
  name: { value: name, validators: ['required', 'min:3'], extraData: '' }
}));

// Form
$loginForm.valid; // false
$loginForm.dirty; // false

// Current state of name field
$loginForm.fields.name.valid; // false
$loginForm.fields.name.pending; // false
$loginForm.fields.name.errors; // ['required', 'min']
$loginForm.fields.name.enabled; // true
$loginForm.fields.name.data; //  { value, validators, extraData }```
````

### <a name="fieldValidationObject"></a>Field validation object

An object that represents a validated field.

| property  | type      | description                                                                          |
| --------- | --------- | ------------------------------------------------------------------------------------ |
| `valid`   | _boolean_ | If the field is valid or not                                                         |
| `errors`  | _Array_   | An array representing the errors name in case if the field is invalid                |
| `pending` | _boolean_ | If there are any async validators, will be true until all of them have been resolved |
| `enabled` | _boolean_ | If the field is enabled or not                                                       |
| `data`    | _object_  | The validator configuration object                                                   |

## <a name="validators"></a>Validators

### between `"between:numberA:numberB"`

> ```javascript
> { validators: ['between:3:16'] }`
> ```

If the value is a number, checks the number is between `numberA` and `numberB`

If the value is a string, checks the string length is between `numberA` and `numberB`

### email `"email"`

> ```javascript
> { validators: ['email'] }`
> ```

Check the value is an email

### equal `"equal:number"`

> ```javascript
> { validators: ['equal:42'] }`
> ```

If the value is a number, checks the number is equal to `number`

If the value is a string, checks the string length is equal to `number`

### min `"min:number"`

> ```javascript
> { validators: ['min:42'] }`
> ```

If the value is a number, checks the number is greater than `number`

If the value is a string, checks the string length is greater than `number`

### max `"max:number"`

> ```javascript
> { validators: ['max:42'] }`
> ```

If the value is a number, checks the number is lesser than `number`

If the value is a string, checks the string length is lesser than `number`

### required `"required"`

> ```javascript
> { validators: ['required'] }`
> ```

Mark the field as required

### url `"url"`

> ```javascript
> { validators: ['url'] }`
> ```

Check the value is an URL

### Custom validator

If you want to use your own validator, you can pass a function, it will receive the value to be checked as parameter.

It must return an object as follow: `{ valid: boolean, name: string }`

`valid`: describes if the condition is matched
`name`: the name of the validator in case of failure

```javascript
const empty = value => ({ valid: value === '', name: 'empty' });

{
  name: {
    value: name,
    validators: [empty]
  }
}
```

You can of course mix regular validators and custom validators.

### Async validator

Nothing more to do, just mark your function as `async` or return a `Promise`.

`svelte-forms` will handle things for you.

In addition, there will be a `pending` property inside the field validation object telling if the validator has been resolved or is still pending.

## TODO

- Testing
- Examples
