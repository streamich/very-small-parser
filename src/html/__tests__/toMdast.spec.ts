import {toText} from '../../markdown/block/toText';
import {toMdast} from '../toMdast';
import {parsef} from './setup';
import {testCases} from './toMdast.fixtures';

describe('toHast', () => {
  for (const [html, markdown, name = html] of testCases) {
    it(name, () => {
      const hast = parsef(html);
      // console.log(JSON.stringify(hast, null, 2));
      const mdast = toMdast(hast);
      // console.log(JSON.stringify(mdast, null, 2));
      const md = toText(mdast);
      // console.log('MD', md);
      try {
        expect(md).toBe(markdown);
      } catch (error) {
        console.log(md);
        throw error;
      }
    });
  }
});
