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

const text = (value: string): hast.IText => ({type: 'text', value});

const element = (tagName: string, inline: TInlineToken, properties?: hast.IElement['properties'], children: hast.IElement['children'] = toHastChildren(inline) as hast.IElement['children']): hast.IElement => {
  const node = {
    type: 'element',
    tagName,
    children,
  } as hast.IElement;
  if (properties) node.properties = properties;
  return node;
};

const elementWithText = (tagName: string, inline: TInlineToken, text: string, properties?: hast.IElement['properties']): hast.IElement =>
  element(tagName, inline, properties, [{type: 'text', value: text}]);

const anchor = (identifier: string, children: (hast.IElement | hast.IText)[]): hast.IElement => {
  const node = {
    type: 'element',
    tagName: 'a',
    properties: {
      href: '#' + identifier,
    },
    children,
  } as hast.IElement;
  return node;
};

export const toHast = (node: IToken): (hast.IElement | hast.IText | hast.IRoot) => {
  const inline = node as TInlineToken;
  switch (inline.type) {
    case 'text': return inline;
    case 'inlineCode': return elementWithText('code', inline, inline.value);
    case 'strong': return element('strong', inline);
    case 'emphasis': return element('em', inline);
    case 'delete': return element('del', inline);
    case 'spoiler': return element('spoiler', inline, {style: 'background:black;color:black'});
    case 'inlineMath': return elementWithText('code', inline, inline.value || '', {class: 'language-math', 'data-lang': 'math'});
    case 'footnoteReference': return {type: 'element', tagName: 'sup', children: [anchor(inline.value, [text(inline.value)])]};
    case 'linkReference':
      return anchor(inline.identifier, toHastChildren(inline) as (hast.IElement | hast.IText)[]);
    case 'imageReference': {
      const {identifier, alt} = inline;
      return anchor(identifier, [text(alt || identifier)]);
    }
    case 'link': {
      const {title, url} = inline;
      const attr: hast.IElement['properties'] = {href: url};
      if (title) attr.title = title;
      return element('a', inline, attr);
    }
    case 'image': {
      const {title, url, alt} = inline;
      const attr: hast.IElement['properties'] = {src: url};
      if (title) attr.title = title;
      if (alt) attr.alt = alt;
      return element('img', inline, attr);
    }
    case 'inlineLink': return elementWithText('a', inline, inline.value, {href: inline.value});
    case 'sup': return element('sup', inline);
    case 'sub': return element('sub', inline);
    case 'mark': return element('mark', inline);
    case 'handle': return elementWithText('cite', inline, inline.prefix + inline.value);
    case 'underline': return element('u', inline);
    case 'break': return element('br', inline);
    case 'icon': return elementWithText('acronym', inline, ':' + inline.emoji + ':', {title: inline.emoji + ' emoji icon', 'data-emoji': inline.emoji});
    case 'element': return inline;
    case 'whitespace': return {type: 'text', value: ' '.repeat(inline.length)};
  }
  // biome-ignore lint: extra catch-all case
  return {...node, type: 'root', children: toHastChildren(inline)} as (hast.IElement | hast.IText | hast.IRoot);
};
