import {create} from '../index';

describe('Fenced code block', () => {
  it('simple, one line, no language', () => {
    const parser = create();
    const ast = parser.tokenizeBlock('```\ngit status\n```');

    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'code',
          value: 'git status',
          lang: '',
        },
      ],
    });
  });

  it('multi-line, no language', () => {
    const parser = create();
    const ast = parser.tokenizeBlock('```\n$ git status\n    Loading...\n```');

    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'code',
          value: '$ git status\n    Loading...',
          lang: '',
        },
      ],
    });
  });

  it('multi-line, with language', () => {
    const parser = create();
    const ast = parser.tokenizeBlock('```js\n$ git status\n    Loading...\n```');

    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'code',
          value: '$ git status\n    Loading...',
          lang: 'js',
        },
      ],
    });
  });

  it('multi-line, with language and meta', () => {
    const parser = create();
    const ast = parser.tokenizeBlock('```js {foo: "bar"}\n$ git status\n    Loading...\n```');

    expect(ast).toMatchObject({
      type: 'root',
      children: [
        {
          type: 'code',
          value: '$ git status\n    Loading...',
          lang: 'js',
          meta: '{foo: "bar"}',
        },
      ],
    });
  });
});
