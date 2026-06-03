import {block} from '../..';

const parsef = (src: string) => block.parsef(src);

describe('reference resolution', () => {
  describe('unresolved references become text', () => {
    test('[bracketed] word with no definition', () => {
      const ast = parsef('A [bracketed] word.');
      const para = ast.children[0] as any;
      const refs = para.children.filter((n: any) => n.type === 'linkReference');
      expect(refs).toHaveLength(0);
      const texts = para.children.filter((n: any) => n.type === 'text');
      const combined = texts.map((t: any) => t.value).join('');
      expect(combined).toContain('[bracketed]');
    });

    test('T[] with no definition', () => {
      const ast = parsef('An array T[] here.');
      const para = ast.children[0] as any;
      const refs = para.children.filter((n: any) => n.type === 'linkReference');
      expect(refs).toHaveLength(0);
    });

    test('[1] with no definition', () => {
      const ast = parsef('See [1] for details.');
      const para = ast.children[0] as any;
      const refs = para.children.filter((n: any) => n.type === 'linkReference');
      expect(refs).toHaveLength(0);
    });

    test('[Text][missing] with no definition', () => {
      const ast = parsef('[Text][missing] link.');
      const para = ast.children[0] as any;
      const refs = para.children.filter((n: any) => n.type === 'linkReference');
      expect(refs).toHaveLength(0);
      const texts = para.children.filter((n: any) => n.type === 'text');
      const combined = texts.map((t: any) => t.value).join('');
      expect(combined).toContain('[Text][missing]');
    });

    test('![alt][missing] with no definition', () => {
      const ast = parsef('![alt][missing] image.');
      const para = ast.children[0] as any;
      const refs = para.children.filter((n: any) => n.type === 'imageReference');
      expect(refs).toHaveLength(0);
      const texts = para.children.filter((n: any) => n.type === 'text');
      const combined = texts.map((t: any) => t.value).join('');
      expect(combined).toContain('![alt][missing]');
    });
  });

  describe('resolved references remain linkReference/imageReference', () => {
    test('[text][ok] with matching definition', () => {
      const ast = parsef('[text][ok]\n\n[ok]: /url "title"');
      const para = ast.children[0] as any;
      const refs = para.children.filter((n: any) => n.type === 'linkReference');
      expect(refs).toHaveLength(1);
      expect(refs[0].identifier).toBe('ok');
      expect(refs[0].referenceType).toBe('full');
    });

    test('[ok][] collapsed with matching definition', () => {
      const ast = parsef('[ok][]\n\n[ok]: /url');
      const para = ast.children[0] as any;
      const refs = para.children.filter((n: any) => n.type === 'linkReference');
      expect(refs).toHaveLength(1);
      expect(refs[0].identifier).toBe('ok');
      expect(refs[0].referenceType).toBe('collapsed');
    });

    test('[ok] shortcut with matching definition', () => {
      const ast = parsef('[ok]\n\n[ok]: /url');
      const para = ast.children[0] as any;
      const refs = para.children.filter((n: any) => n.type === 'linkReference');
      expect(refs).toHaveLength(1);
      expect(refs[0].identifier).toBe('ok');
      expect(refs[0].referenceType).toBe('shortcut');
    });

    test('![alt][ok] with matching definition', () => {
      const ast = parsef('![alt][ok]\n\n[ok]: /url');
      const para = ast.children[0] as any;
      const refs = para.children.filter((n: any) => n.type === 'imageReference');
      expect(refs).toHaveLength(1);
      expect(refs[0].identifier).toBe('ok');
    });

    test('case-insensitive matching', () => {
      const ast = parsef('[text][OK]\n\n[ok]: /url');
      const para = ast.children[0] as any;
      const refs = para.children.filter((n: any) => n.type === 'linkReference');
      expect(refs).toHaveLength(1);
    });
  });
});
