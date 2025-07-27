import { markdown } from './src/index';

const testCase = '---\nmultiline:\n  - item1\n  - item2\n---';
console.log('Input:', JSON.stringify(testCase));

const ast = markdown.block.parse(testCase);
console.log('AST:', JSON.stringify(ast, null, 2));