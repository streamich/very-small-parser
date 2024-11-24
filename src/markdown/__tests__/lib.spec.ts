import {token, first} from '../createParser';
import icon from '../tokenizer/icon';

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
