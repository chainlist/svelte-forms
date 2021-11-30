const t={filename:"2_Examples.md"},e=`<h2 id="some-examples" tabindex="-1">some examples</h2>
<h3 id="simple-form-with-one-input" tabindex="-1">Simple form with one input</h3>
<pre><code class="language-svelte">&lt;script&gt;
  import { form, field } from 'svelte-forms';
  import { required } from 'svlete-forms/validators';

  const name = field('name', [required()]);
  const myForm = form(name);
&lt;/script&gt;;


&lt;section&gt;
  &lt;input type=&quot;text&quot; bind:value={$name.value} /&gt;

  &lt;button disabled={!$form.valid}&gt;Send form&lt;/button&gt;
&lt;/section&gt;
</code></pre>
<h3 id="reset-a-form-field" tabindex="-1">Reset a form / field</h3>
<pre><code class="language-svelte">&lt;script&gt;
  import { form, field } from 'svelte-forms';
  import { required } from 'svlete-forms/validators';

  const name = field('name', '', [required()]);
  const password = field('password', 'my_password', [required()]);
  const myForm = form(name, password);
&lt;/script&gt;;


&lt;section&gt;
  &lt;input type=&quot;text&quot; bind:value={$name.value} /&gt;
  &lt;input type=&quot;password&quot; bind:value={$password.value} /&gt;

  &lt;button on:click={name.reset}&gt;Reset name&lt;/button&gt;
  &lt;button on:click={password.reset}&gt;Reset password&lt;/button&gt;
  &lt;button on:click={myForm.reset}&gt;Reset form&lt;/button&gt;
&lt;/section&gt;
</code></pre>
`,n=[{level:"2",content:"some examples"},{level:"3",content:"Simple form with one input"},{level:"3",content:"Reset a form / field"}];export{t as attributes,e as html,n as toc};
