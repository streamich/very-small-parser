import type {IToken} from './types';

export const toPlainText = (node: IToken): string => {
  if (node.type === 'text') return node.value || '';
  let str = '';
  const children = node.children;
  if (!children) return str;
  const length = children.length;
  for (let i = 0; i < length; i++) str += toPlainText(children[i]);
  return str;
};
