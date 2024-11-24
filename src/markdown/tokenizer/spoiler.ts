import type {TTokenizer, ISpoiler} from '../types';

const REG = /^~~~([\s\S]*)~~~/;

const spoiler: TTokenizer<ISpoiler> = function (eat, value) {
  const matches = value.match(REG);
  return matches ? eat(matches[0], 'spoiler', this.tokenizeInline(matches[1])) : void 0;
};

export default spoiler;
