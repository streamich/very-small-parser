import {dhe} from '../../util';
import {MdInlineParser} from './MdInlineParser';
import {parsers} from './parsers';

export const inline = new MdInlineParser({parsers: parsers(dhe)});
