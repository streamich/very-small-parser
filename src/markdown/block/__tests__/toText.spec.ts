import {parse} from './setup';
import {toText} from '../toText';

describe('toText', () => {
  const testCases: [src: string, expected?: string, name?: string][] = [
    ['plain text'],
  ];

  testCases.forEach(([src, expected = src, name = src]) => {
    it(name, () => {
      const ast = parse(src);
      // console.log(ast);
      const text = toText(ast);
      expect(text).toBe(expected);
    });
  });
});
