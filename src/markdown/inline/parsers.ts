import {regexParser, rep, repAll, token} from '../../util';
import {replace, label, urlInline, title} from '../regex';
import {html as htmlParser} from '../../html';
import type {IElement} from '../../html/types';
import type {TTokenizer} from '../../types';
import type * as types from './types';

const REG_INLINE_CODE = /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/;
const inlineCode: TTokenizer<types.IInlineCode> = (_, value) => {
  const matches = value.match(REG_INLINE_CODE);
  if (!matches) return;
  return token<types.IInlineCode>(matches[0], 'inlineCode', void 0, {
    value: matches[2],
    wrap: matches[1],
  });
};

const REG_STRONG =
  /^__([^\s][\s\S]*?[^\s])__(?!_)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)|^__([^\s])__(?!_)|^\*\*([^\s])\*\*(?!\*)/;
const strong: TTokenizer<types.IStrong> = (parser, value) => {
  const matches = value.match(REG_STRONG);
  if (!matches) return;
  const subvalue = matches[4] || matches[3] || matches[2] || matches[1];
  return token<types.IStrong>(matches[0], 'strong', parser.parse(subvalue));
};

const REG_EMPHASIS =
  /^_([^\s][\s\S]*?[^\s_])_(?!_)|^_([^\s_][\s\S]*?[^\s])_(?!_)|^\*([^\s][\s\S]*?[^\s*])\*(?!\*)|^\*([^\s*][\s\S]*?[^\s])\*(?!\*)|^_([^\s_])_(?!_)|^\*([^\s*])\*(?!\*)/;
const emphasis: TTokenizer<types.IEmphasis> = (parser, value) => {
  const matches = value.match(REG_EMPHASIS);
  if (!matches) return;
  const subvalue = matches[6] || matches[5] || matches[4] || matches[3] || matches[2] || matches[1];
  return token<types.IEmphasis>(matches[0], 'emphasis', parser.parse(subvalue));
};

const REG_DELETE = /^~~(?=\S)([\s\S]*?\S)~~/;
const deletedText: TTokenizer<types.IDelete> = (parser, value) => {
  const matches = value.match(REG_DELETE);
  if (matches) return token<types.IDelete>(matches[0], 'delete', parser.parse(matches[1]));
};

const REG_SPOILER = /^(?:(?:\|\|(?=\S)([\s\S]*)\|\|)|(?:\>\!(?=\S)([\s\S]*)\!\<))/;
const spoiler: TTokenizer<types.ISpoiler> = (parser, value) => {
  const matches = value.match(REG_SPOILER);
  if (!matches) return;
  const content = matches[1] || matches[2];
  return token<types.ISpoiler>(matches[0], 'spoiler', parser.parse(content));
};

const REG_INLINE_MATH = /^\${1,2}(?=\S)([\s\S]*?\S)\${1,2}/;
const inlineMath: TTokenizer<types.IInlineMath> = (parser, value) => {
  const matches = value.match(REG_INLINE_MATH);
  if (matches) return token<types.IInlineMath>(matches[0], 'inlineMath', void 0, {value: matches[1]});
};

const REG_FOOTNOTE_REFERENCE = /^\[\^([a-zA-Z0-9\-_]{1,64})\]/;
const footnoteReference: TTokenizer<types.IFootnoteReference> = (parser, value) => {
  const matches = value.match(REG_FOOTNOTE_REFERENCE);
  if (!matches) return;
  const label = matches[1];
  const identifier = label.toLowerCase();
  return token<types.IFootnoteReference>(matches[0], 'footnoteReference', void 0, {label, identifier});
};

const REG_REFERENCE = replace(/^!?\[(label)\]\s*(\[([^\]]*)\])?/, {label});
const reference: TTokenizer<types.ILinkReference | types.IImageReference> = (parser, value) => {
  const matches = value.match(REG_REFERENCE);
  if (!matches) return;
  const subvalue = matches[0];
  const isImage = subvalue[0] === '!';
  const type = isImage ? 'imageReference' : 'linkReference';
  let identifier = matches[3];
  let referenceType: 'shortcut' | 'collapsed' | 'full' = 'full';
  let children: undefined | types.TInlineToken[] = void 0;
  if (!identifier) {
    identifier = matches[1];
    referenceType = matches[2] ? 'collapsed' : 'shortcut';
  }
  const overrides: Partial<types.ILinkReference | types.IImageReference> = {identifier, referenceType};
  if (isImage) (overrides as types.IImageReference).alt = matches[1] || null;
  else children = parser.parse(matches[1]);
  return token<types.ILinkReference | types.IImageReference>(subvalue, type, children, overrides);
};

const REG_INLINE_LINK = new RegExp('^' + urlInline.source);
const inlineLink: TTokenizer<types.IInlineLink> = (_, value) => {
  const matches = value.match(REG_INLINE_LINK);
  if (!matches) return;
  const subvalue = matches[0];
  return token<types.IInlineLink>(subvalue, 'inlineLink', void 0, {value: subvalue});
};

const REG_SUP = /^\^(?=\S)([\s\S]*?\S)\^/;
const sup: TTokenizer<types.ISup> = regexParser('sup', REG_SUP, 1);

const REG_SUB = /^~(?=\S)([\s\S]*?\S)~/;
const sub: TTokenizer<types.ISub> = regexParser('sub', REG_SUB, 1);

const REG_MARK = /^==(?=\S)([\s\S]*?\S)==/;
const mark: TTokenizer<types.IMark> = regexParser('mark', REG_MARK, 1);

