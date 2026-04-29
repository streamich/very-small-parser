import {parse} from './setup';

describe('inline attributes', () => {
  describe('emphasis', () => {
    test('single class', () => {
      const ast = parse('*Blue Title*{blue}');
      expect(ast[0]).toMatchObject({
        type: 'emphasis',
        args: ['blue'],
      });
    });

    test('id and key=value', () => {
      const ast = parse('*text*{#id position=left}');
      expect(ast[0]).toMatchObject({
        type: 'emphasis',
        args: ['#id', 'position=left'],
      });
    });
  });

  describe('strong', () => {
    test('single id', () => {
      const ast = parse('**Bold**{#bold-id}');
      expect(ast[0]).toMatchObject({
        type: 'strong',
        args: ['#bold-id'],
      });
    });
  });

  describe('link', () => {
    test('attrs attached to link', () => {
      const ast = parse('[hello](http://example.com){.cta}');
      expect(ast[0]).toMatchObject({
        type: 'link',
        args: ['.cta'],
      });
    });
  });

  describe('inlineCode', () => {
    test('attrs attached to inlineCode', () => {
      const ast = parse('`code`{highlight}');
      expect(ast[0]).toMatchObject({
        type: 'inlineCode',
        args: ['highlight'],
      });
    });
  });

  describe('trailing text preserved', () => {
    test('text after attr is kept', () => {
      const ast = parse('*foo*{bar} baz');
      expect(ast[0]).toMatchObject({type: 'emphasis', args: ['bar']});
      expect(ast[1]).toMatchObject({type: 'text', value: ' baz'});
    });

    test('text after attr is not kept', () => {
      const ast = parse('*foo* {bar} baz');
      expect(ast[0]).toMatchObject({type: 'emphasis'});
      expect(ast[1]).toMatchObject({type: 'text', value: ' {bar} baz'});
    });

    test('no attr: text runs normally', () => {
      const ast = parse('*foo* baz');
      expect(ast[0]).toMatchObject({type: 'emphasis'});
      expect((ast[0] as any).args).toBeUndefined();
      expect(ast[1]).toMatchObject({type: 'text', value: ' baz'});
    });
  });

  describe('curly braces in plain text are not attrs', () => {
    test('brace after text token is plain text', () => {
      const ast = parse('Hello {world}');
      expect(ast[0]).toMatchObject({type: 'text', value: 'Hello {world}'});
    });
  });

  describe('multiple inline elements', () => {
    test('each gets its own attrs', () => {
      const ast = parse('*foo*{.x} **bar**{.y}');
      expect(ast[0]).toMatchObject({type: 'emphasis', args: ['.x']});
      expect(ast[1]).toMatchObject({type: 'text', value: ' '});
      expect(ast[2]).toMatchObject({type: 'strong', args: ['.y']});
    });

    test('second element without attrs has none', () => {
      const ast = parse('*foo*{.x} **bar**');
      expect(ast[0]).toMatchObject({type: 'emphasis', args: ['.x']});
      expect(ast[2]).toMatchObject({type: 'strong'});
      expect((ast[2] as any).args).toBeUndefined();
    });
  });
});
