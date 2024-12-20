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

export const loop0 = <T extends IToken, P extends IParser<T>>(
  parser: P,
  tokenizer: TTokenizer<T, P>,
  src: string,
): [tokens: T[], length: number] => {
  const children = [];
  const end = src.length;
  let remaining = src;
  let length = 0;
  while (length < end) {
    const tok = tokenizer(parser, remaining);
    if (!tok) break;
    if (tok.type) children.push(tok);
    length += tok.len || 0;
    remaining = remaining.slice(tok.len);
  }
  return [children, length];
};

export const loop = <T extends IToken, P extends IParser<T>>(
  parser: P,
  tokenizer: TTokenizer<T, P>,
  src: string,
): T[] => loop0(parser, tokenizer, src)[0];

export const first = <T extends IToken, P extends IParser<T>>(tokenizers: TTokenizer<T, P>[]): TTokenizer<T, P> => {
  const length = tokenizers.length;
  return (parser, src: string) => {
    for (let i = 0; i < length; i++) {
      const tokenizer = tokenizers[i];
      const tok = tokenizer(parser, src);
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

export const rep = (search: RegExp | string, replace: string, str: string): string => str.replace(search, replace);
export const repAll = (search: string, replace: string, str: string): string => str.replaceAll(search, replace);

const textarea = typeof document === 'object' ? document.createElement('textarea') : void 0;

/** Decode HTML entities. */
export const dhe = (html: string): string => (textarea ? ((textarea.innerHTML = html), textarea.value) : html);
