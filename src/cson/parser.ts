import type {CsonValue, CsonParseOptions, CsonSyntaxError} from './types';

const DEFAULT_REVIVER = (key: string, value: any) => value;

class CsonParser {
  private source: string;
  private index: number;
  private line: number;
  private column: number;
  private reviver: (key: string, value: any) => any;

  constructor(source: string, options: CsonParseOptions = {}) {
    this.source = source;
    this.index = 0;
    this.line = 1;
    this.column = 1;
    this.reviver = options.reviver || DEFAULT_REVIVER;
  }

  private error(message: string): never {
    const CsonSyntaxError = class extends SyntaxError {
      public line: number;
      public column: number;

      constructor(message: string, line: number, column: number) {
        super(`Syntax error on line ${line}, column ${column}: ${message}`);
        this.name = 'CsonSyntaxError';
        this.line = line;
        this.column = column;
      }
    };
    throw new CsonSyntaxError(message, this.line, this.column);
  }

  private peek(): string {
    return this.index < this.source.length ? this.source[this.index] : '';
  }

  private advance(): string {
    const char = this.peek();
    if (char === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    this.index++;
    return char;
  }

  private skipWhitespace(): void {
    while (this.index < this.source.length) {
      const char = this.peek();
      if (char === ' ' || char === '\t' || char === '\n' || char === '\r') {
        this.advance();
      } else if (char === '#') {
        // Skip comment
        this.advance();
        while (this.index < this.source.length && this.peek() !== '\n') {
          this.advance();
        }
      } else {
        break;
      }
    }
  }

  private parseString(): string {
    const quote = this.advance(); // consume opening quote
    let result = '';

    while (this.index < this.source.length) {
      const char = this.peek();

      if (char === quote) {
        this.advance(); // consume closing quote
        return result;
      }

      if (char === '\\') {
        this.advance(); // consume backslash
        const escaped = this.advance();
        switch (escaped) {
          case 'n':
            result += '\n';
            break;
          case 't':
            result += '\t';
            break;
          case 'r':
            result += '\r';
            break;
          case '\\':
            result += '\\';
            break;
          case '"':
            result += '"';
            break;
          case "'":
            result += "'";
            break;
          default:
            result += escaped;
            break;
        }
      } else {
        result += this.advance();
      }
    }

    this.error(`Unterminated string`);
  }

  private parseNumber(): number {
    let result = '';

    if (this.peek() === '-') {
      result += this.advance();
    }

    while (this.index < this.source.length) {
      const char = this.peek();
      if (
        (char >= '0' && char <= '9') ||
        char === '.' ||
        char === 'e' ||
        char === 'E' ||
        char === '+' ||
        char === '-'
      ) {
        result += this.advance();
      } else {
        break;
      }
    }

    const num = Number(result);
    if (Number.isNaN(num)) {
      this.error(`Invalid number: ${result}`);
    }
    return num;
  }

  private parseIdentifier(): string {
    let result = '';

    while (this.index < this.source.length) {
      const char = this.peek();
      if (
        (char >= 'a' && char <= 'z') ||
        (char >= 'A' && char <= 'Z') ||
        (char >= '0' && char <= '9') ||
        char === '_' ||
        char === '$'
      ) {
        result += this.advance();
      } else {
        break;
      }
    }

    return result;
  }

  private parseValue(): CsonValue {
    this.skipWhitespace();

    const char = this.peek();

    if (char === '"' || char === "'") {
      return this.parseString();
    }

    if ((char >= '0' && char <= '9') || char === '-') {
      return this.parseNumber();
    }

    if (char === '[') {
      return this.parseArray();
    }

    if (char === '{') {
      return this.parseObject();
    }

    // Parse keywords and identifiers
    const identifier = this.parseIdentifier();

    if (identifier === 'true') return true;
    if (identifier === 'false') return false;
    if (identifier === 'null') return null;
    if (identifier === 'undefined') return null;

    if (identifier) {
      // Treat unquoted identifiers as strings (CSON feature)
      return identifier;
    }

    this.error(`Unexpected character: ${char}`);
  }

  private parseArray(): CsonValue[] {
    this.advance(); // consume '['
    const result: CsonValue[] = [];

    this.skipWhitespace();

    if (this.peek() === ']') {
      this.advance(); // consume ']'
      return result;
    }

    while (this.index < this.source.length) {
      result.push(this.parseValue());
      this.skipWhitespace();

      const char = this.peek();
      if (char === ']') {
        this.advance(); // consume ']'
        return result;
      } else if (char === ',') {
        this.advance(); // consume ','
        this.skipWhitespace();

        // Allow trailing comma
        if (this.peek() === ']') {
          this.advance();
          return result;
        }
      } else {
        // Check if we have a newline or whitespace that should act as separator
        this.skipWhitespace();

        if (this.peek() === ']') {
          this.advance();
          return result;
        } else if (this.index >= this.source.length) {
          // End of input without closing bracket
          break;
        }
        // Continue to next item if we still have content (newline separated)
      }
    }

    // If we reach here, we never found the closing bracket
    this.error(`Expected ']' to close array`);
  }

  private parseObjectKey(): string {
    this.skipWhitespace();

    const char = this.peek();
    if (char === '"' || char === "'") {
      return this.parseString();
    }

    // Parse unquoted key
    const identifier = this.parseIdentifier();
    if (!identifier) {
      this.error(`Expected object key`);
    }
    return identifier;
  }

  private parseObject(): {[key: string]: CsonValue} {
    let hasBraces = false;

    if (this.peek() === '{') {
      this.advance(); // consume '{'
      hasBraces = true;
    }

    const result: {[key: string]: CsonValue} = {};
    this.skipWhitespace();

    if (hasBraces && this.peek() === '}') {
      this.advance(); // consume '}'
      return result;
    }

    // For braceless objects, if we can't find a valid key, return empty object
    if (!hasBraces && this.index >= this.source.length) {
      return result;
    }

    // For braced objects, if we reach end of input without closing brace, error
    if (hasBraces && this.index >= this.source.length) {
      this.error(`Expected '}' to close object`);
    }

    while (this.index < this.source.length) {
      try {
        const key = this.parseObjectKey();
        this.skipWhitespace();

        if (this.peek() !== ':') {
          if (!hasBraces) {
            // For braceless objects, if no colon found, this might not be an object
            return result;
          }
          this.error(`Expected ':' after object key`);
        }
        this.advance(); // consume ':'

        const value = this.parseValue();
        result[key] = this.reviver.call(result, key, value);

        this.skipWhitespace();

        const char = this.peek();
        if (hasBraces && char === '}') {
          this.advance(); // consume '}'
          return result;
        } else if (!hasBraces && this.index >= this.source.length) {
          // End of input for braceless object
          return result;
        } else if (char === ',') {
          this.advance(); // consume ','
          this.skipWhitespace();

          // Allow trailing comma
          if (hasBraces && this.peek() === '}') {
            this.advance();
            return result;
          }
        } else {
          // Check if we should continue based on whitespace/newlines
          this.skipWhitespace();

          // After skipping whitespace, check for end conditions
          if (hasBraces && this.peek() === '}') {
            this.advance();
            return result;
          } else if (!hasBraces && this.index >= this.source.length) {
            return result;
            // Check if there's another key coming (for both braced and braceless objects)
          } else {
            const nextChar = this.peek();
            if (
              (nextChar >= 'a' && nextChar <= 'z') ||
              (nextChar >= 'A' && nextChar <= 'Z') ||
              nextChar === '_' ||
              nextChar === '$' ||
              nextChar === '"' ||
              nextChar === "'"
            ) {
              // Continue parsing another key-value pair
            } else if (!hasBraces) {
              // End of braceless object
              return result;
            } else if (hasBraces && this.index >= this.source.length) {
              // End of input without closing brace
              break;
            } else if (hasBraces) {
              // For braced objects, unknown character
              this.error(`Expected ',' or '}' in object`);
            }
          }
        }
      } catch (error) {
        if (!hasBraces) {
          // If we failed to parse in braceless mode, return empty result
          return result;
        }
        throw error;
      }
    }

    // If we have braces but never found closing brace
    if (hasBraces) {
      this.error(`Expected '}' to close object`);
    }

    return result;
  }

  private isObjectStart(): boolean {
    // Save current position
    const savedIndex = this.index;
    const savedLine = this.line;
    const savedColumn = this.column;

    try {
      // Skip whitespace first
      this.skipWhitespace();

      // Check if we're at end of input
      if (this.index >= this.source.length) {
        this.index = savedIndex;
        this.line = savedLine;
        this.column = savedColumn;
        return false;
      }

      // Try to parse an identifier followed by ':'
      const identifier = this.parseIdentifier();
      if (!identifier) {
        this.index = savedIndex;
        this.line = savedLine;
        this.column = savedColumn;
        return false;
      }

      this.skipWhitespace();
      const hasColon = this.peek() === ':';

      // Restore position
      this.index = savedIndex;
      this.line = savedLine;
      this.column = savedColumn;

      return hasColon;
    } catch {
      // Restore position
      this.index = savedIndex;
      this.line = savedLine;
      this.column = savedColumn;
      return false;
    }
  }

  public parse(): CsonValue {
    this.skipWhitespace();

    if (this.index >= this.source.length) {
      return null;
    }

    // Check if we're dealing with a top-level object without braces
    const char = this.peek();
    if (
      char !== '[' &&
      char !== '{' &&
      char !== '"' &&
      char !== "'" &&
      !(char >= '0' && char <= '9') &&
      char !== '-' &&
      this.isObjectStart()
    ) {
      // This is a braceless object
      const result = this.parseObject();
      this.skipWhitespace();

      if (this.index < this.source.length) {
        this.error(`Unexpected content after parsing`);
      }

      if (this.reviver === DEFAULT_REVIVER) {
        return result;
      }

      // Apply reviver to root object
      const contextObj: {'': CsonValue} = {'': result};
      return this.reviver.call(contextObj, '', result);
    }

    const result = this.parseValue();
    this.skipWhitespace();

    if (this.index < this.source.length) {
      this.error(`Unexpected content after parsing`);
    }

    if (this.reviver === DEFAULT_REVIVER) {
      return result;
    }

    // Apply reviver to root value
    const contextObj: {'': CsonValue} = {'': result};
    return this.reviver.call(contextObj, '', result);
  }
}

export function parse(source: string, reviver?: (key: string, value: any) => any): CsonValue {
  if (typeof reviver !== 'undefined' && typeof reviver !== 'function') {
    throw new TypeError('reviver has to be a function');
  }

  const parser = new CsonParser(source, {reviver});
  return parser.parse();
}
