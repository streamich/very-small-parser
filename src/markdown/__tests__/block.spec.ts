import {parse} from './setup';

describe('Block Markdown', () => {
  describe('code', () => {
    it('works', () => {
      const ast = parse('    alert(123);');
      expect(ast).toMatchObject({
        type: 'root',
        children: [
          {
            type: 'code',
            value: 'alert(123);',
            lang: null,
          },
        ],
      });
    });

    it('multiple lines', () => {
      const ast = parse('    alert(123);\n' + '    console.log(123);');
      expect(ast).toMatchObject({
        type: 'root',
        children: [
          {
            type: 'code',
            value: 'alert(123);\nconsole.log(123);',
            lang: null,
          },
        ],
      });
    });
  });

  describe('fences', () => {
    it('works', () => {
      const ast = parse('```js\nalert(123);\n```');
      expect(ast).toMatchObject({
        type: 'root',
        children: [
          {
            type: 'code',
            value: 'alert(123);',
            lang: 'js',
          },
        ],
      });
    });

    it('matches meta information', () => {
      const ast = parse('```js meta\nalert(123);\n```');
      expect(ast).toMatchObject({
        type: 'root',
        children: [
          {
            type: 'code',
            value: 'alert(123);',
            lang: 'js',
            meta: 'meta',
          },
        ],
      });
    });

    it('supports tilde separators', () => {
      const ast = parse('~~~js meta\nalert(123);\n~~~');
      expect(ast).toMatchObject({
        type: 'root',
        children: [
          {
            type: 'code',
            value: 'alert(123);',
            lang: 'js',
            meta: 'meta',
          },
        ],
      });
    });
  });

  describe('math', () => {
    it('works', () => {
      const ast = parse('$$\n1 + 1\n$$');
      expect(ast).toMatchObject({
        type: 'root',
        children: [{type: 'math', len: 11, value: '1 + 1'}],
        len: 11,
      });
    });

    it('multi-line', () => {
      const ast = parse('$$\n1 + 1\nf(n) = 123\n$$');
      expect(ast).toMatchObject({
        type: 'root',
        children: [{type: 'math', len: 22, value: '1 + 1\nf(n) = 123'}],
        len: 22,
      });
    });
  });

  describe('thematicBreak', () => {
    it('works', () => {
      const ast = parse('---\n');
      expect(ast).toMatchObject({
        type: 'root',
        children: [{type: 'thematicBreak', value: '---'}],
      });
    });

    it('supports asterisks', () => {
      const ast = parse('*****\n');
      expect(ast).toMatchObject({
        type: 'root',
        children: [{type: 'thematicBreak', value: '*****'}],
      });
    });

    it('supports underscores', () => {
      const ast = parse('_______\n');
      expect(ast).toMatchObject({
        type: 'root',
        children: [{type: 'thematicBreak', value: '_______'}],
      });
    });
  });

  describe('heading', () => {
    it('works', () => {
      const ast = parse('# Title');
      expect(ast).toMatchObject({
        type: 'root',
        children: [
          {
            type: 'heading',
            depth: 1,
            children: [
              {
                type: 'text',
                value: 'Title',
              },
            ],
          },
        ],
      });
    });

    it('supports all h1-h6 heading levels', () => {
      const result = (depth: any) => ({
        type: 'root',
        children: [
          {
            type: 'heading',
            depth,
            children: [
              {
                type: 'text',
                value: 'Title',
              },
            ],
          },
        ],
      });

      for (let i = 1; i < 7; i++) {
        const src = new Array(i + 1).join('#') + ' Title';
        const ast = parse(src);
        expect(ast).toMatchObject(result(i));
      }
    });

    it('supports only up to h6 depth', () => {
      const ast = parse('####### Title');
      expect(ast).toMatchObject({
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                value: '####### Title',
              },
            ],
          },
        ],
      });
    });

    it('supports orthodox heading h1', () => {
      const ast = parse('Title\n' + '-----');
      expect(ast).toMatchObject({
        type: 'root',
        children: [
          {
            type: 'heading',
            depth: 1,
            children: [
              {
                type: 'text',
                value: 'Title',
              },
            ],
          },
        ],
      });
    });

    it('supports orthodox heading h2', () => {
      const ast = parse('Title\n' + '=====');
      expect(ast).toMatchObject({
        type: 'root',
        children: [
          {
            type: 'heading',
            depth: 2,
            children: [
              {
                type: 'text',
                value: 'Title',
              },
            ],
          },
        ],
      });
    });
  });

  describe('blockquote', () => {
    it('works', () => {
      const ast = parse('> foobar');
      expect(ast).toMatchObject({
        type: 'root',
        children: [
          {
            type: 'blockquote',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    value: 'foobar',
                  },
                ],
              },
            ],
          },
        ],
      });
    });

    it('multiple paragraphs', () => {
      const ast = parse('> foo\n>\n> bar');
      expect(ast).toMatchObject({
        type: 'root',
        children: [
          {
            type: 'blockquote',
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
      });
    });

    it('code blocks', () => {
      const ast = parse('>     git-cz\n>\n> ```js\n> console.log(123)\n> ```\n');
      expect(ast).toMatchObject({
        type: 'root',
        children: [
          {
            type: 'blockquote',
            children: [
              {
                type: 'code',
                value: 'git-cz',
                lang: null,
              },
              {
                type: 'code',
                value: 'console.log(123)',
                lang: 'js',
              },
            ],
          },
        ],
      });
    });
  });

  describe('paragraph', () => {
    it('works', () => {
      const ast = parse('hello world');
      expect(ast).toMatchObject({
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                value: 'hello world',
              },
            ],
          },
        ],
      });
    });

    it('trims spacing', () => {
      const ast = parse('hello world\n');
      expect(ast).toMatchObject({
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                value: 'hello world',
              },
            ],
          },
        ],
      });
    });

    it('Multiple paragraphs', () => {
      const ast = parse(`hello

world

trololo`);
      expect(ast).toMatchObject({
        type: 'root',
        children: [
          {
            type: 'paragraph',
            len: 7,
            children: [
              {
                type: 'text',
                len: 5,
                value: 'hello',
              },
            ],
          },
          {
            type: 'paragraph',
            len: 7,
            children: [
              {
                type: 'text',
                len: 5,
                value: 'world',
              },
            ],
          },
          {
            type: 'paragraph',
            len: 7,
            children: [
              {
                type: 'text',
                len: 7,
                value: 'trololo',
              },
            ],
          },
        ],
        len: 21,
      });
    });
  });

  describe('definition', () => {
    it('works', () => {
      const ast = parse('[alpha]: http://example.com');
      expect(ast).toMatchObject({
        type: 'root',
        children: [
          {
            type: 'definition',
            identifier: 'alpha',
            title: null,
            url: 'http://example.com',
          },
        ],
      });
    });
  });

  describe('footnoteDefinition', () => {
    it('works', () => {
      const ast = parse('[^alpha]: foobar');
      expect(ast).toMatchObject({
        type: 'root',
        children: [
          {
            type: 'footnoteDefinition',
            identifier: 'alpha',
            children: [
              {
                type: 'paragraph',
                children: [
                  {
                    type: 'text',
                    value: 'foobar',
                  },
                ],
              },
            ],
          },
        ],
      });
    });

    it('supports multiple paragraphs', () => {
      const ast = parse('[^alpha]: foo\n\n  bar');
      expect(ast).toMatchObject({
        type: 'root',
        children: [
          {
            type: 'footnoteDefinition',
            identifier: 'alpha',
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
      });
    });
  });

  describe('table', () => {
    it('works', () => {
      const table = `| Table |
            | ----- |
            | *hello* |`;
      const ast = parse(table);
      expect(ast).toMatchObject({
        type: 'root',
        children: [
          {
            type: 'table',
            len: 55,
            children: [
              {
                type: 'tableRow',
                children: [
                  {
                    type: 'tableCell',
                    children: [
                      {
                        type: 'text',
                        len: 5,
                        value: 'Table',
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
                        type: 'emphasis',
                        len: 7,
                        children: [
                          {
                            type: 'text',
                            len: 5,
                            value: 'hello',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
            align: [null],
          },
        ],
        len: 55,
      });
    });

    it('twor row table with alignment', () => {
      const table = `| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| zebra stripes | are neat      |    $1 |
| zebra stripes | are neat 2    |    $2 |`;
      const ast = parse(table);
      expect(ast).toMatchObject({
        type: 'root',
        children: [
          {
            type: 'table',
            len: 167,
            children: [
              {
                type: 'tableRow',
                children: [
                  {
                    type: 'tableCell',
                    children: [
                      {
                        type: 'text',
                        len: 6,
                        value: 'Tables',
                      },
                    ],
                  },
                  {
                    type: 'tableCell',
                    children: [
                      {
                        type: 'text',
                        len: 3,
                        value: 'Are',
                      },
                    ],
                  },
                  {
                    type: 'tableCell',
                    children: [
                      {
                        type: 'text',
                        len: 4,
                        value: 'Cool',
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
                        len: 13,
                        value: 'zebra stripes',
                      },
                    ],
                  },
                  {
                    type: 'tableCell',
                    children: [
                      {
                        type: 'text',
                        len: 8,
                        value: 'are neat',
                      },
                    ],
                  },
                  {
                    type: 'tableCell',
                    children: [
                      {
                        type: 'text',
                        len: 2,
                        value: '$1',
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
                        len: 13,
                        value: 'zebra stripes',
                      },
                    ],
                  },
                  {
                    type: 'tableCell',
                    children: [
                      {
                        type: 'text',
                        len: 10,
                        value: 'are neat 2',
                      },
                    ],
                  },
                  {
                    type: 'tableCell',
                    children: [
                      {
                        type: 'text',
                        len: 2,
                        value: '$2',
                      },
                    ],
                  },
                ],
              },
            ],
            align: [null, 'center', 'right'],
          },
        ],
        len: 167,
      });
    });
  });

  describe('html', () => {
    it('works', () => {
      const ast = parse('<div>foobar</div>');
      expect(ast).toMatchObject({
        type: 'root',
        children: [
          {
            type: 'element',
            len: 17,
            children: [
              {
                type: 'text',
                len: 6,
                value: 'foobar',
              },
            ],
          },
        ],
        len: 17,
      });
    });
  });
});
