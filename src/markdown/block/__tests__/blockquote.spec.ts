import {parse} from './setup';

describe('blockquote', () => {
  test('single paragraph', () => {
    const ast = parse('> paragraph');
    expect(ast[0]).toMatchObject({
      type: 'blockquote',
      children: [
        {type: 'paragraph', children: [{type: 'text', value: 'paragraph'}]},
      ],
    });
  });

  test('two paragraphs', () => {
    const ast = parse('> item 1\n> \n> item 2');
    expect(ast[0]).toMatchObject({
      type: 'blockquote',
      children: [
        {type: 'paragraph', children: [{type: 'text', value: 'item 1'}]},
        {type: 'paragraph', children: [{type: 'text', value: 'item 2'}]},
      ],
    });
  });

  describe('spoiler', () => {
    test('single paragraph', () => {
      const ast = parse('>! paragraph');
      expect(ast[0]).toMatchObject({
        type: 'blockquote',
        spoiler: true,
        children: [
          {type: 'paragraph', children: [{type: 'text', value: 'paragraph'}]},
        ],
      });
    });

    test('two paragraphs', () => {
      const ast = parse('>! item 1\n>! \n>     ! item 2');
      expect(ast[0]).toMatchObject({
        type: 'blockquote',
        spoiler: true,
        children: [
          {type: 'paragraph', children: [{type: 'text', value: 'item 1'}]},
          {type: 'paragraph', children: [{type: 'text', value: 'item 2'}]},
        ],
      });
    });
  });
});
