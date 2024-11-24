import type {TTokenizer, IEmphasis} from '../types';

const REG =
  /^_([^\s][\s\S]*?[^\s_])_(?!_)|^_([^\s_][\s\S]*?[^\s])_(?!_)|^\*([^\s][\s\S]*?[^\s*])\*(?!\*)|^\*([^\s*][\s\S]*?[^\s])\*(?!\*)|^_([^\s_])_(?!_)|^\*([^\s*])\*(?!\*)/;

const emphasis: TTokenizer<IEmphasis> = function (eat, value) {
  const matches = value.match(REG);

  if (matches) {
    const subvalue = matches[6] || matches[5] || matches[4] || matches[3] || matches[2] || matches[1];

    return eat(matches[0], 'emphasis', this.tokenizeInline(subvalue));
  }

  return;
};

export default emphasis;
