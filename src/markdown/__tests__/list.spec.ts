import {create} from '../index';
import type {IListItem} from '../types';

const tests = [
  {
    name: 'single item',
    md: `- foo`,
    ast: {
      type: 'root',
      children: [
        {
          type: 'list',
          ordered: false,
          children: [
            {
              type: 'listItem',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'foo',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: 'two items',
    md: `- foo
- bar`,
    ast: {
      type: 'root',
      children: [
        {
          type: 'list',
          children: [
            {
              type: 'listItem',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'foo',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'bar',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: 'three items',
    md: `- foo
- bar
- baz`,
    ast: {
      type: 'root',
      children: [
        {
          type: 'list',
          children: [
            {
              type: 'listItem',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'foo',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'bar',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'baz',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: 'three items - allows two leading spaces',
    md: `  - foo
  - bar
  - baz`,
    ast: {
      type: 'root',
      children: [
        {
          type: 'list',
          children: [
            {
              type: 'listItem',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'foo',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'bar',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'baz',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: 'supports nesting',
    md: `- Item 1
- Item 2
  - Item 2.1
  - Item 2.2
     - Item 2.2.1
- Item 3`,
    ast: {
      type: 'root',
      children: [
        {
          type: 'list',
          children: [
            {
              type: 'listItem',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Item 1',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Item 2',
                    },
                  ],
                },
                {
                  type: 'list',
                  children: [
                    {
                      type: 'listItem',
                      children: [
                        {
                          type: 'paragraph',
                          children: [
                            {
                              type: 'text',
                              value: 'Item 2.1',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: 'listItem',
                      children: [
                        {
                          type: 'paragraph',
                        },
                        {
                          type: 'list',
                          children: [
                            {
                              type: 'listItem',
                              children: [
                                {
                                  type: 'paragraph',
                                  children: [
                                    {
                                      type: 'text',
                                      value: 'Item 2.2.1',
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'Item 3',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: 'single ordered list item',
    md: `1. foo`,
    ast: {
      type: 'root',
      children: [
        {
          type: 'list',
          ordered: true,
          children: [
            {
              type: 'listItem',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'foo',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: 'two ordered list items',
    md: `1. foo
2. bar`,
    ast: {
      type: 'root',
      children: [
        {
          type: 'list',
          ordered: true,
          children: [
            {
              type: 'listItem',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'foo',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'bar',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: 'two ordered list items - 1. as bullet',
    md: `1. foo
1. bar`,
    ast: {
      type: 'root',
      children: [
        {
          type: 'list',
          ordered: true,
          children: [
            {
              type: 'listItem',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'foo',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'bar',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: 'three ordered list items',
    md: `1. foo
2. bar
3. baz`,
    ast: {
      type: 'root',
      children: [
        {
          type: 'list',
          ordered: true,
          children: [
            {
              type: 'listItem',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'foo',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'bar',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'baz',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: 'can have paragraphs in list',
    md: `- paragraph 1

  paragraph 2

  paragraph 3
        `,
    ast: {
      type: 'root',
      children: [
        {
          type: 'list',
          children: [
            {
              type: 'listItem',
              children: [{type: 'paragraph'}, {type: 'paragraph'}, {type: 'paragraph'}],
            },
          ],
        },
      ],
    },
  },
];

describe('list', () => {
  test('works for a single unordered list item', () => {
    const parser = create();
    const ast = parser.tokenizeBlock(`- foo`);

    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'list',
          ordered: false,
          loose: false,
          children: [
            {
              type: 'listItem',
              checked: null,
              loose: false,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'foo',
                    },
                  ],
                },
              ],
            },
          ],
          start: null,
        },
      ],
      len: 5,
    });
  });

  test('supports all bullet markers', () => {
    const result = {
      type: 'root',
      children: [
        {
          type: 'list',
          ordered: false,
          loose: false,
          len: 5,
          children: [
            {
              type: 'listItem',
              checked: null,
              loose: false,
              children: [
                {
                  type: 'paragraph',
                  len: 3,
                  children: [
                    {
                      type: 'text',
                      len: 3,
                      value: 'foo',
                    },
                  ],
                },
              ],
            },
          ],
          start: null,
        },
      ],
      len: 5,
    };

    const parser = create();

    expect(parser.tokenizeBlock(`- foo`)).toMatchObject(result);
    expect(parser.tokenizeBlock(`* foo`)).toMatchObject(result);
    expect(parser.tokenizeBlock(`+ foo`)).toMatchObject(result);
  });

  test('supports ordered lists', () => {
    const parser = create();
    const ast = parser.tokenizeBlock(`1. foo`);

    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'list',
          ordered: true,
          loose: false,
          children: [
            {
              type: 'listItem',
              checked: null,
              loose: false,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'foo',
                    },
                  ],
                },
              ],
            },
          ],
          start: 1,
        },
      ],
      len: 6,
    });
  });

  test('reports loose items', () => {
    const parser = create();
    const ast = parser.tokenizeBlock(`- foo\n\n  bar`);

    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'list',
          children: [
            {
              type: 'listItem',
              // loose: true,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'foo',
                    },
                  ],
                },
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'bar',
                    },
                  ],
                },
              ],
            },
          ],
          ordered: false,
          start: null,
          // loose: true,
        },
      ],
    });
  });

  test('two ordered list items on first level', () => {
    const parser = create();
    const ast = parser.tokenizeBlock('1. foo\n2. bar\n');

    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'list',
          children: [
            {
              type: 'listItem',
            },
            {
              type: 'listItem',
            },
          ],
        },
      ],
    });
    expect(ast!.children![0].children!.length).toBe(2);
  });

  test('supports multiple items', () => {
    const parser = create();
    const ast = parser.tokenizeBlock(`- foo\n- bar\n- baz`);

    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'list',
          children: [
            {
              type: 'listItem',
              loose: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'foo',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              loose: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'bar',
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              loose: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'baz',
                    },
                  ],
                },
              ],
            },
          ],
          ordered: false,
          start: null,
          loose: false,
        },
      ],
    });
  });

  test('supports nested lists', () => {
    const parser = create();
    const ast = parser.tokenizeBlock(`- foo\n   - bar\n      - baz`);

    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'list',
          children: [
            {
              type: 'listItem',
              loose: false,
              checked: null,
              children: [
                {
                  type: 'paragraph',
                  children: [
                    {
                      type: 'text',
                      value: 'foo',
                    },
                  ],
                },
                {
                  type: 'list',
                  children: [
                    {
                      type: 'listItem',
                      loose: false,
                      checked: null,
                      children: [
                        {
                          type: 'paragraph',
                          len: 4,
                          children: [
                            {
                              type: 'text',
                              value: 'bar',
                            },
                          ],
                        },
                        {
                          type: 'list',
                          children: [
                            {
                              type: 'listItem',
                              loose: false,
                              checked: null,
                              children: [
                                {
                                  type: 'paragraph',
                                  children: [
                                    {
                                      type: 'text',
                                      value: 'baz',
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                          ordered: false,
                          start: null,
                          loose: false,
                        },
                      ],
                    },
                  ],
                  ordered: false,
                  start: null,
                  loose: false,
                },
              ],
            },
          ],
          ordered: false,
          start: null,
          loose: false,
        },
      ],
    });
  });

  test('todo list', () => {
    const parser = create();
    const ast = parser.tokenizeBlock(`- [x] Done
- [ ] Todo
- lol
`);

    const item1 = ast!.children[0].children![0];
    const item2 = ast!.children[0].children![1];
    const item3 = ast!.children[0].children![2];

    expect((item1 as IListItem).checked).toBe(true);
    expect((item2 as IListItem).checked).toBe(false);
    expect((item3 as IListItem).checked).toBe(null);
  });

  describe('automated', () => {
    for (const {name, md, ast} of tests) {
      test(name, () => {
        const parser = create();
        const result = parser.tokenizeBlock(md);

        expect(result).toMatchObject(ast);
      });
    }
  });
});
