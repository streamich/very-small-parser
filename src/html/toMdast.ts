import type {IToken} from '../types';
import type * as mdi from '../markdown/inline/types';
import type * as md from '../markdown/block/types';
import type * as html from './types';

const toMdastInlineChildren = ({children}: {children: html.THtmlToken[]}): mdi.TInlineToken[] => {
  const res: mdi.TInlineToken[] = [];
  const length = children.length;
  for (let i = 0; i < length; i++) {
    const node = toMdastInline(children[i]);
    if (node) res.push(node);
  }
  return res;
};

const toMdastInline = (node: html.THtmlToken): mdi.TInlineToken | undefined => {
  const {type} = node;
  switch (type) {
    case 'element': {
      const {tagName} = node;
      switch (tagName) {
        case 'b':
        case 'strong': {
          return {
            type: 'strong',
            children: toMdastInlineChildren(node)
          };
        }
      }
      break;
    }
    case 'text': return node as mdi.IText;
  }
};

const toMdastChildren = ({children}: {children: html.THtmlToken[]}): IToken[] => {
  const res: IToken[] = [];
  const length = children.length;
  for (let i = 0; i < length; i++) res.push(toMdast(children[i]));
  return res;
};

export const toMdast = (node: html.THtmlToken): IToken => {
  if (Array.isArray(node)) return toMdast({type: 'root', children: node});
  switch (node.type) {
    case 'element': {
      const {tagName} = node;
      switch (tagName) {
        case 'p': {
          return {
            type: 'paragraph',
            children: toMdastChildren(node) as mdi.TInlineToken[]
          };
        }
        case 'blockquote': {
          return {
            type: 'blockquote',
            children: toMdastChildren(node) as mdi.TInlineToken[]
          };
        }
        case 'code':
        case 'pre': {
          return {
            type: 'code',
            children: toMdastChildren(node) as mdi.TInlineToken[]
          };
        }
      }
      break;
    }
    case 'root': {
      return {
        type: 'root',
        children: toMdastChildren(node) as md.TBlockToken[]
      };
    }
  }  
  return node;
};
