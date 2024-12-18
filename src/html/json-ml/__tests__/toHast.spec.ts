import {toHast} from '../toHast';
import {testCases} from './toHast.fixtures';

describe('toHast', () => {
  for (const [jsonml, hast, name] of testCases) {
    test(name, () => {
      expect(toHast(jsonml)).toEqual(hast);
    });
  }
});
