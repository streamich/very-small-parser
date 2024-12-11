import {parsef} from './setup';
import {toText} from '../../../html/toText';
import {testCases} from './toHast.fixtures';
import {toHast} from '../toHast';

describe('toHast', () => {
  for (const [markdown, expected, name = markdown] of testCases) {
    it(name, () => {
      const mdast = parsef(markdown);
      // console.log(JSON.stringify(mdast, null, 2));
      const hast = toHast(mdast);
      // console.log(JSON.stringify(hast, null, 2));
      const html = toText(hast);
      // console.log(html);
      expect(html).toBe(expected);
    });
  }
});
