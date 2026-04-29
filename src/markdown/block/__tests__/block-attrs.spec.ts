import {parse} from './setup';

describe('block attributes', () => {
  describe('block-level: single attr line before block', () => {
    test('heading with id', () => {
      const ast = parse('{#myheader}\n# Hello');
      expect(ast[0]).toMatchObject({
        type: 'heading',
        depth: 1,
        args: ['#myheader'],
      });
    });

    test('blockquote with class', () => {
      const ast = parse("{warning}\n> Don't try this at home!");
      expect(ast[0]).toMatchObject({
        type: 'blockquote',
        args: ['warning'],
      });
    });

    test('paragraph with key=value', () => {
      const ast = parse('{position=left}\nSome text');
      expect(ast[0]).toMatchObject({
        type: 'paragraph',
        args: ['position=left'],
      });
    });
  });

  describe('block-level: multiple attr lines are merged', () => {
    test('two attr lines before blockquote', () => {
      const ast = parse("{#mywarning}\n{warning}\n> Don't try this at home!");
      expect(ast[0]).toMatchObject({
        type: 'blockquote',
        args: ['#mywarning', 'warning'],
      });
    });

    test('attr line with multiple tokens', () => {
      const ast = parse('{#id .class key=val}\n# Title');
      expect(ast[0]).toMatchObject({
        type: 'heading',
        args: ['#id', '.class', 'key=val'],
      });
    });
  });

  describe('block-level: blank line clears attrs', () => {
    test('blank line between attr and block discards attrs', () => {
      const ast = parse('{#myheader}\n\n# Hello');
      const heading = ast.find((t) => t.type === 'heading');
      expect(heading).toBeDefined();
      expect((heading as any).args).toBeUndefined();
    });
  });

  describe('block-level: no attr is a normal block', () => {
    test('heading without attr has no args', () => {
      const ast = parse('# Hello');
      expect(ast[0]).toMatchObject({type: 'heading', depth: 1});
      expect((ast[0] as any).args).toBeUndefined();
    });

    test('standalone {..} with trailing text is a paragraph, not an attr', () => {
      const ast = parse('{foo} some more text');
      expect(ast[0]).toMatchObject({type: 'paragraph'});
      expect((ast[0] as any).args).toBeUndefined();
    });
  });

  describe('inline attributes', () => {
    test('emphasis with class and key=value', () => {
      const ast = parse('# The *Blue Title*{blue position=left}');
      const heading: any = ast[0];
      const emphasis = heading.children.find((c: any) => c.type === 'emphasis');
      expect(emphasis).toBeDefined();
      expect(emphasis.args).toEqual(['blue', 'position=left']);
    });

    test('strong with id', () => {
      const ast = parse('**Bold**{#bold-id}');
      const para: any = ast[0];
      const strong = para.children.find((c: any) => c.type === 'strong');
      expect(strong).toBeDefined();
      expect(strong.args).toEqual(['#bold-id']);
    });

    test('inline attr trailing text is preserved', () => {
      const ast = parse('*foo*{bar} baz');
      const para: any = ast[0];
      const emphasis = para.children.find((c: any) => c.type === 'emphasis');
      expect(emphasis.args).toEqual(['bar']);
      const text = para.children.find((c: any) => c.type === 'text');
      expect(text.value).toBe(' baz');
    });

    test('plain text with curly braces is not treated as attrs', () => {
      const ast = parse('Hello {world}');
      const para: any = ast[0];
      // {world} follows a text token so no attrs are extracted
      expect(para.children[0]).toMatchObject({type: 'text', value: 'Hello {world}'});
    });

    test('emphasis without attr has no args', () => {
      const ast = parse('*foo*');
      const para: any = ast[0];
      const emphasis = para.children.find((c: any) => c.type === 'emphasis');
      expect(emphasis).toBeDefined();
      expect((emphasis as any).args).toBeUndefined();
    });
  });

  describe('combined block and inline', () => {
    test('heading with block attr and inline attr on emphasis', () => {
      const ast = parse('{#myheader}\n# The *Blue Title*{blue position=left}');
      const heading: any = ast[0];
      expect(heading.args).toEqual(['#myheader']);
      const emphasis = heading.children.find((c: any) => c.type === 'emphasis');
      expect(emphasis.args).toEqual(['blue', 'position=left']);
    });
  });
});
