import {toMarkdown} from '../toMarkdown';
import type {JsonMlNode} from '../types';

describe('tag mapping', () => {
  const testCases: [name: string, ml: JsonMlNode, md: string][] = [
    ['<b>', ['b', null, 'bold'], '__bold__'],
    ['<strong>', ['strong', null, 'strong'], '__strong__'],
    ['<i>', ['i', null, 'italic'], '*italic*'],
    ['<em>', ['em', null, 'emphasis'], '*emphasis*'],
    ['<h1>', ['h1', null, 'heading'], '# heading\n\n'],
    ['<h2>', ['h2', null, 'heading'], '## heading\n\n'],
    ['<h3>', ['h3', null, 'heading'], '### heading\n\n'],
    ['<h4>', ['h4', null, 'heading'], '#### heading\n\n'],
    ['<h5>', ['h5', null, 'heading'], '##### heading\n\n'],
    ['<h6>', ['h6', null, 'heading'], '###### heading\n\n'],
    ['<p>', ['p', null, 'paragraph'], 'paragraph\n\n'],
    ['<blockquote>', ['blockquote', null, 'quote'], '> quote\n\n'],
    ['<hr>', ['hr', null], '---\n\n'],
    ['<pre>', ['pre', null, 'code'], '```\ncode```\n\n'],
  ];

  for (const [name, ml, expected] of testCases) {
    test(name, () => {
      const md = toMarkdown(ml);
      expect(md).toBe(expected);
    });
  }
});
