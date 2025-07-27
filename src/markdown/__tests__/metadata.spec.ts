import {parse} from './setup';

describe('Metadata (frontmatter)', () => {
  it('basic frontmatter with dashes', () => {
    const ast = parse('---\nfoo: bar\n---');
    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'metadata',
          value: 'foo: bar',
        },
      ],
    });
  });

  it('frontmatter with language', () => {
    const ast = parse('--- cson\nfoo: bar\n---');
    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'metadata',
          value: 'foo: bar',
          lang: 'cson',
        },
      ],
    });
  });

  it('frontmatter with different fence characters', () => {
    const ast = parse('### cson\nfoo: bar\n###');
    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'metadata',
          value: 'foo: bar',
          lang: 'cson',
          fence: '###',
        },
      ],
    });
  });

  it('frontmatter with equal signs', () => {
    const ast = parse('=== yaml\nkey: value\n===');
    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'metadata',
          value: 'key: value',
          lang: 'yaml',
          fence: '===',
        },
      ],
    });
  });

  it('frontmatter with plus signs', () => {
    const ast = parse('+++ toml\nkey = "value"\n+++');
    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'metadata',
          value: 'key = "value"',
          lang: 'toml',
          fence: '+++',
        },
      ],
    });
  });

  it('frontmatter anywhere in document', () => {
    const ast = parse('# Title\n\n---\nkey: value\n---\n\nContent');
    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'heading',
          depth: 1,
        },
        {
          type: 'metadata',
          value: 'key: value',
        },
        {
          type: 'paragraph',
        },
      ],
    });
  });

  it('multiple lines of metadata', () => {
    const ast = parse('---\nfoo: bar\nbaz: qux\n---');
    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'metadata',
          value: 'foo: bar\nbaz: qux',
        },
      ],
    });
  });

  it('metadata with indented content', () => {
    const ast = parse('--- yaml\nkey:\n  - item1\n  - item2\n---');
    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'metadata',
          value: 'key:\n  - item1\n  - item2',
          lang: 'yaml',
        },
      ],
    });
  });

  it('frontmatter does not interfere with code blocks', () => {
    const ast = parse('```\n---\ncode\n---\n```');
    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'code',
          value: '---\ncode\n---',
          lang: '',
        },
      ],
    });
  });
});