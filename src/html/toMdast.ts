import {toPlainText} from '../toPlainText';
import type {IToken} from '../types';
import type * as mdi from '../markdown/inline/types';
import type * as md from '../markdown/block/types';
import type * as html from './types';

const toMdastInlineChildren = ({children}: {children: html.THtmlToken[]}): mdi.TInlineToken[] => {
  const res: mdi.TInlineToken[] = [];
  const length = children.length;
  for (let i = 0; i < length; i++) {
    const node = toMdastInline(children[i]);
    if (node) res.push(node);
  }
  return res;
};

const createSimpleInlineNode = <
  N extends mdi.IStrong | mdi.IEmphasis | mdi.IDelete | mdi.ISpoiler | mdi.ISup | mdi.ISub | mdi.IMark | mdi.IUnderline,
>(
  type: N['type'],
  element: html.IElement,
): N =>
  ({
    type,
    children: toMdastInlineChildren(element),
  }) as N;

const BLOCK_TAGS_REGEX = /^(blockquote|div|h1|h2|h3|h4|h5|h6|hr|ol|p|pre|table|ul)$/;

const toMdastInline = (node: html.THtmlToken): mdi.TInlineToken | undefined => {
  const {type} = node;
  switch (type) {
    case 'element': {
      const {tagName} = node;
      switch (tagName) {
        case 'code':
        case 'pre': {
          const attr = node.properties;
          const isMath = attr?.class?.includes('math') || attr?.['data-lang'] === 'math';
          if (isMath) {
            return {
              type: 'inlineMath',
              value: toPlainText(node),
            };
          }
          return {
            type: 'inlineCode',
            value: toPlainText(node),
            wrap: '`',
          };
        }
        case 'b':
        case 'strong':
          return createSimpleInlineNode('strong', node);
        case 'i':
        case 'em':
          return createSimpleInlineNode('emphasis', node);
        case 'del':
          return createSimpleInlineNode('delete', node);
        case 'spoiler':
          return createSimpleInlineNode('spoiler', node);
        case 'sup': {
          const attr = node.properties;
          const isFootnoteReference = attr?.['data-node'] === 'footnote';
          if (isFootnoteReference) {
            const anchor = node.children?.[0];
            if (anchor && anchor.type === 'element' && anchor.tagName === 'a') {
              const anchorAttr = anchor.properties;
              const href = anchorAttr?.href || '';
              if (href[0] === '#' && href.length > 1) {
                const identifier = href.slice(1);
                const label = toPlainText(anchor);
                return {
                  type: 'footnoteReference',
                  identifier,
                  label,
                } as mdi.IFootnoteReference;
              }
            }
          }
          return createSimpleInlineNode('sup', node);
        }
        case 'sub':
          return createSimpleInlineNode('sub', node);
        case 'mark':
          return createSimpleInlineNode('mark', node);
        case 'u':
          return createSimpleInlineNode('underline', node);
        case 'acronym': {
          const attr = node.properties;
          const emoji = attr?.['data-icon'];
          if (emoji) {
            return {
              type: 'icon',
              emoji: emoji,
            } as mdi.IIcon;
          }
          break;
        }
        case 'a': {
          const attr = node.properties || {};
          const href = attr.href;
          if (href) {
            const isAnchor = href[0] === '#';
            if (isAnchor) {
              const isImageAnchor = attr['data-ref'] === 'img';
              const identifier = href.slice(1);
              if (isImageAnchor) {
                const alt = toPlainText(node) || null;
                return {
                  type: 'imageReference',
                  identifier,
                  alt,
                  referenceType: alt ? 'full' : 'collapsed',
                } as mdi.IImageReference;
              } else {
                const text = toPlainText(node).trim();
                return {
                  type: 'linkReference',
                  identifier,
                  referenceType: text ? 'full' : 'collapsed',
                  children: toMdastInlineChildren(node),
                } as mdi.ILinkReference;
              }
            } else {
              const title = attr.title;
              if (
                !title &&
                node.children?.length === 1 &&
                node.children[0].type === 'text' &&
                node.children[0].value === href &&
                href.startsWith('http')
              ) {
                return {
                  type: 'inlineLink',
                  value: href,
                } as mdi.IInlineLink;
              } else {
                return {
                  type: 'link',
                  url: href,
                  children: toMdastInlineChildren(node),
                  title,
                } as mdi.ILink;
              }
            }
          }
          return;
        }
        case 'img': {
          const attr = node.properties || {};
          const src = attr.src;
          if (src) {
            const title = attr.title || '';
            const alt = attr.alt || '';
            return {
              type: 'image',
              url: src,
              title,
              alt,
            } as mdi.IImage;
          }
          break;
        }
        case 'cite': {
          const children = node.children;
          if (children?.length === 1 && children[0].type === 'text') {
            const text = children[0].value || '';
            const prefix = text[0];
            if (prefix === '#' || prefix === '~' || prefix === '@') {
              return {
                type: 'handle',
                prefix,
                value: text.slice(1),
              } as mdi.IHandle;
            }
          }
          break;
        }
        case 'br': {
          return {
            type: 'break',
          } as mdi.IBreak;
        }
      }
      if (BLOCK_TAGS_REGEX.test(tagName)) {
        return toMdast0(node) as mdi.TInlineToken;
      }
      return node as html.IElement;
    }
    case 'text':
      return node as mdi.IText;
  }
};

