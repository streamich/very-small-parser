export const replace = (reg: RegExp, map: {[s: string]: RegExp}) => {
  let source = reg.source;
  for (const key in map) source = source.replace(new RegExp(key, 'g'), map[key].source);
  return new RegExp(source, reg.flags);
};

export const label = /(?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?/;
// biome-ignore lint: allow control characters in regexp
export const url = /\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f()\\]*\)|[^\s\x00-\x1f()\\])*?)/;
export const title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;
export const urlInline =
  /(https?:\/\/)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}(\.[a-z]{2,4})?\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=,\*]*)/;
export const heading = /^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n+|$)/;
export const lheading = /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/;
export const blockquote =
  /^( *>[^\n]+(\n(?!^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$))[^\n]+)*)+/;
export const hr = /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/;
export const bull = /(?:[*+-]|\d+\.)/;
export const def = replace(/^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/, {
  label,
  title,
});
export const list = replace(/^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/, {bull, hr, def});
export const item = replace(/^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/gm, {bull});
export const paragraph = replace(/^((?:[^\n]+(\n(?!\s{0,3}bull))?)+)\n*/, {bull});
export const comment = /<!--(?!-?>)[\s\S]*?-->/;
export const tag = new RegExp(
  'address|article|aside|base|basefont|blockquote|body|caption' +
    '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption' +
    '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe' +
    '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option' +
    '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr' +
    '|track|ul',
);
export const html = replace(
  new RegExp(
    '^ {0,3}(?:' + // optional indentation
      '<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' + // (1)
      '|comment[^\\n]*(\\n+|$)' + // (2)
      '|<\\?[\\s\\S]*?\\?>\\n*' + // (3)
      '|<![A-Z][\\s\\S]*?>\\n*' + // (4)
      '|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\n*' + // (5)
      '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)' + // (6)
      '|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=\\h*\\n)[\\s\\S]*?(?:\\n{2,}|$)' + // (7) open tag
      '|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=\\h*\\n)[\\s\\S]*?(?:\\n{2,}|$)' + // (7) closing tag
      ')',
  ),
  {
    comment,
    tag,
    attribute: / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/,
  },
);
