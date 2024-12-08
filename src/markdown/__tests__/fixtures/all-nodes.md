# Heading 1

This is paragraph. Some ==mark== inline highlighting, or ~~strike~~. There is also a footnote[^1]. ||Spoiler||. :smile: :+1: :tada: :rocket: :metal:

We also support three types of handles: @user, #123, and ~tilde. ++underline++ and ==highlight==.

[^1]: This is a footnote.

## Heading 2

Inline _emphasis_ and __strong__. There is also `code`. And [link](https://example.com). Links can also have a title [link with title](https://example.com "title").

Link can be reference [link][1].

[1]: https://example.com

And the reference can have a title [link with title][2].

[2]: https://example.com "title"

There are also images: ![image](https://example.com/image.png). Images can also have a title ![image with title](https://example.com/image.png "title").

---

### Heading 3

This is code:

```
const foo =
  'bar';
```

But, this is inline `code`.

We also support inline HTML <i>tags</i>. And block-level HTML:

<div>
  <p>This is a paragraph.</p>
</div>

#### Heading 4

And this is code with language:

```js
const foo = 'bar';
```

One less known features is code with metadata:

```rust {foo: 'bar'}
fn main() {
    println!("Hello, world!");
}
```

A cool block type is math:

$$
\begin{align*}
\dot{x} & = \sigma(y-x) \\
\dot{y} & = \rho x - y - xz \\
\dot{z} & = -\beta z + xy
\end{align*}
$$

One can also do inline math: $e^{i\pi} + 1 = 0$. Or just use ^superscript^ and ~subscript~.

And, of course, tables:

| Left  | Center | Right | None  |
|:------|:------:|------:|-------|
| foo   |   bar  |   baz | qux   |
| foo 1 |  bar 2 | baz 3 | qux 4 |

##### Heading 5

One can also have blockquotes:

> This is a blockquote.

The blockquote can also have multiple paragraphs:

> This is a blockquote.
> 
> This is another paragraph in the blockquote.

Blockquotes can also have nested blockquotes and other content:

> This is a blockquote.
> 
> > This is a nested blockquote.
> 
> This is another paragraph in the blockquote.
> 
> - This is a list in the blockquote.

###### Heading 6

Lists are complicated. The simplest list is a single unordered list item:

- Item 1

Lists can have multiple items:

- Item 1
- Item 2

Lists can have nested items:

- Item 1
  - Item 1.1
  - Item 1.2
- Item 2
- Item 3
  - Item 3.1
    - Item 3.1.1

Lists can have multiple paragraphs:

- Item 1
  
  This is a paragraph in the list item.
  
  This is another paragraph in the list item.

Lists can also be sorted:

1. Item 1
1. Item 2
1. Item 3

And sorted list numbering can start from any number:

5. Item 1
5. Item 2

It is also possible to create a todo list:

- [ ] Item 1
- [x] Item 2
- [ ] Item 3
