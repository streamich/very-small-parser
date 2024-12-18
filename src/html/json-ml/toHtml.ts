import {toHast} from './toHast';
import {toText} from '../toText';
import type {JsonMlNode} from './types';

export const toHtml = (node: JsonMlNode, tab = '', ident: string = ''): string => toText(toHast(node), tab, ident);
