import type {TTokenizer, IStrong} from '../types';

const REG =
  /^__([^\s][\s\S]*?[^\s])__(?!_)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)|^__([^\s])__(?!_)|^\*\*([^\s])\*\*(?!\*)/;

const strong: TTokenizer<IStrong> = function (eat, value) {
  const matches = value.match(REG);

  if (matches) {
    const subvalue = matches[4] || matches[3] || matches[2] || matches[1];

    return eat(matches[0], 'strong', this.tokenizeInline(subvalue));
  }

  return;
};

export default strong;
