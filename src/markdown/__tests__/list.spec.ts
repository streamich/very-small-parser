import {parse} from './setup';
import type {IListItem} from '../block/types';

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
    const ast = parse(`- foo`);
    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'list',
          ordered: false,
          children: [
            {
              type: 'listItem',
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
          len: 5,
          children: [
            {
              type: 'listItem',
              checked: null,
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
    expect(parse(`- foo`)).toMatchObject(result);
    expect(parse(`* foo`)).toMatchObject(result);
    expect(parse(`+ foo`)).toMatchObject(result);
  });

  test('supports ordered lists', () => {
    const ast = parse(`1. foo`);
    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'list',
          ordered: true,
          children: [
            {
              type: 'listItem',
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
          ],
          start: 1,
        },
      ],
      len: 6,
    });
  });

  test('reports loose (spread) items', () => {
    const ast1 = parse(`- foo\n\n- bar\n- baz\n\n`);
    expect(ast1).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'list',
          spread: true,
        },
      ],
    });
    const ast2 = parse(`- foo\n- bar\n\n- baz\n\n`);
    expect(ast2).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'list',
          spread: true,
        },
      ],
    });
    const ast3 = parse(`- foo\n\n\n- bar\n\n\n\n- baz\n\n`);
    expect(ast3).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'list',
          spread: true,
        },
      ],
    });
    const ast4 = parse(`- foo\n- bar\n-baz\n\n`);
    expect(ast4).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'list',
        },
      ],
    });
  });

  test('two ordered list items on first level', () => {
    const ast = parse('1. foo\n2. bar\n');
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
    const ast = parse(`- foo\n- bar\n- baz`);
    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'list',
          children: [
            {
              type: 'listItem',
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
        },
      ],
    });
  });

  test('supports nested lists', () => {
    const ast = parse(`- foo\n   - bar\n      - baz`);
    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'list',
          children: [
            {
              type: 'listItem',
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
                        },
                      ],
                    },
                  ],
                  ordered: false,
                  start: null,
                },
              ],
            },
          ],
          ordered: false,
          start: null,
        },
      ],
    });
  });

  test('todo list', () => {
    const ast = parse(`- [x] Done
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

  test('todo list', () => {
    const ast = parse(`
Lists are complicated. The simplest list is a single unordered list item:

- Item 1

Lists can have multiple items:

- Item 1
- Item 2

Lists can have nested items:

- Item 1
  - Item 1.1
  - Item 1.2
- Item 2
- Item 3
  - Item 3.1
    - Item 3.1.1
`);
    //  console.log(JSON.stringify(ast, null, 2));

    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Lists are complicated. The simplest list is a single unordered list item:',
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
                      value: 'Item 1',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Lists can have multiple items:',
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
              ],
            },
          ],
        },
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Lists can have nested items:',
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
                      value: 'Item 1',
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
                              value: 'Item 1.1',
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
                              value: 'Item 1.2',
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
                      value: 'Item 2',
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
                              value: 'Item 3.1',
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
                                      value: 'Item 3.1.1',
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
          ],
        },
      ],
    });
  });

  test('keeps mdash continuation text in the same list item paragraph', () => {
    const ast = parse(`- The browser File System Access (FSA) API
  --- the same \`FileSystemDirectoryHandle\`
  interface a browser exposes, backed by memory.`);

    expect(ast).toMatchObject({
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
                      value: 'The browser File System Access (FSA) API — the same ',
                    },
                    {
                      type: 'inlineCode',
                      value: 'FileSystemDirectoryHandle',
                    },
                    {
                      type: 'text',
                      value: ' interface a browser exposes, backed by memory.',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  test('keeps mdash continuation text with strong content on first line', () => {
    const withStrongOnly = parse(`- **The browser File System Access (FSA) API**
  --- the same \`FileSystemDirectoryHandle\`
  interface a browser exposes, backed by memory.`);
    expect(withStrongOnly).toMatchObject({
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
                    {type: 'strong'},
                    {type: 'text', value: ' — the same '},
                    {type: 'inlineCode', value: 'FileSystemDirectoryHandle'},
                    {type: 'text', value: ' interface a browser exposes, backed by memory.'},
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    const withStrongAndText = parse(`- **The browser File System Access (FSA) API** more workds
  --- the same \`FileSystemDirectoryHandle\`
  interface a browser exposes, backed by memory.`);
    expect(withStrongAndText).toMatchObject({
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
                    {type: 'strong'},
                    {type: 'text', value: ' more workds — the same '},
                    {type: 'inlineCode', value: 'FileSystemDirectoryHandle'},
                    {type: 'text', value: ' interface a browser exposes, backed by memory.'},
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    const withStrongAndLink = parse(`- **The browser [File System Access (FSA) API](link)**
  --- the same \`FileSystemDirectoryHandle\`
  interface a browser exposes, backed by memory.`);
    expect(withStrongAndLink).toMatchObject({
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
                      type: 'strong',
                      children: [{type: 'text'}, {type: 'link', url: 'link'}],
                    },
                    {type: 'text', value: ' — the same '},
                    {type: 'inlineCode', value: 'FileSystemDirectoryHandle'},
                    {type: 'text', value: ' interface a browser exposes, backed by memory.'},
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });

  describe('automated', () => {
    for (const {name, md, ast} of tests) {
      test(name, () => {
        const result = parse(md);
        expect(result).toMatchObject(ast);
      });
    }
  });
});
