import type {TTokenizer, INewline} from '../types';

const REG = /^\n+/;

const newline: TTokenizer<INewline> = (eat, value) => {
  const matches = value.match(REG);

  if (!matches) {
    return;
  }

  return matches ? eat(matches[0], 'newline') : void 0;
};

export default newline;
