import type {TTokenizer, IDelete} from '../types';

const REG = /^~~(?=\S)([\s\S]*?\S)~~/;

const deletedText = () => {
  const tokenizer: TTokenizer<IDelete> = function (eat, value) {
    const matches = value.match(REG);

    if (matches) {
      return eat(matches[0], 'delete', this.tokenizeInline(matches[1]));
    }

    return;
  };

  return tokenizer;
};

export default deletedText;
