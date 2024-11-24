import type {TInlineToken, TTokenTypeInline, TTokenizer} from './types';

const createRegexTokenizer = <T extends TInlineToken>(
  type: TTokenTypeInline,
  reg: RegExp,
  childrenMatchIndex: number,
) => {
  const tokenizer: TTokenizer<T> = function (eat, value) {
    const matches = value.match(reg);

    return matches ? eat(matches[0], type, this.tokenizeInline(matches[childrenMatchIndex])) : void 0;
  };

  return tokenizer;
};

export default createRegexTokenizer;
