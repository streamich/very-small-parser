import {parse} from './setup';
import {toText} from '../block/toText';
import * as fs from 'fs';
import * as path from 'path';

describe('toText', () => {
  const files = ['basic.md', 'blockquotes.md', 'references.md', 'all-nodes.md'];

  describe('can reprint a Markdown file', () => {
    for (const file of files) {
      test(file, () => {
        const src = fs.readFileSync(path.join(__dirname, 'fixtures', file)) + '';
        const ast = parse(src);
        const text = toText(ast);
        try {
          expect(text).toBe(src.trim());
        } catch (error) {
          console.log(text);
          throw error;
        }
      });
    }
  });
});
