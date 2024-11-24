import type {TTokenizer, IBlockquote} from '../types';
import {blockquote as REG} from '../regex';

const blockquote: TTokenizer<IBlockquote> = function (eat, value) {
  const matches = value.match(REG);

  if (!matches) {
    return;
  }

  const subvalue = matches[0];
  const innerValue = subvalue.replace(/^ *> ?/gm, '');
  const children = this.tokenizeChildBlock(innerValue);

  return eat(subvalue, 'blockquote', children);
};

export default blockquote;
