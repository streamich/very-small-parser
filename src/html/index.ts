import {dhe} from '../util';
import {HtmlParser} from './HtmlParser';
import {parsers} from './parsers';

export const html = new HtmlParser({parsers: parsers(dhe)});
