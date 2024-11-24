import {token} from '../../createParser';
import link from '../link';

const tokenizer = link();

const runTokenizer = (tk: any, value: any) => {
  const eat = (subvalue: any, type: any, children: any, overrides: any) => token(subvalue, type, children, overrides);

  return tk.call(
    {
      tokenizeInline: (val: string) => val,
    },
    eat,
    value,
  );
};

describe('link tokenizer', () => {
  test('exists', () => {
    expect(typeof link).toBe('function');
    expect(typeof link()).toBe('function');
  });

  test('matches a link', () => {
    const tok = runTokenizer(tokenizer, '[hello](http://example.com) more text');

    expect(tok).toMatchObject({
      type: 'link',
      url: 'http://example.com',
    });
  });
});
