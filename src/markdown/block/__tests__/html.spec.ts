import {parse} from './setup';

describe('HTML', () => {
  it('can parse basic paragraph tag', () => {
    const ast = parse('<p>text</p>');
    expect(ast).toMatchObject([
      {
        type: 'element',
        tagName: 'p',
        properties: {},
        children: [
          {
            type: 'text',
            value: 'text',
          }
        ],
      }
    ]);
  });

  it('can parse centered image in the middle of document', () => {
    const ast = parse('hello\n\n<center><img src="image.png" alt="image" /></center>\n\nworld');
    expect(ast).toMatchObject([
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: 'hello',
          }
        ],
      },
      {
        type: 'element',
        tagName: 'center',
        properties: {},
        children: [
          {
            type: 'element',
            tagName: 'img',
            properties: {
              src: 'image.png',
              alt: 'image',
            },
            children: [],
          }
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: 'world',
          }
        ],
      }
    ]);
  });
});
