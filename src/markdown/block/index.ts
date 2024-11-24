import {inline} from '../inline';
import {MdBlockParser} from './MdBlockParser';
import {parsers} from './parsers';

export const block = new MdBlockParser({parsers, inline});
