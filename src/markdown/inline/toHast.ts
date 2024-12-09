import type {IToken} from '../../types';
import type {TInlineToken} from './types';
import type * as hast from '../../html/types';

const toHastChildren = ({children}: {children?: IToken[]}): hast.THtmlToken[] => {
  let arr: hast.THtmlToken[] = [];
  if (!children) return arr;
  const length = children.length;
  for (let i = 0; i < length; i++) arr.push(toHast(children[i]));
  return arr;
};

const element = (tagName: string, inline: TInlineToken, properties?: hast.IElement['properties'], children: hast.IElement['children'] = toHastChildren(inline) as hast.IElement['children']): hast.IElement => {
  const node = {
    type: 'element',
    tagName,
    children,
  } as hast.IElement;
  if (properties) node.properties = properties;
  return node;
};

export const toHast = (node: IToken): hast.THtmlToken => {
  const inline = node as TInlineToken;
  switch (inline.type) {
    case 'text': return inline;
    case 'inlineCode': return element('code', inline, void 0, [{type: 'text', value: inline.value}]);
    case 'strong': return element('strong', inline);
    case 'emphasis': return element('em', inline);
    case 'delete': return element('del', inline);
    case 'spoiler': return element('spoiler', inline, {style: 'background:black;color:black'});
    case 'inlineMath': return element('code', inline, {class: 'language-math', 'data-lang': 'math'}, [{type: 'text', value: inline.value}]);
    // case 'footnoteReference':
    //   return '[^' + inline.value + ']';
    // case 'linkReference':
    // case 'imageReference': {
    //   const {identifier, referenceType} = inline;
    //   const start = type === 'imageReference' ? '![' : '[';
    //   switch (referenceType) {
    //     case 'full':
    //       return (
    //         start + (type === 'imageReference' ? inline.alt : toHastChildren(inline.children)) + '][' + identifier + ']'
    //       );
    //     case 'collapsed':
    //       return start + identifier + '][]';
    //     // case 'shortcut':
    //     default:
    //       return start + identifier + ']';
    //   }
    // }
    // case 'link':
    // case 'image': {
    //   const {title, url} = inline;
    //   const start = type === 'image' ? '![' + inline.alt : '[' + toHastChildren(inline.children);
    //   return start + '](' + url + (title ? ' "' + title + '"' : '') + ')';
    // }
    case 'inlineLink': return {type: 'text', value: inline.value};
    case 'sup': return element('sup', inline);
    case 'sub': return element('sub', inline);
    case 'mark': return element('mark', inline);
    // case 'handle':
    //   return inline.prefix + inline.value;
    case 'underline': return element('u', inline);
    case 'break': return element('br', inline);
    // case 'icon':
    //   return ':' + inline.emoji + ':';
    case 'element': return inline;
    case 'whitespace': return {type: 'text', value: ' '.repeat(inline.length)};
  }
  return {...node, children: toHastChildren(inline)} as hast.THtmlToken;
};
