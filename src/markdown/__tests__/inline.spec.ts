import {parseInline} from './setup';

describe('Inline Markdown', () => {
  test('icons in text', () => {
    const ast = parseInline('Hello :world:!');
    expect(ast).toMatchObject([
      {type: 'text', len: 6, value: 'Hello '},
      {type: 'icon', len: 7, emoji: 'world'},
      {type: 'text', len: 1, value: '!'},
    ]);
  });

  test('multiple icons', () => {
    const ast = parseInline(':smile: foo ::+1:: bar ::tada::');
    expect(ast).toMatchObject([
      {type: 'icon', len: 7, emoji: 'smile'},
      {type: 'text', len: 5, value: ' foo '},
      {type: 'icon', len: 6, emoji: '+1'},
      {type: 'text', len: 5, value: ' bar '},
      {type: 'icon', len: 8, emoji: 'tada'},
    ]);
  });

  test('marked text', () => {
    const ast = parseInline('I ==really== want this!');
    expect(ast).toMatchObject([
      {type: 'text', len: 2, value: 'I '},
      {
        type: 'mark',
        len: 10,
        children: [{type: 'text', len: 6, value: 'really'}],
      },
      {type: 'text', len: 11, value: ' want this!'},
    ]);
  });

  describe('link', () => {
    test('basic case', () => {
      const ast = parseInline('[me](http://example.com)');
      expect(ast).toMatchObject([
        {
          type: 'link',
          len: 24,
          children: [{type: 'text', len: 2, value: 'me'}],
          url: 'http://example.com',
        },
      ]);
    });

    test('with title', () => {
      const result = [
        {
          type: 'link',
          len: 34,
          children: [{type: 'text', len: 2, value: 'me'}],
          url: 'http://example.com',
          title: 'foo bar',
        },
      ];
      expect(parseInline("[me](http://example.com 'foo bar')")).toMatchObject(result);
      expect(parseInline('[me](http://example.com "foo bar")')).toMatchObject(result);
    });

    test('tokenizes a link', () => {
      const ast = parseInline('Click [me](http://example.com)!');
      expect(ast).toMatchObject([
        {type: 'text', len: 6, value: 'Click '},
        {type: 'link', len: 24, children: [{type: 'text', len: 2, value: 'me'}], url: 'http://example.com'},
        {type: 'text', len: 1, value: '!'},
      ]);
    });

    test('tokenizes link text', () => {
      const ast = parseInline('Click [this ==higlighted== text :smile:](http://example.com)!');
      expect(ast).toMatchObject([
        {type: 'text', len: 6, value: 'Click '},
        {
          type: 'link',
          len: 54,
          children: [
            {
              type: 'text',
              len: 5,
              value: 'this ',
            },
            {
              type: 'mark',
              len: 14,
              children: [
                {
                  type: 'text',
                  len: 10,
                  value: 'higlighted',
                },
              ],
            },
            {
              type: 'text',
              len: 6,
              value: ' text ',
            },
            {
              type: 'icon',
              len: 7,
              emoji: 'smile',
            },
          ],
          url: 'http://example.com',
        },
        {
          type: 'text',
          len: 1,
          value: '!',
        },
      ]);
    });
  });

  describe('image', () => {
    test('basic case', () => {
      const ast = parseInline('![me](http://example.com)');
      expect(ast).toMatchObject([
        {
          type: 'image',
          len: 25,
          url: 'http://example.com',
          alt: 'me',
        },
      ]);
    });

    test('with title', () => {
      const ast = parseInline('![me](http://example.com "title goes here")');
      expect(ast).toMatchObject([
        {
          type: 'image',
          len: 43,
          url: 'http://example.com',
          alt: 'me',
          title: 'title goes here',
        },
      ]);
    });
  });

  describe('inline code', () => {
    test('works', () => {
      const ast = parseInline('See this: `console.log(123)`');
      expect(ast).toMatchObject([
        {type: 'text', len: 10, value: 'See this: '},
        {type: 'inlineCode', len: 18, value: 'console.log(123)', wrap: '`'},
      ]);
    });

    test('supports double back-ticks', () => {
      const ast = parseInline('See this: ``console.log(123)``');
      expect(ast).toMatchObject([
        {type: 'text', len: 10, value: 'See this: '},
        {type: 'inlineCode', len: 20, value: 'console.log(123)', wrap: '``'},
      ]);
    });
  });

  describe('emphasis', () => {
    const result = [
      {type: 'text', len: 6, value: 'Hello '},
      {
        type: 'emphasis',
        len: 7,
        children: [{type: 'text', len: 5, value: 'world'}],
      },
      {type: 'text', len: 2, value: '! '},
      {
        type: 'emphasis',
        len: 4,
        children: [{type: 'text', len: 2, value: 'OK'}],
      },
    ];

    test('asterisk', () => {
      const ast = parseInline('Hello *world*! *OK*');
      expect(ast).toMatchObject(result);
    });

    test('underscore', () => {
      const ast = parseInline('Hello _world_! _OK_');
      expect(ast).toMatchObject(result);
    });
  });

  describe('strong', () => {
    const result = [
      {type: 'text', len: 6, value: 'Hello '},
      {
        type: 'strong',
        len: 9,
        children: [{type: 'text', len: 5, value: 'world'}],
      },
      {type: 'text', len: 2, value: '! '},
      {
        type: 'strong',
        len: 6,
        children: [{type: 'text', len: 2, value: 'OK'}],
      },
    ];

    test('asterisk', () => {
      const ast = parseInline('Hello **world**! **OK**');
      expect(ast).toMatchObject(result);
    });

    test('underscore', () => {
      const ast = parseInline('Hello __world__! __OK__');
      expect(ast).toMatchObject(result);
    });

    test('together with emphasis', () => {
      const ast = parseInline('*em1* **strong** *em2*');
      expect(ast).toMatchObject([
        {
          type: 'emphasis',
          len: 5,
          children: [{type: 'text', len: 3, value: 'em1'}],
        },
        {type: 'text', len: 1, value: ' '},
        {
          type: 'strong',
          len: 10,
          children: [{type: 'text', len: 6, value: 'strong'}],
        },
        {type: 'text', len: 1, value: ' '},
        {
          type: 'emphasis',
          len: 5,
          children: [{type: 'text', len: 3, value: 'em2'}],
        },
      ]);
    });

    test('bold inside italic', () => {
      const ast = parseInline('*italic __bold__*');
      expect(ast).toMatchObject([
        {
          type: 'emphasis',
          len: 17,
          children: [
            {
              type: 'text',
              len: 7,
              value: 'italic ',
            },
            {
              type: 'strong',
              len: 8,
              children: [
                {
                  type: 'text',
                  len: 4,
                  value: 'bold',
                },
              ],
            },
          ],
        },
      ]);
    });

    test('italic inside bold', () => {
      const ast = parseInline('**bold _italic_**');
      expect(ast).toMatchObject([
        {
          type: 'strong',
          len: 17,
          children: [
            {
              type: 'text',
              len: 5,
              value: 'bold ',
            },
            {
              type: 'emphasis',
              len: 8,
              children: [
                {
                  type: 'text',
                  len: 6,
                  value: 'italic',
                },
              ],
            },
          ],
        },
      ]);
    });
  });

  describe('delete text', () => {
    test('works', () => {
      const ast = parseInline('~~123~~');
      expect(ast).toMatchObject([
        {
          type: 'delete',
          children: [
            {
              type: 'text',
              value: '123',
            },
          ],
        },
      ]);
    });

    test('parses inline text', () => {
      const ast = parseInline('~~*1*~~');
      expect(ast).toMatchObject([
        {
          type: 'delete',
          len: 7,
          children: [
            {
              type: 'emphasis',
              len: 3,
              children: [
                {
                  type: 'text',
                  len: 1,
                  value: '1',
                },
              ],
            },
          ],
        },
      ]);
    });
  });

  describe('spoiler text', () => {
    test('works when spoiler text is the only token', () => {
      const ast = parseInline('||foobar||');
      expect(ast).toMatchObject([
        {
          type: 'spoiler',
          children: [
            {
              type: 'text',
              value: 'foobar',
            },
          ],
        },
      ]);
    });

    test('works when surrounded by text', () => {
      const ast = parseInline('hello ||foobar|| world');
      expect(ast).toMatchObject([
        {type: 'text', value: 'hello '},
        {
          type: 'spoiler',
          children: [
            {
              type: 'text',
              value: 'foobar',
            },
          ],
        },
        {type: 'text', value: ' world'},
      ]);
    });

    test('works when surrounded by deleted text', () => {
      const ast = parseInline('~~hello~~ ||foobar|| ~~world~~');
      expect(ast).toMatchObject([
        {
          type: 'delete',
          children: [
            {
              type: 'text',
              value: 'hello',
            },
          ],
        },
        {type: 'text', value: ' '},
        {
          type: 'spoiler',
          children: [
            {
              type: 'text',
              value: 'foobar',
            },
          ],
        },
        {type: 'text', value: ' '},
        {
          type: 'delete',
          children: [
            {
              type: 'text',
              value: 'world',
            },
          ],
        },
      ]);
    });
  });

  describe('math', () => {
    test('works', () => {
      const ast = parseInline('$$1+1$$');
      expect(ast).toMatchObject([
        {
          type: 'inlineMath',
          value: '1+1',
        },
      ]);
    });

    test('single dollar inline math works', () => {
      const ast = parseInline('$1+1$');
      expect(ast).toMatchObject([
        {
          type: 'inlineMath',
          value: '1+1',
        },
      ]);
    });

    test('in text', () => {
      const ast = parseInline('Hey, look $$f(x) = Y ^ 2$$ is a real function.');
      expect(ast).toMatchObject([
        {type: 'text', len: 10, value: 'Hey, look '},
        {type: 'inlineMath', len: 16, value: 'f(x) = Y ^ 2'},
        {type: 'text', len: 20, value: ' is a real function.'},
      ]);
    });

    test('single dollar inline math, in text', () => {
      const ast = parseInline('Hey, look $f(x) = Y ^ 2$ is a real function.');
      expect(ast).toMatchObject([
        {type: 'text', len: 10, value: 'Hey, look '},
        {type: 'inlineMath', len: 14, value: 'f(x) = Y ^ 2'},
        {type: 'text', len: 20, value: ' is a real function.'},
      ]);
    });

    test('emphasized', () => {
      const ast = parseInline('*$$123$$*');
      expect(ast).toMatchObject([
        {
          type: 'emphasis',
          len: 9,
          children: [{type: 'inlineMath', len: 7, value: '123'}],
        },
      ]);
    });
  });

  describe('footnoteReference', () => {
    test('works', () => {
      const ast = parseInline('[^1]');
      expect(ast).toMatchObject([
        {
          type: 'footnoteReference',
          value: '1',
        },
      ]);
    });

    test('end of sentence', () => {
      const ast = parseInline('To be, or not to be.[^my-ref]');
      expect(ast).toMatchObject([
        {type: 'text', len: 20, value: 'To be, or not to be.'},
        {type: 'footnoteReference', len: 9, value: 'my-ref'},
      ]);
    });
  });

  describe('linkReference', () => {
    test('works', () => {
      const ast = parseInline('[1][2]');
      expect(ast).toMatchObject([
        {
          type: 'linkReference',
          len: 6,
          children: [{type: 'text', len: 1, value: '1'}],
          identifier: '2',
          referenceType: 'full',
        },
      ]);
    });

    test('full and collapsed', () => {
      const ast = parseInline('See [this][link-1] and [foo][].');
      expect(ast).toMatchObject([
        {type: 'text', len: 4, value: 'See '},
        {
          type: 'linkReference',
          len: 14,
          children: [{type: 'text', len: 4, value: 'this'}],
          identifier: 'link-1',
          referenceType: 'full',
        },
        {type: 'text', len: 5, value: ' and '},
        {
          type: 'linkReference',
          len: 7,
          children: [{type: 'text', len: 3, value: 'foo'}],
          identifier: 'foo',
          referenceType: 'collapsed',
        },
        {type: 'text', len: 1, value: '.'},
      ]);
    });
  });

  describe('inlineLink', () => {
    test('works', () => {
      const ast = parseInline('http://google.com');
      expect(ast).toMatchObject([
        {
          type: 'inlineLink',
          value: 'http://google.com',
        },
      ]);
    });

    test('finds link in text', () => {
      const ast = parseInline('Hey, check this http://google.com out!');
      expect(ast).toMatchObject([
        {type: 'text', len: 16, value: 'Hey, check this '},
        {type: 'inlineLink', len: 17, value: 'http://google.com'},
        {type: 'text', len: 5, value: ' out!'},
      ]);
    });
  });

  describe('sup', () => {
    test('works', () => {
      const ast = parseInline('^foo^');
      expect(ast).toMatchObject([
        {
          type: 'sup',
          children: [
            {
              type: 'text',
              value: 'foo',
            },
          ],
        },
      ]);
    });

    test('complex example', () => {
      const ast = parseInline('^foo^ *okay ^bar^* hello ^world^');
      expect(ast).toMatchObject([
        {
          type: 'sup',
          len: 5,
          children: [
            {
              type: 'text',
              len: 3,
              value: 'foo',
            },
          ],
        },
        {
          type: 'text',
          len: 1,
          value: ' ',
        },
        {
          type: 'emphasis',
          len: 12,
          children: [
            {
              type: 'text',
              len: 5,
              value: 'okay ',
            },
            {
              type: 'sup',
              len: 5,
              children: [
                {
                  type: 'text',
                  len: 3,
                  value: 'bar',
                },
              ],
            },
          ],
        },
        {
          type: 'text',
          len: 7,
          value: ' hello ',
        },
        {
          type: 'sup',
          len: 7,
          children: [
            {
              type: 'text',
              len: 5,
              value: 'world',
            },
          ],
        },
      ]);
    });
  });

  describe('sub', () => {
    test('works', () => {
      const ast = parseInline('~foo~');
      expect(ast).toMatchObject([
        {
          type: 'sub',
          children: [
            {
              type: 'text',
              value: 'foo',
            },
          ],
        },
      ]);
    });

    test('complex example', () => {
      const ast = parseInline('~foo~ *okay ~bar~* hello ~world~');
      expect(ast).toMatchObject([
        {
          type: 'sub',
          len: 5,
          children: [
            {
              type: 'text',
              len: 3,
              value: 'foo',
            },
          ],
        },
        {
          type: 'text',
          len: 1,
          value: ' ',
        },
        {
          type: 'emphasis',
          len: 12,
          children: [
            {
              type: 'text',
              len: 5,
              value: 'okay ',
            },
            {
              type: 'sub',
              len: 5,
              children: [
                {
                  type: 'text',
                  len: 3,
                  value: 'bar',
                },
              ],
            },
          ],
        },
        {
          type: 'text',
          len: 7,
          value: ' hello ',
        },
        {
          type: 'sub',
          len: 7,
          children: [
            {
              type: 'text',
              len: 5,
              value: 'world',
            },
          ],
        },
      ]);
    });
  });

  describe('handle', () => {
    test('works', () => {
      expect(parseInline('@foo')).toMatchObject([
        {
          type: 'handle',
          value: 'foo',
          prefix: '@',
        },
      ]);
      expect(parseInline('~foo')).toMatchObject([
        {
          type: 'handle',
          value: 'foo',
          prefix: '~',
        },
      ]);
      expect(parseInline('#foo')).toMatchObject([
        {
          type: 'handle',
          value: 'foo',
          prefix: '#',
        },
      ]);
    });

    test('complex value', () => {
      expect(parseInline('@{foo bar}')).toMatchObject([
        {
          type: 'handle',
          value: 'foo bar',
          prefix: '@',
        },
      ]);
      expect(parseInline('~{foo bar}')).toMatchObject([
        {
          type: 'handle',
          value: 'foo bar',
          prefix: '~',
        },
      ]);
      expect(parseInline('#{foo bar}')).toMatchObject([
        {
          type: 'handle',
          value: 'foo bar',
          prefix: '#',
        },
      ]);
    });

    test('allows = in complex value', () => {
      expect(parseInline('@{foo=bar}')).toMatchObject([
        {
          type: 'handle',
          value: 'foo=bar',
          prefix: '@',
        },
      ]);
      expect(parseInline('~{foo=bar}')).toMatchObject([
        {
          type: 'handle',
          value: 'foo=bar',
          prefix: '~',
        },
      ]);
      expect(parseInline('#{foo=bar}')).toMatchObject([
        {
          type: 'handle',
          value: 'foo=bar',
          prefix: '#',
        },
      ]);
    });

    test('in various positions in text', () => {
      const ast = parseInline('#foo hello @bar world *@baz*');
      expect(ast).toMatchObject([
        {type: 'handle', len: 4, value: 'foo', prefix: '#'},
        {type: 'text', len: 7, value: ' hello '},
        {type: 'handle', len: 4, value: 'bar', prefix: '@'},
        {type: 'text', len: 7, value: ' world '},
        {
          type: 'emphasis',
          len: 6,
          children: [{type: 'handle', len: 4, value: 'baz', prefix: '@'}],
        },
      ]);
    });
  });

  describe('underline', () => {
    test('works', () => {
      const ast = parseInline('++foo++');
      expect(ast).toMatchObject([
        {
          type: 'underline',
          children: [
            {
              type: 'text',
              value: 'foo',
            },
          ],
        },
      ]);
    });

    test('complex example', () => {
      const ast = parseInline('++foo++ *okay ++bar++* hello ++world++');
      expect(ast).toMatchObject([
        {
          type: 'underline',
          len: 7,
          children: [
            {
              type: 'text',
              len: 3,
              value: 'foo',
            },
          ],
        },
        {
          type: 'text',
          len: 1,
          value: ' ',
        },
        {
          type: 'emphasis',
          len: 14,
          children: [
            {
              type: 'text',
              len: 5,
              value: 'okay ',
            },
            {
              type: 'underline',
              len: 7,
              children: [
                {
                  type: 'text',
                  len: 3,
                  value: 'bar',
                },
              ],
            },
          ],
        },
        {
          type: 'text',
          len: 7,
          value: ' hello ',
        },
        {
          type: 'underline',
          len: 9,
          children: [
            {
              type: 'text',
              len: 5,
              value: 'world',
            },
          ],
        },
      ]);
    });
  });

  describe('break', () => {
    it('two spaces before linebreak', () => {
      const ast = parseInline('foo  \nbar');
      expect(ast).toMatchObject([
        {type: 'text', len: 3, value: 'foo'},
        {type: 'break', len: 3},
        {type: 'text', len: 3, value: 'bar'},
      ]);
    });

    it('escaped linebrak \\n character', () => {
      const ast = parseInline('foo\\nbar');
      expect(ast).toMatchObject([
        {type: 'text', len: 3, value: 'foo'},
        {type: 'break', len: 2},
        {type: 'text', len: 3, value: 'bar'},
      ]);
    });
  });

  describe('escape', () => {
    it('works', () => {
      const ast = parseInline('\\[\\$\\@');
      expect(ast).toMatchObject([
        {
          type: 'text',
          value: '[$@',
        },
      ]);
    });
  });

  describe('imageReference', () => {
    test('works', () => {
      const ast = parseInline('![alt][ref]');
      expect(ast).toMatchObject([
        {
          type: 'imageReference',
          len: 11,
          identifier: 'ref',
          referenceType: 'full',
          alt: 'alt',
        },
      ]);
    });
  });
});
