import {parse} from './setup';

describe('headings', () => {
  describe('ATX', () => {
    test('simple ATX', () => {
      const ast = parse('# Heading 1\n## Heading 2\n### Heading 3\n#### Heading 4\n##### Heading 5\n###### Heading 6');
      expect(ast).toMatchObject([
        {
          type: 'heading',
          depth: 1,
          children: [{type: 'text', value: 'Heading 1'}],
        },
        {
          type: 'heading',
          depth: 2,
          children: [{type: 'text', value: 'Heading 2'}],
        },
        {
          type: 'heading',
          depth: 3,
          children: [{type: 'text', value: 'Heading 3'}],
        },
        {
          type: 'heading',
          depth: 4,
          children: [{type: 'text', value: 'Heading 4'}],
        },
        {
          type: 'heading',
          depth: 5,
          children: [{type: 'text', value: 'Heading 5'}],
        },
        {
          type: 'heading',
          depth: 6,
          children: [{type: 'text', value: 'Heading 6'}],
        },
      ]);
    });

    test('ATX with trailing hashes', () => {
      const ast = parse('# Heading 1 #\n## Heading 2 ##\n### Heading 3 ###');
      expect(ast).toMatchObject([
        {
          type: 'heading',
          depth: 1,
          children: [{type: 'text', value: 'Heading 1'}],
        },
        {
          type: 'heading',
          depth: 2,
          children: [{type: 'text', value: 'Heading 2'}],
        },
        {
          type: 'heading',
          depth: 3,
          children: [{type: 'text', value: 'Heading 3'}],
        },
      ]);
    });

    test('ATX with leading and trailing spaces', () => {
      const ast = parse('   # Heading 1   \n   ## Heading 2   \n   ### Heading 3   ');
      expect(ast).toMatchObject([
        {
          type: 'heading',
          depth: 1,
          children: [{type: 'text', value: 'Heading 1'}],
        },
        {
          type: 'heading',
          depth: 2,
          children: [{type: 'text', value: 'Heading 2'}],
        },
        {
          type: 'heading',
          depth: 3,
          children: [{type: 'text', value: 'Heading 3'}],
        },
      ]);
    });

    test('ATX with non-space characters after trailing hashes', () => {
      const ast = parse('# Heading 1 # not a heading\n## Heading 2 ## not a heading\n### Heading 3 ### not a heading');
      expect(ast).toMatchObject([
        {
          type: 'heading',
          depth: 1,
          children: [{type: 'text', value: 'Heading 1 # not a heading'}],
        },
        {
          type: 'heading',
          depth: 2,
          children: [{type: 'text', value: 'Heading 2 ## not a heading'}],
        },
        {
          type: 'heading',
          depth: 3,
          children: [{type: 'text', value: 'Heading 3 ### not a heading'}],
        },
      ]);
    });
  });

  describe('Setext', () => {
    test('simple Setext', () => {
      const ast = parse('Heading 1\n=========\n\nHeading 2\n---------');
      expect(ast).toMatchObject([
        {
          type: 'heading',
          depth: 1,
          children: [{type: 'text', value: 'Heading 1'}],
        },
        {
          type: 'heading',
          depth: 2,
          children: [{type: 'text', value: 'Heading 2'}],
        },
      ]);
    });
  });
});
