import type {TTokenizer, ICode} from '../types';

const REG = /^ *(`{3,}|~{3,})([^\s]*) *([^\n]*)\n([\s\S]*?)\s*\1 *(?:\n+|$)/;

const fences: TTokenizer<ICode> = (eat, value) => {
  const matches = value.match(REG);

  if (!matches) {
    return;
  }

  const subvalue = matches[0];
  const overrides = {
    value: matches[4] || matches[3],
    lang: matches[2] || '',
    meta: matches.length > 4 ? matches[3] : null,
  };

  return eat(subvalue, 'code', void 0, overrides);
};

export default fences;
