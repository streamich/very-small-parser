import {parse} from './setup';

describe('text', () => {
  test('can parse plain text', () => {
    const ast = parse('some text');
    expect(ast[0]).toMatchObject({
      type: 'text',
      value: 'some text',
    });
  });
});
