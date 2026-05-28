import {parseColor} from '..';

describe('parseColor', () => {
  describe('hex colors', () => {
    test('parses 3-digit hex', () => {
      expect(parseColor('#f00')).toEqual({ r: 255, g: 0, b: 0 });
      expect(parseColor('#0f0')).toEqual({ r: 0, g: 255, b: 0 });
      expect(parseColor('#00f')).toEqual({ r: 0, g: 0, b: 255 });
      expect(parseColor('#abc')).toEqual({ r: 170, g: 187, b: 204 });
    });

    test('parses 6-digit hex', () => {
      expect(parseColor('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(parseColor('#00ff00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(parseColor('#0000ff')).toEqual({ r: 0, g: 0, b: 255 });
      expect(parseColor('#abcdef')).toEqual({ r: 171, g: 205, b: 239 });
    });

    test('handles uppercase hex', () => {
      expect(parseColor('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(parseColor('#ABCDEF')).toEqual({ r: 171, g: 205, b: 239 });
    });

    test('returns null for invalid hex', () => {
      expect(parseColor('#gg0000')).toBeNull();
      expect(parseColor('#12')).toBeNull();
      expect(parseColor('#1234567')).toBeNull();
    });
  });

  describe('rgb/rgba colors', () => {
    test('parses rgb', () => {
      expect(parseColor('rgb(255, 0, 0)')).toEqual({ r: 255, g: 0, b: 0 });
      expect(parseColor('rgb(0, 255, 0)')).toEqual({ r: 0, g: 255, b: 0 });
      expect(parseColor('rgb(128, 64, 192)')).toEqual({ r: 128, g: 64, b: 192 });
    });

    test('parses rgba', () => {
      expect(parseColor('rgba(255, 0, 0, 1)')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
      expect(parseColor('rgba(0, 255, 0, 0.5)')).toEqual({ r: 0, g: 255, b: 0, a: 0.5 });
      expect(parseColor('rgba(128, 64, 192, 0.7)')).toEqual({ r: 128, g: 64, b: 192, a: 0.7 });
    });

    test('handles whitespace', () => {
      expect(parseColor('rgb( 255 , 0 , 0 )')).toEqual({ r: 255, g: 0, b: 0 });
      expect(parseColor('rgba( 255 , 0 , 0 , 1 )')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    });

    test('handles uppercase', () => {
      expect(parseColor('RGB(255, 0, 0)')).toEqual({ r: 255, g: 0, b: 0 });
      expect(parseColor('RGBA(255, 0, 0, 1)')).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    });

    test('returns null for invalid rgb', () => {
      expect(parseColor('rgb(255, 0)')).toBeNull();
      expect(parseColor('rgb(invalid)')).toBeNull();
    });
  });

  describe('named colors', () => {
    test('parses basic named colors', () => {
      expect(parseColor('red')).toEqual({ r: 255, g: 0, b: 0 });
      expect(parseColor('green')).toEqual({ r: 0, g: 128, b: 0 });
      expect(parseColor('blue')).toEqual({ r: 0, g: 0, b: 255 });
      expect(parseColor('white')).toEqual({ r: 255, g: 255, b: 255 });
      expect(parseColor('black')).toEqual({ r: 0, g: 0, b: 0 });
    });

    test('handles transparent', () => {
      expect(parseColor('transparent')).toEqual({ r: 0, g: 0, b: 0, a: 0 });
    });

    test('handles case insensitive', () => {
      expect(parseColor('RED')).toEqual({ r: 255, g: 0, b: 0 });
      expect(parseColor('Red')).toEqual({ r: 255, g: 0, b: 0 });
    });

    test('returns null for unknown named colors', () => {
      expect(parseColor('purple')).toBeNull();
      expect(parseColor('unknown')).toBeNull();
    });
  });

  test('handles whitespace', () => {
    expect(parseColor('  red  ')).toEqual({ r: 255, g: 0, b: 0 });
    expect(parseColor(' #ff0000 ')).toEqual({ r: 255, g: 0, b: 0 });
  });

  test('returns null for invalid colors', () => {
    expect(parseColor('')).toBeNull();
    expect(parseColor('invalid')).toBeNull();
    expect(parseColor('##ff0000')).toBeNull();
  });
});