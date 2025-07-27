import { parse } from './setup';
import { toText } from '../block/toText';

describe('Metadata toText (frontmatter pretty-printing)', () => {
  it('should pretty-print basic frontmatter with dashes', () => {
    const md = '---\nfoo: bar\n---';
    const ast = parse(md);
    const result = toText(ast);
    expect(result).toBe(md);
  });

  it('should pretty-print frontmatter with language', () => {
    const md = '--- yaml\nfoo: bar\n---';
    const ast = parse(md);
    const result = toText(ast);
    expect(result).toBe(md);
  });

  it('should pretty-print frontmatter with different fence characters', () => {
    const md = '### cson\nfoo: bar\n###';
    const ast = parse(md);
    const result = toText(ast);
    expect(result).toBe(md);
  });

  it('should pretty-print frontmatter with equal signs', () => {
    const md = '=== yaml\nkey: value\n===';
    const ast = parse(md);
    const result = toText(ast);
    expect(result).toBe(md);
  });

  it('should pretty-print frontmatter with plus signs', () => {
    const md = '+++ toml\nkey = "value"\n+++';
    const ast = parse(md);
    const result = toText(ast);
    expect(result).toBe(md);
  });

  it('should pretty-print multiple lines of metadata', () => {
    const md = '---\nfoo: bar\nbaz: qux\n---';
    const ast = parse(md);
    const result = toText(ast);
    expect(result).toBe(md);
  });

  it('should pretty-print metadata with indented content', () => {
    const md = '--- yaml\nkey:\n  - item1\n  - item2\n---';
    const ast = parse(md);
    const result = toText(ast);
    expect(result).toBe(md);
  });
});