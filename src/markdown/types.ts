export type TTokenTypeBlock =
  | 'root'
  | 'newline'
  | 'code'
  | 'math'
  | 'thematicBreak'
  | 'heading'
  | 'blockquote'
  | 'list'
  | 'listItem'
  | 'html'
  | 'table'
  | 'tableRow'
  | 'tableCell'
  | 'definition'
  | 'footnoteDefinition'
  | 'paragraph';

export type TTokenTypeInline =
  | 'inlineCode'
  | 'strong'
  | 'emphasis'
  | 'delete'
  | 'spoiler'
  | 'inlineMath'
  | 'footnoteReference'
  | 'linkReference'
  | 'imageReference'
  | 'inlineLink'
  | 'sup'
  | 'sub'
  | 'mark'
  | 'handle'
  | 'underline'
  | 'break'
  | 'icon'
  | 'link'
  | 'image'
  | 'whitespace'
  | 'text';

export type TTokenType = 'root' | TTokenTypeBlock | TTokenTypeInline;

export interface IToken {
  type: TTokenType;
  len: number;
  raw?: string;
  children?: TAnyToken[];
  value?: string;
}

export interface IRoot extends IToken {
  type: 'root';
  children: TChildrenBlock;
}

export interface INewline extends IToken {
  type: 'newline';
}

export interface ICode extends IToken {
  type: 'code';
  value: string;
  lang: string | null;
  meta?: string | null;
}

export interface IMath extends IToken {
  type: 'math';
  value: string;
}

export interface IThematicBreak extends IToken {
  type: 'thematicBreak';
  value: string;
}

export interface IHeading extends IToken {
  type: 'heading';
  depth: number;
  children: TChildrenInline;
}

export interface IBlockquote extends IToken {
  type: 'blockquote';
  children: TChildrenBlock;
}

export interface IList extends IToken {
  type: 'list';
  ordered: boolean;
  start: number | null;
  loose: boolean;
  children: IListItem[];
}

export interface IListItem extends IToken {
  type: 'listItem';
  loose: boolean;
  checked: boolean | null;
  children: TChildrenBlock;
}

export interface IHtml extends IToken {
  type: 'html';
  value: string;
}

export interface ITable extends IToken {
  type: 'table';
  align: ('left' | 'right' | 'center' | null)[];
}

export interface ITableRow extends IToken {
  type: 'tableRow';
}

export interface ITableCell extends IToken {
  type: 'tableCell';
}

export interface IDefinition extends IToken {
  type: 'definition';
  identifier: string;
  title: string | null;
  url: string;
}

export interface IFootnoteDefinition extends IToken {
  type: 'footnoteDefinition';
  identifier: string;
  children: TChildrenBlock;
}

export interface IParagraph extends IToken {
  type: 'paragraph';
  children: TChildrenInline;
}

export interface IInlineCode extends IToken {
  type: 'inlineCode';
  value: string;
  wrap: string;
}

export interface IStrong extends IToken {
  type: 'strong';
}

export interface IEmphasis extends IToken {
  type: 'emphasis';
}

export interface IDelete extends IToken {
  type: 'delete';
}

export interface ISpoiler extends IToken {
  type: 'spoiler';
}

export interface IInlineMath extends IToken {
  type: 'inlineMath';
}

export interface IFootnoteReference extends IToken {
  type: 'footnoteReference';
}

export interface ILinkReference extends IToken {
  type: 'linkReference';
  identifier: string;
  referenceType: 'shortcut' | 'collapsed' | 'full';
}

export interface IImageReference extends IToken {
  type: 'imageReference';
  identifier: string;
  referenceType: 'shortcut' | 'collapsed' | 'full';
  alt: string | null;
}

export interface IInlineLink extends IToken {
  type: 'inlineLink';
  value: string;
}

export interface ISup extends IToken {
  type: 'sup';
}

export interface ISub extends IToken {
  type: 'sub';
}

export interface IMark extends IToken {
  type: 'mark';
  children: TChildrenInline;
}

export interface IHandle extends IToken {
  type: 'handle';
  value: string;
  prefix: '#' | '~' | '@';
}

export interface IUnderline extends IToken {
  type: 'underline';
}

export interface IBreak extends IToken {
  type: 'break';
}

export interface IIcon extends IToken {
  type: 'icon';
  emoji: string;
}

export interface ILink extends IToken {
  type: 'link';
  title: string;
  url: string;
}

export interface IImage extends IToken {
  type: 'image';
  title: string;
  alt: string;
  url: string;
}

export interface IText extends IToken {
  type: 'text';
  value: string;
}

export interface IWhitespace extends IToken {
  type: 'whitespace';
  length: number;
}

export type TBlockToken =
  | INewline
  | ICode
  | IMath
  | IThematicBreak
  | IHeading
  | IBlockquote
  | IList
  | IListItem
  | IHtml
  | ITable
  | ITableRow
  | ITableCell
  | IDefinition
  | IFootnoteDefinition
  | IParagraph;

export type TInlineToken =
  | IInlineCode
  | IStrong
  | IEmphasis
  | IDelete
  | ISpoiler
  | IInlineMath
  | IFootnoteReference
  | ILinkReference
  | IImageReference
  | ILink
  | IImage
  | IInlineLink
  | ISup
  | ISub
  | IMark
  | IHandle
  | IUnderline
  | IBreak
  | IIcon
  | IText
  | IWhitespace;

export type TAnyToken = TBlockToken | TInlineToken;

export type TNullableToken<T extends TAnyToken> = T | undefined | null;
export type TChildrenToken<T extends TAnyToken> = TNullableToken<T> | T[];

export type TChildrenBlock = TBlockToken[];
export type TChildrenInline = TInlineToken[];

export type TEat<T extends TAnyToken> = (
  subvalue: string,
  type: TTokenType,
  children?: TNullableToken<any>,
  overrides?: Partial<TAnyToken>,
) => T;
export type TTokenizer<T extends TAnyToken> = (this: IParser, eat: TEat<T>, value: string) => TNullableToken<T>;

export interface IParser {
  tokenizeInline(value: string): undefined | any[];
  tokenizeBlock(value: string): IRoot | undefined | null;
  tokenizeChildBlock(value: string): TChildrenBlock | TChildrenInline;
}
