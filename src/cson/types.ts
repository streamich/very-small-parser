export interface CsonParseOptions {
  reviver?: (key: string, value: any) => any;
}

export type CsonValue = null | boolean | number | string | CsonValue[] | {[key: string]: CsonValue};

export class CsonSyntaxError extends SyntaxError {
  public line: number;
  public column: number;

  constructor(message: string, line: number, column: number) {
    super(`Syntax error on line ${line}, column ${column}: ${message}`);
    this.name = 'CsonSyntaxError';
    this.line = line;
    this.column = column;
  }
}
