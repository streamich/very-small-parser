import {Parser} from '../Parser';
import {THtmlToken} from './types';
import type {IParser, TTokenizer} from '../types';

export interface HtmlParserOpts {
  parsers: TTokenizer<THtmlToken, HtmlParser>[];
}

export class HtmlParser extends Parser<THtmlToken> implements IParser<THtmlToken> {
  // biome-ignore lint: keep constructor for typing
  constructor(opts: HtmlParserOpts) {
    super(opts);
  }
}
