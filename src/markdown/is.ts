import {replace} from './regex';

// Bold, italic, underline, strikethrough, highlight.
const b = /(?:\s|^)(_|__|\*|\*\*|~~|==|\+\+)(?!\s).{1,64}(?<!\s)(?=\1)/;

// Basic inline link (also captures images).
const a = /\[[^\]]{1,128}\]\(https?:\/\/\S{1,999}\)/;

// Inline code.
const code = /(?:\s|^)`(?!\s)[^`]{1,48}(?<!\s)`([^\w]|$)/;

// Unordered list.
const ul = /(?:^|\n)\s{0,5}\-\s{1}[^\n]+\n\s{0,15}\-\s/;

// Ordered list.
const ol = /(?:^|\n)\s{0,5}\d+\.\s{1}[^\n]+\n\s{0,15}\d+\.\s/;

// Horizontal rule.
const hr = /\n{2} {0,3}\-{2,48}\n{2}/;

const REG = replace(/(b)|(a)|(code)|(ul)|(ol)|(hr)/, {b, a, code, ul, ol, hr});

/**
 * Returns `true` if the source text might be a markdown document.
 *
 * @param src Source text to analyze.
 */
export const is = (src: string): boolean => REG.test(src);
