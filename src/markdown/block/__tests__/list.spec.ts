import {parse} from './setup';

describe('list', () => {
  test('can parse a simple link', () => {
    const ast = parse('- item 1\n- item 2\n- item 3');
    expect(ast[0]).toMatchObject({
      type: 'list',
      children: [
        {type: 'listItem', children: [
          {type: 'paragraph', children: [{type: 'text', value: 'item 1'}]},
        ]},
        {type: 'listItem', children: [
          {type: 'paragraph', children: [{type: 'text', value: 'item 2'}]},
        ]},
        {type: 'listItem', children: [
          {type: 'paragraph', children: [{type: 'text', value: 'item 3'}]},
        ]},
      ],
    });
  });
});
