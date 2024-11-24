import * as fs from 'fs';
import * as path from 'path';
import {create} from '../index';

const check = (md: any, json: any) =>
  test(md, () => {
    const parser = create();
    const mdFilepath = path.join(__dirname, 'fixtures', md);
    const ast = parser.tokenizeBlock(fs.readFileSync(mdFilepath, 'utf8'));
    const expected = require(path.join(__dirname, 'fixtures', json));

    expect(ast).toMatchObject(expected);
  });

describe('Integration', () => {
  check('basic.md', 'basic.json');
  check('blockquotes.md', 'blockquotes.json');
  check('footnote.md', 'footnote.json');
  check('references.md', 'references.json');
  check('inline.md', 'inline.json');
});
