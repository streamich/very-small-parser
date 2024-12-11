import {block, type IRoot} from '..';
import type {IToken} from '../../types';

export const parse = (src: string): IRoot => {
  const ast = block.parsef(src);
  // console.log(JSON.stringify(ast, null, 2));
  return ast;
};

export const parseInline = (src: string): IToken[] => {
  const ast = block.inline.parse(src);
  // console.log(JSON.stringify(ast, null, 2));
  return ast;
};
