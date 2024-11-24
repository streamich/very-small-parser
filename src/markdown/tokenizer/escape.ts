import type {TTokenizer, IBreak} from '../types';

const REG = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;

// biome-ignore lint: allow "escape" name
const escape: TTokenizer<IBreak> = (eat, value) => {
  const matches = value.match(REG);

  return matches ? eat(matches[0], 'text', void 0, {value: matches[1]}) : void 0;
};

export default escape;
