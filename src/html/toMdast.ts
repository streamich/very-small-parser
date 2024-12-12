import {toPlainText} from '../toPlainText';
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
        case 'code':
        case 'pre': {
          return {
            type: 'inlineCode',
            value: toPlainText(node),
            wrap: '`',
          };
        }
        case 'b':
        case 'strong': {
          return {
            type: 'strong',
            children: toMdastInlineChildren(node),
          };
        }
        case 'i':
        case 'em': {
          return {
            type: 'emphasis',
            children: toMdastInlineChildren(node),
          };
        }

        // | IInlineCode
        // | IStrong
        // | IEmphasis
        // | IDelete
        // | ISpoiler
        // | IInlineMath
        // | IFootnoteReference
        // | ILinkReference
        // | IImageReference
        // | ILink
        // | IImage
        // | IInlineLink
        // | ISup
        // | ISub
        // | IMark
        // | IHandle
        // | IUnderline
        // | IBreak
        // | IIcon
        // | IElement
        // | IText
        // | IWhitespace;
      }
      break;
    }
    case 'text':
      return node as mdi.IText;
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
            children: toMdastInlineChildren(node) as mdi.TInlineToken[],
          };
        }
        case 'blockquote': {
          return {
            type: 'blockquote',
            children: toMdastChildren(node) as mdi.TInlineToken[],
          };
        }
        case 'code':
        case 'pre': {
          return {
            type: 'code',
            children: toMdastChildren(node) as mdi.TInlineToken[],
          };
        }
        default: {
          return toMdastInline(node) as mdi.TInlineToken;
        }
      }
      break;
    }
    case 'root': {
      return {
        type: 'root',
        children: toMdastChildren(node) as md.TBlockToken[],
      };
    }
  }
  return node;
};

const isBlock = (node: IToken): node is md.TBlockToken => {
  switch (node.type) {
    case 'paragraph':
    case 'blockquote':
    case 'code':
    case 'root':
      return true;
  }
  return false;
};

// /** Whether this block element can have child nodes. */
// const isContainerBlock = (node: md.TBlockToken): boolean => {
//   switch (node.type) {
//     case 'paragraph':
//     case 'blockquote':
//       return true;
//   }
//   return false;
// }

export const fixupMdast = (node: IToken): IToken => {
  // Ensure the root node is always a root node.
  if (node.type !== 'root') {
    node = {
      type: 'root',
      children: [node],
    };
  }

  // Ensure that immediate children of the root node are always block nodes.
  let lastBlockNode: md.TBlockToken | undefined;
  const children = node.children ?? [];
  const length = children.length;
  const newChildren: md.TBlockToken[] = [];

  for (let i = 0; i < length; i++) {
    const child = children[i];
    if (isBlock(child)) {
      lastBlockNode = child;
      newChildren.push(child);
    } else {
      if (!lastBlockNode || lastBlockNode.type !== 'paragraph') {
        lastBlockNode = {
          type: 'paragraph',
          children: [],
        };
        newChildren.push(lastBlockNode);
      }
      if (!lastBlockNode.children) lastBlockNode.children = [];
      lastBlockNode.children.push(child as mdi.TInlineToken);
    }
  }

  node.children = newChildren;

  return node;
};
