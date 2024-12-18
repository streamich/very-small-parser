import type {THtmlToken} from '../types';
import type {JsonMlNode} from './types';

export const fromHast = (node: THtmlToken): JsonMlNode => {
  switch (node.type) {
    case 'text': {
      return node.value || '';
    }
    case 'element': {
      const children = node.children.map(fromHast);
      return [node.tagName, node.properties || null, ...children];
    }
    case 'root': {
      const children = node.children.map(fromHast) as JsonMlNode[];
      return ['', null].concat(children as any) as JsonMlNode;
    }
    case 'comment': {
      return ['!--', null, node.value || ''];
    }
    case 'doctype': {
      return ['!DOCTYPE', null, node.value || ''];
    }
  }
};
