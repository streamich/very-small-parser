import {parse} from './setup';
import {toText} from '../toText';
import {testCases} from './toText.fixtures';

describe('toText', () => {
  testCases.forEach(([src, expected = src, name = src]) => {
    it(name, () => {
      const ast = parse(src);
      // console.log(ast);
      const text = toText(ast);
      expect(text).toBe(expected);
    });
  });
});
