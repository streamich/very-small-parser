import {Parser, ParserOpts} from '../Parser';
import {IRoot, THtmlToken} from './types';
import {first} from '../util';
import type {IParser, TTokenizer} from '../types';

export interface HtmlParserOpts extends ParserOpts<THtmlToken, HtmlParser> {
  parsers: TTokenizer<THtmlToken, HtmlParser>[];
}

export class HtmlParser extends Parser<THtmlToken> implements IParser<THtmlToken> {
  // biome-ignore lint: keep constructor for typing
  constructor(opts: HtmlParserOpts) {
    super(opts as ParserOpts<THtmlToken, Parser<THtmlToken>>);
  }

  public parseFragment(src: string): IRoot {
    const tokenizer = first<THtmlToken, this>(this.parsers);
    const children = [];
    const end = src.length;
    let remaining = src;
    let length = 0;
    while (length < end) {
      const tok = tokenizer(this, remaining);
      if (!tok) break;
      children.push(tok);
      length += tok.len || 0;
      remaining = remaining.slice(tok.len);
    }
    const root: IRoot = {
      type: 'root',
      children,
      len: length,
    };
    return root;
  }
}
