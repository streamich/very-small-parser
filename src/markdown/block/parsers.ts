import {token} from '../../util';
import * as reg from '../regex';
import type {TTokenizer} from '../../types';
import type {MdBlockParser} from './MdBlockParser';
import type * as type from './types';

const REG_NEWLINE = /^[\n\r]+/;
const newline: TTokenizer<type.INewline> = (_, src) => {
  const matches = src.match(REG_NEWLINE);
  if (matches) return token<type.INewline>(matches[0], 'newline');
};

const REG_CODE = /^(\s{4}[^\n]+)+/;
const code: TTokenizer<type.ICode> = (_, src) => {
  const matches = src.match(REG_CODE);
  if (!matches) return;
  const subvalue = matches[0];
  const overrides = {
    value: subvalue.replace(/^ {4}/gm, '').replace(/\n+$/, ''),
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

const heading: TTokenizer<type.IHeading, MdBlockParser<type.TBlockToken>> = (parser, src) => {
  let matches = src.match(reg.heading);
  if (matches) {
    const subvalue = matches[2];
    return token<type.IHeading>(matches[0], 'heading', parser.parseInline(subvalue), {depth: matches[1].length});
  }
  matches = src.match(reg.lheading);
  if (matches) {
    const subvalue = matches[1];
    return token<type.IHeading>(matches[0], 'heading', parser.parseInline(subvalue), {
      depth: matches[2] === '-' ? 1 : 2,
    });
  }
};

const blockquote: TTokenizer<type.IBlockquote, MdBlockParser<type.TBlockToken>> = (parser, src) => {
  const matches = src.match(reg.blockquote);
  if (!matches) return;
  const subvalue = matches[0];
  const innerValue = subvalue.replace(/^ *> ?/gm, '');
  const children = parser.parse(innerValue);
  return token<type.IBlockquote>(subvalue, 'blockquote', children);
};

const REG_BULLET = /^(\s*)([*+-]|\d\.)(\s{1,2}|\t)/;
const REG_LOOSE = /\n\n(?!\s*$)/;
const getParts = (subvalue: string): string[] | null => subvalue.match(reg.item);
const list: TTokenizer<type.IList, MdBlockParser<type.TBlockToken>> = (parser, value) => {
  const matches = value.match(reg.list);
  if (!matches) return;
  const subvalue = matches[0];
  const parts = getParts(subvalue);
  if (!parts) return;
  const length = parts.length;
  const children: any[] = [];
  let ordered = false;
  let start = null;
  let loose = false;
  for (let i = 0; i < length; i++) {
    const part = parts[i];
    const bulletMatch = part.match(REG_BULLET);
    if (!bulletMatch) return;
    const sansBullet = part.slice(bulletMatch[0].length);
    const bulletMarker = bulletMatch[2];
    if (i === 0 && bulletMarker.length > 1) {
      ordered = true;
      start = Number.parseInt(bulletMarker, 10);
    }
    let outdented = sansBullet.replace(/^ {1,4}/gm, '');
    let checked: null | boolean = null;
    if (outdented[0] === '[' && outdented[2] === ']') {
      switch (outdented[1]) {
        case 'x':
        case 'X':
          outdented = outdented.substr(3);
          checked = true;
          break;
        case ' ':
          outdented = outdented.substr(3);
          checked = false;
          break;
      }
    }
    const partLoose = REG_LOOSE.test(sansBullet);
    if (partLoose) loose = true;
    children.push({
      type: 'listItem',
      loose: partLoose,
      checked,
      children: parser.parse(outdented),
    });
  }
  return token<type.IList>(subvalue, 'list', children, {ordered, start, loose});
};

const html: TTokenizer<type.IHtml> = (eat, value) => {
  const matches = value.match(reg.html);
  if (matches) return token<type.IHtml>(matches[0], 'html', void 0, {value: matches[0]});
};

const REG_TABLE = /^ *\|(.+)\n *\|?( *[-:]+[-| :]*)(?:\n((?: *[^>\n ].*(?:\n|$))*)\n*|$)/;
const splitCells = (tableRow: string, count?: number) => {
  const cells = tableRow.replace(/([^\\])\|/g, '$1 |').split(/ +\| */);
  if (count !== void 0) {
    if (cells.length > count) cells.splice(count);
    else while (cells.length < count) cells.push('');
  }
  for (let i = 0; i < cells.length; i++) cells[i] = cells[i].replace(/\\\|/g, '|');
  return cells;
};
const table: TTokenizer<type.ITable, MdBlockParser<type.TBlockToken>> = (parser, value) => {
  const matches = value.match(REG_TABLE);
  if (!matches) return;
  const subvalue = matches[0];
  const header = matches[1];
  const align = matches[2]
    .replace(/^ *|\| *$/g, '')
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
  const rows = matches[3] ? matches[3].replace(/(?: *\| *)?\n$/, '').split('\n') : [];
  const children: type.ITableRow[] = [];
  const headers = splitCells(header.replace(/^ *| *\| *$/g, '')).map((headerText) => ({
    type: 'tableCell',
    children: parser.parseInline(headerText),
  }));
  children.push({
    type: 'tableRow',
    children: headers,
  } as type.ITableRow);
  if (rows && rows.length) {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const cells = splitCells(row.replace(/^ *\| *| *\| *$/g, ''), headers.length);
      children.push({
        type: 'tableRow',
        children: cells.map((cellRawValue) => ({
          type: 'tableCell',
          children: parser.parseInline(cellRawValue),
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
  const identifier = matches[1];
  const outdented = matches[2].replace(/^ {1,4}/gm, '');
  const children = parser.parse(outdented);
  return token<type.IFootnoteDefinition>(subvalue, 'footnoteDefinition', children, {identifier});
};

const definition: TTokenizer<type.IDefinition> = (_, value) => {
  const matches = value.match(reg.def);
  if (!matches) return;
  const subvalue = matches[0];
  return token<type.IDefinition>(subvalue, 'definition', void 0, {
    identifier: matches[1],
    title: matches[3] || null,
    url: matches[2],
  });
};

const paragraph: TTokenizer<type.IParagraph, MdBlockParser<type.TBlockToken>> = (parser, value) => {
  const matches = value.match(reg.paragraph);
  if (matches) return token<type.IParagraph>(matches[0], 'paragraph', parser.parseInline(matches[1].trim()));
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
  <TTokenizer<type.TBlockToken>>html,
  <TTokenizer<type.TBlockToken>>table,
  <TTokenizer<type.TBlockToken>>footnoteDefinition,
  <TTokenizer<type.TBlockToken>>definition,
  <TTokenizer<type.TBlockToken>>paragraph,
];
