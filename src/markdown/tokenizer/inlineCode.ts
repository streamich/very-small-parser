import type {TTokenizer, IInlineCode} from '../types';

const REG = /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/;

const inlineCode = () => {
  const tokenizer: TTokenizer<IInlineCode> = (eat, value) => {
    const matches = value.match(REG);

    if (matches) {
      return eat(matches[0], 'inlineCode', void 0, {
        value: matches[2],
        wrap: matches[1],
      });
    }

    return;
  };

  return tokenizer;
};

export default inlineCode;
