import type {IMark, TTokenizer} from '../types';
import createRegexTokenizer from '../createRegexTokenizer';

const REG = /^==(?=\S)([\s\S]*?\S)==/;
const mark: TTokenizer<IMark> = createRegexTokenizer('mark', REG, 1);

export default mark;
