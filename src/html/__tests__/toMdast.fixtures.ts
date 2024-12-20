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
  [
    '<img src="https://example.com" alt="This is alt" title="This is title" />',
    '![This is alt](https://example.com "This is title")',
  ],
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
  ['<blockquote data-spoiler="true">quote</blockquote>', '>! quote'],
  ['<blockquote><p>quote</p></blockquote>', '> quote'],
  ['<blockquote><p>paragraph 1</p><p>paragraph 2</p></blockquote>', '> paragraph 1\n> \n> paragraph 2'],
  ['<pre>code</pre>', '```\ncode\n```'],
  ['<pre><code>printf("asdf");</code></pre>', '```\nprintf("asdf");\n```'],
  [
    '<pre data-lang="clang" data-meta="this-is-meta"><code>printf("asdf");</code></pre>',
    '```clang this-is-meta\nprintf("asdf");\n```',
  ],
  [
    '<pre><code data-lang="clang" data-meta="this-is-meta">printf("asdf");</code></pre>',
    '```clang this-is-meta\nprintf("asdf");\n```',
  ],
  ['<h1>heading</h1>', '# heading'],
  ['<h2>heading</h2>', '## heading'],
  ['<h3>heading</h3>', '### heading'],
  ['<h4>heading</h4>', '#### heading'],
  ['<h5>heading</h5>', '##### heading'],
  ['<h6>heading __bold__</h6>', '###### heading __bold__'],
  ['<ul><li>item 1</li></ul>', '- item 1'],
  ['<ul><li>item 1</li><li>item 2</li></ul>', '- item 1\n- item 2'],
  [
    '<ul><li><p>Item 1</p><ul><li>Item 1.1</li><li>Item 1.2</li></ul></li><li>Item 2</li></ul>',
    '- Item 1\n  - Item 1.1\n  - Item 1.2\n- Item 2',
  ],
  ['<ol><li>item 1</li></ol>', '1. item 1'],
  ['<ol start="3"><li>item 1</li></ol>', '3. item 1'],
  ['<ul><li data-checked="true">item 1</li><li data-checked="false">item 2</li></ul>', '- [x] item 1\n- [ ] item 2'],
  ['<hr />', '---'],
  [
    '<table><thead><tr><th>Header 1</th><th>Header 2</th></tr></thead><tbody><tr><td>Cell 1</td><td>Cell 2</td></tr></tbody></table>',
    '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |',
    '2x2 basic table',
  ],
  [
    `<table>
    <thead>
      <tr>
        <th align="left">Left</th>
        <th align="center">Center</th>
        <th align="right">Right</th>
        <th>None</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>foo</td>
        <td>bar</td>
        <td>baz</td>
        <td>qux</td>
      </tr>
      <tr>
        <td>foo 1</td>
        <td>bar 2</td>
        <td>baz 3</td>
        <td>qux 4</td>
      </tr>
    </tbody>
  </table>`,
    `| Left  | Center | Right | None  |
|:------|:------:|------:|-------|
| foo   |   bar  |   baz | qux   |
| foo 1 |  bar 2 | baz 3 | qux 4 |`,
    'table with column alignment',
  ],
  [
    `<table>
    <tr>
      <th align="left">Left</th>
      <th align="center">Center</th>
      <th align="right">Right</th>
      <th>None</th>
    </tr>
    <tr>
      <td>foo</td>
      <td>bar</td>
      <td>baz</td>
      <td>qux</td>
    </tr>
    <tr>
      <td>foo 1</td>
      <td>bar 2</td>
      <td>baz 3</td>
      <td>qux 4</td>
    </tr>
  </table>`,
    `| Left  | Center | Right | None  |
|:------|:------:|------:|-------|
| foo   |   bar  |   baz | qux   |
| foo 1 |  bar 2 | baz 3 | qux 4 |`,
    'table with column alignment (raw rows)',
  ],
  [
    `<table>
    <tr>
      <th align="left">Left</th>
      <th align="center">Center</th>
      <th align="right">Right</th>
      <th>None</th>
    </tr>
    <tr>
      <td>foo</td>
      <td>bar</td>
      <td>baz</td>
      <td>qux</td>
    </tr>
  </table>`,
    `| Left | Center | Right | None |
|:-----|:------:|------:|------|
| foo  |   bar  |   baz | qux  |`,
    'table with column alignment (raw rows, 2 rows)',
  ],
  ['<pre data-math="true"><code>y(x) = 2</code></pre>', '$$\ny(x) = 2\n$$'],
  ['<pre><code data-math="true">y(x) = 2</code></pre>', '$$\ny(x) = 2\n$$'],
  ['<center>hello</center>', '<center>hello</center>'],
  ['<p><center>hello</center></p>', '<center>hello</center>'],
  [
    '<div data-node="definition" data-label="Def" data-id="def" data-url="http://example.com"><a href="">title</a></div>',
    '[Def]: http://example.com',
  ],
  [
    '<div data-node="definition" data-label="Def" data-id="def" data-url="http://example.com" data-title="My title"><a href="">title</a></div>',
    '[Def]: http://example.com "My title"',
  ],
  [
    `<div data-node="footnoteDefinition" data-label="Def" data-id="def"><a name="anchor">def</a><p>paragraph 1</p><p>paragraph 2</p></div>`,
    '[^Def]: paragraph 1\n  \n  paragraph 2',
  ],
  [
    `<div data-node="footnoteDefinition" data-label="Def" data-id="def"><a name="anchor">def</a><p>paragraph 1</p></div>`,
    '[^Def]: paragraph 1',
  ],
  [
    `<div data-node="footnoteDefinition" data-label="Def" data-id="def"><a name="anchor">def</a>paragraph 1</div>`,
    '[^Def]: paragraph 1',
  ],

  // Incorrect block nesting
  ['<p><p>paragraph</p></p>', 'paragraph'],
  ['<div><p>paragraph</p></div>', 'paragraph'],
  ['<p><div>paragraph</div></p>', 'paragraph'],
  ['<div><div>paragraph</div></div>', 'paragraph'],
  ['<div><div><div>paragraph</div></div></div>', 'paragraph'],
  ['<div><div><p>paragraph</p></div></div>', 'paragraph'],
  ['<div><p><div>paragraph</div></p></div>', 'paragraph'],
  ['<p><div><div>paragraph</div></div></p>', 'paragraph'],
  ['<blockquote><p>this is quote</p></blockquote>', '> this is quote'],
  ['<blockquote><p><p>this is quote</p></p></blockquote>', '> this is quote'],
  ['<div><blockquote><p><p>this is quote</p></p></blockquote></div>', '> this is quote'],
  ['<p><div>text 1</div> and <div>text 2</div></p>', 'text 1 and text 2'],
  ['<div><p>text 1</p> and <p>text 2</p></div>', 'text 1 and \n\ntext 2'],
  ['<div><p><div>text 1</div></p><p><div>text 2</div></p></div>', 'text 1\n\ntext 2'],
  ['<ul><li>item</li></ul>', '- item'],
  ['<ul><li><p>item</p></li></ul>', '- item'],
  ['<ul><li><p><div>item</div></p></li></ul>', '- item'],
  ['<ul><li><div><p><div>item</div></p></div></li></ul>', '- item'],
  ['<div><ul><li><div><p><div>item</div></p></div></li></ul></div>', '- item'],
  ['<div><p><ul><li><div><p><div>item</div></p></div></li></ul></p></div>', 'item'],
];
