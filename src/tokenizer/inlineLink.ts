import type {TTokenizer, IInlineCode} from '../types';
import {urlInline} from '../regex';

const REG = new RegExp('^' + urlInline.source);

const inlineLink: TTokenizer<IInlineCode> = (eat, value) => {
  const matches = value.match(REG);

  if (matches) {
    const subvalue = matches[0];

    return eat(subvalue, 'inlineLink', void 0, {
      value: subvalue,
    });
  }

  return;
};

export default inlineLink;
