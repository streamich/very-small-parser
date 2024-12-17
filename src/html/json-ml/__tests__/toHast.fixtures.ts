import type {THtmlToken} from '../../types';
import type {JsonMlNode} from '../types';

export const testCases: [jsonml: JsonMlNode, hast: THtmlToken, name: string][] = [
  ['foo', {type: 'text', value: 'foo'}, 'text'],
  [['div', null, 'foo'], {type: 'element', tagName: 'div', children: [{type: 'text', value: 'foo'}]}, 'element'],
  [
    ['div', {class: 'bar'}, 'foo'],
    {type: 'element', tagName: 'div', properties: {class: 'bar'}, children: [{type: 'text', value: 'foo'}]},
    'element with properties',
  ],
  [
    ['', null, 'foo', ['div', null, 'bar']],
    {
      type: 'element',
      tagName: '',
      children: [
        {type: 'text', value: 'foo'},
        {type: 'element', tagName: 'div', children: [{type: 'text', value: 'bar'}]},
      ],
    },
    'fragment',
  ],
  [
    ['', null, 'foo', ['div', null, 'bar', ['span', null, 'baz']]],
    {
      type: 'element',
      tagName: '',
      children: [
        {type: 'text', value: 'foo'},
        {
          type: 'element',
          tagName: 'div',
          children: [
            {type: 'text', value: 'bar'},
            {type: 'element', tagName: 'span', children: [{type: 'text', value: 'baz'}]},
          ],
        },
      ],
    },
    'nested fragment',
  ],
  [
    ['', null, 'foo', ['div', null, 'bar'], 'baz'],
    {
      type: 'element',
      tagName: '',
      children: [
        {type: 'text', value: 'foo'},
        {type: 'element', tagName: 'div', children: [{type: 'text', value: 'bar'}]},
        {type: 'text', value: 'baz'},
      ],
    },
    'fragment with text',
  ],
  [
    ['', null, ['div', null, 'foo'], ['div', null, 'bar']],
    {
      type: 'element',
      tagName: '',
      children: [
        {type: 'element', tagName: 'div', children: [{type: 'text', value: 'foo'}]},
        {type: 'element', tagName: 'div', children: [{type: 'text', value: 'bar'}]},
      ],
    },
    'fragment with elements',
  ],
  [
    ['', null, 'foo', ['div', null, 'bar'], 'baz', ['div', null, 'qux']],
    {
      type: 'element',
      tagName: '',
      children: [
        {type: 'text', value: 'foo'},
        {type: 'element', tagName: 'div', children: [{type: 'text', value: 'bar'}]},
        {type: 'text', value: 'baz'},
        {type: 'element', tagName: 'div', children: [{type: 'text', value: 'qux'}]},
      ],
    },
    'fragment with text and elements',
  ],
  [
    ['', null, 'foo', 'bar'],
    {
      type: 'element',
      tagName: '',
      children: [
        {type: 'text', value: 'foo'},
        {type: 'text', value: 'bar'},
      ],
    },
    'fragment with text nodes',
  ],
];
