import {html} from '..';

test('can parse only one HTML element', () => {
  const ast = html.el('<b>bold</b> text');
  expect(ast).toMatchObject({
    type: 'element',
    tagName: 'b',
    children: [{type: 'text', value: 'bold'}],
  });
});

test('can parse one HTML element with children', () => {
  const ast = html.el('<b>bold <em>italic</em></b> text');
  expect(ast).toMatchObject({
    type: 'element',
    tagName: 'b',
    children: [
      {type: 'text', value: 'bold '},
      {
        type: 'element',
        tagName: 'em',
        children: [{type: 'text', value: 'italic'}],
      },
    ],
  });
});

test('returns nothing if there is no HTML', () => {
  const ast = html.el('text');
  expect(!!ast).toBe(false);
});

test('returns nothing if source does no immediately start with HTML', () => {
  const ast = html.el('text <b>asdf</b>');
  expect(!!ast).toBe(false);
});
