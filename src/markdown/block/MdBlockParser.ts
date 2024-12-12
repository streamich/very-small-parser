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

  public parsef(src: string): IRoot {
    const tokens = this.parse(src) as TBlockToken[];
    const token: IRoot = {
      type: 'root',
      children: tokens,
      len: src.length,
    };
    // Merge adjacent "list" tokens.
    const length = tokens.length;
    for (let i = 0; i < length - 1; i++) {
      const tok1 = tokens[i];
      if (tok1?.type === 'list') {
        const tok2 = tokens[i + 1];
        if (tok2?.type === 'list') {
          tok1.spread = true;
          tok1.children.push(...tok2.children);
          tokens.splice(i + 1, 1);
          i--;
        }
      }
    }
    return token;
  }

  public parsei(src: string): TInlineToken[] {
    return this.inline.parse(src);
  }
}
