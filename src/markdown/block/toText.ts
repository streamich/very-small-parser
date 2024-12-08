import {toText as toTextHtml} from '../../html/toText';
import {toText as toTextInline} from '../inline/toText';
import type {IToken} from '../../types';
import type {IListItem, TBlockToken} from './types';

const toTextInlineChildren = (children?: IToken[]): string => {
  if (!children) return '';
  let str = '';
  const length = children.length;
  for (let i = 0; i < length; i++) str += toText(children[i]);
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
  if (Array.isArray(node)) return toTextInlineChildren(node);
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
      return '> ' + toTextBlockChildren(block.children).replace(/\n/g, '\n> ');
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
          if (size > columnSizes[j]) columnSizes[j] = size;
        }
      }
      let headerSeparator = '';
      for (let j = 0; j < columnLength; j++) {
        const alignment = align[j];
        const size = columnSizes[j];
        let txt = '-'.padEnd(size, '-');
        switch (alignment) {
          case 'center':
            txt = ':' + txt + ':';
            break;
          case 'right':
            txt = '-' + txt + ':';
            break;
          case 'left':
            txt = ':' + txt + '-';
            break;
          default:
            txt = txt + '--';
        }
        headerSeparator += '|' + txt;
      }
      headerSeparator += '|';
      for (let i = 0; i < rowLength; i++) {
        const row = texts[i];
        for (let j = 0; j < columnLength; j++) {
          const alignment = align[j];
          const size = columnSizes[j];
          let txt = row[j]; //.padEnd(size, ' ');
          switch (alignment) {
            case 'center':
              const length = txt.length;
              const left = Math.ceil((size - length) / 2);
              txt = txt.padStart(left + length, ' ').padEnd(size, ' ');
              break;
            case 'right':
              txt = txt.padStart(size, ' ');
              break;
            default:
              txt = txt.padEnd(size, ' ');
          }
          texts[i][j] = ' ' + txt + ' ';
        }
      }
      let str = '|' + texts[0].join('|') + '|\n' + headerSeparator;
      for (let i = 1; i < rowLength; i++) str += '\n|' + texts[i].join('|') + '|';
      return str;
    }
    case 'math':
      return '$$\n' + block.value + '\n$$';
    case 'element':
      return toTextHtml(block);
    case '': // newline
      return '\n\n';
    default:
      return toTextInline(block);
  }
  // biome-ignore lint: unreachable code
  return toTextInlineChildren((block as any).children);
};
