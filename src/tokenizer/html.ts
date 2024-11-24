import type {TTokenizer, IList} from '../types';
import {html as REG} from '../regex';

const html: TTokenizer<IList> = (eat, value) => {
  const matches = value.match(REG);

  return matches ? eat(matches[0], 'html', void 0, {value: matches[0]}) : void 0;
};

export default html;
