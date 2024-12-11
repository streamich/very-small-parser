import {toText as toTextHtml} from '../../html/toText';
import {toHast as toHastInline} from '../inline/toHast';
import type {IToken} from '../../types';
import type {IListItem, TBlockToken} from './types';
import type * as hast from '../../html/types';

const toTextChildrenInline = ({children}: {children?: IToken[]}): (hast.IElement | hast.IText | hast.IRoot)[] => {
  const res: (hast.IElement | hast.IText | hast.IRoot)[] = [];
  if (!children) return res;
  const length = children.length;
  for (let i = 0; i < length; i++) res.push(toHastInline(children[i]));
  return res;
};

const toHastChildren = ({children}: {children?: IToken[]}): hast.THtmlToken[] => {
  let arr: hast.THtmlToken[] = [];
  if (!children) return arr;
  const length = children.length;
  for (let i = 0; i < length; i++) arr.push(toHast(children[i]));
  return arr;
};

const element = (tagName: string, inline: TBlockToken, properties?: hast.IElement['properties'], children: hast.IElement['children'] = toHastChildren(inline) as hast.IElement['children']): hast.IElement => {
  const node = {
    type: 'element',
    tagName,
    children,
  } as hast.IElement;
  if (properties) node.properties = properties;
  return node;
};

export const toHast = (node: IToken | IToken[]): hast.IElement | hast.IText | hast.IRoot => {
  if (Array.isArray(node)) return {type: 'root', children: toHastChildren({children: node})};
  const block = node as TBlockToken;
  switch (block.type) {
    case 'paragraph':
      // return toTextInlineChildren(block.children);
      // return [];
      return element('p', block, void 0, toTextChildrenInline(block));
    case 'code': {
      // return '```' + (block.lang || '') + (block.meta ? ' ' + block.meta : '') + '\n' + block.value + '\n```';
      return element('div', block);
    }
    case 'heading': {
      // const depth = block.depth;
      // const prefix = '#'.repeat(depth);
      // return prefix + ' ' + toTextInlineChildren(block.children);
      return element('div', block);
    }
    case 'blockquote': {
      // return '> ' + toTextBlockChildren(block.children).replace(/\n/g, '\n> ');
      return element('div', block);
    }
    case 'list': {
      // const {ordered, start, spread} = block;
      // const bullet = ordered ? (start || 1) + '. ' : '- ';
      // const separator = spread ? '\n\n' : '\n';
      // const children = block.children;
      // const last = children.length - 1;
      // let str = '';
      // for (let i = 0; i <= last; i++) {
      //   const item = children[i] as IListItem;
      //   const itemSeparator = item.spread ? '\n\n' : '\n';
      //   const content = toTextBlockChildren(item.children, itemSeparator).replace(/\n/g, '\n  ');
      //   const checked = item.checked;
      //   if (typeof checked === 'boolean') str += (checked ? '- [x]' : '- [ ]') + ' ' + content;
      //   else str += bullet + content;
      //   if (i !== last) str += separator;
      // }
      // return str;
      return element('div', block);
    }
    case 'thematicBreak':
      // return '---';
      return element('div', block);
    case 'table': {
      // const {align, children: rows} = block;
      // const texts: string[][] = [];
      // const columnSizes: number[] = Array.from({length: align.length}, () => 1);
      // const columnLength = align.length;
      // const rowLength = rows.length;
      // let totalSize = 1 * columnLength;
      // // Compute column sizes and pre-format cell texts
      // for (let i = 0; i < rowLength; i++) {
      //   const row = rows[i];
      //   const textRow: string[] = [];
      //   const cells = row.children;
      //   texts.push(textRow);
      //   for (let j = 0; j < columnLength; j++) {
      //     const cell = cells[j];
      //     const text = toTextInlineChildren(cell.children);
      //     textRow.push(text);
      //     const size = text.length;
      //     if (size > columnSizes[j]) {
      //       totalSize += size - columnSizes[j];
      //       columnSizes[j] = size;
      //     }
      //   }
      // }
      // const isWide = totalSize > 200;
      // // Format cells
      // for (let i = 0; i < rowLength; i++) {
      //   const row = texts[i];
      //   for (let j = 0; j < columnLength; j++) {
      //     const alignment = align[j];
      //     const size = columnSizes[j];
      //     let txt = row[j];
      //     const length = txt.length;
      //     const leftPadding =
      //       alignment === 'right' ? size - length : alignment === 'center' ? Math.ceil((size - length) / 2) : 0;
      //     if (!isWide) txt = row[j].padStart(leftPadding + length, ' ').padEnd(size, ' ');
      //     texts[i][j] = ' ' + txt + ' ';
      //   }
      // }
      // // Format first row (header)
      // let str = '|' + texts[0].join('|') + '|\n';
      // // Format header separator
      // for (let j = 0; j < columnLength; j++) {
      //   const alignment = align[j];
      //   const txt = isWide ? '-' : '-'.repeat(columnSizes[j]);
      //   str +=
      //     '|' +
      //     (alignment === 'center' || alignment === 'left' ? ':' : '-') +
      //     txt +
      //     (alignment === 'center' || alignment === 'right' ? ':' : '-');
      // }
      // str += '|';
      // // Format remaining rows
      // for (let i = 1; i < rowLength; i++) str += '\n|' + texts[i].join('|') + '|';
      // return str;
      return element('div', block);
    }
    case 'definition': {
      // const {label, url, title} = block;
      // let str = '[' + label + ']: ';
      // if (!url || url.includes('"')) str += '<' + url + '>';
      // else str += url;
      // if (title) {
      //   str += title.length + str.length > 80 ? '\n    ' : ' ';
      //   const hasDoubleQuote = title.includes('"');
      //   str += hasDoubleQuote ? '(' + title + ')' : '"' + title + '"';
      // }
      // return str;
      return element('div', block);
    }
    case 'footnoteDefinition': {
      // const {label, children} = block;
      // return '[^' + label + ']: ' + toTextBlockChildren(children).replace(/\n/g, '\n  ');
      return element('div', block);
    }
    case 'math':
      // return '$$\n' + block.value + '\n$$';
      return element('div', block);
    case 'element':
      // return toTextHtml(block);
      return element('div', block);
    case '': // newline
      // return '\n\n';
      return element('div', block);
  }
  // biome-ignore lint: extra catch-all case
  return {...node, type: 'root', children: toHastChildren(block)} as (hast.IElement | hast.IText | hast.IRoot);
};
