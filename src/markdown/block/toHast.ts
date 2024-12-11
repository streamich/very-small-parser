import {toHast as toHastInline} from '../inline/toHast';
import type {IToken} from '../../types';
import type {TBlockToken} from './types';
import type * as hast from '../../html/types';

const toTextChildrenInline = ({children}: {children?: IToken[]}): (hast.IElement | hast.IText | hast.IRoot)[] => {
  const res: (hast.IElement | hast.IText | hast.IRoot)[] = [];
  if (!children) return res;
  const length = children.length;
  for (let i = 0; i < length; i++) res.push(toHastInline(children[i]));
  return res;
};

const toHastChildren = ({children}: {children?: IToken[]}): (hast.IElement | hast.IText | hast.IRoot)[] => {
  let arr: (hast.IElement | hast.IText | hast.IRoot)[] = [];
  if (!children) return arr;
  const length = children.length;
  for (let i = 0; i < length; i++) arr.push(toHast(children[i]) as (hast.IElement | hast.IText | hast.IRoot));
  return arr;
};

const toHastChildrenSkipSingleParagraph = (node: {children?: IToken[]}): (hast.IElement | hast.IText | hast.IRoot)[] => {
  const {children} = node;
  if (children?.length === 1 && children[0].type === 'paragraph')
    return toTextChildrenInline(children[0]);
  return toHastChildren(node);
};

const element = (tagName: string, block: TBlockToken, properties?: hast.IElement['properties'], children: hast.IElement['children'] = toHastChildren(block) as hast.IElement['children']): hast.IElement => {
  const node = {
    type: 'element',
    tagName,
    children,
  } as hast.IElement;
  if (properties) node.properties = properties;
  return node;
};

const text = (value: string): hast.IText => ({type: 'text', value});

export const toHast = (node: IToken | IToken[]): hast.THtmlToken => {
  if (Array.isArray(node)) return {type: 'root', children: toHastChildren({children: node})};
  const block = node as TBlockToken;
  switch (block.type) {
    case 'paragraph': return element('p', block, void 0, toTextChildrenInline(block));
    case 'code': {
      const lang = block.lang || 'text';
      const attr: hast.IElement['properties'] = {
        class: 'language-' + lang,
        'data-lang': lang,
        'data-meta': block.meta || '',
      };
      return element('pre', block, attr,
        [element('code', block, {...attr}, [text(block.value)])]
      );
    }
    case 'heading': return element('h' + block.depth, block, void 0, toTextChildrenInline(block));
    case 'blockquote': return element('blockquote', block, void 0, toHastChildren(block));
    case 'list': {
      const children = block.children;
      const length = children.length;
      const items: hast.IElement[] = [];
      for (let i = 0; i < length; i++) {
        const item = children[i];
        const itemAttr: hast.IElement['properties'] = {};
        const checked = item.checked
        if (typeof checked === 'boolean')
          itemAttr['data-checked'] = checked + '';
        items.push(element('li', item, itemAttr, toHastChildrenSkipSingleParagraph(item)));
      }
      const attr: hast.IElement['properties'] = {};
      let tag: 'ol' | 'ul' = 'ul';
      if (block.ordered) {
        tag = 'ol';
        attr.start = (block.start ?? 1) + '';
      }
      const list = element(tag, block, attr, items);
      return list;
    }
    case 'thematicBreak': return element('hr', block);
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
    case 'element': return block;
    case '': return element('br', block);
  }
  // biome-ignore lint: extra catch-all case
  return {...node, type: 'root', children: toHastChildren(block)} as hast.THtmlToken;
};
