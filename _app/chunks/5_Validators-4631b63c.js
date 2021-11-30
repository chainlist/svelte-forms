const e={filename:"5_Validators.md"},n=`<h2 id="validators" tabindex="-1">Validators</h2>
<h3 id="required" tabindex="-1">required</h3>
<pre><code class="language-typescript">function required() =&gt; { valid: boolean, name : 'required' };
</code></pre>
<pre><code class="language-typescript">import { field } from 'svelte-forms';
import { required } from 'svelte-forms/validators';

const name = field('name', [required()]);
</code></pre>
<h3 id="email" tabindex="-1">email</h3>
<pre><code class="language-typescript">function email() =&gt; { valid: boolean, name : 'email' };
</code></pre>
<pre><code class="language-typescript">import { field } from 'svelte-forms';
import { email } from 'svelte-forms/validators';

const name = field('name', [email()]);
</code></pre>
<h3 id="url" tabindex="-1">url</h3>
<pre><code class="language-typescript">function url() =&gt; { valid: boolean, name : 'url' };
</code></pre>
<pre><code class="language-typescript">import { field } from 'svelte-forms';
import { url } from 'svelte-forms/validators';

const name = field('name', [url()]);
</code></pre>
<h3 id="min" tabindex="-1">min</h3>
<pre><code class="language-typescript">function min(n: number) =&gt; { valid: boolean, name : 'min' };
</code></pre>
<pre><code class="language-typescript">import { field } from 'svelte-forms';
import { min } from 'svelte-forms/validators';

const name = field('name', [min(3)]);
</code></pre>
<h3 id="max" tabindex="-1">max</h3>
<pre><code class="language-typescript">function max(n: number) =&gt; { valid: boolean, name : 'max' };
</code></pre>
<pre><code class="language-typescript">import { field } from 'svelte-forms';
import { max } from 'svelte-forms/validators';

const name = field('name', [max(10)]);
</code></pre>
<h3 id="between" tabindex="-1">between</h3>
<pre><code class="language-typescript">function between(n: number) =&gt; { valid: boolean, name : 'between' };
</code></pre>
<pre><code class="language-typescript">import { field } from 'svelte-forms';
import { between } from 'svelte-forms/validators';

const name = field('name', [between(3, 10)]);

// equivalent to
const lastname = field('lastname', [min(3), max(10)]);
</code></pre>
<h3 id="custom-validator" tabindex="-1">custom validator</h3>
<p>A validator is just a function that returns a function <code>(value: any) =&gt; { valid: boolean, name: 'name_of_the_validator' }</code>. Nothing else.
Of course this validator can be asynchronus and return a promise.</p>
<blockquote>
<p>If your validators takes parameters, they need to be put on the main function and not the returned one</p>
</blockquote>
<pre><code class="language-svelte">&lt;script lang=&quot;ts&quot;&gt;
  import { field } from 'svelte-forms';

  function checkName() {
    return async (value: string) =&gt; {
      const users: any[] = await fetch('https://jsonplaceholder.typicode.com/users').then((r) =&gt; r.json());

      return { valid: !users.find((d) =&gt; d.name === value), name: 'already_taken' };
    };
  }

  function validatorWithParams(str: string) {
    return (value: string) =&gt; ({ valid: value === str, name: 'it_does_not_match' })
  }

  const name = field('name', [checkName(), validatorWithParams('it should match this')])
&lt;/script&gt;

&lt;input type=&quot;text&quot; bind:value={$name.value} /&gt;
</code></pre>
`,t=[{level:"2",content:"Validators"},{level:"3",content:"required"},{level:"3",content:"email"},{level:"3",content:"url"},{level:"3",content:"min"},{level:"3",content:"max"},{level:"3",content:"between"},{level:"3",content:"custom validator"}];export{e as attributes,n as html,t as toc};
