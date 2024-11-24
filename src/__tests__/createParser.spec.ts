import createParser from '../createParser';
import icon from '../tokenizer/icon';

describe('createParser()', () => {
  test('returns a parser object', () => {
    const parser = createParser({
      inline: [icon(32) as any],
      block: [],
    });

    expect(typeof parser).toBe('object');
    expect(typeof parser.tokenizeInline).toBe('function');
  });

  test('returns a single AST token', () => {
    const parser = createParser({
      inline: [icon(32) as any],
      block: [],
    });

    const ast = parser.tokenizeInline(':smile:')![0];

    expect(typeof ast).toBe('object');
    expect(ast.type).toBe('icon');
  });
});
