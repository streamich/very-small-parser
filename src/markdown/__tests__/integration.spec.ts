import * as fs from 'fs';
import * as path from 'path';
import {parse} from './setup';

const check = (md: any, json: any) =>
  test(md, () => {
    const mdFilepath = path.join(__dirname, 'fixtures', md);
    const ast = parse(fs.readFileSync(mdFilepath, 'utf8'));
    const expected = require(path.join(__dirname, 'fixtures', json));
    try {
      expect(ast).toMatchObject(expected);
    } catch (error) {
      console.log(JSON.stringify(ast, null, 2));
      throw error;
    }
  });

describe('Integration', () => {
  check('basic.md', 'basic.json');
  check('blockquotes.md', 'blockquotes.json');
  check('footnote.md', 'footnote.json');
  check('references.md', 'references.json');
  check('inline.md', 'inline.json');
});
