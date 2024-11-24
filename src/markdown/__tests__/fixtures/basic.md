# md-mdast

[![](https://img.shields.io/bundlephobia/minzip/md-mdast.svg)](https://bundlephobia.com/result?p=md-mdast@1.0.1)

Markdown-to-MDAST converter. Small and fast.

## Installation

```shell
npm install md-mdast
```

## Usage

```js
const {create} = require('md-mdast');

const parser = create();

console.log(parser.tokenizeBlock('hello world'));
console.log(parser.tokenizeInline('hello world'));
```

## License

[Unlicense](http://unlicense.org/) &mdash; public domain.
