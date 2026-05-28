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

const REG_DOCTYPE = /^<!doctype\s+[^>]*>/i;
const doctype: TTokenizer<type.IDoctype, HtmlParser> = (_, src) => {
  const matches = src.match(REG_DOCTYPE);
  if (matches) {
    const match = matches[0];
    const value = match.slice(9, -1).trim(); // Remove <!doctype and >
    return token<type.IDoctype>(match, 'doctype', void 0, {value});
  }
};

const REG_CDATA = /^<!\[CDATA\[[\s\S]*?\]\]>/;
const cdata: TTokenizer<type.IText, HtmlParser> = (_, src) => {
  const matches = src.match(REG_CDATA);
  if (matches) {
    const match = matches[0];
    const value = match.slice(9, -3); // Remove <![CDATA[ and ]]>
    return token<type.IText>(match, 'text', void 0, {value}, match.length);
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

// HTML void elements that don't need closing tags
const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 
  'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

const unescapeAttr = (str: string): string => {
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, '\u00A0')
    .replace(/&amp;/g, '&')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(code));
};

const REG_ATTR = / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/;
const REG_OPEN_TAG = reg.replace(/^<([a-zA-Z][\w-]*)(?:attr)*? *(\/?)>/i, {attr: REG_ATTR});
const REG_ATTRS = /([\w|data-]+)=["']?((?:.(?!["']?\s+(?:\S+)=|\s*\/?[>"']))*.)["']?/gim;
const REG_CLOSE_TAG = /^<\/([a-zA-Z][\w-]*)>/i;
export const el: TTokenizer<type.IElement, HtmlParser> = (parser, src) => {
  const matchOpen = src.match(REG_OPEN_TAG);
  if (!matchOpen) return;
  const [match, rawTagName, selfClosing] = matchOpen;
  const tagName = rawTagName.toLowerCase(); // Normalize to lowercase
  const matchLength = match.length;
  const attrSrc = match.slice(rawTagName.length + 1, -1 - selfClosing.length);
  const properties: Record<string, string> = {};
  if (attrSrc) {
    const attrs = attrSrc.matchAll(REG_ATTRS);
    for (const [, key, value] of attrs) properties[key.toLowerCase()] = unescapeAttr(value);
  }
  const token: type.IElement = {
    type: 'element',
    tagName,
    properties,
    children: [],
    len: matchLength,
  };
  
  // Handle void elements and self-closing elements
  const isVoidElement = VOID_ELEMENTS.has(tagName);
  if (!selfClosing && !isVoidElement) {
    const substr = src.slice(matchLength);
    const fragment = parser.parsef(substr);
    const fragmentLen = fragment.len;
    const matchClose = substr.slice(fragmentLen).match(REG_CLOSE_TAG);
    if (matchClose) {
      token.len! += fragment.len! + matchClose[0].length;
      token.children = fragment.children as any;
    } else {
      // No closing tag found, but we still include the content for robustness
      token.len! += fragment.len!;
      token.children = fragment.children as any;
    }
  }
  return token;
};

export const parsers = (dhe: (html: string) => string): TTokenizer<type.THtmlToken, HtmlParser>[] => [
  <TTokenizer<type.THtmlToken, HtmlParser>>doctype,
  <TTokenizer<type.THtmlToken, HtmlParser>>comment,
  <TTokenizer<type.THtmlToken, HtmlParser>>cdata,
  <TTokenizer<type.THtmlToken, HtmlParser>>el,
  <TTokenizer<type.THtmlToken, HtmlParser>>text(dhe),
];
