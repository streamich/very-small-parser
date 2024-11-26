import {replace} from './regex';

// Headings H1-H6.
const h1 = /(^|\n) {0,3}#{1,6} {1,8}[^\n]{1,64}\r?\n\r?\n\s{0,32}\S/;

// Bold, italic, underline, strikethrough, highlight.
const bold = /(?:\s|^)(_|__|\*|\*\*|~~|==|\+\+)(?!\s).{1,64}(?<!\s)(?=\1)/;

// Basic inline link (also captures images).
const link = /\[[^\]]{1,128}\]\(https?:\/\/\S{1,999}\)/;

// Inline code.
const code = /(?:\s|^)`(?!\s)[^`]{1,48}(?<!\s)`([^\w]|$)/;

// Unordered list.
const ul = /(?:^|\n)\s{0,5}\-\s{1}[^\n]+\n\s{0,15}\-\s/;

// Ordered list.
const ol = /(?:^|\n)\s{0,5}\d+\.\s{1}[^\n]+\n\s{0,15}\d+\.\s/;

// Horizontal rule.
const hr = /\n{2} {0,3}\-{2,48}\n{2}/;

// Fenced code block.
const fences = /(?:\n|^)(`{3}|~{3})(?!`|~)[^\s]{0,64} {0,64}[^\n]{0,64}\n[\s\S]{0,9999}?\s*\1 {0,64}(?:\n+|$)/;

const REG = replace(/(h1)|(bold)|(link)|(code)|(ul)|(ol)|(hr)|(fences)/, {h1, bold, link, code, ul, ol, hr, fences});

/**
 * Returns `true` if the source text might be a markdown document.
 *
 * @param src Source text to analyze.
 */
export const is = (src: string): boolean => REG.test(src);
