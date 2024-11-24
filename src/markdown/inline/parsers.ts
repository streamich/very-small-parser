import {regexParser, token} from '../../util';
import {replace, label, urlInline, url, title} from '../regex';
import type {TTokenizer} from '../../types';
import type {IDelete, IEmphasis, IInlineCode, IStrong, TInlineToken, ISpoiler, IInlineMath, IFootnoteReference, ILinkReference, IImageReference, IInlineLink, ISup, ISub, IMark, IHandle, IUnderline, IBreak, IIcon, ILink, IImage, IWhitespace, IText} from './types';

const REG_INLINE_CODE = /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/;
const inlineCode: TTokenizer<IInlineCode> = (_, value) => {
  const matches = value.match(REG_INLINE_CODE);
  if (!matches) return;
  return token<IInlineCode>(matches[0], 'inlineCode', void 0, {
    value: matches[2],
    wrap: matches[1],
  });
};

const REG_STRONG =
  /^__([^\s][\s\S]*?[^\s])__(?!_)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)|^__([^\s])__(?!_)|^\*\*([^\s])\*\*(?!\*)/;
const strong: TTokenizer<IStrong> = (parser, value) => {
  const matches = value.match(REG_STRONG);
  if (!matches) return;
  const subvalue = matches[4] || matches[3] || matches[2] || matches[1];
  return token<IStrong>(matches[0], 'strong', parser.parse(subvalue));
};

const REG_EMPHASIS =
  /^_([^\s][\s\S]*?[^\s_])_(?!_)|^_([^\s_][\s\S]*?[^\s])_(?!_)|^\*([^\s][\s\S]*?[^\s*])\*(?!\*)|^\*([^\s*][\s\S]*?[^\s])\*(?!\*)|^_([^\s_])_(?!_)|^\*([^\s*])\*(?!\*)/;
const emphasis: TTokenizer<IEmphasis> = (parser, value) => {
  const matches = value.match(REG_EMPHASIS);
  if (!matches) return;
  const subvalue = matches[6] || matches[5] || matches[4] || matches[3] || matches[2] || matches[1];
  return token<IEmphasis>(matches[0], 'emphasis', parser.parse(subvalue));
};

const REG_DELETE = /^~~(?=\S)([\s\S]*?\S)~~/;
const deletedText: TTokenizer<IDelete> = (parser, value) => {
  const matches = value.match(REG_DELETE);
  if (matches) return token<IDelete>(matches[0], 'delete', parser.parse(matches[1]));
};

const REG_SPOILER = /^~~~([\s\S]*)~~~/;
const spoiler: TTokenizer<ISpoiler> = (parser, value) => {
  const matches = value.match(REG_SPOILER);
  if (matches) return token<ISpoiler>(matches[0], 'spoiler', parser.parse(matches[1]));
};

const REG_INLINE_MATH = /^\${1,2}(?=\S)([\s\S]*?\S)\${1,2}/;
const inlineMath: TTokenizer<IInlineMath> = (parser, value) => {
  const matches = value.match(REG_INLINE_MATH);
  if (matches) return token<IInlineMath>(matches[0], 'inlineMath', void 0, {value: matches[1]});
};

const REG_FOOTNOTE_REFERENCE = /^\[\^([a-zA-Z0-9\-_]{1,64})\]/;
const footnoteReference: TTokenizer<IFootnoteReference> = (parser, value) => {
  const matches = value.match(REG_FOOTNOTE_REFERENCE);
  if (matches) return token<IFootnoteReference>(matches[0], 'footnoteReference', void 0, {value: matches[1]});
};

const REG_REFERENCE = replace(/^!?\[(label)\]\s*(\[([^\]]*)\])?/, {label});
const reference: TTokenizer<ILinkReference | IImageReference> = (parser, value) => {
  const matches = value.match(REG_REFERENCE);
  if (!matches) return;
  const subvalue = matches[0];
  const isImage = subvalue[0] === '!';
  const type = isImage ? 'imageReference' : 'linkReference';
  let identifier = matches[3];
  let referenceType: 'shortcut' | 'collapsed' | 'full' = 'full';
  let children: undefined | TInlineToken[] = void 0;
  if (!identifier) {
    identifier = matches[1];
    referenceType = matches[2] ? 'collapsed' : 'shortcut';
  }
  const overrides: Partial<ILinkReference | IImageReference> = {identifier, referenceType};
  if (isImage) (overrides as IImageReference).alt = matches[1] || null;
  else children = parser.parse(matches[1]);
  return token<ILinkReference | IImageReference>(subvalue, type, children, overrides);
};

const REG_INLINE_LINK = new RegExp('^' + urlInline.source);
const inlineLink: TTokenizer<IInlineLink> = (_, value) => {
  const matches = value.match(REG_INLINE_LINK);
  if (!matches) return;
  const subvalue = matches[0];
  return token<IInlineLink>(subvalue, 'inlineLink', void 0, {value: subvalue});
};

const REG_SUP = /^\^(?=\S)([\s\S]*?\S)\^/;
const sup: TTokenizer<ISup> = regexParser('sup', REG_SUP, 1);

const REG_SUB = /^~(?=\S)([\s\S]*?\S)~/;
const sub: TTokenizer<ISub> = regexParser('sub', REG_SUB, 1);

