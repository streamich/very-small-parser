import {parseDeclarations} from "..";

test('can parse inline styles', () => {
  const style = 'font-size:11pt;font-family:Arial,sans-serif;color:#000000;background-color:transparent;font-weight:400;font-style:normal;font-variant:normal;text-decoration:none;vertical-align:baseline;white-space:pre;white-space:pre-wrap;';
  const declarations = parseDeclarations(style);
  expect(declarations).toEqual({
    'font-size': '11pt',
    'font-family': 'Arial,sans-serif',
    color: '#000000',
    'background-color': 'transparent',
    'font-weight': '400',
    'font-style': 'normal',
    'font-variant': 'normal',
    'text-decoration': 'none',
    'vertical-align': 'baseline',
    'white-space': 'pre-wrap'
  });
});
