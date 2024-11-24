import {create} from '../src';
import {join, parse} from 'path';
import {readdirSync, readFileSync, writeFileSync} from 'fs';

const parser = create();
const mdDir = join(__dirname, 'md');
const jsonDir = join(__dirname, 'json');
const mdFiles = readdirSync(mdDir);

for (const mdFile of mdFiles) {
    const {name} = parse(mdFile);
    const md = readFileSync(join(mdDir, mdFile), 'utf8');
    const ast = parser.tokenizeBlock(md);
    writeFileSync(join(jsonDir, name + '.json'), JSON.stringify(ast, null, 2));
}
