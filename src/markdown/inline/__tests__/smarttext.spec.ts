import {parse} from './setup';

const check = (name: any, src: any, out: any) =>
  test(name, () => {
    const ast = parse(src);
    expect(ast).toMatchObject([{type: 'text', value: out}]);
  });

describe('smarttext', () => {
  check('...', '...', '…');
  check('(c)', '(c)', '©');
  check('(C)', '(C)', '©');
  check('two (c)', '(C) and (c)', '© and ©');
  check('(r)', '(r)', '®');
  check('(R)', '(R)', '®');
  check('(tm)', '(tm)', '™');
  check('(TM)', '(TM)', '™');
  check('(P)', '(P)', '§');
  check('+-', '+-', '±');
  check('---', '---', '\u2014');
  check('--', '--', '\u2013');
  check('"quotes"', '"quotes"', '“quotes”');
  check("'quotes'", "'quotes'", '‘quotes’');
});
