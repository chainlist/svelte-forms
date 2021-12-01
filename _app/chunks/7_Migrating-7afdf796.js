const n={filename:"7_Migrating.md"},e=`<h2 id="migrate-from-v-1" tabindex="-1">migrate from v1</h2>
<h3 id="form-initialization" tabindex="-1">form initialization</h3>
<pre><code class="language-typescript">/// v1
import { form } from 'svelte-forms';

const myForm = form(() =&gt; {
  return {
    name: { value: '', validators: ['required', 'max:2'] }
  }
}));

// v2
import { form, field } from 'svelte-forms';
import { required, max } from 'svelte-forms/validators';

const name = field('name', '', [required(), max(2)]);
const myForm(name);
</code></pre>
<h3 id="use-bind-class" tabindex="-1">use:bindClass</h3>
<ul>
<li><code>bindClass</code> is renamed <code>style</code></li>
<li>use <code>field</code> instead of <code>form</code> as now the validation is made per field</li>
</ul>
<pre><code class="language-svelte">
&lt;!-- V1 --&gt;
&lt;!-- const myForm = form(...); --&gt;
&lt;input type=&quot;text&quot; use:bindClass={{ form: myForm, field: 'name' }}&gt;

&lt;!-- V2 --&gt;
&lt;!-- const name = field('name', ''); --&gt;
&lt;input type=&quot;text&quot; use:style={{ field: name }}&gt;

</code></pre>
<h3 id="validators" tabindex="-1">validators</h3>
<pre><code class="language-typescript">// V1
function max(value: any, args: any[]) {
	const maxValue = parseFloat(args[0]);
	const value = isNaN(val) ? val.length : parseFloat(val);

	return value &lt;= maxValue;
}

// V2
function max(n: number) {
	return (value: any) =&gt; {
		const val = isNaN(value) ? value.length : parseFloat(value);

		return { valid: !isNaN(value) || val &lt;= n, name: 'max' };
	};
}
</code></pre>
`,t=[{level:"2",content:"migrate from v1"},{level:"3",content:"form initialization"},{level:"3",content:"use:bindClass"},{level:"3",content:"validators"}];export{n as attributes,e as html,t as toc};
