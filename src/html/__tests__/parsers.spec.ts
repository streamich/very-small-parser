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
            children: [{type: 'text', value: 'def'}],
          },
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
            children: [{type: 'text', value: 'def'}],
          },
          {type: 'text', value: ' '},
          {
            type: 'element',
            tagName: 'u',
            children: [{type: 'text', value: 'ghi'}],
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
                children: [{type: 'text', value: 'e'}],
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
          children: [{type: 'text', value: ' ! '}],
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
          children: [{type: 'text', value: ' ! '}],
        });
      });

      test('data attribute', () => {
        const ast = parse('<p data-testid="123"> ! </p>');
        expect(ast[0]).toMatchObject({
          type: 'element',
          tagName: 'p',
          properties: {
            'data-testid': '123',
          },
          children: [{type: 'text', value: ' ! '}],
        });
      });

      test('single quotes', () => {
        const ast = parse("<p data-testid='123'> ! </p>");
        expect(ast[0]).toMatchObject({
          type: 'element',
          tagName: 'p',
          properties: {
            'data-testid': '123',
          },
          children: [{type: 'text', value: ' ! '}],
        });
      });

      test('no quotes', () => {
        const ast = parse('<p data-testid=123> ! </p>');
        expect(ast[0]).toMatchObject({
          type: 'element',
          tagName: 'p',
          properties: {
            'data-testid': '123',
          },
          children: [{type: 'text', value: ' ! '}],
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
          children: [{type: 'text', value: ' ! '}],
        });
      });
    });

    describe('self closing', () => {
      test('can parse simple self-closing element', () => {
        const ast = parse('<hr />');
        expect(ast[0]).toMatchObject({
          type: 'element',
          tagName: 'hr',
          properties: {},
          children: [],
        });
      });

      test('can parse simple self-closing element - 2', () => {
        const ast = parse('<hr/>');
        expect(ast[0]).toMatchObject({
          type: 'element',
          tagName: 'hr',
          properties: {},
          children: [],
        });
      });

      test('can parse simple self-closing element with attributes', () => {
        const ast = parse('<hr data-testid="very-important" />');
        expect(ast[0]).toMatchObject({
          type: 'element',
          tagName: 'hr',
          properties: {
            'data-testid': 'very-important',
          },
          children: [],
        });
      });

      test('nested in another tag', () => {
        const ast = parse('<center>a <div /> </center>');
        expect(ast[0]).toMatchObject({
          type: 'element',
          tagName: 'center',
          properties: {},
          children: [
            {type: 'text', value: 'a '},
            {
              type: 'element',
              tagName: 'div',
              properties: {},
              children: [],
            },
            {type: 'text', value: ' '},
          ],
        });
      });
    });
  });

  describe('fragment', () => {
    test('text and an element', () => {
      const ast = parse('text <b>bold</b>');
      expect(ast).toMatchObject([
        {type: 'text', value: 'text '},
        {
          type: 'element',
          tagName: 'b',
          children: [{type: 'text', value: 'bold'}],
        },
      ]);
    });

    test('two elements', () => {
      const ast = parse('<i>em</i><b>bold</b>');
      expect(ast).toMatchObject([
        {
          type: 'element',
          tagName: 'i',
          children: [{type: 'text', value: 'em'}],
        },
        {
          type: 'element',
          tagName: 'b',
          children: [{type: 'text', value: 'bold'}],
        },
      ]);
    });

    test('unescaped "<" in the middle of text', () => {
      const ast = parse('hello < world');
      expect(ast).toMatchObject([
        {
          type: 'text',
          value: 'hello ',
        },
        {
          type: 'text',
          value: '<',
        },
        {
          type: 'text',
          value: ' world',
        },
      ]);
    });
  });
});
