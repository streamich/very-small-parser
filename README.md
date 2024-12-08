# `very-small-parser`

- JavaScript parser for Markdown, HTML, and inline CSS.
- [Tiny](https://cdn.jsdelivr.net/npm/very-small-parser/dist/module.js), just over 4KB.
- Runs in browser and Node.js.
- No dependencies.
- Markdown is parsed into [MDAST (Markdown Abstract Syntax Tree)](https://github.com/syntax-tree/mdast).
- HTML is parsed into [HAST (Hypertext Abstract Syntax Tree)](https://github.com/syntax-tree/hast).


## Usage

[__Live demo__](https://jsfiddle.net/yd5eL1cb/)

On the web you can simply import the module using a script tag.

Using ESM.sh:

```html
<script type="module">
  import { markdown } from '//esm.sh/very-small-parser';

  const ast = markdown.block.parse('Hello __world__!');
  console.log(ast);
</script>
```

Using jsDelivr:

```html
<script type="module">
  import { markdown } from '//esm.run/very-small-parser';

  const ast = markdown.block.parse('Hello __world__!');
  console.log(ast);
</script>
```

To use TypeScript types or import into a Node.js project, you can install the package from npm:

```sh
npm install very-small-parser
```


## Reference

### Markdown

Parse Markdown document (block elements):

```js
import { markdown } from 'very-small-parser';

const ast = markdown.block.parse('Hello __world__!');
```

Parse Markdown inline markup only:

```js
const ast = markdown.inline.parse('Hello __world__!');
```

Detect if text is likely to be a Markdown document:

```js
import { is } from 'very-small-parser/lib/markdown/is';

is('Hello __world__!');     // true
is('<b>Hello</b>!');        // false
```

Pretty-print MDAST back to text:

```js
import { markdown } from 'very-small-parser';
import { toText } from 'very-small-parser/lib/markdown/block/toText';

const ast = markdown.block.parse('Hello __world__!');
const text = toText(hast); // Hello __world__!
```


### HTML

Parse HTML to HAST (Hypertext Abstract Syntax Tree):

```js
import { html } from 'very-small-parser';

const ast = html.parse('<b>Hello</b> <i>world</i>!');
```

Pretty-print HAST to HTML:

```js
import { html } from 'very-small-parser';
import { toText } from 'very-small-parser/lib/html/toText';

const hast = html.parse('<b>Hello</b> <i>world</i>!');
const html = toText(hast); // '<b>Hello</b> <i>world</i>!'
```

Specify tabulation size for indentation when pretty-printing:

```js
import { html } from 'very-small-parser';
import { toText } from 'very-small-parser/lib/html/toText';

const tab = '  ';
const hast = html.parse('<div><b>Hello</b><i>world</i>!</div>', tab);
const html = toText(hast);
// <div>
//   <b>Hello</b>
//   <i>world</i>
//   !
// </div>
```
