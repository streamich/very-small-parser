import type {IElement} from '../../html/types';
import type {IToken} from '../../types';

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
  | 'text'
  | 'element';

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
  identifier: string;
  label: string;
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
  children: TInlineToken[];
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
  | IElement
  | IText
  | IWhitespace;
