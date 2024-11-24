import type {TTokenizer, TAnyToken, TTokenType, TEat, IParser, IText, TInlineToken, TBlockToken, IRoot} from './types';

const isTest = process.env.NODE_ENV === 'test';

export const token = <T extends TAnyToken>(
  value: string,
  type: TTokenType,
  children?: any,
  overrides?: Partial<TAnyToken>,
): T => {
  const tok = {
    type,
    len: value.length,
  } as T;

  if (isTest) {
    tok.raw = value;
  }

  if (children) {
    tok.children = children;
  }

  if (overrides) {
    Object.assign(tok, overrides);
  }

  return tok;
};

const eat: TEat<TAnyToken> = (subvalue, type, children, overrides) => {
  const tok = token(subvalue, type, children, overrides);

  return tok;
};

export const loop = (parser: IParser, tokenizer: TTokenizer<TAnyToken>, value: string): TAnyToken[] | undefined => {
  const children = [];
  const end = value.length;

  let remaining = value;
  let length = 0;

  while (length < end) {
    const tok = tokenizer.call(parser, eat, remaining);

    if (tok) {
      children.push(tok);
      length += tok.len || 0;
      remaining = remaining.substr(tok.len);
    } else {
      if (!children.length) {
        return;
      }
    }
  }

  return children;
};

export const first = (tokenizers: TTokenizer<any>[]): TTokenizer<any> => {
  return function (this: IParser, eat: TEat<any>, value: string) {
    for (const tokenizer of tokenizers) {
      const tok = tokenizer.call(this, eat, value);

      if (tok) {
        return tok;
      }
    }
  };
};

export interface IcreateParserOptions {
  inline: TTokenizer<TInlineToken>[];
  block: TTokenizer<TBlockToken>[];
}

const smartypants = (text: string) =>
  text
    .replace(/\.{3}/g, '\u2026')
    .replace(/\(C\)/gi, '©')
    .replace(/\(R\)/gi, '®')
    .replace(/\(TM\)/gi, '™')
    .replace(/\(P\)/g, '§')
    .replace(/\+\-/g, '±')
    .replace(/---/g, '\u2014')
    .replace(/--/g, '\u2013')
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018') // opening singles
    .replace(/'/g, '\u2019') // closing singles & apostrophes
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c') // opening doubles
    .replace(/"/g, '\u201d'); // closing doubles

const createParser = ({inline, block}: IcreateParserOptions) => {
  const parser: IParser = {} as IParser;

  parser.tokenizeInline = (value: string) => {
    const tokens = loop(parser, first(inline), value);

    if (!tokens) {
      return;
    }

    // MERGE ADJACENT TEXT TOKENS.
    const merged: TAnyToken[] = [];
    let lastTextToken: IText | null = null;

    for (let i = 0; i < tokens.length; i++) {
      const tok = tokens[i];

      if (tok.type === 'text') {
        tok.value = smartypants((tok as IText).value);

        if (lastTextToken) {
          lastTextToken.value += tok.value;
          lastTextToken.len += tok.len;
        } else {
          merged.push(tok);
          lastTextToken = tok as IText;
        }
      } else {
        merged.push(tok);
        lastTextToken = null;
      }
    }

    return merged;
  };

  parser.tokenizeBlock = (value: string) => {
    const tokens = loop(parser, first(block), value) as TBlockToken[];

    if (!tokens) {
      return;
    }

    const children = [] as TBlockToken[];

    for (const tok of tokens) {
      if (tok.type !== 'newline') {
        children.push(tok);
      }
    }

    return {
      type: 'root',
      children,
      len: value.length,
    } as IRoot;
  };

  parser.tokenizeChildBlock = (value: string) => {
    let children = parser.tokenizeBlock(value) as any;

    if (!children) {
      return children;
    }

    if (children.type === 'root') {
      children = children.children;
    }

    if (!children) {
      return children;
    }

    return children;
  };

  return parser;
};

export default createParser;
