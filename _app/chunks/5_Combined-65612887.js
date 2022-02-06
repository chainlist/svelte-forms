const e={filename:"5_Combined.md"},t=`<h2 id="combined" tabindex="-1">combined</h2>
<pre><code class="language-typescript">export function combined(
	name: string,
	fields: Field[],
	reducer: (fields: Field[]) =&gt; T,
	validators: Validator[] = [],
	options: FieldOptions = defaultFieldOptions
): Readable&lt;Field&lt;T&gt;&gt;;
</code></pre>
<p><code>combined()</code> returns a readable store that is somewhat considered as a <code>field</code> that combines multiple fields together to have a single output.</p>
<ul>
<li>Any binded field will pass their errors prefixed with the field name.</li>
</ul>
<pre><code class="language-typescript">const firstname = field('firstname', '', [required()]);
const lastname = field('lastname', '', [required()]);
const fullname = combined('fullname', [firstname, lastname], ([firstname, lastname]) =&gt; [firstname.value, lastname.value].join(' '));

const myForm(firstname, lastname, fullname);

firstname.validate();
lastname.validate();

// fullname.errors will contain the following error ['firstname.required', 'lastname.required']
</code></pre>
<ul>
<li>You can also pass some validators to that function as well. These validators will get the reduced value that comes from your custom function as the 3rd argument.</li>
</ul>
<h3 id="functions" tabindex="-1">functions</h3>
<blockquote>
<p>combined create an object that is strictly <strong>reactive</strong>. Thus we cannot interact with it through functions calls</p>
</blockquote>
<h3 id="options" tabindex="-1">options</h3>
<pre><code class="language-typescript">type CombinedOptions = {
	stopAtFirstError: boolean; // default: false. Stop checking for others validators if one fails
};
// Only available for validators that are set for that field. Not for the binded fields.
</code></pre>
<h3 id="example" tabindex="-1">example</h3>
<pre><code class="language-svelte">&lt;script&gt;
  import { form, field, combined } from 'svelte-forms';
  import { required } from 'svelte-forms/validators';

  const firstname = field('firstname', '', [required()]);
  const lastname = field('lastname', '', [required()]);
  const fullname = combined('fullname', [firstname, lastname], ([firstname, lastname]) =&gt; [firstname.value, lastname.value].join(' '));

  const myForm = form(fullname);
&lt;/script&gt;

&lt;section&gt;
  &lt;input type=&quot;text&quot; bind:value={$firstname.value}&gt;
  &lt;input type=&quot;text&quot; bind:value={$lastname.value}&gt;

  {#if $myForm.hasError('firstname.required')}
    &lt;div&gt;Firstname is required&lt;/div&gt;
  {/if}

  {#if $myForm.hasError('lastname.required')}
    &lt;div&gt;Lastname is required&lt;/div&gt;
  {/if}

  &lt;div&gt;Welcome {$fullname.value}&lt;/div&gt;

  &lt;button on:click={fullname.validate}&gt;Validate field&lt;/button&gt;
&lt;/section&gt;
</code></pre>
`,n=[{level:"2",content:"combined"},{level:"3",content:"functions"},{level:"3",content:"options"},{level:"3",content:"example"}];export{e as attributes,t as html,n as toc};
