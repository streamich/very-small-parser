import {create} from '../index';

describe('Block Markdown', () => {
  describe('code', () => {
    it('works', () => {
      const parser = create();
      const ast = parser.tokenizeBlock('    alert(123);');

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
      const parser = create();
      const ast = parser.tokenizeBlock('    alert(123);\n' + '    console.log(123);');

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

  describe('newline', () => {
    it('removes newline tokens', () => {
      const parser = create();
      const ast = parser.tokenizeBlock('\n\n\n    alert(123);\n\n\n\n');

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
  });

  describe('fences', () => {
    it('works', () => {
      const parser = create();
      const ast = parser.tokenizeBlock('```js\nalert(123);\n```');

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
      const parser = create();
      const ast = parser.tokenizeBlock('```js meta\nalert(123);\n```');

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
      const parser = create();
      const ast = parser.tokenizeBlock('~~~js meta\nalert(123);\n~~~');

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
      const parser = create();
      const ast = parser.tokenizeBlock('$$\n1 + 1\n$$');

      expect(ast).toMatchObject({
        type: 'root',
        children: [{type: 'math', len: 11, value: '1 + 1'}],
        len: 11,
      });
    });

    it('multi-line', () => {
      const parser = create();
      const ast = parser.tokenizeBlock('$$\n1 + 1\nf(n) = 123\n$$');

      expect(ast).toMatchObject({
        type: 'root',
        children: [{type: 'math', len: 22, value: '1 + 1\nf(n) = 123'}],
        len: 22,
      });
    });
  });

  describe('thematicBreak', () => {
    it('works', () => {
      const parser = create();
      const ast = parser.tokenizeBlock('---\n');

      expect(ast).toMatchObject({
        type: 'root',
        children: [{type: 'thematicBreak', value: '---'}],
      });
    });

    it('supports asterisks', () => {
      const parser = create();
      const ast = parser.tokenizeBlock('*****\n');

      expect(ast).toMatchObject({
        type: 'root',
        children: [{type: 'thematicBreak', value: '*****'}],
      });
    });

    it('supports underscores', () => {
      const parser = create();
      const ast = parser.tokenizeBlock('_______\n');

      expect(ast).toMatchObject({
        type: 'root',
        children: [{type: 'thematicBreak', value: '_______'}],
      });
    });
  });

  describe('heading', () => {
    it('works', () => {
      const parser = create();
      const ast = parser.tokenizeBlock('# Title');

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
      const parser = create();
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
        const ast = parser.tokenizeBlock(src);

        expect(ast).toMatchObject(result(i));
      }
    });

    it('supports only up to h6 depth', () => {
      const parser = create();
      const ast = parser.tokenizeBlock('####### Title');

      expect(ast).toMatchObject({
        type: 'root',
        children: [
          {
            type: 'heading',
            depth: 6,
            children: [
              {
                type: 'text',
                value: '# Title',
              },
            ],
          },
        ],
      });
    });

    it('supports orthodox heading h1', () => {
      const parser = create();
      const ast = parser.tokenizeBlock('Title\n' + '-----');

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
      const parser = create();
      const ast = parser.tokenizeBlock('Title\n' + '=====');

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
      const parser = create();
      const ast = parser.tokenizeBlock('> foobar');

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
      const parser = create();
      const ast = parser.tokenizeBlock('> foo\n>\n> bar');

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
      const parser = create();
      const ast = parser.tokenizeBlock('>     git-cz\n>\n> ```js\n> console.log(123)\n> ```\n');

      expect(ast).toMatchObject({
        type: 'root',
        children: [
          {
            type: 'blockquote',
            children: [
              {
                type: 'code',
                value: 'git-cz',
              },
              {
                type: 'code',
                value: 'console.log(123)',
              },
            ],
          },
        ],
      });
    });
  });

  describe('paragraph', () => {
    it('works', () => {
      const parser = create();
      const ast = parser.tokenizeBlock('hello world');

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
      const parser = create();
      const ast = parser.tokenizeBlock('hello world\n');

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
      const parser = create();
      const ast = parser.tokenizeBlock(`hello

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
      const parser = create();
      const ast = parser.tokenizeBlock('[alpha]: http://example.com');

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
      const parser = create();
      const ast = parser.tokenizeBlock('[^alpha]: foobar');

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
      const parser = create();
      const ast = parser.tokenizeBlock('[^alpha]: foo\n\n  bar');

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

      const parser = create();
      const ast = parser.tokenizeBlock(table);

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

      const parser = create();
      const ast = parser.tokenizeBlock(table);

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
      const parser = create();
      const ast = parser.tokenizeBlock('<div>foobar</div>');

      expect(ast).toMatchObject({
        type: 'root',
        children: [{type: 'html', len: 17, value: '<div>foobar</div>'}],
        len: 17,
      });
    });
  });

  /*
    test('returns raw text', () => {
        const parser = create();
        const ast = parser.tokenizeBlock('*asdf*');

        expect(ast).toMatchObject({
            type: 'root',
            children: [
                {
                    type: 'paragraph',
                    raw: '*asdf*',
                    len: 6,
                    children: [
                        {
                            type: 'emphasis',
                            raw: '*asdf*',
                            len: 6,
                            children: [
                                {
                                    type: 'text',
                                    raw: 'asdf',
                                    len: 4,
                                    value: 'asdf',
                                },
                            ],
                        },
                    ],
                },
            ],
            len: 6,
        });
    });
    */
});
