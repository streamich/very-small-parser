import {inline} from '..';
import type {IToken} from '../../../types';

export const parse = (text: string): IToken[] => {
  const ast = inline.parse(text);
  // console.log(ast);
  return ast;
};
