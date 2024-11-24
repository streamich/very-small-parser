export const parseDecls = (src: string): Record<string, string> => {
  const declarations: Record<string, string> = {};
  const decls = src.split(';');
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
