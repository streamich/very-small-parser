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
  import { markdown } from "//esm.sh/very-small-parser";

  const ast = markdown.block.parse('Hello __world__!');
  console.log(ast);
</script>
```

Using jsDelivr:

```html
<script type="module">
  import { markdown } from "//esm.run/very-small-parser";

  const ast = markdown.block.parse('Hello __world__!');
  console.log(ast);
</script>
```

To use TypeScript types or import into a Node.js project, you can install the package from npm:

```sh
npm install very-small-parser
```


## Reference

Parse Markdown document (block elements):

```js
import { markdown } from "very-small-parser";

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

Parse HTML:

```js
import { html } from "very-small-parser";

const ast = html.parse('<b>Hello</b> <i>world</i>!');
```
