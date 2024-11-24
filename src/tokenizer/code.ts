import type {TTokenizer, ICode} from '../types';

const REG = /^(\s{4}[^\n]+\n*)+/;

const code: TTokenizer<ICode> = (eat, value) => {
  const matches = value.match(REG);

  if (!matches) {
    return;
  }

  const subvalue = matches[0];
  const overrides = {
    value: subvalue.replace(/^ {4}/gm, '').replace(/\n+$/, ''),
    lang: null,
  };

  return eat(subvalue, 'code', void 0, overrides);
};

export default code;
