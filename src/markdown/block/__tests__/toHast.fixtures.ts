export const testCases: [markdown: string, html: string, name?: string][] = [
  ['paragraph', '<p>paragraph</p>'],
  ['paragraph\n\nparagraph', '<p>paragraph</p><p>paragraph</p>', 'two paragraphs'],
  [
    'paragraph\n\n> blockquote',
    '<p>paragraph</p><blockquote><p>blockquote</p></blockquote>',
    'paragraph and blockquote',
  ],
  ['line 1  \nline2', '<p>line 1<br />line2</p>', 'inline line break'],
  ['> this is blockquote', '<blockquote><p>this is blockquote</p></blockquote>'],
  ['>! this is spoiler', "<blockquote data-spoiler='true'><p>this is spoiler</p></blockquote>"],
  ['# heading 1', '<h1>heading 1</h1>'],
  ['## heading 2', '<h2>heading 2</h2>'],
  ['### heading 3', '<h3>heading 3</h3>'],
  ['#### heading 4', '<h4>heading 4</h4>'],
  ['##### heading 5', '<h5>heading 5</h5>'],
  ['###### heading 6', '<h6>heading 6</h6>'],
  ['---', '<hr />'],
  ['<div>bold: <b>bold</b></div>', '<div>bold: <b>bold</b></div>'],
  [
    '```\ncode\n```',
    "<pre class='language-text' data-lang='text' data-meta=''><code class='language-text' data-lang='text' data-meta=''>code</code></pre>",
    'plain text code block',
  ],
  [
    '```js\nconsole.log(123);\n```',
    "<pre class='language-js' data-lang='js' data-meta=''><code class='language-js' data-lang='js' data-meta=''>console.log(123);</code></pre>",
    'code block with language',
  ],
  [
    '```js meta\nconsole.log(123);\n```',
    "<pre class='language-js' data-lang='js' data-meta='meta'><code class='language-js' data-lang='js' data-meta='meta'>console.log(123);</code></pre>",
    'code block with language and meta',
  ],
  ['- list item', '<ul><li>list item</li></ul>', 'unordered list item'],
  [
    '- list item\n  \nparagraph',
    '<ul><li><p>list item</p><p>paragraph</p></li></ul>',
    'unordered list item (multiline)',
  ],
  ['- list item\n- second list item', '<ul><li>list item</li><li>second list item</li></ul>', 'unordered list items'],
  [
    '- list item\n  - nested list item',
    '<ul><li><p>list item</p><ul><li>nested list item</li></ul></li></ul>',
    'unordered list item with nested list item',
  ],
  ['1. ordered list item', "<ol start='1'><li>ordered list item</li></ol>", 'ordered list item'],
  [
    '2. ordered list\n2. start from 2',
    "<ol start='2'><li>ordered list</li><li>start from 2</li></ol>",
    'ordered list items',
  ],
  [
    '- [x] checked list item\n- [ ] unchecked',
    "<ul><li data-checked='true'>checked list item</li><li data-checked='false'>unchecked</li></ul>",
    'checked and unchecked list items',
  ],
  ['$$\nx + 2\n$$', "<pre data-math='true'><code data-math='true'>x + 2</code></pre>", 'math block'],
  [
    '[^Footnote]: footnote definition',
    "<div data-node='footnoteDefinition' data-label='Footnote' data-id='footnote'><a name='footnote' id='footnote'>Footnote</a><p>footnote definition</p></div>",
    'footnote definition',
  ],
  [
    '[My-link]: https://example.com',
    "<div data-node='definition' data-label='My-link' data-id='my-link' data-title='' data-url='https://example.com'><a name='my-link' id='my-link'>My-link</a>: <a href='https://example.com' title='https://example.com'>https://example.com</a></div>",
    'definition',
  ],
  [
    '[My-link-with-title]: https://example.com "My title"',
    "<div data-node='definition' data-label='My-link-with-title' data-id='my-link-with-title' data-title='My title' data-url='https://example.com'><a name='my-link-with-title' id='my-link-with-title'>My-link-with-title</a>: <a href='https://example.com' title='My title'>My title</a></div>",
    'definition with title',
  ],
  [
    `| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |`,
    "<table data-align='[null,null]'><thead><tr><th>Header 1</th><th>Header 2</th></tr></thead><tbody><tr><td>Cell 1</td><td>Cell 2</td></tr></tbody></table>",
    'table',
  ],
  [
    `| Left | Center | Right | None |
|:---- |:------:| -----:|------|
| foo  | bar    | baz   | qux  |`,
    "<table data-align='[\"left\",\"center\",\"right\",null]'><thead><tr><th align='left'>Left</th><th align='center'>Center</th><th align='right'>Right</th><th>None</th></tr></thead><tbody><tr><td align='left'>foo</td><td align='center'>bar</td><td align='right'>baz</td><td>qux</td></tr></tbody></table>",
    'table with alignment',
  ],
  ['__bold__ inline formatting', '<p><strong>bold</strong> inline formatting</p>', 'bold inline formatting'],
];
