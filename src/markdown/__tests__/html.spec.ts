import {parse} from './setup';

describe('HTML', () => {
  it('the <b> tag in text', () => {
    const ast = parse('Hello <b>world</b>!');
    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'paragraph',
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
            {
              type: 'text',
              value: '!',
            },
          ]
        }
      ],
    });
  });
});
