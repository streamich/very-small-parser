export interface IToken {
  type: string;
  len?: number;
  raw?: string;
  children?: IToken[];
  value?: string;
}

export type TNullableToken<T extends IToken> = T | undefined | null;
export type TChildrenToken<T extends IToken> = TNullableToken<T> | T[];

export type TTokenizer<T extends IToken = IToken, P extends IParser<any> = IParser<any>> = (
  parser: P,
  value: string,
) => TNullableToken<T>;

export interface IParser<T extends IToken> {
  parse(value: string): T[];
}
