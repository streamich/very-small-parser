import icon from '../icon';
import {token} from '../../createParser';

const tokenizer = icon(32);

const runTokenizer = (tk: any, value: any) => {
  const eat = (subvalue: any, type: any, children: any, overrides: any) => token(subvalue, type, children, overrides);

  return tk.call({}, eat, value);
};

describe('icon tokenizer', () => {
  test('exists', () => {
    expect(typeof icon).toBe('function');
    expect(typeof icon(32)).toBe('function');
  });

  test('returns undefined if not icon', () => {
    const tok = runTokenizer(tokenizer, 'adsf');

    expect(tok).toBe(undefined);
  });

  test('returns icon token', () => {
    const tok = runTokenizer(tokenizer, ':smile:');

    expect(typeof tok).toBe('object');
    expect(tok).toMatchObject({
      type: 'icon',
      emoji: 'smile',
    });
  });

  /*
    test('allows double colon', () => {
        const token = Icon('::smile::', 0, {} as any);

        expect(typeof token).toBe('object');
        expect(token).toMatchObject({
            type: 'Icon',
            children: 'smile',
        });
    });
    */

  test('allows underscore', () => {
    const tok = runTokenizer(tokenizer, ':crossed_fingers:');

    expect(typeof tok).toBe('object');
    expect(tok).toMatchObject({
      type: 'icon',
      emoji: 'crossed_fingers',
    });
  });

  test('does not allow spaces', () => {
    const tok = runTokenizer(tokenizer, ': space:');

    expect(typeof tok).toBe('undefined');
  });

  test('does allow hyphens', () => {
    const tok = runTokenizer(tokenizer, ':crossed-fingers:');

    expect(typeof tok).toBe('object');
    expect(tok).toMatchObject({
      type: 'icon',
      emoji: 'crossed-fingers',
    });
  });
});
