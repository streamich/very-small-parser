import {Parser} from '../../Parser';
import type {IParser, TTokenizer} from '../../types';
import type {IText, TInlineToken} from './types';

export interface MdInlineParserOpts<T extends TInlineToken> {
  parsers: TTokenizer<T, MdInlineParser<T>>[];
}

export class MdInlineParser<T extends TInlineToken = TInlineToken> extends Parser<T> implements IParser<T> {
  // biome-ignore lint: keep constructor for typing
  constructor(opts: MdInlineParserOpts<T>) {
    super(opts);
  }

  public parse(src: string): T[] {
    const tokens = super.parse(src);
    // Merge adjacent text tokens.
    const merged: T[] = [];
    const length = tokens.length;
    let text: IText | undefined;
    for (let i = 0; i < length; i++) {
      const tok = tokens[i];
      if (tok.type === 'text') {
        if (text) {
          text.value += tok.value;
          text.len! += tok.len!;
        } else merged.push(<T>(text = tok));
      } else {
        merged.push(tok);
        text = void 0;
      }
    }
    return merged;
  }
}
