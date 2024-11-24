import type {TTokenizer, IInlineMath} from '../types';

const REG = /^\[\^([a-zA-Z0-9\-_]{1,64})\]/;

const footnoteReference: TTokenizer<IInlineMath> = (eat, value) => {
  const matches = value.match(REG);

  if (matches) {
    return eat(matches[0], 'footnoteReference', void 0, {value: matches[1]});
  }

  return;
};

export default footnoteReference;
