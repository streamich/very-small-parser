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

const createSimpleInlineNode = <N extends mdi.IStrong | mdi.IEmphasis | mdi.IDelete | mdi.ISpoiler | mdi.ISup | mdi.ISub | mdi.IMark | mdi.IUnderline>(type: N['type'], element: html.IElement): N => ({
  type,
  children: toMdastInlineChildren(element),
}) as N;

const toMdastInline = (node: html.THtmlToken): mdi.TInlineToken | undefined => {
  const {type} = node;
  switch (type) {
    case 'element': {
      const {tagName} = node;
      switch (tagName) {
        case 'code':
        case 'pre': {
          const attr = node.properties;
          const isMath = attr?.class?.includes('math') || attr?.['data-lang'] === 'math';
          if (isMath) {
            return {
              type: 'inlineMath',
              value: toPlainText(node),
            };
          }
          return {
            type: 'inlineCode',
            value: toPlainText(node),
            wrap: '`',
          };
        }
        case 'b':
        case 'strong': return createSimpleInlineNode('strong', node);
        case 'i':
        case 'em': return createSimpleInlineNode('emphasis', node);
        case 'del': return createSimpleInlineNode('delete', node);
        case 'spoiler': return createSimpleInlineNode('spoiler', node);
        case 'sup': {
          const attr = node.properties;
          let isFootnoteReference = attr?.['data-node'] === 'footnote';
          if (isFootnoteReference) {
            const anchor = node.children?.[0];
            if (anchor && anchor.type === 'element' && anchor.tagName === 'a') {
              const anchorAttr = anchor.properties;
              const href = anchorAttr?.href || '';
              if (href[0] === '#' && href.length > 1) {
                const identifier = href.slice(1);
                const label = toPlainText(anchor);
                return {
                  type: 'footnoteReference',
                  identifier,
                  label,
                } as mdi.IFootnoteReference;
              }
            }
          }
          return createSimpleInlineNode('sup', node);
        }
        case 'sub': return createSimpleInlineNode('sub', node); 
        case 'mark': return createSimpleInlineNode('mark', node); 
        case 'u': return createSimpleInlineNode('underline', node); 
        case 'acronym': {
          const attr = node.properties;
          const emoji = attr?.['data-icon'];
          if (emoji) {
            return {
              type: 'icon',
              emoji: emoji,
            } as mdi.IIcon;
          }
          break;
        }
        case 'a': {
          const attr = node.properties || {};
          const href = attr.href;
          if (href) {
            const isAnchor = href[0] === '#';
            if (isAnchor) {
              const isImageAnchor = attr['data-ref'] === 'img';
              const identifier = href.slice(1);
              if (isImageAnchor) {
                const alt = toPlainText(node) || null;
                return {
                  type: 'imageReference',
                  identifier,
                  alt,
                  referenceType: alt ? 'full' : 'collapsed',
                } as mdi.IImageReference
              } else {
                const text = toPlainText(node).trim();
                return {
                  type: 'linkReference',
                  identifier,
                  referenceType: text ? 'full' : 'collapsed',
                  children: toMdastInlineChildren(node),
                } as mdi.ILinkReference
              }
            } else {
              const title = attr.title;
              if (!title && node.children?.length === 1 && node.children[0].type === 'text' && node.children[0].value === href && href.startsWith('http')) {
                return {
                  type: 'inlineLink',
                  value: href,
                } as mdi.IInlineLink;
              } else {
                return {
                  type: 'link',
                  url: href,
                  children: toMdastInlineChildren(node),
                  title,
                } as mdi.ILink;
              }
            }
          }
          break;
        }
        case 'img': {
          const attr = node.properties || {};
          const src = attr.src;
          if (src) {
            const title = attr.title || '';
            const alt = attr.alt || '';
            return {
              type: 'image',
              url: src,
              title,
              alt,
            } as mdi.IImage;
          }
          break;
        }
        case 'cite': {
          const children = node.children;
          if (children?.length === 1 && children[0].type === 'text') {
            const text = children[0].value || '';
            const prefix = text[0];
            if (prefix === '#' || prefix === '~' || prefix === '@') {
              return {
                type: 'handle',
                prefix,
                value: text.slice(1),
              } as mdi.IHandle;
            }
          }
          break;
        }
        case 'br': {
          return {
            type: 'break',
          } as mdi.IBreak;
        }
      }
      break;
    }
    case 'text':
      return node as mdi.IText;
  }
  return node as html.IElement;
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
