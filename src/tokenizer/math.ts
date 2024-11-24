import type {TTokenizer, IMath} from '../types';

const REG = /^ *\$\$[ \.]*(\S+)? *\n([\s\S]*?)\s*\$\$ *(?:\n+|$)/;

const math: TTokenizer<IMath> = (eat, value) => {
  const matches = value.match(REG);

  return matches ? eat(matches[0], 'math', void 0, {value: matches[2]}) : void 0;
};

export default math;
