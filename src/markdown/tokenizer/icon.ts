import type {IIcon, IParser, TEat} from '../types';

const icon = (maxLength: number = 32) => {
  const REG1 = new RegExp(`^::([^'\\s:]{1,${maxLength}}?)::`);
  const REG2 = new RegExp(`^:([^'\\s:]{1,${maxLength}}?):`);

  return function (this: IParser, eat: TEat<IIcon>, value: string) {
    const matches = value.match(REG1) || value.match(REG2);

    return matches ? eat(matches[0], 'icon', void 0, {emoji: matches[1]}) : void 0;
  };
};

export default icon;
