import type {IParser, IToken, TTokenizer} from './types';
import {loop, first} from './util';

export interface ParserOpts<T extends IToken, P extends Parser<T>> {
  parsers: TTokenizer<T, P>[];
}

export class Parser<T extends IToken> implements IParser<T> {
  protected readonly parsers: TTokenizer<T, Parser<T>>[];

  constructor(opts: ParserOpts<T, Parser<T>>) {
    this.parsers = opts.parsers;
  }

  public parse(src: string): T[] {
    return loop<T, this>(this, first<T, this>(this.parsers), src) as T[];
  }
}
