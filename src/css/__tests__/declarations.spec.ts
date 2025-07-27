import {parseDecls} from '..';

test('can parse inline styles', () => {
  const style =
    'font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;';
  const declarations = parseDecls(style);
  expect(declarations).toEqual({
    'font-size': '11pt',
    'font-family': 'Arial,sans-serif',
    color: '#000000',
    'background-color': 'transparent',
    'font-weight': '400',
    'font-style': 'normal',
    'font-variant': 'normal',
    'text-decoration': 'none',
    'vertical-align': 'baseline',
    'white-space': 'pre-wrap',
  });
});

describe('parseDecls edge cases', () => {
  test('handles empty string', () => {
    expect(parseDecls('')).toEqual({});
  });

  test('handles whitespace-only string', () => {
    expect(parseDecls('   \n\t  ')).toEqual({});
  });

  test('handles single declaration', () => {
    expect(parseDecls('color: red')).toEqual({ color: 'red' });
  });

  test('handles declaration without trailing semicolon', () => {
    expect(parseDecls('color: red')).toEqual({ color: 'red' });
  });

  test('handles multiple declarations without trailing semicolon', () => {
    expect(parseDecls('color: red; font-size: 14px')).toEqual({ 
      color: 'red', 
      'font-size': '14px' 
    });
  });

  test('ignores malformed declarations without colon', () => {
    expect(parseDecls('color red; font-size: 14px')).toEqual({ 
      'font-size': '14px' 
    });
  });

  test('ignores empty declarations', () => {
    expect(parseDecls('color: red;; font-size: 14px;')).toEqual({ 
      color: 'red', 
      'font-size': '14px' 
    });
  });

  test('trims whitespace from properties and values', () => {
    expect(parseDecls('  color  :  red  ;  font-size  :  14px  ')).toEqual({ 
      color: 'red', 
      'font-size': '14px' 
    });
  });

  test('handles values with colons', () => {
    expect(parseDecls('background: url(http://example.com:8080/image.png)')).toEqual({ 
      background: 'url(http://example.com:8080/image.png)' 
    });
  });

  test('handles values with semicolons in strings', () => {
    expect(parseDecls('content: "Hello; World"')).toEqual({ 
      content: '"Hello; World"' 
    });
  });

  test('handles CSS custom properties', () => {
    expect(parseDecls('--main-color: #ff0000; color: var(--main-color)')).toEqual({ 
      '--main-color': '#ff0000',
      color: 'var(--main-color)' 
    });
  });

  test('handles duplicate properties (last one wins)', () => {
    expect(parseDecls('color: red; color: blue')).toEqual({ 
      color: 'blue' 
    });
  });

  test('ignores declarations with empty property names', () => {
    expect(parseDecls(': red; font-size: 14px')).toEqual({ 
      'font-size': '14px' 
    });
  });

  test('ignores declarations with empty values', () => {
    expect(parseDecls('color: ; font-size: 14px')).toEqual({ 
      'font-size': '14px' 
    });
  });

  test('handles complex CSS values', () => {
    const css = 'transform: translateX(10px) rotate(45deg); box-shadow: 0 2px 4px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5)';
    expect(parseDecls(css)).toEqual({ 
      transform: 'translateX(10px) rotate(45deg)',
      'box-shadow': '0 2px 4px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.5)'
    });
  });

  test('handles mixed quotes', () => {
    expect(parseDecls('content: "Hello \'world\';"; font-family: \'Arial, "Times New Roman"\'')).toEqual({ 
      content: '"Hello \'world\';"',
      'font-family': '\'Arial, "Times New Roman"\'' 
    });
  });

  test('handles escaped quotes', () => {
    expect(parseDecls('content: "He said \\"Hello\\";"; color: red')).toEqual({ 
      content: '"He said \\"Hello\\";"',
      color: 'red' 
    });
  });

  test('handles very long values', () => {
    const longValue = 'a'.repeat(1000);
    expect(parseDecls(`color: ${longValue}`)).toEqual({ 
      color: longValue 
    });
  });
});
