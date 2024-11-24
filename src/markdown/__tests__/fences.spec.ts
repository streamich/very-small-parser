import {parse} from './setup';

describe('Fenced code block', () => {
  it('simple, one line, no language', () => {
    const ast = parse('```\ngit status\n```');
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
    const ast = parse('```\n$ git status\n    Loading...\n```');
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
    const ast = parse('```js\n$ git status\n    Loading...\n```');
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
    const ast = parse('```js {foo: "bar"}\n$ git status\n    Loading...\n```');
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