const REG_MARK = /^==(?=\S)([\s\S]*?\S)==/;
const mark: TTokenizer<IMark> = regexParser('mark', REG_MARK, 1);

const REG_HANDLE = /^([#~@])(([\w\-_\.\/#]{1,64})|(\{([\w\-_\.\/#=\/ ]{1,64})\}))/;
const handle: TTokenizer<IHandle> = (_, value) => {
  const matches = value.match(REG_HANDLE);
  if (!matches) return;
  const subvalue = matches[5] || matches[2];
  return token<IHandle>(matches[0], 'handle', void 0, {value: subvalue, prefix: <any>matches[1]});
};

const REG_UNDERLINE = /^\+\+(?=\S)([\s\S]*?\S)\+\+/;
const underline: TTokenizer<IUnderline> = regexParser('underline', REG_UNDERLINE, 1);

const REG1_BREAK1 = /^\s{2,}\n(?!\s*$)/;
const REG_BREAK2 = /^ *\\n/;
const inlineBreak: TTokenizer<IBreak> = (_, value) => {
  const matches = value.match(REG1_BREAK1) || value.match(REG_BREAK2);
  if (matches) return token<IBreak>(matches[0], 'break');
};

const icon = (maxLength: number = 32): TTokenizer<IIcon> => {
  const REG_ICON1 = new RegExp(`^::([^'\\s:]{1,${maxLength}}?)::`);
  const REG_ICON2 = new RegExp(`^:([^'\\s:]{1,${maxLength}}?):`);
  return (_, value: string) => {
    const matches = value.match(REG_ICON1) || value.match(REG_ICON2);
    if (matches) return token<IIcon>(matches[0], 'icon', void 0, {emoji: matches[1]});
  };
};

const REG_LINK = replace(/^!?\[(label)\]\(url(?:\s+(title))?\s*\)/, {label, url, title});
const link: TTokenizer<ILink | IImage> = (parser, value: string) => {
  const matches = value.match(REG_LINK);
  if (!matches) return;
  const isImage = matches[0][0] === '!';
  let linkTitle = matches[3];
  if (linkTitle) linkTitle = linkTitle.slice(1, -1);
  if (isImage) return token<IImage>(matches[0], 'image', void 0, {
    url: matches[2],
    alt: matches[1],
    title: linkTitle,
  });
  return token<ILink>(matches[0], 'link', parser.parse(matches[1]), {
    url: matches[2],
    title: linkTitle,
  });
};

// const REG_WHITESPACE = /^\s+/;
// const whitespace: TTokenizer<IWhitespace> = (parser, value: string) => {
//   const matches = value.match(REG_WHITESPACE);
//   if (!matches) return;
//   const subvalue = matches[0];
//   return token<IWhitespace>(subvalue, 'whitespace', void 0, {length: subvalue.length});
// };

const smarttext = (text: string) =>
  text
    .replace(/\.{3}/g, '\u2026')
    .replace(/\(C\)/gi, '©')
    .replace(/\(R\)/gi, '®')
    .replace(/\(TM\)/gi, '™')
    .replace(/\(P\)/g, '§')
    .replace(/\+\-/g, '±')
    .replace(/---/g, '\u2014')
    .replace(/--/g, '\u2013')
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018') // opening singles
    .replace(/'/g, '\u2019') // closing singles & apostrophes
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c') // opening doubles
    .replace(/"/g, '\u201d'); // closing doubles
const REG_TEXT = new RegExp('^[\\s\\S]+?(?=[\\<!\\[_*`:~\\|#@\\$\\^=\\+]| {2,}\\n|(' + urlInline.source + ')|\\\\n|\\\\`|$)');
const text: TTokenizer<IText> = (eat, src) => {
  const matches = src.match(REG_TEXT);
  if (!matches) return;
  const value = smarttext(matches[0]);
  return token<IText>(value, 'text', void 0, {value});
};

const REG_ESCAPE = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
const inlineEscape: TTokenizer<IText> = (_, value) => {
  const matches = value.match(REG_ESCAPE);
  if (matches) return token<IText>(matches[0], 'text', void 0, {value: matches[1]});
};

export const parsers: TTokenizer<TInlineToken>[] = [
  <TTokenizer<TInlineToken>>inlineEscape,
  <TTokenizer<TInlineToken>>inlineCode,
  <TTokenizer<TInlineToken>>strong,
  <TTokenizer<TInlineToken>>emphasis,
  <TTokenizer<TInlineToken>>spoiler,
  <TTokenizer<TInlineToken>>deletedText,
  <TTokenizer<TInlineToken>>inlineMath,
  <TTokenizer<TInlineToken>>footnoteReference,
  <TTokenizer<TInlineToken>>link,
  <TTokenizer<TInlineToken>>reference,
  <TTokenizer<TInlineToken>>inlineLink,
  <TTokenizer<TInlineToken>>sup,
  <TTokenizer<TInlineToken>>sub,
  <TTokenizer<TInlineToken>>mark,
  <TTokenizer<TInlineToken>>handle,
  <TTokenizer<TInlineToken>>underline,
  <TTokenizer<TInlineToken>>inlineBreak,
  <TTokenizer<TInlineToken>>icon(),
  // <TTokenizer<TInlineToken>>whitespace,
  <TTokenizer<TInlineToken>>text,
];
