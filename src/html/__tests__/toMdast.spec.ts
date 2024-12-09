import {html} from '..';
import {toMdast} from '../toMdast';
import {toText} from '../../markdown/block/toText';
import {parse} from './setup';

describe('toMdast', () => {
  describe('block', () => {
    test('a single paragraph', () => {
      const hast = html.parsef('<p>hello world</p>');
      const mdast = toMdast(hast);
      const text = toText(mdast);
      expect(text).toBe('hello world');
    });

    test('a blockquote', () => {
      const hast = html.parsef('<blockquote><p>hello world</p></blockquote>');
      const mdast = toMdast(hast);
      const text = toText(mdast);
      expect(text).toBe('> hello world');
    });

    test('code block', () => {
      const hast = html.parsef('<pre>console.log(123);</pre>');
      const mdast = toMdast(hast);
      const text = toText(mdast);
      expect(text).toBe('```\nconsole.log(123);\n```');
    });
  });
});
