import {html} from '..';
import type {THtmlToken, IRoot} from '../types';

export const parse = (text: string): THtmlToken[] => {
  const ast = html.parse(text);
  // console.log(JSON.stringify(ast, null, 2));
  return ast;
};

export const parsef = (text: string): IRoot => {
  const ast = html.parsef(text);
  // console.log(JSON.stringify(ast, null, 2));
  return ast;
};
