import {parse} from './setup';

describe('table', () => {
  it('can parse a basic table', () => {
    const ast = parse(`Table:

| Header 1 | Header 2 |
| -------- | -------- |
| Cell 1   | Cell 2   |`);
    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Table:',
            },
          ],
        },
        {
          type: 'table',
          children: [
            {
              type: 'tableRow',
              children: [
                {
                  type: 'tableCell',
                  children: [
                    {
                      type: 'text',
                      value: 'Header 1',
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  children: [
                    {
                      type: 'text',
                      value: 'Header 2',
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableRow',
              children: [
                {
                  type: 'tableCell',
                  children: [
                    {
                      type: 'text',
                      value: 'Cell 1',
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  children: [
                    {
                      type: 'text',
                      value: 'Cell 2',
                    },
                  ],
                },
              ],
            },
          ],
          align: [null, null],
        },
      ],
    });
  });

  it('can the most minimal table', () => {
    const ast = parse(`Table:

foo
|---|
bar`);
    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Table:',
            },
          ],
        },
        {
          type: 'table',
          children: [
            {
              type: 'tableRow',
              children: [
                {
                  type: 'tableCell',
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
              type: 'tableRow',
              children: [
                {
                  type: 'tableCell',
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
          align: [null],
        },
      ],
    });
  });

  it('parses out table column alignment', () => {
    const ast = parse(
`| Left | Center | Right | None |
|:---- |:------:| -----:|------|
| foo  | bar    | baz   | qux  |`);
    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'table',
          align: ['left', 'center', 'right', null],
        },
      ],
    });
  });
});
