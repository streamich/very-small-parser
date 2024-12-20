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
  const arr: (hast.IElement | hast.IText | hast.IRoot)[] = [];
  if (!children) return arr;
  const length = children.length;
  for (let i = 0; i < length; i++) arr.push(toHast(children[i]) as hast.IElement | hast.IText | hast.IRoot);
  return arr;
};

const toHastChildrenSkipSingleParagraph = (node: {children?: IToken[]}): (
  | hast.IElement
  | hast.IText
  | hast.IRoot
)[] => {
  const {children} = node;
  if (children?.length === 1 && children[0].type === 'paragraph') return toTextChildrenInline(children[0]);
  return toHastChildren(node);
};

const el = (
  tagName: string,
  properties?: hast.IElement['properties'],
  children?: hast.IElement['children'],
): hast.IElement => {
  const node = {
    type: 'element',
    tagName,
  } as hast.IElement;
  if (properties) node.properties = properties;
  if (children) node.children = children;
  return node;
};

const element = (
  tagName: string,
  block: TBlockToken,
  properties?: hast.IElement['properties'],
  children: hast.IElement['children'] = toHastChildren(block) as hast.IElement['children'],
): hast.IElement => el(tagName, properties, children);

const text = (value: string): hast.IText => ({type: 'text', value});

export const toHast = (node: IToken | IToken[]): hast.THtmlToken => {
  if (Array.isArray(node)) return {type: 'root', children: toHastChildren({children: node})};
  const block = node as TBlockToken;
  switch (block.type) {
    case 'paragraph':
      return element('p', block, void 0, toTextChildrenInline(block));
    case 'code': {
      const lang = block.lang || 'text';
      const attr: hast.IElement['properties'] = {
        class: 'language-' + lang,
        'data-lang': lang,
        'data-meta': block.meta || '',
      };
      return element('pre', block, attr, [element('code', block, {...attr}, [text(block.value)])]);
    }
    case 'heading':
      return element('h' + block.depth, block, void 0, toTextChildrenInline(block));
    case 'blockquote': {
      let attr: hast.IElement['properties'] = void 0;
      if (block.spoiler) attr = {'data-spoiler': 'true'};
      return element('blockquote', block, attr, toHastChildren(block));
    }
    case 'list': {
      const children = block.children;
      const length = children.length;
      const items: hast.IElement[] = [];
      for (let i = 0; i < length; i++) {
        const item = children[i];
        const itemAttr: hast.IElement['properties'] = {};
        const checked = item.checked;
        if (typeof checked === 'boolean') itemAttr['data-checked'] = checked + '';
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
    case 'thematicBreak':
      return el('hr');
    case 'table': {
      const {align, children} = block;
      const rowLength = children.length;
      const columnLength = align.length;
      const headerRow = children[0];
      const headerRowCells: hast.IElement[] = [];
      const header = el('thead', void 0, [el('tr', void 0, headerRowCells)]);
      if (headerRow) {
        const headerCells = headerRow.children;
        for (let j = 0; j < columnLength; j++) {
          const alignment = align[j];
          const cellAttr = alignment ? {align: alignment} : void 0;
          headerRowCells.push(el('th', cellAttr, toTextChildrenInline(headerCells[j])));
        }
      }
      const bodyRows: hast.IElement[] = [];
      const body = el('tbody', void 0, bodyRows);
      for (let i = 1; i < rowLength; i++) {
        const row = children[i];
        const rowChildren = row.children;
        const tds: hast.IElement[] = [];
        for (let j = 0; j < columnLength; j++) {
          const cell = rowChildren[j];
          const alignment = align[j];
          const cellAttr = alignment ? {align: alignment} : void 0;
          tds.push(el('td', cellAttr, toTextChildrenInline(cell)));
        }
        bodyRows.push(el('tr', void 0, tds));
      }
      const attr: hast.IElement['properties'] = {
        'data-align': JSON.stringify(align),
      };
      return el('table', attr, [header, body]);
    }
    case 'definition': {
      const {label, url, title, identifier: id} = block;
      const attr: hast.IElement['properties'] = {
        'data-node': 'definition',
        'data-label': label,
        'data-id': id,
        'data-title': title || '',
        'data-url': url,
      };
      return el('div', attr, [
        el('a', {name: id, id}, [text(block.label)]),
        text(': '),
        el('a', {href: url, title: title || url}, [text(title || url)]),
      ]);
    }
    case 'footnoteDefinition': {
      const id = block.identifier;
      const attr: hast.IElement['properties'] = {
        'data-node': 'footnoteDefinition',
        'data-label': block.label,
        'data-id': id,
      };
      return el('div', attr, [el('a', {name: id, id}, [text(block.label)]), ...toHastChildren(block)]);
    }
    case 'math': {
      const attr: hast.IElement['properties'] = {
        'data-math': 'true',
      };
      return element('pre', block, attr, [element('code', block, {...attr}, [text(block.value)])]);
    }
    case 'element':
      return block;
    case '':
      return element('br', block);
  }
  return {...node, type: 'root', children: toHastChildren(block)} as hast.THtmlToken;
};
