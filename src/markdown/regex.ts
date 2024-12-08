import {rep} from '../util';

export const replace = (reg: RegExp, map: {[s: string]: RegExp}) => {
  let source = reg.source;
  for (const key in map) source = rep(new RegExp(key, 'g'), map[key].source, source);
  return new RegExp(source, reg.flags);
};

export const label = /(?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?/;
export const title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;
export const urlInline =
  /(https?:\/\/)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}(\.[a-z]{2,4})?\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=,\*]*)/;
export const hr = /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/;
export const def = replace(/^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/, {
  label,
  title,
});
