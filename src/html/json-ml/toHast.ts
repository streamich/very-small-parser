import type {IText, IElement} from '../types';
import type {JsonMlNode} from './types';

export const toHast = (node: JsonMlNode): IText | IElement => {
  if (typeof node === 'string') return {type: 'text', value: node} as IText;
  const [tag, properties, ...children] = node;
  const element: IElement = {
    type: 'element',
    tagName: tag + '',
    children: children.map(toHast),
  };
  if (properties) element.properties = properties;
  return element;
};
