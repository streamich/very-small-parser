import {parse} from './setup';
import {toText} from '../../../html/toText';
import {testCases} from './toHast.fixtures';
import {toHast} from '../toHast';

describe('toHast', () => {
  for (const [markdown, html, name = markdown] of testCases) {
    it(name, () => {
      const mdast = parse(markdown);
      // console.log(mdast);
      const hast = toHast({type: 'root', children: mdast});
      const text = toText(hast);
      expect(text).toBe(html);
    });
  }
});
