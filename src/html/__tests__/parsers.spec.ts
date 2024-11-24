import {parse} from './setup';

describe('parsers', () => {
  test('comment', () => {
    const ast = parse('<!-- comment -->');
    expect(ast[0]).toMatchObject({
      type: 'comment',
      value: ' comment ',
    });
  });
});
