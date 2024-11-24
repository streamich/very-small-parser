import {parse} from './setup';

describe('mark', () => {
  test('can parse highlighted text', () => {
    const ast = parse('==lol==');
    expect(ast[0]).toMatchObject({
      type: 'mark',
      children: [{type: 'text', value: 'lol'}],
    });
  });
});
