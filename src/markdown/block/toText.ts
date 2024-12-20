import {toText as toTextHtml} from '../../html/toText';
import {toText as toTextInline} from '../inline/toText';
import type {IToken} from '../../types';
import type {IListItem, TBlockToken} from './types';

const toTextInlineChildren = (children?: IToken[]): string => {
  if (!children) return '';
  let str = '';
  const length = children.length;
  for (let i = 0; i < length; i++) str += toTextInline(children[i]);
  return str;
};

const toTextBlockChildren = (children?: IToken[], separator = '\n\n'): string => {
  if (!children) return '';
  let str = '';
  const length = children.length;
  for (let i = 0; i < length; i++) str += (str ? separator : '') + toText(children[i]);
  return str;
};

export const toText = (node: IToken | IToken[]): string => {
  if (Array.isArray(node)) return toTextBlockChildren(node);
  const block = node as TBlockToken;
  const type = block.type;
  switch (type) {
    case 'paragraph':
      return toTextInlineChildren(block.children);
    case 'code': {
      return '```' + (block.lang || '') + (block.meta ? ' ' + block.meta : '') + '\n' + block.value + '\n```';
    }
    case 'heading': {
      const depth = block.depth;
      const prefix = '#'.repeat(depth);
      return prefix + ' ' + toTextInlineChildren(block.children);
    }
    case 'blockquote': {
      const indent = block.spoiler ? '>! ' : '> ';
      return indent + toTextBlockChildren(block.children).replace(/\n/g, '\n' + indent);
    }
    case 'list': {
      const {ordered, start, spread} = block;
      const bullet = ordered ? (start || 1) + '. ' : '- ';
      const separator = spread ? '\n\n' : '\n';
      const children = block.children;
      const last = children.length - 1;
      let str = '';
      for (let i = 0; i <= last; i++) {
        const item = children[i] as IListItem;
        const itemSeparator = item.spread ? '\n\n' : '\n';
        const content = toTextBlockChildren(item.children, itemSeparator).replace(/\n/g, '\n  ');
        const checked = item.checked;
        if (typeof checked === 'boolean') str += (checked ? '- [x]' : '- [ ]') + ' ' + content;
        else str += bullet + content;
        if (i !== last) str += separator;
      }
      return str;
    }
    case 'thematicBreak':
      return '---';
    case 'table': {
      const {align, children: rows} = block;
      const texts: string[][] = [];
      const columnSizes: number[] = Array.from({length: align.length}, () => 1);
      const columnLength = align.length;
      const rowLength = rows.length;
      let totalSize = 1 * columnLength;
      // Compute column sizes and pre-format cell texts
      for (let i = 0; i < rowLength; i++) {
        const row = rows[i];
        const textRow: string[] = [];
        const cells = row.children;
        texts.push(textRow);
        for (let j = 0; j < columnLength; j++) {
          const cell = cells[j];
          const text = toTextInlineChildren(cell.children);
          textRow.push(text);
          const size = text.length;
          if (size > columnSizes[j]) {
            totalSize += size - columnSizes[j];
            columnSizes[j] = size;
          }
        }
      }
      const isWide = totalSize > 200;
      // Format cells
      for (let i = 0; i < rowLength; i++) {
        const row = texts[i];
        for (let j = 0; j < columnLength; j++) {
          const alignment = align[j];
          const size = columnSizes[j];
          let txt = row[j];
          const length = txt.length;
          const leftPadding =
            alignment === 'right' ? size - length : alignment === 'center' ? Math.ceil((size - length) / 2) : 0;
          if (!isWide) txt = row[j].padStart(leftPadding + length, ' ').padEnd(size, ' ');
          texts[i][j] = ' ' + txt + ' ';
        }
      }
      // Format first row (header)
      let str = '|' + texts[0].join('|') + '|\n';
      // Format header separator
      for (let j = 0; j < columnLength; j++) {
        const alignment = align[j];
        const txt = isWide ? '-' : '-'.repeat(columnSizes[j]);
        str +=
          '|' +
          (alignment === 'center' || alignment === 'left' ? ':' : '-') +
          txt +
          (alignment === 'center' || alignment === 'right' ? ':' : '-');
      }
      str += '|';
      // Format remaining rows
      for (let i = 1; i < rowLength; i++) str += '\n|' + texts[i].join('|') + '|';
      return str;
    }
    case 'definition': {
      const {label, url, title} = block;
      let str = '[' + label + ']: ';
      if (!url || url.includes('"')) str += '<' + url + '>';
      else str += url;
      if (title) {
        str += title.length + str.length > 80 ? '\n    ' : ' ';
        const hasDoubleQuote = title.includes('"');
        str += hasDoubleQuote ? '(' + title + ')' : '"' + title + '"';
      }
      return str;
    }
    case 'footnoteDefinition': {
      const {label, children} = block;
      return '[^' + label + ']: ' + toTextBlockChildren(children).replace(/\n/g, '\n  ');
    }
    case 'math':
      return '$$\n' + block.value + '\n$$';
    case 'element':
      return toTextHtml(block);
    case '': // newline
      return '\n\n';
  }
  return toTextBlockChildren((block as any).children ?? []);
};
