import type {TTokenizer, IHeading} from '../types';
import {heading as REG1, lheading as REG2} from '../regex';

const heading: TTokenizer<IHeading> = function (eat, value) {
  let matches = value.match(REG1);

  if (matches) {
    const subvalue = matches[2];

    return eat(matches[0], 'heading', this.tokenizeInline(subvalue), {
      depth: matches[1].length,
    });
  }

  matches = value.match(REG2);

  if (matches) {
    const subvalue = matches[1];

    return eat(matches[0], 'heading', this.tokenizeInline(subvalue), {
      depth: matches[2] === '-' ? 1 : 2,
    });
  }

  return;
};

export default heading;
