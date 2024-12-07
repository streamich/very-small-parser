import {block} from '..';
import type {IToken} from '../../../types';

export const parse = (text: string): IToken[] => {
  const ast = block.parse(text);
  // console.log(JSON.stringify(ast, null, 2));
  return ast;
};