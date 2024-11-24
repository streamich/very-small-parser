import type {IParser, TEat, TTokenizer, IWhitespace} from '../types';

const REG = /^\s+/;

const whitespace = (): TTokenizer<IWhitespace> => {
  return function (this: IParser, eat: TEat<IWhitespace>, value: string) {
    const matches = value.match(REG);

    if (matches) {
      const subvalue = matches[0];

      return eat(subvalue, 'whitespace', void 0, {length: subvalue.length});
    }

    return;
  };
};

export default whitespace;
