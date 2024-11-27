import {is} from '../is';

type Case = [name: string, src: string];

describe('false', () => {
  const cases: Case[] = [
    ['plain text', 'Hello, world!'],
    ['empty string', ''],
    ['exclamation mark', '!'],
    ['heading without following', 'asdf asdf \n\n# Heading\n\n'],
    ['code in the middle of word', 'copy`this`haha'],
    ['a single <ol>', 'asdf\n\n1. List\n\n'],
    ['code', `
public htmlTag(): string {
  const tag = this.tag();
  switch (typeof tag) {
    case 'string': return tag.toLowerCase();
    case 'number': return SliceTypeName[tag] || 'div';
    default: return 'div';
  }
}

public jsonMlNode(): JsonMlElement {
  const props: Record<string, string> = {};
  const node: JsonMlElement = ['div', props];
  const tag = this.tag();
  switch (typeof tag) {
    case 'string':
      node[0] = tag;
      break;
    case 'number':
      const tag0 = SliceTypeName[tag];
      if (tag0) node[0] = tag0; else props['data-tag'] = tag + '';
      break;
  }
  const attr = this.attr();
  if (attr !== undefined) props['data-attr'] = JSON.stringify(attr);
  return node;
}

public attr(): Attr | undefined {
  return this.marker?.data() as Attr | undefined;
}`],
  ];

  for (const [name, src] of cases) {
    it(name, () => {
      const res = is(src);
      expect(res).toBe(false);
    });
  }
});

describe('true', () => {
  const cases: Case[] = [
    ['bold', '__bold__'],
    ['bold in the middle of text', 'text __bold__ aha'],
    ['bold in the end of text', 'text **bold**'],
    ['italic', 'I am *italic*'],
    ['code', '`console.log("asdf");`'],
    ['code in the middle of text', 'copy this `function:cast[123]`, OK?'],
    ['link', '[Click me](https://example.com)'],
    ['link in text', 'Go to [example.com](https://example.com) for more info.'],
    ['<ol>', '1. First\n2. Second\n3. Third'],
    ['<ol> with whitespace', '  1.   First\n   2.   Second\n 3.  Third'],
    ['<ol> in the middle of text', 'copy this\n\n1. First\n\n2. Second'],
    ['<ul>', '- First\n- Second\n- Third'],
    ['<ul> in the middle of text', 'copy this\n\n- First\n\n- Second'],
    ['horizontal rule', '\n\n----\n\n'],
    ['horizontal rule with whitespace', '\n\n  ----\n\n'],
    ['horizontal rule with newlines', '\n\n\n\n----\n\n\n\n'],
    ['heading', '# Heading\n\na'],
    ['heading with whitespace', '  # Heading\n\na'],
    ['heading in the middle of content', 'copy this\n\n# Heading\n\n    console.log("asdf");\n\n'],
    ['H6', '###### Heading\n\na'],
    ['fences', '```\nconsole.log("asdf");\n```'],
    ['fences with language', '```js\nconsole.log("asdf");\n```'],
    ['fences in the middle of content', 'copy this\n\n```\nconsole.log("asdf");\n```\n\n'],
    ['fences with tilde', '~~~\nconsole.log("asdf");\n~~~'],
    ['math block', '$$\n\\frac{1}{2}\n$$'],
    ['underlined H1 heading', 'asdf\n\nHeading\n------\n\na'],
    ['blockquote', '> This is a blockquote\n\n'],
  ];

  for (const [name, src] of cases) {
    it(name, () => {
      const res = is(src);
      expect(res).toBe(true);
    });
  }
});
