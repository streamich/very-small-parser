export const testCases: [html: string, markdown: string, name?: string][] = [
  ['<p><code>hello world</code></p>', '`hello world`'],
  ['<p><pre><code>hello world</code></pre></p>', '`hello world`'],
  ['<p><pre>hello world</pre></p>', '`hello world`'],
  ['<p><code><strong>hello</strong> <span>world</span></code></p>', '`hello world`'],
  ['<b>hello world</b>', '__hello world__'],
  ['<b foo="bar">hello world</b>', '__hello world__'],
  ['<strong>hello world</strong>', '__hello world__'],
  ['<i>hello world</i>', '_hello world_'],
  ['<em>hello world</em>', '_hello world_'],
  ['<del>hello world</del>', '~~hello world~~'],
  ['<del>hello <strong>world</strong></del>', '~~hello __world__~~'],
  ['<spoiler>hello world</spoiler>', '||hello world||'],
];
