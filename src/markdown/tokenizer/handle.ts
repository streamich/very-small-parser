import type {TTokenizer, ISub} from '../types';

const REG = /^([#~@])(([\w\-_\.\/#]{1,64})|(\{([\w\-_\.\/#=\/ ]{1,64})\}))/;

const handle: TTokenizer<ISub> = (eat, value) => {
  const matches = value.match(REG);

  if (matches) {
    const subvalue = matches[5] || matches[2];

    return eat(matches[0], 'handle', void 0, {
      value: subvalue,
      prefix: <any>matches[1],
    });
  }

  return;
};

export default handle;
