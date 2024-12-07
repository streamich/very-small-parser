import {parse} from './setup';
import {toText} from '../toText';

describe('toText', () => {
  const testCases: [src: string, expected?: string, name?: string][] = [
    ['plain text'],
    ['', '', 'empty string'],
    ['__bold__'],
    ['**bold**', '__bold__'],
    ['*italic*', '_italic_'],
    ['_italic_'],
    ['`code`'],
    ['~~strike~~'],
    ['||spoiler||'],
    ['$x + x$'],
    ['$$x + x$$', '$x + x$'],
    ['[^1]'],
    ['[^footnote-reference]'],
    ['[shortcut-link-reference]'],
    ['[collapsed-link-reference][]'],
    ['[Full link reference][my-reference]'],
    ['![shortcut-image-reference]'],
    ['![collapsed-image-reference][]'],
    ['![Full image reference][my-reference]'],
    ['https://example.com'],
    ['[link](https://example.com)'],
    ['[link with title](https://example.com "title")'],
    ['![image](https://example.com)'],
    ['![image with title](https://example.com "title")'],
    ['![image with alt text](https://example.com)'],
    ['![](https://example.com "this is the title, yeah")'],
    ['![](https://example.com)'],
    ['[link reference][ref]'],
    ['![image reference][ref]'],
    ['^superscript^'],
    ['~subscript~'],
    ['==mark=='],
    ['@at-handle'],
    ['~tilde-handle'],
    ['#hash-handle'],
    ['++underline++'],
    ['\n', '\n', 'newline'],
    ['foo\nbar', 'foo\nbar', 'newline in text'],
    [':smile:', ':smile:'],
    ['::smile::', ':smile:'],
    ['<b>bold</b>'],
    ['<font color="red">text</font>'],
    ['a <font color="red">b</font> c'],

    // complex cases, with nested elements
    ['**bold _italic_**', '__bold *italic*__'],
    ['__bold **strong**__', '__bold **strong**__'],
    ['[**bold** link](https://example.com)', '[__bold__ link](https://example.com)'],
    ['[`code(**args**)`](https://example.com)', '[`code(**args**)`](https://example.com)'],
  ];

  testCases.forEach(([src, expected = src, name = src]) => {
    it(name, () => {
      const ast = parse(src);
      // console.log(ast);
      const text = toText(ast);
      expect(text).toBe(expected);
    });
  });
});
