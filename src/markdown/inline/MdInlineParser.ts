import {Parser} from '../../Parser';
import {token} from '../../util';
import type {IParser, TTokenizer} from '../../types';
import type {IInlineAttr, IText, TInlineToken} from './types';

export interface MdInlineParserOpts<T extends TInlineToken> {
  parsers: TTokenizer<T, MdInlineParser<T>>[];
}

export class MdInlineParser<T extends TInlineToken = TInlineToken> extends Parser<T> implements IParser<T> {
  // biome-ignore lint: keep constructor for typing
  constructor(opts: MdInlineParserOpts<T>) {
    super(opts);
  }

  public parse(src: string): T[] {
    const raw = super.parse(src);
    // Combined pass: merge adjacent text tokens AND attach inline attributes.
    // An inlineAttr token {args, value} directly after a non-text inline token
    // has its args attached to that token. Otherwise it is folded into text.
    const result: T[] = [];
    let pendingText: IText | undefined;
    const flushText = () => {
      if (pendingText) {
        result.push(pendingText as unknown as T);
        pendingText = undefined;
      }
    };
    const appendText = (str: string, len: number) => {
      if (pendingText) {
        pendingText.value += str;
        pendingText.len! += len;
      } else {
        pendingText = token<IText>(str, 'text' as IText['type'], void 0, {value: str} as any, len) as unknown as IText;
      }
    };
    const length = raw.length;
    for (let i = 0; i < length; i++) {
      const tok = raw[i];
      if (tok.type === 'text') {
        const t = tok as unknown as IText;
        if (pendingText) {
          pendingText.value += t.value;
          pendingText.len! += tok.len!;
        } else {
          pendingText = {...t} as IText;
        }
      } else if (tok.type === 'inlineAttr') {
        const attr = tok as unknown as IInlineAttr;
        const last = result[result.length - 1];
        if (!pendingText && last && last.type !== 'text') {
          (last as any).args = (last as any).args ? [...(last as any).args, ...attr.args] : [...attr.args];
        } else {
          appendText(attr.value, tok.len!);
        }
      } else {
        flushText();
        result.push(tok);
      }
    }
    flushText();
    return result;
  }
}
