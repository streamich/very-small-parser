import type {TTokenizer, IThematicBreak} from '../types';
import {hr as REG} from '../regex';

// const REG = /^ *([-*_]{3,})\s*(?:\n+|$)/;

const thematicBreak: TTokenizer<IThematicBreak> = (eat, value) => {
  const matches = value.match(REG);

  return matches ? eat(matches[0], 'thematicBreak', void 0, {value: matches[1]}) : void 0;
};

export default thematicBreak;
