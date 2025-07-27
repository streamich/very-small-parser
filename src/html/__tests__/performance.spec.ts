import {parse, parsef} from './setup';

describe('HTML parser performance and security tests', () => {
  describe('Performance with large inputs', () => {
    test('handles large HTML document efficiently', () => {
      const largeContent = 'This is repeated content. '.repeat(1000);
      const largeHtml = `<div>${largeContent}</div>`;
      
      const startTime = performance.now();
      const ast = parse(largeHtml);
      const endTime = performance.now();
      
      expect(ast).toHaveLength(1);
      expect(ast[0]).toMatchObject({
        type: 'element',
        tagName: 'div',
      });
      
      // Should complete in reasonable time (less than 100ms for this size)
      expect(endTime - startTime).toBeLessThan(100);
    });

    test('handles deeply nested elements efficiently', () => {
      let deepHtml = 'content';
      for (let i = 0; i < 100; i++) {
        deepHtml = `<div>${deepHtml}</div>`;
      }
      
      const startTime = performance.now();
      const ast = parse(deepHtml);
      const endTime = performance.now();
      
      expect(ast).toHaveLength(1);
      expect(ast[0]).toMatchObject({
        type: 'element',
        tagName: 'div',
      });
      
      // Should complete in reasonable time
      expect(endTime - startTime).toBeLessThan(200);
    });

    test('handles many sibling elements efficiently', () => {
      const manyElements = Array.from({length: 500}, (_, i) => `<span>item ${i}</span>`).join('');
      
      const startTime = performance.now();
      const ast = parse(manyElements);
      const endTime = performance.now();
      
      expect(ast).toHaveLength(500);
      expect(ast[0]).toMatchObject({
        type: 'element',
        tagName: 'span',
      });
      
      // Should complete in reasonable time
      expect(endTime - startTime).toBeLessThan(150);
    });
  });

  describe('Security considerations', () => {
    test('handles potential XSS patterns safely', () => {
      const xssAttempts = [
        '<script>alert("xss")</script>',
        '<img src="x" onerror="alert(1)">',
        '<div onclick="alert(1)">click me</div>',
        '<iframe src="javascript:alert(1)"></iframe>',
      ];

      for (const html of xssAttempts) {
        const ast = parse(html);
        expect(ast).toBeDefined();
        // Parser should handle these without crashing
        expect(ast.length).toBeGreaterThan(0);
      }
    });

    test('handles malformed script tags safely', () => {
      const malformedScripts = [
        '<script>',
        '<script><script>',
        '</script><script>',
        '<script>var x = "</script>alert(1);"</script>',
      ];

      for (const html of malformedScripts) {
        const ast = parse(html);
        expect(ast).toBeDefined();
        // Should not crash on malformed script tags
      }
    });

    test('handles extremely long attribute values', () => {
      const longValue = 'a'.repeat(10000);
      const html = `<div data-long="${longValue}">content</div>`;
      
      const ast = parse(html);
      expect(ast).toHaveLength(1);
      expect(ast[0]).toMatchObject({
        type: 'element',
        tagName: 'div',
      });
    });

    test('handles many attributes gracefully', () => {
      const manyAttrs = Array.from({length: 100}, (_, i) => `attr${i}="value${i}"`).join(' ');
      const html = `<div ${manyAttrs}>content</div>`;
      
      const ast = parse(html);
      expect(ast).toHaveLength(1);
      expect(ast[0]).toMatchObject({
        type: 'element',
        tagName: 'div',
      });
      
      const element = ast[0] as any;
      expect(Object.keys(element.properties || {}).length).toBe(100);
    });
  });

  describe('Edge cases and robustness', () => {
    test('handles empty input', () => {
      const ast = parse('');
      expect(ast).toEqual([]);
    });

    test('handles whitespace-only input', () => {
      const ast = parse('   \n\t  ');
      expect(ast).toHaveLength(1);
      expect(ast[0]).toMatchObject({
        type: 'text',
        value: '   \n\t  ',
      });
    });

    test('handles null characters', () => {
      const ast = parse('text\0null');
      expect(ast).toHaveLength(1);
      expect(ast[0]).toMatchObject({
        type: 'text',
        value: 'text\0null',
      });
    });

    test('handles unicode content', () => {
      const unicodeContent = '🚀 Hello 世界 👋 café naïve résumé';
      const ast = parse(`<div>${unicodeContent}</div>`);
      
      expect(ast).toHaveLength(1);
      expect(ast[0]).toMatchObject({
        type: 'element',
        tagName: 'div',
        children: [{type: 'text', value: unicodeContent}],
      });
    });

    test('handles mixed line endings', () => {
      const mixedContent = 'line1\nline2\r\nline3\r';
      const ast = parse(`<pre>${mixedContent}</pre>`);
      
      expect(ast).toHaveLength(1);
      expect(ast[0]).toMatchObject({
        type: 'element',
        tagName: 'pre',
        children: [{type: 'text', value: mixedContent}],
      });
    });

    test('handles consecutive angle brackets', () => {
      const weirdContent = '<<>><<<>>>>';
      const ast = parse(weirdContent);
      
      // Should handle this gracefully without crashing
      expect(ast).toBeDefined();
      expect(ast.length).toBeGreaterThan(0);
    });

    test('handles incomplete comment tags', () => {
      const incompleteComments = [
        '<!--',
        '<!-- incomplete',
        '-->',
        '<!-->',
        '<!---',
      ];

      for (const html of incompleteComments) {
        const ast = parse(html);
        expect(ast).toBeDefined();
        // Should handle gracefully
      }
    });

    test('handles attributes with special characters', () => {
      const specialAttrs = [
        '<div title="simple &amp; escaped">content</div>',
        '<div data-info="value with spaces">content</div>',
        '<div class="multi-class another-class">content</div>',
      ];

      for (const html of specialAttrs) {
        const ast = parse(html);
        expect(ast.length).toBeGreaterThanOrEqual(1);
        // Check that we get at least some content parsed
        const hasElement = ast.some(node => node.type === 'element');
        expect(hasElement).toBe(true);
      }
    });

    test('DOCTYPE variations', () => {
      const doctypes = [
        '<!DOCTYPE html>',
        '<!doctype html>',
        '<!Doctype HTML>',
        '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN">',
        '<!DOCTYPE html SYSTEM "about:legacy-compat">',
      ];

      for (const doctype of doctypes) {
        const ast = parse(doctype);
        expect(ast).toHaveLength(1);
        expect(ast[0]).toMatchObject({
          type: 'doctype',
        });
      }
    });

    test('real-world clipboard content', () => {
      // Test various clipboard content patterns that might break simple parsers
      const clipboardSamples = [
        // Google Docs style
        '<meta charset="utf-8"><b style="font-weight:normal;"><span>text</span></b>',
        // Rich text editors
        '<div><p><strong>Bold</strong> and <em>italic</em> text.</p></div>',
        // Microsoft Word style
        '<p class="MsoNormal"><span style="font-family:Arial">Content</span></p>',
        // Email client style
        '<div dir="ltr">Email content with <a href="http://example.com">link</a></div>',
      ];

      for (const html of clipboardSamples) {
        const ast = parse(html);
        expect(ast).toBeDefined();
        expect(ast.length).toBeGreaterThan(0);
      }
    });
  });
});