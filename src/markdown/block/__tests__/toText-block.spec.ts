import {parse} from './setup';
import {toText} from '../toText';

describe('toText', () => {
  const testCases: [src: string, expected?: string, name?: string][] = [
    ['plain text'],
    ['```\ncode\n```', void 0, 'fenced code block'],
    ['```js\ncode\n```', void 0, 'fenced code block with language'],
    ['```js {"foo": "bar"}\ncode\n```', void 0, 'fenced with language and metadata'],
    ['``` {"foo": "bar"}\ncode\n```', void 0, 'fenced with metadata'],
    ['~~~\ncode\n~~~', '```\ncode\n```', 'fenced code block, using tilde'],
    ['~~~ts\ncode\n~~~', '```ts\ncode\n```', 'fenced code block with language, using tilde'],
    [
      '~~~ts colorful\ncode\n~~~',
      '```ts colorful\ncode\n```',
      'fenced code block with language and metadata, using tilde',
    ],
    ['~~~ colorful\ncode\n~~~', '``` colorful\ncode\n```', 'fenced code block with metadata, using tilde'],
    ['$$\nx^2\n$$', void 0, 'math block'],
    ['---'],
    ['----------', '---'],
    ['# heading 1'],
    ['## heading 2'],
    ['### heading 3'],
    ['#### heading 4'],
    ['##### heading 5'],
    ['###### heading 6'],
    ['####### text'],
    ['heading 1\n===', '# heading 1', 'alternative heading 1'],
    ['heading 2\n---', '## heading 2', 'alternative heading 2'],
    ['> blockquote', void 0, 'simple blockquote'],
    ['> blockquote\n> with multiple lines', void 0, 'blockquote with multiple lines'],
    ['> blockquote\n> \n> with multiple blocks', void 0, 'blockquote with multiple blocks'],
    ['> blockquote\n> \n> ```\n> with multiple blocks\n> ```', void 0, 'blockquote with multiple blocks and code'],
    ['- single list item'],
    ['- first\n- second', void 0, 'multiple list items'],
    ['- first\n\n- second', '- first\n\n- second', 'multiple *loose* list items'],
    ['- first\n\n\n- second', '- first\n\n- second', 'multiple *loose* list items'],
    ['* first\n* second', '- first\n- second', 'two list items with "*" bullet'],
    ['+ first\n+ second\n+ third', '- first\n- second\n- third', 'three list items with "+" bullet'],
    [
      '- single list item\n  \n  with multiple lines',
      '- single list item\n  \n  with multiple lines',
      'list item with multiple lines',
    ],
    [
      '- single list item\n  - nested list item\n  - nested list item',
      void 0,
      'nested list items',
    ],
    ['1. first\n2. second', '1. first\n1. second', 'ordered list items'],
    ['4. first\n5. second', '4. first\n4. second', 'ordered list items starting at 4'],
    ['4. first\n\n5. second', '4. first\n\n4. second', 'ordered list items starting at 4'],
    ['- [ ] unchecked'],
    ['- [x] checked'],
    ['- [ ] unchecked\n- [x] checked', '- [ ] unchecked\n- [x] checked', 'list items with checkboxes'],
    ['<b>html</b>'],
    ['<center><a href="https://google.com">Click <em>me</em>!</a></center>'],
    ['foo\n|---|\nbar', '| foo |\n|-----|\n| bar |', 'table'],
    ['foo\n|---|\nbar', '| foo |\n|-----|\n| bar |', 'table with alignment'],

    [`| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |`, `| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |`,  'basic table with cell padding'],

    [`| Left | Center | Right | None |
|:---- |:------:| -----:|------|
| foo  | bar    | baz   | qux  |
| foo 1| bar 2  | baz 3 | qux 4|`, `| Left  | Center | Right | None  |
|:------|:------:|------:|-------|
| foo   |   bar  |   baz | qux   |
| foo 1 |  bar 2 | baz 3 | qux 4 |`,  'table with column alignment'],

    [`| Syntax      | Description | Test Text     |
| :---        |    :----:   |          ---: |
| Header      | Title       | Heres this!   |
| Paragraph   | Text, some very long text        | And more      |`,
`| Syntax    |        Description        |   Test Text |
|:----------|:-------------------------:|------------:|
| Header    |           Title           | Heres this! |
| Paragraph | Text, some very long text |    And more |`,  'example table from docs'],

[`| Header 1 | Header 2 |
| -------- | -------- |
| This is a very long cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell | x |
| x | This is a very long cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell |`,

`| Header 1 | Header 2 |
|---|---|
| This is a very long cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell | x |
| x | This is a very long cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell cell |`,

'basic table with cell padding'],

];

  for (const [src, expected = src, name = src] of testCases) {
    it(name, () => {
      const ast = parse(src);
      // console.log(JSON.stringify(ast, null, 2));
      const text = toText(ast);
      // console.log(JSON.stringify(text));
      // console.log(text);
      expect(text).toBe(expected);
    });
  }
});