const toMdastChildren = ({children}: {children: html.THtmlToken[]}): IToken[] => {
  const res: IToken[] = [];
  const length = children.length;
  for (let i = 0; i < length; i++) {
    const node = toMdast0(children[i]);
    if (node) res.push(node);
  }
  return res;
};

const validAlignAttr: Set<md.ITable['align'][number]> = new Set(['left', 'center', 'right']);

export const toMdast0 = (node: html.THtmlToken): IToken => {
  if (Array.isArray(node)) return toMdast0({type: 'root', children: node});
  switch (node.type) {
    case 'element': {
      const {tagName, properties} = node;
      switch (tagName) {
        case 'p': {
          return {
            type: 'paragraph',
            children: toMdastInlineChildren(node) as mdi.TInlineToken[],
          };
        }
        case 'blockquote': {
          const blockquote: md.IBlockquote = {
            type: 'blockquote',
            children: toMdastChildren(node) as md.TBlockToken[],
          };
          if (properties?.['data-spoiler'] === 'true') blockquote.spoiler = true;
          return blockquote;
        }
        case 'code':
        case 'pre': {
          const attr = properties || {};
          const children = node.children || [];
          if (children.length) {
            const firstChild = node.children?.[0];
            if (firstChild.type === 'element' && firstChild.tagName === 'code') {
              Object.assign(attr, firstChild.properties);
            }
          }

          const isMath = attr['data-math'] === 'true';
          if (isMath) {
            const mdastNode: md.IMath = {
              type: 'math',
              value: toPlainText(node),
            };
            return mdastNode;
          }
          const lang = attr['data-lang'] || '';
          const meta = attr['data-meta'] || '';
          const mdastNode: md.ICode = {
            type: 'code',
            value: toPlainText(node),
            lang,
          };
          if (meta) mdastNode.meta = meta;
          return mdastNode;
        }
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6': {
          const depth = Number.parseInt(tagName[1]);
          const headingNode: md.IHeading = {
            type: 'heading',
            depth,
            children: toMdastInlineChildren(node) as mdi.TInlineToken[],
          };
          return headingNode;
        }
        case 'ul':
        case 'ol': {
          const children = node.children || [];
          const length = children.length;
          const ordered = tagName === 'ol';
          const list: md.IList = {
            type: 'list',
            ordered,
            children: [],
          };
          if (ordered) list.start = Number.parseInt(properties?.start || '1');
          for (let i = 0; i < length; i++) {
            const child = children[i];
            if (child.type !== 'element' || child.tagName !== 'li') continue;
            const dataChecked = child.properties?.['data-checked'];
            const checked = dataChecked ? dataChecked === 'true' : null;
            const item: md.IListItem = {
              type: 'listItem',
              checked,
              children: toMdastChildren(child) as md.TBlockToken[],
            };
            list.children.push(item);
          }
          return list;
        }
        case 'hr':
          return {type: 'thematicBreak'} as md.IThematicBreak;
        case 'table': {
          const table: md.ITable = {
            type: 'table',
            align: [],
            children: [],
          };
          let firstRow = true;
          const processRow = (hastRow: html.IElement) => {
            const row: md.ITableRow = {
              type: 'tableRow',
              children: [],
            };
            const children = hastRow.children || [];
            const length = children.length;
            for (let i = 0; i < length; i++) {
              const child = children[i];
              if (child.type !== 'element') continue;
              if (firstRow) {
                let align: md.ITable['align'][number] = null;
                const alignAttr = child.properties?.align;
                if (validAlignAttr.has(alignAttr as any)) align = alignAttr as md.ITable['align'][number];
                table.align.push(align);
              }
              const cell: md.ITableCell = {
                type: 'tableCell',
                children: toMdastInlineChildren(child as {children: html.THtmlToken[]}),
              };
              row.children.push(cell);
            }
            table.children.push(row);
            firstRow = false;
          };
          const processRows = (hastRow: html.IElement) => {
            for (const child of hastRow.children || [])
              if (child.type === 'element' && child.tagName === 'tr') processRow(child);
          };
          for (const tableChild of node.children || []) {
            if (tableChild.type !== 'element') continue;
            switch (tableChild.tagName) {
              case 'thead': {
                processRows(tableChild);
                break;
              }
              case 'tbody': {
                processRows(tableChild);
                break;
              }
              case 'tr': {
                processRow(tableChild);
                break;
              }
            }
          }
          return table;
        }
        case 'div': {
          const attr = node.properties || {};
          const nodeType = attr['data-node'];
          switch (nodeType) {
            case 'definition': {
              const label = attr['data-label'];
              const identifier = attr['data-id'];
              const url = attr['data-url'];
              if (!label || !identifier || !url) break;
              const definitionNode: md.IDefinition = {
                type: 'definition',
                label,
                identifier,
                url,
              };
              const title = attr['data-title'];
              if (title) definitionNode.title = title;
              return definitionNode;
            }
            case 'footnoteDefinition': {
              const label = attr['data-label'];
              const identifier = attr['data-id'];
              const children = toMdastChildren(node) as md.TBlockToken[];
              const footnoteDefinitionNode: md.IFootnoteDefinition = {
                type: 'footnoteDefinition',
                label,
                identifier,
                children,
              };
              return footnoteDefinitionNode;
            }
          }
          return {
            type: 'root',
            children: toMdastChildren(node) as md.TBlockToken[],
          };
        }
        case '': {
          return {
            type: 'root',
            children: toMdastChildren(node) as md.TBlockToken[],
          };
        }
        default: {
          return toMdastInline(node) as mdi.TInlineToken;
        }
      }
    }
    case 'root': {
      return {
        type: 'root',
        children: toMdastChildren(node) as md.TBlockToken[],
      };
    }
  }
  return node;
};

