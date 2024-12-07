import {parse} from './setup';
import {toText} from '../toText';
import {testCases} from '../../inline/__tests__/toText.fixtures';

const blockTestCases = testCases.filter(([, , , inlineOnly]) => !inlineOnly);

describe('toText (inline)', () => {
  for (const [src, expected = src, name = src] of blockTestCases) {
    it(name, () => {
      const ast = parse(src);
      // console.log(JSON.stringify(ast, null, 2));
      const text = toText(ast);
      expect(text).toBe(expected);
    });
  }
});
