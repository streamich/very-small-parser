import {toText} from '../toText';
import {IElement} from '../types';
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

    test('two tags wrapping each other', () => {
      const ast = parse('<b><i>42</i></b>');
      const text = toText(ast);
      expect(text).toBe('<b><i>42</i></b>');
    });

    test('a single self-closing tag', () => {
      const ast = parse('<br/>');
      const text = toText(ast);
      expect(text).toBe('<br />');
    });

    test('a single self-closing tag with whitespace', () => {
      const ast = parse('<hr   />');
      const text = toText(ast);
      expect(text).toBe('<hr />');
    });

    test('a single self-closing tag with attributes', () => {
      const ast = parse('<meta lang="js" />');
      const text = toText(ast);
      expect(text).toBe('<meta lang="js" />');
    });

    test('a single self-closing without closing slash', () => {
      const ast = parse('<meta lang="js">');
      const text = toText(ast);
      expect(text).toBe('<meta lang="js" />');
    });

    test('nested nodes', () => {
      const ast = parse('<div><b>bold</b> text</div><p>Hello world</p><blockquote><p>Hello <b><u>world</u></b><i>!!!</i></p></blockquote>');
      const text = toText(ast);
      expect(text).toBe('<div><b>bold</b> text</div><p>Hello world</p><blockquote><p>Hello <b><u>world</u></b><i>!!!</i></p></blockquote>');
    });
  });

  describe('fragments', () => {
    test('fragment: element + text', () => {
      const ast = parse('<b>bold</b> text');
      const text = toText(ast);
      expect(text).toBe('<b>bold</b> text');
    });

    test('fragment: multiple elements', () => {
      const ast = parse('<b>bold</b><i>italic</i><u>underline</u>');
      const text = toText(ast);
      expect(text).toBe('<b>bold</b><i>italic</i><u>underline</u>');
    });

    test('fragment: text + element + text', () => {
      const ast = parse('a <b>b</b> c');
      const text = toText(ast);
      expect(text).toBe('a <b>b</b> c');
    });
  });

  describe('escaping', () => {
    test('can escape text nodes', () => {
      const ast = parse('<div><b>bold</b> text >></div>');
      const text = toText(ast);
      expect(text).toBe('<div><b>bold</b> text &#62;&#62;</div>');
    });

    test('can escape plain text', () => {
      const ast = parse('text >>');
      const text = toText(ast);
      expect(text).toBe('text &#62;&#62;');
    });

    test('can render attributes', () => {
      const ast = parse('<div data-type="very-bold"><b>bold</b> text >></div>');
      const text = toText(ast);
      expect(text).toBe('<div data-type="very-bold"><b>bold</b> text &#62;&#62;</div>');
    });

    test('can escape attribute values', () => {
      const ast = parse('<span class="test<a:not(asdf)&test">text</span>');
      const text = toText(ast);
      expect(text).toBe('<span class=\"test&lt;a:not(asdf)&amp;test\">text</span>');
    });
  });

  describe('indentation', () => {
    test('can format HTML with tabbing', () => {
      const ast = parse('<div><hr foo="bar" /><span>text</span></div>');
      const text = toText(ast, '  ');
      expect(text).toBe('<div>\n  <hr foo="bar" />\n  <span>text</span>\n</div>');
    });
    
    test('can format HTML fragment with tabbing', () => {
      const ast = parse('<hr foo="bar" /><span>text</span>');
      const text = toText(ast, '  ');
      expect(text).toBe('<hr foo="bar" />\n<span>text</span>');
    });
    
    test('can format HTML fragment with tabbing - 2', () => {
      const ast: IElement = {
        type: 'element',
        tagName: 'div',
        properties: {},
        len: 0,
        children: [
          {
            type: 'root',
            len: 0,
            children: [
              {
                type: 'element',
                tagName: 'hr',
                properties: {foo: 'bar'},
                len: 0,
                children: [],
              } as IElement,
              {
                type: 'element',
                tagName: 'span',
                properties: {},
                len: 0,
                children: [{type: 'text', value: 'text'}]
              } as IElement,
            ],
          },
        ]
      };
      const text = toText(ast, '  ');
      expect(text).toBe('<div>\n  <hr foo="bar" />\n  <span>text</span>\n</div>');
    });
  });
});
