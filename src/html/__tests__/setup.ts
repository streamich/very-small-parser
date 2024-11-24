import {html} from '..';
import type {IToken} from '../../types';

export const parse = (text: string): IToken[] => {
  const ast = html.parse(text);
  // console.log(ast);
  return ast;
};
