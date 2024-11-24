import {token} from '../util';
import * as reg from '../markdown/regex';
import type {TTokenizer} from '../types';
import type * as type from './types';
import type {HtmlParser} from './HtmlParser';

const comment: TTokenizer<type.IComment, HtmlParser> = (eat, value) => {
  const matches = value.match(reg.comment);
  if (matches) {
    const match = matches[0];
    const value = match.slice(4, -3);
    return token<type.IComment>(match, 'comment', void 0, {value});
  }
};

const REG_TEXT = /^[^<]+/;
const text: TTokenizer<type.IText, HtmlParser> = (eat, src) => {
  const matches = src.match(REG_TEXT);
  if (!matches) return;
  const value = matches[0];
  return token<type.IText>(value, 'text', void 0, {value}, value.length);
};

export const parsers: TTokenizer<type.THtmlToken, HtmlParser>[] = [
  <TTokenizer<type.THtmlToken, HtmlParser>>text,
  <TTokenizer<type.THtmlToken, HtmlParser>>comment,
];
