import {html} from '..';
import type {THtmlToken} from '../types';

export const parse = (text: string): THtmlToken[] => {
  const ast = html.parse(text);
  // console.log(JSON.stringify(ast, null, 2));
  return ast;
};
