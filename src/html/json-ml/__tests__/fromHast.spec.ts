import {fromHast} from '../fromHast';
import {testCases} from './toHast.fixtures';

describe('fromHast', () => {
  for (const [jsonml, hast, name] of testCases) {
    test(name, () => {
      expect(fromHast(hast)).toEqual(jsonml);
    });
  }
});
