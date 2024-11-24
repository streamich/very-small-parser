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

export const parsers: TTokenizer<type.THtmlToken, HtmlParser>[] = [
  <TTokenizer<type.THtmlToken, HtmlParser>>comment,
];
