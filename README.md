# Svelte Forms Validation [![Build Status](https://travis-ci.org/chainlist/svelte-forms.svg?branch=master)](https://travis-ci.org/chainlist/svelte-forms)

## Install

`npm i -D svelte-forms`

or

`yarn add -D svelte-forms`

## How to use

### Basic

```html
<script>
  import { form } from 'svelte-forms';

  let name = "";

  const myForm = form(() => ({
    name: { value: name, validators: ["required", "min:6"]},
  }));
</script>

<form>
  <input type="text" bind:value={value} use:bindClass={{ form: myForm }}/>

  {#if $myForm.name.errors.includes('required') }
    <p>The name is required</p>
  {/if}
  
  {#if $myForm.name.errors.includes('min') }
    <p>The name should be at least 6 characters</p>
  {/if}
  <button bind:disabled={!$myForm.valid}>Login</button>
</form>
```

### Advanced

The form function takes a callback that returns a [fields configuration](#fieldsConfigurationObject) object.
```html
<script>
  import { form } from 'svelte-forms';

  let name = "";
  let email = "";

  const usernameIsTaken = async function(value) {
    return fetch('https://jsonplaceholder.typicode.com/users?username='+value)
    .then(d => d.json())
    .then(d => {
      return { rule: 'usernameIsTaken', valid: !d.length};
    });
  }

  const loginForm = form(() => ({
    name: { value: name, validators: ["required", "min:6"]},
    email: { value: email, validators: ["required", "email"]}
  }));
</script>

<form>
  <input type="text" bind:value={value}/>
  <input type="email" class:valid={$loginForm.email.valid}/>

  {#if $loginForm.email.errors.includes('email') }
    <p>The email is invalid</p>
  {/if}

  {#if $loginForm.name.errors.includes('min') }
    <p>The name should be at least 6 characters</p>
  {/if}

  <button bind:disabled={!$loginForm.valid}>Login</button>
</form>
```

## API

### `form(callback: () => fieldConfigurationObject, { stopAtFirstError: boolean } ): StoreObservable`

Creates a new form validator and returns a store observable, thus you can automatically subscribe with the famous `$` reserved token.

The store value represent a [fields validation object](#formValidationObject)

As second parameter you can pass an object with the following properties

* `stopAtFirstError: boolean`: If you have many validators on a field, it will stop and do not check the remaining validators at the first failure. Default is `true`

### `bindClass({ form: StoreObservable, , name: string, valid: string = 'valid', invalid: string = 'invalid' })`

> ```html
> <input type="text" name="username" use:bindClass={{ form: loginForm }} />
> <input type="text" use:bindClass={{ form: loginForm, name: "username" }} />
> ```

Automatically adds `valid` or `invalid` (default value) classes to the input **IF**
the form is dirty **AND** every rules are matched.

If `bindClass` is use on a DOM node that has an attribute `name`, it will check for this field.
Otherwise you can set the field by setting the `name` parameter.

You can override the classes by passing the parameters `valid` and `invalid`.

> ```html
> <input type="text" use:bindClass={{ form: loginForm, valid: 'ok', invalid: 'ko' }} />
> ```

## <a name="fieldsConfigurationObject"></a>Fields configuration Object

The keys of the object represent the name of the fields and their [validator configurations](#validatorConfigurationObject)

```javascript
{ name: { value: name, validators: ['requred'] } }
```

## <a name="validatorConfigurationObject"></a>Validator configuration object

| property   | description                                                                  |
|------------|------------------------------------------------------------------------------|
| `value`      | Reference the value to be check                                              |
| `validators` | An array representing the validations that need to be performed on the field. See [@validators](#validators) |

## <a name="formValidationObject"></a>Form validation object

They keys of the object represent the name of the fields as described in the [fields configuration object](#fieldsConfigurationObject) and the following properties

| property | type    | description                                                                                              |
|----------|---------|----------------------------------------------------------------------------------------------------------|
| `valid`    | *boolean* | If the field is valid or not                                                                             |
| `errors`   | *Array*   | An array representing the errors name in case if the field is invalid                                    |
| `pending`  | *boolean* | If one of the validator is an async function, pending will be true until the validator has been resolved |

In addition there are 2 reserved properties: `valid` and `dirty`.


```javascript
let name = "";
const loginForm = form(() => ({
  name: { value: name, validators: ['required', 'min:3']}
}));

$loginForm.valid; // if every field are valid
$loginForm.dirty; // if at least one of the fields has been modified
$loginForm.name.valid;
$loginForm.name.pending;
$loginForm.name.errors; // ['required', 'min']
```

# <a name="validators"></a>Validators

## between `"between:numberA:numberB"`

> ```javascript
> { validators: ["between:3:16"] }`
> ```

If the value is a number, checks the number is between `numberA` and `numberB`

If the value is a string, checks the string length is between `numberA` and `numberB`

## email `"email"`

> ```javascript
> { validators: ["email"] }`
> ```

Check the value is an email

## equal `"equal:number"`

> ```javascript
> { validators: ["equal:42"] }`
> ```

If the value is a number, checks the number is equal to `number`

If the value is a string, checks the string length is equal to `number`

## min `"min:number"`

> ```javascript
> { validators: ["min:42"] }`
> ```

If the value is a number, checks the number is greater than `number`

If the value is a string, checks the string length is greater than `number`

## max `"max:number"`

> ```javascript
> { validators: ["max:42"] }`
> ```

If the value is a number, checks the number is lesser than `number`

If the value is a string, checks the string length is lesser than `number`

## required `"required"`

> ```javascript
> { validators: ["required"] }`
> ```

Mark the field as required

## url `"url"`

> ```javascript
> { validators: ["url"] }`
>```

Check the value is an URL

## Custom validator

If you want to use your own validator, you can pass a function, it will receive the value to be checked as parameter.

You must returned an object as follow: `{ valid: boolean, name: string }`

`valid`: describes if the condition is matched
`name`: the name of the validator in case of failure

```javascript
const foobar = value => ({ valid: value === "toto", name: "foorbar" });

{
  name: {
    value: name,
    validators: [foorbar]
  }
}
```

You can of course mix regular validators and custom validators.

## Async validator

Nothing more to do, just mark your function as `async` or return a `Promise`.

`svelte-forms` will handle the things for you.

In addition, there will be a `pending` property inside the field validation object telling if the validator has been done or is till pending.


## TODO

* Testing
* Examples
