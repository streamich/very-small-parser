export const testCases: [markdown: string, html: string, name?: string, inlineOnly?: boolean][] = [
  ['plain text', 'plain text'],
  ['*italic*', '<em>italic</em>'],
  ['*italic* and _also italic_', '<em>italic</em> and <em>also italic</em>'],
  ['**bold**', '<strong>bold</strong>'],
  ['**bold** and __also bold__', '<strong>bold</strong> and <strong>also bold</strong>'],
  ['`code`', '<code>code</code>'],
  ['~~strikethrough~~', '<del>strikethrough</del>'],
  ['||spoiler||', '<spoiler style="background:black;color:black">spoiler</spoiler>'],
  ['Reddit: >!spoiler!<', 'Reddit: <spoiler style="background:black;color:black">spoiler</spoiler>'],
  ['$$x + x$$', '<code class="language-math" data-lang="math">x + x</code>'],
  ['https://example.com', '<a href="https://example.com">https://example.com</a>'],
  ['x^2^', 'x<sup>2</sup>'],
  ['H~2~O', 'H<sub>2</sub>O'],
  ['==highlight==', '<mark>highlight</mark>'],
  ['++underline++', '<u>underline</u>'],
  ['a\\nb', 'a<br />b', 'explicit line break'],
  ['<i>html</i>', '<i>html</i>', 'inline html', true],
  ['@user', '<cite>@user</cite>'],
  ['#hash-tag', '<cite>#hash-tag</cite>'],
  ['~tilde-mention', '<cite>~tilde-mention</cite>'],
  ['![](https://example.com/image.png)', '<img src="https://example.com/image.png" />'],
  ['![](https://example.com/image.png "This is a title")', '<img src="https://example.com/image.png" title="This is a title" />'],
  ['![alt text](https://example.com/image.png)', '<img src="https://example.com/image.png" alt="alt text" />'],
  ['[Click me](https://example.com)', '<a href="https://example.com">Click me</a>'],
  ['[Click me](https://example.com "With title")', '<a href="https://example.com" title="With title">Click me</a>'],
  [':smile:', '<acronym title="smile emoji icon" data-emoji="smile">:smile:</acronym>'],
  ['::smile::', '<acronym title="smile emoji icon" data-emoji="smile">:smile:</acronym>'],
  ['[^footnote]', '<sup><a href="#footnote">footnote</a></sup>'],
  ['[Click me][ref]', '<a href="#ref">Click me</a>'],
  ['![alt text][ref]', '<a href="#ref">alt text</a>'],
  ['![][ref]', '<a href="#ref">ref</a>'],
];
