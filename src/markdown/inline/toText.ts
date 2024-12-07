import {toText as hastToText} from '../../html/toText';
import type {IToken} from '../../types';
import type {TInlineToken} from './types';

const toTextChildren = (children?: IToken[]): string => {
  if (!children) return '';
  let str = '';
  const length = children.length;
  for (let i = 0; i < length; i++) str += toText(children[i]);
  return str;
};

export const toText = (node: IToken | IToken[]): string => {
  if (Array.isArray(node)) return toTextChildren(node);
  const inline = node as TInlineToken;
  const type = inline.type;
  switch (type) {
    case 'text':
      return inline.value;
    case 'inlineCode':
      return '`' + node.value + '`';
    case 'strong':
      return '__' + toTextChildren(inline.children) + '__';
    case 'emphasis':
      return '*' + toTextChildren(inline.children) + '*';
    case 'delete':
      return '~~' + toTextChildren(inline.children) + '~~';
    case 'spoiler':
      return '||' + toTextChildren(inline.children) + '||';
    case 'inlineMath':
      return '$' + inline.value + '$';
    case 'footnoteReference':
      return '[^' + inline.value + ']';
    case 'linkReference':
    case 'imageReference': {
      const {identifier, referenceType} = inline;
      const start = type === 'imageReference' ? '![' : '[';
      switch (referenceType) {
        case 'full':
          return start + (type === 'imageReference' ? inline.alt : toTextChildren(inline.children)) + '][' + identifier + ']';
        case 'collapsed':
          return start + identifier + '][]';
        case 'shortcut':
          return start + identifier + ']';
      }
    }
    case 'link':
    case 'image': {
      const {title, url} = inline;
      const start = type === 'image' ? '![' + inline.alt : '[' + toTextChildren(inline.children);
      return start + '](' + url + (title ? ' "' + title + '"' : '') + ')';
    }
    case 'inlineLink':
      return inline.value;
    case 'sup':
      return '^' + toTextChildren(inline.children) + '^';
    case 'sub':
      return '~' + toTextChildren(inline.children) + '~';
    case 'mark':
      return '==' + toTextChildren(inline.children) + '==';
    case 'handle':
      return inline.prefix + inline.value;
    case 'underline':
      return '++' + toTextChildren(inline.children) + '++';
    case 'break':
      return '\n';
    case 'icon':
      return ':' + inline.emoji + ':';
    case 'element':
      return hastToText(inline, '  ');
    case 'whitespace':
      return ' '.repeat(inline.length);
  }
  return toTextChildren((inline as any).children);
};
