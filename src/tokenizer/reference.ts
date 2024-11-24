import type {TTokenizer, ILinkReference, IImageReference, TAnyToken} from '../types';
import {replace, label} from '../regex';

const REG = replace(/^!?\[(label)\]\s*(\[([^\]]*)\])?/, {label});

const reference: TTokenizer<ILinkReference | IImageReference> = function (eat, value) {
  const matches = value.match(REG);

  if (matches) {
    const subvalue = matches[0];
    const isImage = subvalue[0] === '!';
    const type = isImage ? 'imageReference' : 'linkReference';
    let identifier = matches[3];
    let referenceType: 'shortcut' | 'collapsed' | 'full' = 'full';
    let children: undefined | TAnyToken[] = void 0;

    if (!identifier) {
      identifier = matches[1];
      referenceType = matches[2] ? 'collapsed' : 'shortcut';
    }

    const overrides: any = {
      identifier,
      referenceType,
    };

    if (isImage) {
      overrides.alt = matches[1] || null;
    } else {
      children = this.tokenizeInline(matches[1]);
    }

    return eat(subvalue, type, children, overrides);
  }

  return;
};

export default reference;
