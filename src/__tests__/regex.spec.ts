import {replace} from '../regex';

describe('regex', () => {
  describe('replace()', () => {
    test('exists', () => {
      expect(typeof replace).toBe('function');
    });

    test('interpolates regular expression', () => {
      const result = replace(/[0-9]+label,whitespace/, {
        label: /[a-z]+/,
        whitespace: /\s*/,
      });

      expect(result.source).toBe('[0-9]+[a-z]+,\\s*');
    });

    test('interpolates multiple locations', () => {
      const result = replace(/[0-9]+label,label/, {
        label: /[a-z]+/,
      });

      expect(result.source).toBe('[0-9]+[a-z]+,[a-z]+');
    });

    test('preserves flags', () => {
      let result = replace(/[0-9]+label,label/i, {
        label: /[a-z]+/,
      });

      expect(result.flags).toBe('i');

      result = replace(/[0-9]+label,label/g, {
        label: /[a-z]+/,
      });

      expect(result.flags).toBe('g');
    });
  });
});
