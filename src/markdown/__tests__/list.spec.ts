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
          spread: false,
          children: [
            {
              type: 'listItem',
              checked: null,
              spread: false,
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
          spread: false,
          len: 5,
          children: [
            {
              type: 'listItem',
              checked: null,
              spread: false,
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
          spread: false,
          children: [
            {
              type: 'listItem',
              checked: null,
              spread: false,
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
    // const ast2 = parse(`- foo\n- bar\n\n- baz\n\n`);
    // expect(ast2).toMatchObject({
    //   type: 'root',
    //   children: [
    //     {
    //       type: 'list',
    //       spread: true,
    //     },
    //   ],
    // });
    // const ast3 = parse(`- foo\n\n\n- bar\n\n\n\n- baz\n\n`);
    // expect(ast3).toMatchObject({
    //   type: 'root',
    //   children: [
    //     {
    //       type: 'list',
    //       spread: true,
    //     },
    //   ],
    // });
    // const ast4 = parse(`- foo\n- bar\n-baz\n\n`);
    // expect(ast4).toMatchObject({
    //   type: 'root',
    //   children: [
    //     {
    //       type: 'list',
    //       spread: false,
    //     },
    //   ],
    // });
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
              spread: false,
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
              spread: false,
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
              spread: false,
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
          spread: false,
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
              spread: false,
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
                      spread: false,
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
                              spread: false,
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
                          spread: false,
                        },
                      ],
                    },
                  ],
                  ordered: false,
                  start: null,
                  spread: false,
                },
              ],
            },
          ],
          ordered: false,
          start: null,
          spread: false,
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
            }
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

  describe('automated', () => {
    for (const {name, md, ast} of tests) {
      test(name, () => {
        const result = parse(md);
        expect(result).toMatchObject(ast);
      });
    }
  });
});
