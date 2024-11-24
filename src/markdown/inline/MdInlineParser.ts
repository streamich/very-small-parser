import {Parser} from '../../Parser';
import {IParser, TTokenizer} from '../../types';
import type {TInlineToken} from './types';

export interface MdInlineParserOpts<T extends TInlineToken> {
  parsers: TTokenizer<T, MdInlineParser<T>>[];
}

export class MdInlineParser<T extends TInlineToken> extends Parser<T> implements IParser<T> {
  constructor(opts: MdInlineParserOpts<T>) {
    super(opts);
  }
}
