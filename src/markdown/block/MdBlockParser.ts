import {Parser, type ParserOpts} from '../../Parser';
import type {IParser, TTokenizer} from '../../types';
import type {MdInlineParser} from '../inline/MdInlineParser';
import type {TInlineToken} from '../inline/types';
import type {IRoot, TBlockToken} from './types';

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

  public parser(src: string): IRoot {
    const token: IRoot = {
      type: 'root',
      children: this.parse(src) as TBlockToken[],
      len: src.length,
    };
    return token;
  }

  public parsei(src: string): TInlineToken[] {
    return this.inline.parse(src);
  }
}
