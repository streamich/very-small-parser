import {parse} from './setup';

describe('new lines', () => {
  test('single newline is converted to space', () => {
    const ast = parse('a\nb');
    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {type: 'text', value: 'a b'},
          ],
        },
      ],
    });
  });

  test('single newline is converted to space (with \\r)', () => {
    const ast = parse('a\r\nb');
    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {type: 'text', value: 'a b'},
          ],
        },
      ],
    });
  });

  test('single space + single newline is converted to space', () => {
    const ast = parse('a \nb');
    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {type: 'text', value: 'a b'},
          ],
        },
      ],
    });
  });

  test('single space + single newline is converted to space (with \\r)', () => {
    const ast = parse('a \r\nb');
    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {type: 'text', value: 'a b'},
          ],
        },
      ],
    });
  });

  test('double space + single newline is converted to newline', () => {
    const ast = parse('a  \nb');
    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {type: 'text', value: 'a'},
            {type: 'break'},
            {type: 'text', value: 'b'},
          ],
        },
      ],
    });
  });

  test.skip('double space + single newline is converted to newline (\\r)', () => {
    const ast = parse('a  \r\nb');
    // console.log(JSON.stringify(ast, null, 2));
    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {type: 'text', value: 'a'},
            {type: 'break'},
            {type: 'text', value: 'b'},
          ],
        },
      ],
    });
  });
});
