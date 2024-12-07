import {toText as toTextHtml} from '../../html/toText';
import {toText as toTextInline} from '../inline/toText';
import type {IToken} from '../../types';
import type {TBlockToken} from './types';

const toTextInlineChildren = (children?: IToken[]): string => {
  if (!children) return '';
  let str = '';
  const length = children.length;
  for (let i = 0; i < length; i++) str += toText(children[i]);
  return str;
};

const toTextBlockChildren = (children?: IToken[]): string => {
  if (!children) return '';
  let str = '';
  const length = children.length;
  for (let i = 0; i < length; i++) str += (str ? '\n\n' : '') + toText(children[i]);
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
      const {ordered, start} = inline;
      const prefix = ordered ? (start || 1) + '. ' : '- ';
      return inline.children.map((item) => prefix + toTextBlockChildren(item.children)).join('\n');
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
