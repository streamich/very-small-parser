## Why?

### Lint Your Package to Strict ES2018 Spec

```
$ standard-pkg --dist lib/
  » Linting lib/...
  ⚠️ [lib/index.js 2:0] Imported file does not exist.
                        Missing file extension for import "./some/import".
  ✘  1 issues found.
```

### Publish Modern JavaScript With Your Package

```json
{
    "scripts": {"build": "standard-pkg --src src/ --lib lib/"},
    "esnext": "lib/index.js"
}
```

### Use Existing Tools with Experimental Language Features

Builds to a standard language target for other tooling to consume (or to publish directly with your package). Especially useful if you're using TypeScript or experimental language features that your tooling may not support.

## Exceptions

While we try to match the ES2018 spec as strictly as possible, the following exceptions are required to support some common usecases where no other workaround exists:

1.  Supports bare module specifiers: This is the npm standard, and modern tooling like bundlers support it.
1.  Supports dynamic `import()`: This is a [stage 3 proposal](https://github.com/tc39/proposal-dynamic-import) which allows dynamically importing modules.
1.  Supports `import.meta.url`: This is a [stage 3 proposal](https://github.com/tc39/proposal-import-meta) which allows modules to read their location (filepath or URL).
