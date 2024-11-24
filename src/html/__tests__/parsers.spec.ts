import {parse} from './setup';

describe('parsers', () => {
  test('comment', () => {
    const ast = parse('<!-- comment -->');
    expect(ast[0]).toMatchObject({
      type: 'comment',
      value: ' comment ',
    });
  });

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
