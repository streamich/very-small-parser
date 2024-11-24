import {tag} from '../../markdown/regex';
import {parse} from './setup';

const atoms = [
  'text',
  ' ',
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

test('does not crash, regardless of input combination', () => {});
