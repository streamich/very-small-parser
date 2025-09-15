export const parseDecls = (src: string): Record<string, string> => {
  const declarations: Record<string, string> = {};
  const decls: string[] = [];
  let current = '';
  let inQuotes = false;
  let quoteChar = '';
  
  // Split on semicolons while respecting quoted strings
  for (let i = 0; i < src.length; i++) {
    const char = src[i];
    if (!inQuotes && (char === '"' || char === "'")) {
      inQuotes = true;
      quoteChar = char;
      current += char;
    } else if (inQuotes && char === quoteChar) {
      inQuotes = false;
      quoteChar = '';
      current += char;
    } else if (!inQuotes && char === ';') {
      decls.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last declaration if it exists
  if (current.trim()) {
    decls.push(current);
  }
  
  // Parse each declaration
  const length = decls.length;
  for (let i = 0; i < length; i++) {
    const decl = decls[i];
    const index = decl.indexOf(':');
    if (index === -1) continue;
    const key = decl.slice(0, index).trim();
    const value = decl.slice(index + 1).trim();
    if (key && value) declarations[key] = value;
  }
  return declarations;
};

export const removeComments = (css: string): string => {
  let result = '';
  let inComment = false;
  let inQuotes = false;
  let quoteChar = '';
  
  for (let i = 0; i < css.length; i++) {
    const char = css[i];
    const nextChar = css[i + 1];
    
    if (!inComment && !inQuotes && char === '/' && nextChar === '*') {
      inComment = true;
      i++; // Skip next char
      continue;
    }
    
    if (inComment && char === '*' && nextChar === '/') {
      inComment = false;
      i++; // Skip next char
      continue;
    }
    
    if (!inComment) {
      if (!inQuotes && (char === '"' || char === "'")) {
        inQuotes = true;
        quoteChar = char;
      } else if (inQuotes && char === quoteChar) {
        inQuotes = false;
        quoteChar = '';
      }
      
      if (!inComment) {
        result += char;
      }
    }
  }
  
  return result;
};

export interface CSSRule {
  selector: string;
  declarations: Record<string, string>;
}

export const parseRule = (rule: string): CSSRule | null => {
  const trimmed = rule.trim();
  if (!trimmed) return null;
  
  const braceIndex = trimmed.indexOf('{');
  if (braceIndex === -1) return null;
  
  const lastBraceIndex = trimmed.lastIndexOf('}');
  if (lastBraceIndex === -1 || lastBraceIndex <= braceIndex) return null;
  
  const selector = trimmed.slice(0, braceIndex).trim();
  const declarationsText = trimmed.slice(braceIndex + 1, lastBraceIndex).trim();
  
  if (!selector) return null;
  
  return {
    selector,
    declarations: parseDecls(declarationsText)
  };
};

export const parseCSS = (css: string): CSSRule[] => {
  const cleanCSS = removeComments(css);
  const rules: CSSRule[] = [];
  let current = '';
  let braceDepth = 0;
  let inQuotes = false;
  let quoteChar = '';
  
  for (let i = 0; i < cleanCSS.length; i++) {
    const char = cleanCSS[i];
    
    if (!inQuotes && (char === '"' || char === "'")) {
      inQuotes = true;
      quoteChar = char;
    } else if (inQuotes && char === quoteChar) {
      inQuotes = false;
      quoteChar = '';
    }
    
    if (!inQuotes) {
      if (char === '{') {
        braceDepth++;
      } else if (char === '}') {
        braceDepth--;
        if (braceDepth === 0) {
          current += char;
          const rule = parseRule(current);
          if (rule) rules.push(rule);
          current = '';
          continue;
        }
      }
    }
    
    current += char;
  }
  
  return rules;
};

export const parseColor = (color: string): { r: number; g: number; b: number; a?: number } | null => {
  const c = color.trim().toLowerCase();
  
  // Hex colors
  if (c[0] === '#') {
    const hex = c.slice(1);
    if (hex.length === 3) {
      // Validate hex characters
      if (!/^[0-9a-f]{3}$/i.test(hex)) return null;
      return {
        r: Number.parseInt(hex[0] + hex[0], 16),
        g: Number.parseInt(hex[1] + hex[1], 16),
        b: Number.parseInt(hex[2] + hex[2], 16)
      };
    } else if (hex.length === 6) {
      // Validate hex characters
      if (!/^[0-9a-f]{6}$/i.test(hex)) return null;
      return {
        r: Number.parseInt(hex.slice(0, 2), 16),
        g: Number.parseInt(hex.slice(2, 4), 16),
        b: Number.parseInt(hex.slice(4, 6), 16)
      };
    }
  }
  
  // RGB/RGBA colors
  const rgbMatch = c.match(/rgba?\(([^)]+)\)/);
  if (rgbMatch) {
    const values = rgbMatch[1].split(',').map(v => Number.parseFloat(v.trim()));
    if (values.length >= 3 && values.slice(0, 3).every(v => !Number.isNaN(v))) {
      const result = { r: values[0], g: values[1], b: values[2] };
      if (values.length > 3 && !Number.isNaN(values[3])) (result as any).a = values[3];
      return result;
    }
  }
  
  // Named colors (basic set)
  const namedColors: Record<string, [number, number, number]> = {
    red: [255, 0, 0],
    green: [0, 128, 0],
    blue: [0, 0, 255],
    white: [255, 255, 255],
    black: [0, 0, 0],
    transparent: [0, 0, 0]
  };
  
  if (namedColors[c]) {
    const [r, g, b] = namedColors[c];
    const result = { r, g, b };
    if (c === 'transparent') (result as any).a = 0;
    return result;
  }
  
  return null;
};
