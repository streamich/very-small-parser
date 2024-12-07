import {THtmlToken} from "./types";

const escapeText = (str: string): string => str.replace(/[\u00A0-\u9999<>\&]/gim, (i) => '&#' + i.charCodeAt(0) + ';');

const escapeAttr = (str: string): string => str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/**
 * Pretty-prints an HTML node to text.
 *
 * @param node HTML node to convert to text
 * @param tab Tabulation for children
 * @param ident Current indentation
 * @returns Text representation of the HTML node
 */
export const toText = (node: THtmlToken | THtmlToken[], tab: string = '', ident: string = ''): string => {
  if (Array.isArray(node)) return node.map((n) => toText(n, tab, ident)).join('');
  if (typeof node === 'string') return ident + escapeText(node);
  const {type} = node;
  switch (type) {
    case 'text':
      return ident + escapeText(node.value || '');
    case 'comment': {
      const {value} = node;
      return value ? ident + '<!--' + escapeText(value) + '-->' : '';
    }
    // case 'doctype': return '';
    case 'element': {
      const {tagName, properties, children} = node;
      const childrenLength = children.length;
      const isFragment = !tagName;
      const childrenIdent = ident + (isFragment ? '' : tab);
      const doIdent = !!tab;
      let childrenStr = '';
      let textOnlyChildren = true;
      for (let i = 0; i < childrenLength; i++)
        if (children[i].type !== 'text') {
          textOnlyChildren = false;
          break;
        }
      if (textOnlyChildren) for (let i = 0; i < childrenLength; i++) childrenStr += escapeText(children[i].value || '');
      else
        for (let i = 0; i < childrenLength; i++)
          childrenStr += (doIdent ? (!isFragment || i ? '\n' : '') : '') + toText(children[i], tab, childrenIdent);
      if (isFragment) return childrenStr;
      let attrStr = '';
      if (properties) for (const key in properties) attrStr += ' ' + key + '="' + escapeAttr(properties[key] + '') + '"';
      const htmlHead = '<' + tagName + attrStr;
      return (
        ident +
        (childrenStr
          ? htmlHead + '>' + childrenStr + (doIdent && !textOnlyChildren ? '\n' + ident : '') + '</' + tagName + '>'
          : htmlHead + ' />')
      );
    }
  }
  return '';
};
