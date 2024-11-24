import type {TTokenizer, IDefinition} from '../types';
import {def as REG} from '../regex';

const definition: TTokenizer<IDefinition> = (eat, value) => {
  const matches = value.match(REG);

  if (!matches) {
    return void 0;
  }

  const subvalue = matches[0];

  return eat(subvalue, 'definition', void 0, {
    identifier: matches[1],
    title: matches[3] || null,
    url: matches[2],
  });
};

export default definition;
