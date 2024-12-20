import type {IElement} from '../../html/types';
import type {IToken} from '../../types';
import type {TInlineToken} from '../inline/types';

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

export interface IRoot extends IToken {
  type: 'root';
  children: TBlockToken[];
}

export interface INewline extends IToken {
  type: '';
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
  children: TInlineToken[];
}

export interface IBlockquote extends IToken {
  type: 'blockquote';
  spoiler?: boolean;
  children: TBlockToken[];
}

export interface IList extends IToken {
  type: 'list';
  ordered?: boolean;
  start?: number | null;
  spread?: boolean;
  children: IListItem[];
}

export interface IListItem extends IToken {
  type: 'listItem';
  spread?: boolean;
  checked: boolean | null;
  children: TBlockToken[];
}

export interface IHtml extends IToken {
  type: 'html';
  value: string;
}

export interface ITable extends IToken {
  type: 'table';
  align: ('left' | 'right' | 'center' | null)[];
  children: ITableRow[];
}

export interface ITableRow extends IToken {
  type: 'tableRow';
  children: ITableCell[];
}

export interface ITableCell extends IToken {
  type: 'tableCell';
}

export interface IDefinition extends IToken {
  type: 'definition';
  identifier: string;
  label: string;
  title?: string | null;
  url: string;
}

export interface IFootnoteDefinition extends IToken {
  type: 'footnoteDefinition';
  label: string;
  identifier: string;
  children: TBlockToken[];
}

export interface IParagraph extends IToken {
  type: 'paragraph';
  children: TInlineToken[];
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
  | IElement
  | IParagraph;
