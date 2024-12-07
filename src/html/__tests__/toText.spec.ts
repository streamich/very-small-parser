import {toText} from '../toText';
import {parse} from './setup';

describe('toText', () => {
  describe('can pretty-print basic HTML', () => {
    test('inline HTML', () => {
      const ast = parse('<b>ab<i>c</i></b>');
      const text = toText(ast);
      expect(text).toBe('<b>ab<i>c</i></b>');
    });

    test('plain text', () => {
      const ast = parse('hello world');
      const text = toText(ast);
      expect(text).toBe('hello world');
    });

    test('tag inside text', () => {
      const ast = parse('hello <em>world</em>!');
      const text = toText(ast);
      expect(text).toBe('hello <em>world</em>!');
    });

    test('tag wrapping text', () => {
      const ast = parse('<u>underline</u>');
      const text = toText(ast);
      expect(text).toBe('<u>underline</u>');
    });

    test('a single self-closing tag', () => {
      const ast = parse('<br/>');
      const text = toText(ast);
      expect(text).toBe('<br />');
    });
  });
});
