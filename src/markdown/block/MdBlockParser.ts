import {Parser, type ParserOpts} from '../../Parser';
import {IParser, TTokenizer} from '../../types';
import {MdInlineParser} from '../inline/MdInlineParser';
import type {TInlineToken} from '../inline/types';
import type {TBlockToken} from './types';

export interface MdBlockParserOpts<T extends TBlockToken> extends ParserOpts<T, MdBlockParser<T>> {
  parsers: TTokenizer<T, MdBlockParser<T>>[];
  inline: MdInlineParser;
}

export class MdBlockParser<T extends TBlockToken> extends Parser<T> implements IParser<T> {
  public readonly inline: MdInlineParser;

  constructor(opts: MdBlockParserOpts<T>) {
    super(opts as any);
    this.inline = opts.inline;
  }

  public parseInline(value: string): TInlineToken[] {
    return this.inline.parse(value);
  }
}
