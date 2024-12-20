import {rep, token} from '../../util';
import * as reg from '../regex';
import {html as htmlParser} from '../../html';
import type {TTokenizer} from '../../types';
import type {MdBlockParser} from './MdBlockParser';
import type * as type from './types';
import type {IElement} from '../../html/types';

const REG_NEWLINE = /^[\n\r]+/;
const newline: TTokenizer<type.INewline> = (_, src) => {
  const matches = src.match(REG_NEWLINE);
  if (matches) return token<type.INewline>(matches[0], '');
};

const REG_CODE = /^(\s{4}[^\n]+)+/;
const code: TTokenizer<type.ICode> = (_, src) => {
  const matches = src.match(REG_CODE);
  if (!matches) return;
  const subvalue = matches[0];
  const overrides = {
    value: rep(/\n+$/, '', rep(/^ {4}/gm, '', subvalue)),
    lang: null,
  };
  return token<type.ICode>(subvalue, 'code', void 0, overrides, subvalue.length);
};

const REG_FENCES = /^ *(`{3,}|~{3,})([^\s]*) *([^\n]*)\n([\s\S]*?)\s*\1 *(?:\n+|$)/;
const fences: TTokenizer<type.ICode> = (_, src) => {
  const matches = src.match(REG_FENCES);
  if (!matches) return;
  const subvalue = matches[0];
  const overrides = {
    value: matches[4] || matches[3],
    lang: matches[2] || '',
    meta: matches.length > 4 ? matches[3] : null,
  };
  return token<type.ICode>(subvalue, 'code', void 0, overrides);
};

const REG_MATH = /^ *\$\$[ \.]*(\S+)? *\n([\s\S]*?)\s*\$\$ *(?:\n+|$)/;
const math: TTokenizer<type.IMath> = (_, src) => {
  const matches = src.match(REG_MATH);
  if (matches) return token<type.IMath>(matches[0], 'math', void 0, {value: matches[2]});
};

const thematicBreak: TTokenizer<type.IThematicBreak> = (_, src) => {
  const matches = src.match(reg.hr);
  if (matches) return token<type.IThematicBreak>(matches[0], 'thematicBreak', void 0, {value: matches[1]});
};

const REG_HEADING1 = /^ *(#{1,6}) +([^\n]+?) *(?:#+ *)?(?:\n+|$)/;
const REG_HEADING2 = /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/;
const heading: TTokenizer<type.IHeading, MdBlockParser<type.TBlockToken>> = (parser, src) => {
  let matches = src.match(REG_HEADING1);
  if (matches) {
    const subvalue = matches[2];
    return token<type.IHeading>(matches[0], 'heading', parser.parsei(subvalue), {depth: matches[1].length});
  }
  matches = src.match(REG_HEADING2);
  if (matches) {
    const subvalue = matches[1];
    return token<type.IHeading>(matches[0], 'heading', parser.parsei(subvalue), {
      depth: matches[2] === '-' ? 2 : 1,
    });
  }
};

const REG_BLOCKQUOTE = /^( *>[^\n]+(\n(?!^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$))[^\n]+)*)+/;
const REG_BLOCKQUOTE_OUTDENT = /^ *> ?/gm;
const REG_BLOCK_SPOILER_CHECK = /^ *!/;
const REG_BLOCK_SPOILER_OUTDENT = /^ *! ?/gm;
const blockquote: TTokenizer<type.IBlockquote, MdBlockParser<type.TBlockToken>> = (parser, src) => {
  const matches = src.match(REG_BLOCKQUOTE);
  if (!matches) return;
  const subvalue = matches[0];
  let content = rep(REG_BLOCKQUOTE_OUTDENT, '', subvalue);
  let spoiler = false;
  const isPotentiallySpoiler = content.match(REG_BLOCK_SPOILER_CHECK);
  if (isPotentiallySpoiler) {
    spoiler = content.split('\n').every((line) => line.match(REG_BLOCK_SPOILER_CHECK));
    if (spoiler) content = content.replace(REG_BLOCK_SPOILER_OUTDENT, '');
  }
  const children = parser.parse(content);
  const node = token<type.IBlockquote>(subvalue, 'blockquote', children);
  if (spoiler) node.spoiler = spoiler;
  return node;
};

const REG_BULLET = /^\s{0,3}([*+-]|\d{1,3}\.)\s{1,42}/;
const bull = /(?:[*+-]|\d{1,3}\.)/;
const REG_LOOSE = /\n\s*\n(?!\s*$)/;
const REG_ITEM = reg.replace(/^( {0,333})(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/gm, {bull});
const REG_LIST = reg.replace(/^ {0,3}(?:bull) (?:(?!\r?\n\r?\n)[\s\S])+/, {
  bull,
  hr: reg.hr,
  def: reg.def,
});
const getParts = (subvalue: string): string[] | null => subvalue.match(REG_ITEM);
const list: TTokenizer<type.IList, MdBlockParser<type.TBlockToken>> = (parser, value) => {
  const matches = value.match(REG_LIST);
  if (!matches) return;
  const subvalue = matches[0];
  const parts = getParts(subvalue);
  if (!parts) return;
  const length = parts.length;
  const children: any[] = [];
  let start: null | number = null;
  for (let i = 0; i < length; i++) {
    const part = parts[i];
    // if (part[part.length - 1] === '\n') part = part.trimEnd();
    const bulletMatch = part.match(REG_BULLET);
    if (!bulletMatch) return;
    const [bulletWithWhitespace, bullet] = bulletMatch;
    let content = part.slice(bulletWithWhitespace.length);
    if (i === 0 && bullet.length > 1) start = Number(bullet);
    let checked: null | boolean = null;
    if (content[0] === '[' && content[2] === ']' && content[3] === ' ') {
      checked = content[1] !== ' ';
      content = content.slice(4);
    }
    const newLinePos = content.indexOf('\n');
    if (newLinePos > 0) {
      let outdentSize = 0;
      for (let pos = newLinePos + 1; pos < newLinePos + 4; pos++)
        if (content[pos] === ' ') outdentSize++;
        else break;
      if (outdentSize) content = rep(new RegExp('^ {1,' + outdentSize + '}', 'gm'), '', content);
    }
    children.push({
      type: 'listItem',
      spread: REG_LOOSE.test(content),
      checked,
      children: parser.parse(content),
    });
  }
  return token<type.IList>(subvalue, 'list', children, {ordered: start !== null, start});
};

const splitCells = (tableRow: string, count?: number) => {
  const cells = rep(/([^\\])\|/g, '$1 |', tableRow).split(/ +\| */);
  if (count !== void 0) {
    if (cells.length > count) cells.splice(count);
    else while (cells.length < count) cells.push('');
  }
  for (let i = 0; i < cells.length; i++) cells[i] = rep(/\\\|/g, '|', cells[i]);
  return cells;
};
const REG_TABLE = /^ *\|?(.+)\n *\|?( *[-:]+[-| :]*)(?:\n((?: *[^>\n ].*(?:\n|$))*)\n*|$)/;
const table: TTokenizer<type.ITable, MdBlockParser<type.TBlockToken>> = (parser, value) => {
  const matches = value.match(REG_TABLE);
  if (!matches) return;
  const subvalue = matches[0];
  const header = matches[1];
  const align = rep(/^ *|\| *$/g, '', matches[2])
    .split(/ *\| */)
    .map((spec) => {
      spec = spec.trim();
      return spec[0] === ':'
        ? spec[spec.length - 1] === ':'
          ? 'center'
          : 'left'
        : spec[spec.length - 1] === ':'
          ? 'right'
          : null;
    });
  const rows = matches[3] ? rep(/(?: *\| *)?\n$/, '', matches[3]).split('\n') : [];
  const children: type.ITableRow[] = [];
  const headers = splitCells(rep(/^ *| *\| *$/g, '', header)).map((headerText) => ({
    type: 'tableCell',
    children: parser.parsei(headerText),
  }));
  children.push({
    type: 'tableRow',
    children: headers,
  } as type.ITableRow);
  if (rows && rows.length) {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const cells = splitCells(rep(/^ *\| *| *\| *$/g, '', row), headers.length);
      children.push({
        type: 'tableRow',
        children: cells.map((cellRawValue) => ({
          type: 'tableCell',
          children: parser.parsei(cellRawValue),
        })),
      } as type.ITableRow);
    }
  }
  return token<type.ITable>(subvalue, 'table', children, {align});
};

const REG_FOOTNOTE_DEF = /^\[\^([a-zA-Z0-9\-_]+)\]: *([^\n]*(\n?(( {2}([^\n]*)\n?)|\n(?!\n))*)?)/;
const footnoteDefinition: TTokenizer<type.IFootnoteDefinition, MdBlockParser<type.TBlockToken>> = (parser, value) => {
  const matches = value.match(REG_FOOTNOTE_DEF);
  if (!matches) return;
  const subvalue = matches[0];
  const label = matches[1];
  const identifier = label.toLowerCase();
  const outdented = rep(/^ {1,4}/gm, '', matches[2]);
  const children = parser.parse(outdented);
  return token<type.IFootnoteDefinition>(subvalue, 'footnoteDefinition', children, {label, identifier});
};

const definition: TTokenizer<type.IDefinition> = (_, value) => {
  const matches = value.match(reg.def);
  if (!matches) return;
  const subvalue = matches[0];
  const label = matches[1];
  const title = matches[3];
  return token<type.IDefinition>(subvalue, 'definition', void 0, {
    label: label,
    identifier: label.toLowerCase(),
    title: title ? title.slice(1, -1) : null,
    url: matches[2],
  });
};

const html: TTokenizer<IElement> = (_, src) => htmlParser.el(src);

const REG_PARAGRAPH = reg.replace(/^((?:[^\n]+(\n(?!\s{0,3}bull))?)+)\n*/, {bull});
const paragraph: TTokenizer<type.IParagraph, MdBlockParser<type.TBlockToken>> = (parser, value) => {
  const matches = value.match(REG_PARAGRAPH);
  if (matches) return token<type.IParagraph>(matches[0], 'paragraph', parser.parsei(matches[1].trim()));
};

export const parsers: TTokenizer<type.TBlockToken, MdBlockParser<type.TBlockToken>>[] = [
  <TTokenizer<type.TBlockToken>>newline,
  <TTokenizer<type.TBlockToken>>code,
  <TTokenizer<type.TBlockToken>>fences,
  <TTokenizer<type.TBlockToken>>math,
  <TTokenizer<type.TBlockToken>>thematicBreak,
  <TTokenizer<type.TBlockToken>>heading,
  <TTokenizer<type.TBlockToken>>blockquote,
  <TTokenizer<type.TBlockToken>>list,
  <TTokenizer<type.TBlockToken>>table,
  <TTokenizer<type.TBlockToken>>footnoteDefinition,
  <TTokenizer<type.TBlockToken>>definition,
  <TTokenizer<IElement>>html,
  <TTokenizer<type.TBlockToken>>paragraph,
];
