import {Parser, type ParserOpts} from '../Parser';
import {first, loop0} from '../util';
import {el} from './parsers';
import type {IElement, IRoot, IText, THtmlToken} from './types';
import type {IParser, TNullableToken, TTokenizer} from '../types';

export interface HtmlParserOpts extends ParserOpts<THtmlToken, HtmlParser> {
  parsers: TTokenizer<THtmlToken, HtmlParser>[];
}

export class HtmlParser extends Parser<THtmlToken> implements IParser<THtmlToken> {
  public readonly first: TTokenizer<THtmlToken, HtmlParser>;

  constructor(opts: HtmlParserOpts) {
    super(opts as ParserOpts<THtmlToken, Parser<THtmlToken>>);
    this.first = first<THtmlToken, this>(this.parsers) as TTokenizer<THtmlToken, HtmlParser>;
  }

  public parse(src: string): THtmlToken[] {
    const children = [];
    const end = src.length;
    let remaining = src;
    let length = 0;
    while (length < end) {
      const tok = this.first(this, remaining);
      if (!tok) {
        const textToken: IText = {
          type: 'text',
          value: remaining[0],
          len: 1,
        };
        children.push(textToken);
        length += 1;
        remaining = remaining.slice(1);
        continue;
      }
      children.push(tok);
      length += tok.len || 0;
      remaining = remaining.slice(tok.len);
    }
    return children;
  }

  public parsef(src: string): IRoot {
    const [children, len] = loop0(this, this.first, src);
    const root: IRoot = {type: 'root', children, len};
    return root;
  }

  public el(src: string): TNullableToken<IElement> {
    return el(this, src);
  }
}