const REG_HANDLE = /^([#~@])(?![#~@])(([\w\-_\.\/#]{1,64})|(\{([\w\-_\.\/#=\/ ]{1,64})\}))/;
const handle: TTokenizer<types.IHandle> = (_, value) => {
  const matches = value.match(REG_HANDLE);
  if (!matches) return;
  const subvalue = matches[5] || matches[2];
  return token<types.IHandle>(matches[0], 'handle', void 0, {value: subvalue, prefix: <any>matches[1]});
};

const REG_UNDERLINE = /^\+\+(?=\S)([\s\S]*?\S)\+\+/;
const underline: TTokenizer<types.IUnderline> = regexParser('underline', REG_UNDERLINE, 1);

const REG1_BREAK1 = /^\s{2,}\r?\n(?!\s*$)/;
const REG_BREAK2 = /^\s*\\n/;
const inlineBreak: TTokenizer<types.IBreak> = (_, value) => {
  const matches = value.match(REG1_BREAK1) || value.match(REG_BREAK2);
  if (matches) return token<types.IBreak>(matches[0], 'break');
};

const icon = (maxLength: number = 32): TTokenizer<types.IIcon> => {
  const REG_ICON1 = new RegExp(`^::([^'\\s:]{1,${maxLength}}?)::`);
  const REG_ICON2 = new RegExp(`^:([^'\\s:]{1,${maxLength}}?):`);
  return (_, value: string) => {
    const matches = value.match(REG_ICON1) || value.match(REG_ICON2);
    if (matches) return token<types.IIcon>(matches[0], 'icon', void 0, {emoji: matches[1]});
  };
};

// biome-ignore lint: allow control characters in regexp
const REG_URL = /\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f()\\]*\)|[^\s\x00-\x1f()\\])*?)/;
const REG_LINK = replace(/^!?\[(r1)\]\(r2(?:\s+(title))?\s*\)/, {r1: label, r2: REG_URL, title});
const link: TTokenizer<types.ILink | types.IImage> = (parser, value: string) => {
  const matches = value.match(REG_LINK);
  if (!matches) return;
  const isImage = matches[0][0] === '!';
  let linkTitle = matches[3];
  if (linkTitle) linkTitle = linkTitle.slice(1, -1);
  if (isImage)
    return token<types.IImage>(matches[0], 'image', void 0, {
      url: matches[2],
      alt: matches[1],
      title: linkTitle,
    });
  return token<types.ILink>(matches[0], 'link', parser.parse(matches[1]), {
    url: matches[2],
    title: linkTitle,
  });
};

const smarttext = (text: string): string =>
  // biome-ignore format: keep functional formatting
  repAll('...', '…',
  repAll('(P)', '§',
  repAll('+-', '±',
  repAll('--', '–',
  repAll('---', '—',
  repAll("'", '’',
  repAll('"', '”',
  rep(/\(c\)/gi, '©',
  rep(/\(r\)/gi, '®',
  rep(/\(tm\)/gi, '™',
  rep(/^'(?=\S)/, '\u2018', // opening singles
  rep(/^"(?=\S)/, '\u201c', // opening doubles
  text))))))))))));

const REG_NEWLINE = /\s{0,2}\r?\n/g;
const newlineReplacer = (newline: string) => (newline[0] === ' ' && newline[1] === ' ' ? '\n' : ' ');

const REG_TEXT = new RegExp(
  '^[\\s\\S]+?(?=[\\<>!\\[_*`:~\\|#@\\$\\^=\\+]| {2,}\\n|(' + urlInline.source + ')|\\\\n|\\\\`|$)',
);
const text =
  (dhe: (html: string) => string): TTokenizer<types.IText> =>
  (eat, src) => {
    const matches = src.match(REG_TEXT);
    if (!matches) return;
    const match = matches[0];
    let value = match.replace(REG_NEWLINE, newlineReplacer);
    value = smarttext(value);
    if (dhe) value = dhe(value);
    return token<types.IText>(match, 'text', void 0, {value}, match.length);
  };

const REG_ESCAPE = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
const inlineEscape: TTokenizer<types.IText> = (_, value) => {
  const matches = value.match(REG_ESCAPE);
  if (matches) return token<types.IText>(matches[0], 'text', void 0, {value: matches[1]});
};

const html: TTokenizer<IElement> = (_, src) => htmlParser.el(src);

export const parsers = (dhe: (html: string) => string): TTokenizer<types.TInlineToken>[] => [
  <TTokenizer<types.TInlineToken>>inlineEscape,
  <TTokenizer<types.TInlineToken>>inlineCode,
  <TTokenizer<types.TInlineToken>>strong,
  <TTokenizer<types.TInlineToken>>emphasis,
  <TTokenizer<types.TInlineToken>>spoiler,
  <TTokenizer<types.TInlineToken>>deletedText,
  <TTokenizer<types.TInlineToken>>inlineMath,
  <TTokenizer<types.TInlineToken>>footnoteReference,
  <TTokenizer<types.TInlineToken>>link,
  <TTokenizer<types.TInlineToken>>reference,
  <TTokenizer<types.TInlineToken>>inlineLink,
  <TTokenizer<types.TInlineToken>>sup,
  <TTokenizer<types.TInlineToken>>sub,
  <TTokenizer<types.TInlineToken>>mark,
  <TTokenizer<types.TInlineToken>>handle,
  <TTokenizer<types.TInlineToken>>underline,
  <TTokenizer<types.TInlineToken>>inlineBreak,
  <TTokenizer<types.TInlineToken>>icon(),
  <TTokenizer<IElement>>html,
  <TTokenizer<types.TInlineToken>>text(dhe),
];
