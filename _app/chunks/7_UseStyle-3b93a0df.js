const t={filename:"7_UseStyle.md"},e=`<h2 id="use-style" tabindex="-1">use:style</h2>
<pre><code class="language-typescript">function style({ field: store: Readable&lt;Field&lt;any&gt;&gt;, valid = &quot;valid&quot;, invalid = &quot;invalid&quot;, dirty = &quot;dirty&quot; });
</code></pre>
<p><code>use:style</code> will help you to <strong>automaticaly</strong> set the class of your HTML field to <code>valid</code> or <code>invalid</code> only if the field is <code>dirty</code>.</p>
<p>You can of course override the class names by setting your own.</p>
<p>You will need to use to <code>:global()</code> CSS keyword to customize to look of those classes.</p>
<pre><code class="language-svelte">&lt;script&gt;
  import { field, style } from 'svelte-forms';

  const name = field('name');
&lt;/script&gt;

&lt;input text=&quot;text&quot; use:style={{ field: name }}&gt;
&lt;input text=&quot;text&quot; use:style={{ field: name, valid: &quot;foo&quot;, invalid: &quot;bar&quot; }}&gt;

&lt;style&gt;
  input {
    outline: none;
  }

  :global(.invalid), :global(.bar) {
    border: 1px solid red;
  }

  :global(.valid), :global(.foo) {
    border: 1px solid green;
  }

  :global(.dirty) {
    border: 1px dashed black;
  }
&lt;/style&gt;
</code></pre>
`,o=[{level:"2",content:"use:style"}];export{t as attributes,e as html,o as toc};
