import type {TTokenizer, IParagraph} from '../types';
import {paragraph as REG} from '../regex';

const paragraph: TTokenizer<IParagraph> = function (eat, value) {
  const matches = value.match(REG);

  return matches ? eat(matches[0], 'paragraph', this.tokenizeInline(matches[1].trim())) : void 0;
};

export default paragraph;
