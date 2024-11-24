import type {TTokenizer, IInlineMath} from '../types';

const REG = /^\${1,2}(?=\S)([\s\S]*?\S)\${1,2}/;

const inlineMath = () => {
  const tokenizer: TTokenizer<IInlineMath> = (eat, value) => {
    const matches = value.match(REG);

    if (matches) {
      return eat(matches[0], 'inlineMath', void 0, {value: matches[1]});
    }

    return;
  };

  return tokenizer;
};

export default inlineMath;
