import {parsef} from '../html/__tests__/setup';
import {toPlainText} from '../toPlainText';

describe('toPlainText', () => {
  describe('HTML', () => {
    describe('elements', () => {
      test('inline HTML', () => {
        const ast = parsef('<b>ab<i>c</i></b>');
        const text = toPlainText(ast);
        expect(text).toBe('abc');
      });

      test('plain text', () => {
        const ast = parsef('hello world');
        const text = toPlainText(ast);
        expect(text).toBe('hello world');
      });

      test('tag inside text', () => {
        const ast = parsef('hello <em>world</em>!');
        const text = toPlainText(ast);
        expect(text).toBe('hello world!');
      });

      test('tag wrapping text', () => {
        const ast = parsef('<u>underline</u>');
        const text = toPlainText(ast);
        expect(text).toBe('underline');
      });

      test('two tags wrapping each other', () => {
        const ast = parsef('<b><i>42</i></b>');
        const text = toPlainText(ast);
        expect(text).toBe('42');
      });

      test('a single self-closing tag', () => {
        const ast = parsef('<br/>');
        const text = toPlainText(ast);
        expect(text).toBe('');
      });

      test('a single self-closing tag with whitespace', () => {
        const ast = parsef('<hr   />');
        const text = toPlainText(ast);
        expect(text).toBe('');
      });

      test('a single self-closing tag with attributes', () => {
        const ast = parsef('<meta lang="js" />');
        const text = toPlainText(ast);
        expect(text).toBe('');
      });

      test('a single self-closing without closing slash', () => {
        const ast = parsef('<meta lang="js">');
        const text = toPlainText(ast);
        expect(text).toBe('');
      });

      test('nested nodes', () => {
        const ast = parsef(
          '<div><b>bold</b> text</div><p>Hello world</p><blockquote><p>Hello <b><u>world</u></b><i>!!!</i></p></blockquote>',
        );
        const text = toPlainText(ast);
        expect(text).toBe(
          'bold textHello worldHello world!!!',
        );
      });
    });

    describe('fragments', () => {
      test('fragment: element + text', () => {
        const ast = parsef('<b>bold</b> text');
        const text = toPlainText(ast);
        expect(text).toBe('bold text');
      });

      test('fragment: multiple elements', () => {
        const ast = parsef('<b>bold</b><i>italic</i><u>underline</u>');
        const text = toPlainText(ast);
        expect(text).toBe('bolditalicunderline');
      });

      test('fragment: text + element + text', () => {
        const ast = parsef('a <b>b</b> c');
        const text = toPlainText(ast);
        expect(text).toBe('a b c');
      });
    });

    describe('escaping', () => {
      test('can escape text nodes', () => {
        const ast = parsef('<div><b>bold</b> text >></div>');
        const text = toPlainText(ast);
        expect(text).toBe('bold text >>');
      });

      test('can escape plain text', () => {
        const ast = parsef('text >>');
        const text = toPlainText(ast);
        expect(text).toBe('text >>');
      });

      test('can render attributes', () => {
        const ast = parsef('<div data-type="very-bold"><b>bold</b> text >></div>');
        const text = toPlainText(ast);
        expect(text).toBe('bold text >>');
      });

      test('can escape attribute values', () => {
        const ast = parsef('<span class="test<a:not(asdf)&test">text</span>');
        const text = toPlainText(ast);
        expect(text).toBe('text');
      });
    });
  });
});
