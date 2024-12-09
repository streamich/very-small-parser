import type {IToken} from '../types';

export interface IRoot extends IToken {
  type: 'root';
  children: THtmlToken[];
}

export interface IText extends IToken {
  type: 'text';
}

export interface IComment extends IToken {
  type: 'comment';
}

export interface IDoctype extends IToken {
  type: 'doctype';
}

export interface IElement extends IToken {
  type: 'element';
  tagName: string;
  properties?: Record<string, string>;
  children: (IComment | IElement | IText | IRoot)[];
}

export type THtmlToken = IRoot | IText | IComment | IDoctype | IElement;
