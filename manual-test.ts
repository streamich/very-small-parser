import { markdown } from './src/index';
import { toText } from './src/markdown/block/toText';

// Test frontmatter pretty-printing
const testCases = [
  '---\nfoo: bar\n---',
  '--- yaml\nkey: value\n---',
  '### cson\ndata: content\n###',
  '=== yaml\ntest: value\n===',
  '+++ toml\nname = "test"\n+++',
  '--- yaml\nkey:\n  - item1\n  - item2\n---'
];

console.log('Testing Markdown frontmatter pretty-printing:\n');

for (const testCase of testCases) {
  console.log('Input:');
  console.log(testCase);
  
  const ast = markdown.block.parse(testCase);
  const result = toText(ast);
  
  console.log('Output:');
  console.log(result);
  console.log('Match:', testCase === result ? '✓' : '✗');
  console.log('---');
}