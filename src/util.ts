import type {IParser, IToken, TTokenizer} from './types';

const isTest = process.env.NODE_ENV !== 'production';

export const token = <T extends IToken>(
  value: string,
  type: T['type'],
  children?: any,
  overrides?: Partial<T>,
  len: number = value.length,
): T => {
  const tok = {type, len} as T;
  if (isTest) tok.raw = value;
  if (children) tok.children = children;
  if (overrides) Object.assign(tok, overrides);
  return tok;
};

export const loop = <T extends IToken, P extends IParser<T>>(
  parser: P,
  tokenizer: TTokenizer<T, P>,
  value: string,
): T[] => {
  const children = [];
  const end = value.length;
  let remaining = value;
  let length = 0;
  while (length < end) {
    const tok = tokenizer(parser, remaining);
    if (tok) {
      children.push(tok);
      length += tok.len || 0;
      remaining = remaining.slice(tok.len);
    } else if (!children.length) return [];
  }
  return children;
};

export const first = <T extends IToken, P extends IParser<T>>(tokenizers: TTokenizer<T, P>[]): TTokenizer<T, P> => {
  const length = tokenizers.length;
  return (parser, value: string) => {
    for (let i = 0; i < length; i++) {
      const tokenizer = tokenizers[i];
      const tok = tokenizer(parser, value);
      if (tok) return tok;
    }
    return;
  };
};

export const regexParser =
  <T extends IToken>(type: T['type'], reg: RegExp, childrenMatchIndex: number): TTokenizer<T> =>
  (parser, value) => {
    const matches = value.match(reg);
    return matches ? token<T>(matches[0], type, parser.parse(matches[childrenMatchIndex])) : void 0;
  };
