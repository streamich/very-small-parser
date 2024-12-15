export const testCases: [html: string, markdown: string, name?: string][] = [
  // Inline elements
  ['<p><code>hello world</code></p>', '`hello world`'],
  ['<p><pre><code>hello world</code></pre></p>', '`hello world`'],
  ['<p><pre>hello world</pre></p>', '`hello world`'],
  ['<p><code><strong>hello</strong> <span>world</span></code></p>', '`hello world`'],
  ['<b>hello world</b>', '__hello world__'],
  ['<b foo="bar">hello world</b>', '__hello world__'],
  ['<strong>hello world</strong>', '__hello world__'],
  ['<i>hello world</i>', '_hello world_'],
  ['<em>hello world</em>', '_hello world_'],
  ['<del>hello world</del>', '~~hello world~~'],
  ['<del>hello <strong>world</strong></del>', '~~hello __world__~~'],
  ['<spoiler>hello world</spoiler>', '||hello world||'],
  ['<p><code class="language-math">x + x</code></p>', '$x + x$'],
  ['<p><code data-lang="math">x + x</code></p>', '$x + x$'],
  ['<sup>test</sup>', '^test^'],
  ['<sup><b>test</b></sup>', '^__test__^'],
  ['<sub>test</sub>', '~test~'],
  ['<mark>test</mark>', '==test=='],
  ['<u>test</u>', '++test++'],
  ['<acronym data-icon="smile" />', ':smile:'],
  ['<a href="https://example.com">link</a>', '[link](https://example.com)'],
  ['<a href="https://example.com" title="This is title">link</a>', '[link](https://example.com "This is title")'],
  ['<a href="https://example.com">https://example.com</a>', 'https://example.com'],
  ['<img src="https://example.com" />', '![](https://example.com)'],
  ['<img src="https://example.com" alt="This is alt" />', '![This is alt](https://example.com)'],
  ['<img src="https://example.com" alt="This is alt" title="This is title" />', '![This is alt](https://example.com "This is title")'],
  ['<cite>#tag</cite>', '#tag'],
  ['<cite>@user</cite>', '@user'],
  ['<cite>~stream</cite>', '~stream'],
  ['<br />', '\n'],
  ['<p><center>center</center></p>', '<center>center</center>'],
  ['<a href="#tag">Tag</a>', '[Tag][tag]'],
  ['<a href="#tag" />', '[tag][]'],
  ['<a href="#tag" data-ref="img">Tag</a>', '![Tag][tag]'],
  ['<a href="#tag" data-ref="img" />', '![tag][]'],
  ['<sup data-node="footnote"><a href="#tag">Tag</a></sup>', '[^Tag]'],

  // Block elements
  ['<p>paragraph</p>', 'paragraph'],
  ['<blockquote>quote</blockquote>', '> quote'],
];
