import {parse} from './setup';

describe('link', () => {
  test('can parse a simple link', () => {
    const ast = parse('[hello](http://example.com) more text');
    expect(ast[0]).toMatchObject({
      type: 'link',
      url: 'http://example.com',
    });
  });
});
