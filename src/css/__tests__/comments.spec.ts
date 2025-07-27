import {removeComments} from '..';

describe('removeComments', () => {
  test('removes basic comments', () => {
    expect(removeComments('color: red; /* comment */ font-size: 14px;')).toBe('color: red;  font-size: 14px;');
  });

  test('removes multiline comments', () => {
    const css = `color: red;
    /* this is a 
       multiline comment */
    font-size: 14px;`;
    const result = removeComments(css);
    expect(result.replace(/\s+/g, ' ').trim()).toBe('color: red; font-size: 14px;');
  });

  test('preserves comments in strings', () => {
    expect(removeComments('content: "/* not a comment */";')).toBe('content: "/* not a comment */";');
  });

  test('handles empty string', () => {
    expect(removeComments('')).toBe('');
  });

  test('handles CSS without comments', () => {
    const css = 'color: red; font-size: 14px;';
    expect(removeComments(css)).toBe(css);
  });

  test('handles comment at start', () => {
    expect(removeComments('/* comment */ color: red;')).toBe(' color: red;');
  });

  test('handles comment at end', () => {
    expect(removeComments('color: red; /* comment */')).toBe('color: red; ');
  });

  test('handles unclosed comment', () => {
    expect(removeComments('color: red; /* unclosed comment')).toBe('color: red; ');
  });
});