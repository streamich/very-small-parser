import {toText} from '../../markdown/block/toText';
import {toMdast} from '../toMdast';
import {parsef} from './setup';
import {testCases} from './toMdast.fixtures';

describe('toMdast', () => {
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

  it('converts <fragment> nodes to "root" nodes', () => {
    const hast = {
      type: 'element',
      tagName: '', // <fragment>
      children: [
        {type: 'element', tagName: 'p', children: [{type: 'text', value: 'a'}]},
        {type: 'element', tagName: 'p', children: [{type: 'text', value: 'b'}]},
      ],
    };
    const mdast = toMdast(hast as any);
    expect(mdast.type).toBe('root');
    const md = toText(mdast);
    expect(md).toBe('a\n\nb');
  });

  it('converts "root" nodes to "root" nodes', () => {
    const hast = {
      type: 'root',
      children: [
        {type: 'element', tagName: 'p', children: [{type: 'text', value: 'a'}]},
        {type: 'element', tagName: 'p', children: [{type: 'text', value: 'b'}]},
      ],
    };
    const mdast = toMdast(hast as any);
    expect(mdast.type).toBe('root');
    const md = toText(mdast);
    expect(md).toBe('a\n\nb');
  });
});
