import {token} from '../../createParser';
import mark from '../mark';

const tokenizer = mark;

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

describe('highlight tokenizer', () => {
  test('exists', () => {
    expect(typeof mark).toBe('function');
    expect(typeof mark).toBe('function');
  });

  test('matches highlighted text', () => {
    const tok = runTokenizer(tokenizer, '==lol==');

    expect(tok).toMatchObject({
      type: 'mark',
      children: 'lol',
    });
  });
});
