import {token} from '../util';
import * as reg from '../markdown/regex';
import type {TTokenizer} from '../types';
import type {HtmlParser} from './HtmlParser';
import type * as type from './types';

const REG_COMMENT = /^<!--(?!-?>)[\s\S]*?-->/;
const comment: TTokenizer<type.IComment, HtmlParser> = (_, src) => {
  const matches = src.match(REG_COMMENT);
  if (matches) {
    const match = matches[0];
    const value = match.slice(4, -3);
    return token<type.IComment>(match, 'comment', void 0, {value});
  }
};

const REG_TEXT = /^[^<]+/;
const text =
  (dhe: (html: string) => string): TTokenizer<type.IText, HtmlParser> =>
  (_, src) => {
    const matches = src.match(REG_TEXT);
    if (!matches) return;
    let value = matches[0];
    if (dhe) value = dhe(value);
    return token<type.IText>(value, 'text', void 0, {value}, value.length);
  };

const REG_ATTR = / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/;
const REG_OPEN_TAG = reg.replace(/^<([a-z][\w-]*)(?:attr)*? *(\/?)>/, {attr: REG_ATTR});
const REG_ATTRS = /([\w|data-]+)=["']?((?:.(?!["']?\s+(?:\S+)=|\s*\/?[>"']))*.)["']?/gm;
const REG_CLOSE_TAG = /^<\/([a-z][\w-]*)>/;
export const el: TTokenizer<type.IElement, HtmlParser> = (parser, src) => {
  const matchOpen = src.match(REG_OPEN_TAG);
  if (!matchOpen) return;
  const [match, tagName, selfClosing] = matchOpen;
  const matchLength = match.length;
  const attrSrc = match.slice(tagName.length + 1, -1 - selfClosing.length);
  const properties: Record<string, string> = {};
  if (attrSrc) {
    const attrs = attrSrc.matchAll(REG_ATTRS);
    for (const [, key, value] of attrs) properties[key] = value;
  }
  const token: type.IElement = {
    type: 'element',
    tagName,
    properties,
    children: [],
    len: matchLength,
  };
  if (!selfClosing) {
    const substr = src.slice(matchLength);
    const fragment = parser.parsef(substr);
    const fragmentLen = fragment.len;
    if (selfClosing) {
      token.len! += fragment.len!;
    } else {
      const matchClose = substr.slice(fragmentLen).match(REG_CLOSE_TAG);
      if (!matchClose) return token;
      token.len! += fragment.len! + (matchClose?.[0].length ?? 0);
    }
    token.children = fragment.children as any;
  }
  return token;
};

export const parsers = (dhe: (html: string) => string): TTokenizer<type.THtmlToken, HtmlParser>[] => [
  <TTokenizer<type.THtmlToken, HtmlParser>>text(dhe),
  <TTokenizer<type.THtmlToken, HtmlParser>>comment,
  <TTokenizer<type.THtmlToken, HtmlParser>>el,
];
