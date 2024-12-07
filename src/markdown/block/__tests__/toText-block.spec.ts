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
    ['~~~ts colorful\ncode\n~~~', '```ts colorful\ncode\n```', 'fenced code block with language and metadata, using tilde'],
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
  ];

  for (const [src, expected = src, name = src] of testCases) {
    it(name, () => {
      const ast = parse(src);
      // console.log(ast);
      const text = toText(ast);
      expect(text).toBe(expected);
    });
  }
});
