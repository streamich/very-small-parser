import {Parser, type ParserOpts} from '../../Parser';
import type {IParser, IToken, TTokenizer} from '../../types';
import type {MdInlineParser} from '../inline/MdInlineParser';
import type {IText, TInlineToken} from '../inline/types';
import type {IBlockAttr, IRoot, TBlockToken} from './types';

export interface MdBlockParserOpts<T extends TBlockToken> extends ParserOpts<T, MdBlockParser<T>> {
  parsers: TTokenizer<T, MdBlockParser<T>>[];
  inline: MdInlineParser;
}

export class MdBlockParser<T extends TBlockToken> extends Parser<T> implements IParser<T> {
  public readonly inline: MdInlineParser;

  constructor(opts: MdBlockParserOpts<T>) {
    super(opts as any);
    this.inline = opts.inline;
  }

  public parse(src: string): T[] {
    const tokens = super.parse(src);
    return this.applyBlockAttrs(tokens);
  }

  private applyBlockAttrs(tokens: T[]): T[] {
    const result: T[] = [];
    let pendingArgs: string[] = [];
    for (const tok of tokens) {
      if (tok.type === 'blockAttr') {
        const ba = tok as unknown as IBlockAttr;
        if ((ba as any)._blankLine) {
          // Blank line after this attr line — discard accumulated attrs
          pendingArgs = [];
        } else {
          pendingArgs.push(...ba.args);
        }
      } else if (tok.type === '') {
        // blank line clears pending attrs — they must directly precede the block
        pendingArgs = [];
        result.push(tok);
      } else {
        if (pendingArgs.length > 0) {
          (tok as any).args = pendingArgs;
          pendingArgs = [];
        }
        result.push(tok);
      }
    }
    return result;
  }

  public parsef(src: string): IRoot {
    const tokens = this.parse(src) as TBlockToken[];
    const token: IRoot = {
      type: 'root',
      children: tokens,
      len: src.length,
    };
    // Merge adjacent "list" tokens.
    const length = tokens.length;
    for (let i = 0; i < length - 1; i++) {
      const tok1 = tokens[i];
      if (tok1?.type === 'list') {
        const tok2 = tokens[i + 1];
        if (tok2?.type === 'list') {
          tok1.spread = true;
          tok1.children.push(...tok2.children);
          tokens.splice(i + 1, 1);
          i--;
        }
      }
    }
    // Resolve link/image references against collected definitions.
    this.resolveReferences(token);
    return token;
  }

  private resolveReferences(root: IRoot): void {
    // Collect all definition identifiers.
    const defs = new Set<string>();
    const collectDefs = (node: IToken): void => {
      if (node.type === 'definition') defs.add((node as any).identifier);
      if (node.children) for (const child of node.children) collectDefs(child);
    };
    collectDefs(root);
    // Walk inline children and replace unresolved references with text.
    const resolveInline = (children: IToken[]): void => {
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.type === 'linkReference' || child.type === 'imageReference') {
          const id = (child as any).identifier as string;
          if (!defs.has(id?.toLowerCase?.() ?? id)) {
            const raw = child.raw || this.refToText(child);
            const text: IText = {type: 'text', value: raw, len: child.len};
            children[i] = text;
            continue;
          }
        }
        if (child.children) resolveInline(child.children as IToken[]);
      }
    };
    const walk = (node: IToken): void => {
      if (node.children) {
        resolveInline(node.children as IToken[]);
        for (const child of node.children) walk(child);
      }
    };
    walk(root);
  }

  private refToText(node: IToken): string {
    const ref = node as any;
    const isImage = node.type === 'imageReference';
    const start = isImage ? '![' : '[';
    const identifier: string = ref.identifier || '';
    const referenceType: string = ref.referenceType || 'shortcut';
    const content = isImage ? (ref.alt || '') : this.inlineChildrenToText(node.children);
    switch (referenceType) {
      case 'full':
        return start + content + '][' + identifier + ']';
      case 'collapsed':
        return start + identifier + '][]';
      default:
        return start + identifier + ']';
    }
  }

  private inlineChildrenToText(children?: IToken[]): string {
    if (!children) return '';
    let result = '';
    for (const child of children) {
      if (child.raw) result += child.raw;
      else if ((child as any).value) result += (child as any).value;
      else if (child.children) result += this.inlineChildrenToText(child.children);
    }
    return result;
  }

  public parsei(src: string): TInlineToken[] {
    return this.inline.parse(src);
  }
}
