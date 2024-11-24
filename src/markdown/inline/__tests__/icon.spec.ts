import {parse} from './setup';

describe('icon parser', () => {
  test('returns icon token', () => {
    const ast = parse(':smile:');
    expect(ast[0]).toMatchObject({
      type: 'icon',
      emoji: 'smile',
    });
  });

  test('allows double colon', () => {
    const ast = parse('::smile::');
    expect(ast[0]).toMatchObject({
      type: 'icon',
      emoji: 'smile',
    });
  });

  test('allows underscore', () => {
    const ast = parse('::crossed_fingers::');
    expect(ast[0]).toMatchObject({
      type: 'icon',
      emoji: 'crossed_fingers',
    });
  });

  test('allows hyphens', () => {
    const ast = parse('::crossed-fingers::');
    expect(ast[0]).toMatchObject({
      type: 'icon',
      emoji: 'crossed-fingers',
    });
  });

  test('does not allow spaces', () => {
    const ast = parse(': space:');
    expect(ast[0]).not.toMatchObject({
      type: 'icon',
    });
  });
});
