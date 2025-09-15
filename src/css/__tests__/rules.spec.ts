import {parseRule, parseCSS} from '..';

describe('parseRule', () => {
  test('parses simple rule', () => {
    const rule = parseRule('p { color: red; font-size: 14px; }');
    expect(rule).toEqual({
      selector: 'p',
      declarations: { color: 'red', 'font-size': '14px' }
    });
  });

  test('parses complex selector', () => {
    const rule = parseRule('.class#id > div[attr="value"] { color: red; }');
    expect(rule).toEqual({
      selector: '.class#id > div[attr="value"]',
      declarations: { color: 'red' }
    });
  });

  test('handles whitespace', () => {
    const rule = parseRule('  p  {  color:  red;  }  ');
    expect(rule).toEqual({
      selector: 'p',
      declarations: { color: 'red' }
    });
  });

  test('returns null for invalid rule', () => {
    expect(parseRule('invalid rule')).toBeNull();
    expect(parseRule('p { no closing brace')).toBeNull();
    expect(parseRule('{ no selector }')).toBeNull();
    expect(parseRule('')).toBeNull();
  });

  test('handles empty declarations', () => {
    const rule = parseRule('p { }');
    expect(rule).toEqual({
      selector: 'p',
      declarations: {}
    });
  });

  test('handles multiple selectors', () => {
    const rule = parseRule('h1, h2, h3 { color: blue; }');
    expect(rule).toEqual({
      selector: 'h1, h2, h3',
      declarations: { color: 'blue' }
    });
  });
});

describe('parseCSS', () => {
  test('parses multiple rules', () => {
    const css = `
      p { color: red; }
      .class { font-size: 14px; }
    `;
    const rules = parseCSS(css);
    expect(rules).toHaveLength(2);
    expect(rules[0]).toEqual({
      selector: 'p',
      declarations: { color: 'red' }
    });
    expect(rules[1]).toEqual({
      selector: '.class',
      declarations: { 'font-size': '14px' }
    });
  });

  test('handles CSS with comments', () => {
    const css = `
      /* This is a comment */
      p { color: red; /* inline comment */ }
      /* Another comment */
      .class { font-size: 14px; }
    `;
    const rules = parseCSS(css);
    expect(rules).toHaveLength(2);
    expect(rules[0].declarations).toEqual({ color: 'red' });
  });

  test('handles empty CSS', () => {
    expect(parseCSS('')).toEqual([]);
    expect(parseCSS('/* only comment */')).toEqual([]);
  });

  test('handles nested braces in values', () => {
    const css = 'p { content: "{ not a rule }"; color: red; }';
    const rules = parseCSS(css);
    expect(rules).toHaveLength(1);
    expect(rules[0].declarations).toEqual({
      content: '"{ not a rule }"',
      color: 'red'
    });
  });

  test('handles malformed CSS gracefully', () => {
    const css = 'p { color: red; } invalid { font-size: 14px; }';
    const rules = parseCSS(css);
    expect(rules).toHaveLength(2);
    expect(rules[0].selector).toBe('p');
    expect(rules[1].selector).toBe('invalid');
  });

  test('parses pseudo-selectors and combinators', () => {
    const css = `
      a:hover { color: blue; }
      .parent > .child { margin: 10px; }
      p + p { margin-top: 20px; }
    `;
    const rules = parseCSS(css);
    expect(rules).toHaveLength(3);
    expect(rules[0].selector).toBe('a:hover');
    expect(rules[1].selector).toBe('.parent > .child');
    expect(rules[2].selector).toBe('p + p');
  });
});