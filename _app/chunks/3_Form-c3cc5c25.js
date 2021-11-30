const e={filename:"3_Form.md"},t=`<h2 id="form" tabindex="-1">Form</h2>
<pre><code class="language-typescript">function form(...fields: Writable&lt;Field&lt;any&gt;&gt;[]) =&gt; Readable&lt;{
  dirty: boolean;
  valid: boolean;
  errors: string[];
  hasError: (s: string) =&gt; boolean
}&gt;
</code></pre>
<p><code>form(...fields)</code> returns a store and is a convenient function to bind all your <code>field</code> all together and reflect their internal state.</p>
<h3 id="functions" tabindex="-1">functions</h3>
<p>In addition there is two different functions that can be called on the store:</p>
<ul>
<li><code>reset()</code> which resets all the binded <code>field</code></li>
<li><code>validate()</code> which launches a manual validation of all the binded <code>field</code></li>
</ul>
<h3 id="has-error" tabindex="-1">hasError</h3>
<blockquote>
<p>There is also the method <code>hasError(s: string)</code> that can be called.
It is a method because it is not binded to the store directly but on its content.
You will then need to use the <code>$</code> in front of your variable to access the method <code>hasError</code></p>
</blockquote>
<pre><code class="language-svelte">&lt;script&gt;
  myForm.hasError('name.required'); // will throw an error &quot;hasError is not a function&quot;
  $myForm.hasError('name.required'); // will work
&lt;/script&gt;
</code></pre>
<h3 id="example" tabindex="-1">example</h3>
<pre><code class="language-svelte">&lt;script&gt;
  import { form, field } from 'svelte-forms';
  import { required } from 'svelte-forms/validators';

  const name = field('name', [required()]);
  const myForm = form(name);
&lt;/script&gt;

&lt;section&gt;
  &lt;input type=&quot;text&quot; bind:value={$name.value}&gt;

  {#if $myForm.hasError('name.required')}
    &lt;div&gt;Name is required&lt;/div&gt;
  {/if}
&lt;/section&gt;
</code></pre>
`,n=[{level:"2",content:"Form"},{level:"3",content:"functions"},{level:"3",content:"hasError"},{level:"3",content:"example"}];export{e as attributes,t as html,n as toc};