const isBlock = (node: IToken): node is md.TBlockToken => {
  switch (node.type) {
    case 'paragraph':
    case 'heading':
    case 'blockquote':
    case 'list':
    case 'code':
    case 'definition':
    case 'thematicBreak':
    case 'table':
    case 'math':
    case 'footnoteDefinition':
      return true;
  }
  return false;
};

const flattenInlineChildren = (node: IToken): mdi.TInlineToken[] => {
  let result: mdi.TInlineToken[] = [];
  const children = node.children ?? [];
  const length = children.length;
  for (let i = 0; i < length; i++) {
    const child = children[i];
    if (isBlock(child)) {
      const flattened = flattenInlineChildren(child);
      result = result.concat(flattened);
    } else {
      result.push(child as mdi.TInlineToken);
    }
  }
  return result;
};

const ensureChildrenAreBlockNodes = (node: IToken): void => {
  // Ensure that immediate children of the root node are always block nodes.
  let lastBlockNode: md.TBlockToken | undefined;
  let children = node.children ?? [];
  const newChildren: md.TBlockToken[] = [];

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.type === 'root') {
      const head = children.slice(0, i);
      const tail = children.slice(i + 1);
      const mid = child.children || [];
      children = head.concat(mid).concat(tail);
      i--;
      continue;
    }
    if (isBlock(child)) {
      lastBlockNode = child;
      newChildren.push(child);
    } else {
      if (!lastBlockNode || lastBlockNode.type !== 'paragraph') {
        lastBlockNode = {
          type: 'paragraph',
          children: [],
        };
        newChildren.push(lastBlockNode);
      }
      if (!lastBlockNode.children) lastBlockNode.children = [];
      lastBlockNode.children.push(child as mdi.TInlineToken);
    }

    switch (child.type) {
      case 'blockquote':
        ensureChildrenAreBlockNodes(child);
        break;
      case 'list': {
        const {children} = child;
        if (children) {
          const length = children.length;
          for (let i = 0; i < length; i++) ensureChildrenAreBlockNodes(children[i]);
        }
        break;
      }
      case 'footnoteDefinition':
        ensureChildrenAreBlockNodes(child);
        break;
      case 'paragraph':
        child.children = flattenInlineChildren(child);
        break;
      case 'heading':
        child.children = flattenInlineChildren(child);
        break;
    }
  }

  node.children = newChildren;
};

export const fixupMdast = (node: IToken): IToken => {
  // Ensure the root node is always a root node.
  if (node.type !== 'root') {
    node = {
      type: 'root',
      children: [node],
    };
  }

  ensureChildrenAreBlockNodes(node);

  return node;
};

export const toMdast = (node: html.THtmlToken): IToken => fixupMdast(toMdast0(node));
