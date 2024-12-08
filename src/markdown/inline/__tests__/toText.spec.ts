import {parse} from './setup';
import {toText} from '../toText';
import {testCases} from './toText.fixtures';

describe('toText', () => {
  for (const [src, expected = src, name = src] of testCases) {
    it(name, () => {
      const ast = parse(src);
      // console.log(ast);
      const text = toText(ast);
      expect(text).toBe(expected);
    });
  }
});
