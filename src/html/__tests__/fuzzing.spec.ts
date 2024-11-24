import {parse} from './setup';

const atoms = [
  'text',
  ' ',
  '\n',
  '\t',
  '<!-- comment -->',
  '<!--',
  '-->',
  '<!',
  '<!-',
  '<div>',
  '</div>',
  '<span>',
  '</span>',
  '<span/>',
  '<span />',
  '<img',
  'foo="bar"',
  '<',
  '>',
  '</',
];

test('does not crash, regardless of input combination', () => {
  for (let j = 0; j < 1000; j++) {
    const size = 1 + Math.round(Math.random() * 10);
    let src = '';
    for (let i = 0; i < size; i++) {
      const index = Math.floor(Math.random() * atoms.length);
      src += atoms[index];
    }
    parse(src);
  }
});
