import {parse} from '../parser';

describe('CSON Parser', () => {
  describe('Basic Values', () => {
    test('parses null', () => {
      expect(parse('null')).toBe(null);
      expect(parse('undefined')).toBe(null);
    });

    test('parses booleans', () => {
      expect(parse('true')).toBe(true);
      expect(parse('false')).toBe(false);
    });

    test('parses numbers', () => {
      expect(parse('42')).toBe(42);
      expect(parse('-42')).toBe(-42);
      expect(parse('3.14')).toBe(3.14);
      expect(parse('-3.14')).toBe(-3.14);
      expect(parse('1e5')).toBe(100000);
      expect(parse('1E5')).toBe(100000);
      expect(parse('1e-5')).toBe(0.00001);
    });

    test('parses strings', () => {
      expect(parse('"hello"')).toBe('hello');
      expect(parse("'hello'")).toBe('hello');
      expect(parse('"hello world"')).toBe('hello world');
      expect(parse("'hello world'")).toBe('hello world');
    });

    test('parses escaped strings', () => {
      expect(parse('"hello\\nworld"')).toBe('hello\nworld');
      expect(parse('"hello\\tworld"')).toBe('hello\tworld');
      expect(parse('"hello\\rworld"')).toBe('hello\rworld');
      expect(parse('"hello\\\\"')).toBe('hello\\');
      expect(parse('"\\"hello\\""')).toBe('"hello"');
      expect(parse("'\\'hello\\''")).toBe("'hello'");
    });

    test('parses unquoted identifiers as strings', () => {
      expect(parse('hello')).toBe('hello');
      expect(parse('hello_world')).toBe('hello_world');
      expect(parse('$special')).toBe('$special');
    });
  });

  describe('Arrays', () => {
    test('parses empty arrays', () => {
      expect(parse('[]')).toEqual([]);
    });

    test('parses simple arrays', () => {
      expect(parse('[1, 2, 3]')).toEqual([1, 2, 3]);
      expect(parse('["a", "b", "c"]')).toEqual(['a', 'b', 'c']);
      expect(parse('[true, false, null]')).toEqual([true, false, null]);
    });

    test('parses arrays with mixed types', () => {
      expect(parse('[1, "hello", true, null]')).toEqual([1, 'hello', true, null]);
    });

    test('parses nested arrays', () => {
      expect(parse('[[1, 2], [3, 4]]')).toEqual([
        [1, 2],
        [3, 4],
      ]);
    });

    test('parses arrays with trailing commas', () => {
      expect(parse('[1, 2, 3,]')).toEqual([1, 2, 3]);
    });

    test('parses multiline arrays', () => {
      const cson = `[
        1,
        2,
        3
      ]`;
      expect(parse(cson)).toEqual([1, 2, 3]);
    });

    test('parses arrays with newline separators', () => {
      const cson = `[
        1
        2
        3
      ]`;
      expect(parse(cson)).toEqual([1, 2, 3]);
    });
  });

  describe('Objects', () => {
    test('parses empty objects', () => {
      expect(parse('{}')).toEqual({});
    });

    test('parses simple objects with braces', () => {
      expect(parse('{"key": "value"}')).toEqual({key: 'value'});
      expect(parse("{'key': 'value'}")).toEqual({key: 'value'});
      expect(parse('{key: "value"}')).toEqual({key: 'value'});
    });

    test('parses objects without braces', () => {
      expect(parse('key: "value"')).toEqual({key: 'value'});
      expect(parse('key1: "value1", key2: "value2"')).toEqual({
        key1: 'value1',
        key2: 'value2',
      });
    });

    test('parses objects with various value types', () => {
      expect(parse('{a: 1, b: "hello", c: true, d: null}')).toEqual({
        a: 1,
        b: 'hello',
        c: true,
        d: null,
      });
    });

    test('parses nested objects', () => {
      expect(parse('{a: {b: {c: "value"}}}')).toEqual({
        a: {b: {c: 'value'}},
      });
    });

    test('parses objects with trailing commas', () => {
      expect(parse('{a: 1, b: 2,}')).toEqual({a: 1, b: 2});
    });

    test('parses multiline objects', () => {
      const cson = `{
        key1: "value1",
        key2: "value2",
        key3: "value3"
      }`;
      expect(parse(cson)).toEqual({
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      });
    });

    test('parses multiline objects without braces', () => {
      const cson = `
        key1: "value1"
        key2: "value2"
        key3: "value3"
      `;
      expect(parse(cson)).toEqual({
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      });
    });
  });

  describe('Comments', () => {
    test('ignores line comments', () => {
      expect(parse('# This is a comment\n42')).toBe(42);
    });

    test('ignores comments in objects', () => {
      const cson = `{
        # This is a comment
        key1: "value1", # Another comment
        key2: "value2"
      }`;
      expect(parse(cson)).toEqual({
        key1: 'value1',
        key2: 'value2',
      });
    });

    test('ignores comments in arrays', () => {
      const cson = `[
        # Comment
        1, # Another comment
        2,
        3
      ]`;
      expect(parse(cson)).toEqual([1, 2, 3]);
    });
  });

  describe('Complex Structures', () => {
    test('parses complex nested structure', () => {
      const cson = `{
        name: "Test Config"
        version: 1.0
        enabled: true
        features: [
          "feature1",
          "feature2",
          {
            name: "feature3",
            config: {
              timeout: 5000,
              retries: 3
            }
          }
        ]
        database: {
          host: "localhost"
          port: 5432
          credentials: {
            username: "admin"
            password: "secret"
          }
        }
      }`;

      expect(parse(cson)).toEqual({
        name: 'Test Config',
        version: 1.0,
        enabled: true,
        features: [
          'feature1',
          'feature2',
          {
            name: 'feature3',
            config: {
              timeout: 5000,
              retries: 3,
            },
          },
        ],
        database: {
          host: 'localhost',
          port: 5432,
          credentials: {
            username: 'admin',
            password: 'secret',
          },
        },
      });
    });
  });

  describe('Reviver Function', () => {
    test('applies reviver function', () => {
      const reviver = (key: string, value: any) => {
        if (typeof value === 'string') {
          return value.toUpperCase();
        }
        return value;
      };

      expect(parse('key: "hello"', reviver)).toEqual({key: 'HELLO'});
    });

    test('reviver receives correct context', () => {
      const reviver = function (this: any, key: string, value: any) {
        if (key === 'transform' && typeof value === 'string') {
          return `${this.prefix}_${value}`;
        }
        return value;
      };

      expect(parse('{prefix: "test", transform: "value"}', reviver)).toEqual({
        prefix: 'test',
        transform: 'test_value',
      });
    });

    test('throws error for non-function reviver', () => {
      expect(() => parse('{}', 'not-a-function' as any)).toThrow(TypeError);
      expect(() => parse('{}', 'not-a-function' as any)).toThrow('reviver has to be a function');
    });
  });

  describe('Error Handling', () => {
    test('throws syntax errors with line and column info', () => {
      expect(() => parse('{')).toThrow('Syntax error on line 1, column 2');
      expect(() => parse('["hello"')).toThrow('Syntax error');
      expect(() => parse('invalid!')).toThrow('Syntax error');
    });

    test('throws error for unterminated strings', () => {
      expect(() => parse('"unterminated')).toThrow('Unterminated string');
    });

    test('throws error for invalid numbers', () => {
      expect(() => parse('123abc')).toThrow('Unexpected content after parsing');
    });

    test('throws error for invalid object syntax', () => {
      expect(() => parse('{key "value"}')).toThrow("Expected ':' after object key");
    });

    test('provides correct line numbers for multiline input', () => {
      const cson = `{
        key1: "value1"
        key2: "value2"
        invalid!
      }`;

      try {
        parse(cson);
      } catch (error: any) {
        expect(error.message).toContain('line 4');
      }
    });
  });

  describe('Whitespace Handling', () => {
    test('handles various whitespace characters', () => {
      expect(parse('  \t\n\r  42  \t\n\r  ')).toBe(42);
    });

    test('handles whitespace in objects and arrays', () => {
      expect(parse('  {  key  :  "value"  }  ')).toEqual({key: 'value'});
      expect(parse('  [  1  ,  2  ,  3  ]  ')).toEqual([1, 2, 3]);
    });
  });

  describe('Edge Cases', () => {
    test('parses empty input as null', () => {
      expect(parse('')).toBe(null);
      expect(parse('   ')).toBe(null);
      expect(parse('# just a comment')).toBe(null);
    });

    test('handles single values', () => {
      expect(parse('42')).toBe(42);
      expect(parse('"hello"')).toBe('hello');
      expect(parse('true')).toBe(true);
    });
  });
});
