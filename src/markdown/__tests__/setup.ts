import {block, IRoot} from '..';
import {IToken} from '../../types';

export const parse = (src: string): IRoot => {
  const ast = block.parseRoot(src);
  // console.log(JSON.stringify(ast, null, 2));
  return ast;
};

export const parseInline = (src: string): IToken[] => {
  const ast = block.inline.parse(src);
  // console.log(JSON.stringify(ast, null, 2));
  return ast;
};
