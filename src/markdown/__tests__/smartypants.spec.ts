import {create} from '../index';

const check = (name: any, src: any, out: any) =>
  test(name, () => {
    const parser = create();
    const ast = parser.tokenizeInline(src);

    expect(ast).toMatchObject([{type: 'text', value: out}]);
  });

describe('smartypants', () => {
  check('...', '...', '…');
  check('(c)', '(c)', '©');
  check('(C)', '(C)', '©');
  check('(r)', '(r)', '®');
  check('(R)', '(R)', '®');
  check('(tm)', '(tm)', '™');
  check('(TM)', '(TM)', '™');
  check('(P)', '(P)', '§');
  check('+-', '+-', '±');
  check('---', '---', '\u2014');
  check('"quotes"', '"quotes"', '“quotes”');
  check("'quotes'", "'quotes'", '‘quotes’');
});
