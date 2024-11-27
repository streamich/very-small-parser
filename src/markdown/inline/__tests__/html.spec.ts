import {parse} from './setup';

describe('HTML', () => {
  it('the <b> tag in text', () => {
    const ast = parse('Hello <b>world</b>!');
    expect(ast).toMatchObject([
      {
        type: 'text',
        value: 'Hello ',
      },
      {
        type: 'element',
        tagName: 'b',
        properties: {},
        children: [
          {
            type: 'text',
            value: 'world',
          },
        ],
      },
      {
        type: 'text',
        value: '!',
      },
    ]);
  });

  it('nested inline tags', () => {
    const ast = parse('<em>Hello <b>world</b></em>!');
    expect(ast).toMatchObject([
      {
        type: 'element',
        tagName: 'em',
        properties: {},
        children: [
          {
            type: 'text',
            value: 'Hello ',
          },
          {
            type: 'element',
            tagName: 'b',
            properties: {},
            children: [
              {
                type: 'text',
                value: 'world',
              },
            ],
          },
        ],
      },
      {
        type: 'text',
        value: '!',
      },
    ]);
  });

  it('can element attributes', () => {
    const ast = parse('<em>Hello</em> <a href="https://example.com">link</a>!');
    expect(ast).toMatchObject([
      {
        type: 'element',
        tagName: 'em',
        properties: {},
        children: [
          {
            type: 'text',
            value: 'Hello',
          },
        ],
      },
      {
        type: 'text',
        value: ' ',
      },
      {
        type: 'element',
        tagName: 'a',
        properties: {
          href: 'https://example.com',
        },
        children: [
          {
            type: 'text',
            value: 'link',
          },
        ],
      },
      {
        type: 'text',
        value: '!',
      },
    ]);
  });
});
