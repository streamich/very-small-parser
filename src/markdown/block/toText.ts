import {toText as toTextHtml} from '../../html/toText';
import {toText as toTextInline} from '../inline/toText';
import type {IToken} from '../../types';
import type {IListItem, TBlockToken} from './types';

const toTextInlineChildren = (children?: IToken[]): string => {
  if (!children) return '';
  let str = '';
  const length = children.length;
  for (let i = 0; i < length; i++) str += toText(children[i]);
  return str;
};

const toTextBlockChildren = (children?: IToken[], separator = '\n\n'): string => {
  if (!children) return '';
  let str = '';
  const length = children.length;
  for (let i = 0; i < length; i++) str += (str ? separator : '') + toText(children[i]);
  return str;
};

export const toText = (node: IToken | IToken[]): string => {
  if (Array.isArray(node)) return toTextInlineChildren(node);
  const inline = node as TBlockToken;
  const type = inline.type;
  switch (type) {
    case 'paragraph':
      return toTextInlineChildren(inline.children);
    case 'code': {
      return '```' + (inline.lang || '') + (inline.meta ? ' ' + inline.meta : '') + '\n' + inline.value + '\n```';
    }
    case 'heading': {
      const depth = inline.depth;
      const prefix = '#'.repeat(depth);
      return prefix + ' ' + toTextInlineChildren(inline.children);
    }
    case 'blockquote': {
      return '> ' + toTextBlockChildren(inline.children).replace(/\n/g, '\n> ');
    }
    case 'list': {
      const {ordered, start, spread} = inline;
      const bullet = ordered ? (start || 1) + '. ' : '- ';
      const separator = spread ? '\n\n' : '\n';
      const children = inline.children;
      const last = children.length - 1;
      let str = '';
      for (let i = 0; i <= last; i++) {
        const item = children[i] as IListItem;
        const itemSeparator = item.spread ? '\n\n' : '\n';
        const content = toTextBlockChildren(item.children, itemSeparator).replace(/\n/g, '\n  ');
        str += bullet + content;
        if (i !== last) str += separator;
      }
      return str;
    }
    case 'thematicBreak':
      return '---';
    case 'math':
      return '$$\n' + inline.value + '\n$$';
    case 'element':
      return toTextHtml(inline);
    case '': // newline
      return '\n\n';
    default:
      return toTextInline(inline);
  }
  // biome-ignore lint: unreachable code
  return toTextInlineChildren((inline as any).children);
};
