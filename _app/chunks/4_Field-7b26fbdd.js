const e={filename:"4_Field.md"},t=`<h2 id="field" tabindex="-1">field</h2>
<pre><code class="language-typescript">function field&lt;T&gt;(
	name: string,
	value: T,
	validators: Validator[] = [],
	options: FieldOptions = defaultOptions
);
</code></pre>
<p><code>field()</code> returns a writable store and is a convenient function to create a new form input that will serve a your input controller.</p>
<p>You can directly use the store to set the field value programatically if you need to.</p>
<pre><code class="language-typescript">import { field } from 'svete-forms';
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
</code></pre>
<h3 id="functions" tabindex="-1">functions</h3>
<p>In addition there is two different functions that can be called on the store:</p>
<ul>
<li><code>reset()</code> which resets the field itself</li>
<li><code>validate()</code> which launches a validation on itself</li>
</ul>
<h3 id="options" tabindex="-1">options</h3>
<pre><code class="language-typescript">type FieldOptions = {
	valid: boolean; // default: true. Determines if the field is valid or not by default
	checkOnInit: boolean; // default: false. Launches a validation when the input is first rendered
	validateOnChange: boolean; // default: true. Launches a validations every time the input changes
	stopAtFirstError: boolean; // default: false. Stop checking for others validators if one fails
};
</code></pre>
<blockquote>
<p>There is no global form options to setup. Only per field options</p>
</blockquote>
<h3 id="example" tabindex="-1">example</h3>
<pre><code class="language-svelte">&lt;script&gt;
  import { form, field } from 'svelte-forms';
  import { required } from 'svelte-forms/validators';

  const name = field('name', '', [required()], {
    validateOnChange: false
  });
  const myForm = form(name);
&lt;/script&gt;

&lt;section&gt;
  &lt;input type=&quot;text&quot; bind:value={$name.value}&gt;

  {#if $myForm.hasError('name.required')}
    &lt;div&gt;Name is required&lt;/div&gt;
  {/if}

  &lt;button on:click={name.validate}&gt;Validate field&lt;/button&gt;
&lt;/section&gt;
</code></pre>
`,n=[{level:"2",content:"field"},{level:"3",content:"functions"},{level:"3",content:"options"},{level:"3",content:"example"}];export{e as attributes,t as html,n as toc};
