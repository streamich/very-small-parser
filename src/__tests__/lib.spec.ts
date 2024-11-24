import {token, first} from '../util';
import {IToken, TTokenizer} from '../types';

const icon = (maxLength: number = 32): TTokenizer<IToken> => {
  const REG_ICON1 = new RegExp(`^::([^'\\s:]{1,${maxLength}}?)::`);
  const REG_ICON2 = new RegExp(`^:([^'\\s:]{1,${maxLength}}?):`);
  return (_, value: string) => {
    const matches = value.match(REG_ICON1) || value.match(REG_ICON2);
    if (matches) return token<IToken>(matches[0], 'icon', void 0, {emoji: matches[1]} as any);
  };
};

describe('lib', () => {
  describe('node()', () => {
    test('returns a token', () => {
      const tok = token('some value', 'root', 'children');
      expect(tok).toMatchObject({
        type: 'root',
        children: 'children',
        len: 'some value'.length,
      });
    });
  });

  describe('first()', () => {
    test('exists', () => {
      expect(typeof first).toBe('function');
    });

    test('works', () => {
      const tokenizer = first([(() => undefined) as any, icon()]);
      const tok = (tokenizer as any)(token, ':smile:');
      expect(typeof tok).toBe('object');
      expect(tok.type).toBe('icon');
    });
  });
});
