import {tag} from '../../markdown/regex';
import {parse} from './setup';

describe('parsers', () => {
  describe('comment', () => {
    test('comment', () => {
      const ast = parse('<!-- comment -->');
      expect(ast[0]).toMatchObject({
        type: 'comment',
        value: ' comment ',
      });
    });
  });
  
  describe('text', () => {
    test('text', () => {
      const ast = parse('hello world');
      expect(ast[0]).toMatchObject({
        type: 'text',
        value: 'hello world',
      });
    });

    test('text with comment', () => {
      const ast = parse('hello <!--world-->');
      expect(ast).toMatchObject([
        {
          type: 'text',
          value: 'hello ',
        },
        {
          type: 'comment',
          value: 'world',
        },
      ]);
    });

    test('text with comment, with text', () => {
      const ast = parse('hello <!--world-->!');
      expect(ast).toMatchObject([
        {
          type: 'text',
          value: 'hello ',
        },
        {
          type: 'comment',
          value: 'world',
        },
        {
          type: 'text',
          value: '!',
        },
      ]);
    });
  });

  describe('element', () => {
    test('a basic bold tag element', () => {
      const ast = parse('<b>abc</b>');
      expect(ast[0]).toMatchObject({
        type: 'element',
        tagName: 'b',
        children: [{type: 'text', value: 'abc'}],
      });
    });

    test('basic tag nesting', () => {
      const ast = parse('<b>abc <i>def</i></b>');
      expect(ast[0]).toMatchObject({
        type: 'element',
        tagName: 'b',
        children: [
          {type: 'text', value: 'abc '},
          {
            type: 'element',
            tagName: 'i',
            children: [
              {type: 'text', value: 'def'},
            ],
          }
        ],
      });
    });

    test('multiple nested tags', () => {
      const ast = parse('<b>abc <i>def</i> <u>ghi</u>!</b>');
      expect(ast[0]).toMatchObject({
        type: 'element',
        tagName: 'b',
        children: [
          {type: 'text', value: 'abc '},
          {
            type: 'element',
            tagName: 'i',
            children: [
              {type: 'text', value: 'def'},
            ],
          },
          {type: 'text', value: ' '},
          {
            type: 'element',
            tagName: 'u',
            children: [
              {type: 'text', value: 'ghi'},
            ],
          },
          {type: 'text', value: '!'},
        ],
      });
    });

    test('multi-level nesting', () => {
      const ast = parse('<p>abc <i>d<b>e</b>f</i> </p>');
      expect(ast[0]).toMatchObject({
        type: 'element',
        tagName: 'p',
        children: [
          {type: 'text', value: 'abc '},
          {
            type: 'element',
            tagName: 'i',
            children: [
              {type: 'text', value: 'd'},
              {
                type: 'element',
                tagName: 'b',
                children: [
                  {type: 'text', value: 'e'},
                ],
              },
              {type: 'text', value: 'f'},
            ],
          },
          {type: 'text', value: ' '},
        ],
      });
    });

    describe('attributes', () => {
      test('a single attribute', () => {
        const ast = parse('<p id="test"> ! </p>');
        expect(ast[0]).toMatchObject({
          type: 'element',
          tagName: 'p',
          properties: {
            id: 'test',
          },
          children: [
            {type: 'text', value: ' ! '},
          ],
        });
      });

      test('multiple attributes', () => {
        const ast = parse('<p id="test" role=\'button\'> ! </p>');
        expect(ast[0]).toMatchObject({
          type: 'element',
          tagName: 'p',
          properties: {
            id: 'test',
            role: 'button',
          },
          children: [
            {type: 'text', value: ' ! '},
          ],
        });
      });

      test('data attribute', () => {
        const ast = parse('<p data-testid="123"> ! </p>');
        expect(ast[0]).toMatchObject({
          type: 'element',
          tagName: 'p',
          properties: {
            ['data-testid']: '123',
          },
          children: [
            {type: 'text', value: ' ! '},
          ],
        });
      });

      test('single quotes', () => {
        const ast = parse('<p data-testid=\'123\'> ! </p>');
        expect(ast[0]).toMatchObject({
          type: 'element',
          tagName: 'p',
          properties: {
            ['data-testid']: '123',
          },
          children: [
            {type: 'text', value: ' ! '},
          ],
        });
      });

      test('no quotes', () => {
        const ast = parse('<p data-testid=123> ! </p>');
        expect(ast[0]).toMatchObject({
          type: 'element',
          tagName: 'p',
          properties: {
            ['data-testid']: '123',
          },
          children: [
            {type: 'text', value: ' ! '},
          ],
        });
      });

      test('equals sign in attribute value', () => {
        const ast = parse('<a href="test.jpg?public=true"> ! </a>');
        expect(ast[0]).toMatchObject({
          type: 'element',
          tagName: 'a',
          properties: {
            href: 'test.jpg?public=true',
          },
          children: [
            {type: 'text', value: ' ! '},
          ],
        });
      });
    });
  });
});
