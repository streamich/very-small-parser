import type {TTokenizer, IFootnoteDefinition} from '../types';

const REG = /^\[\^([a-zA-Z0-9\-_]+)\]: *([^\n]*(\n?(( {2}([^\n]*)\n?)|\n(?!\n))*)?)/;

const footnoteDefinition: TTokenizer<IFootnoteDefinition> = function (eat, value) {
  const matches = value.match(REG);

  if (!matches) {
    return void 0;
  }

  const subvalue = matches[0];
  const identifier = matches[1];
  const outdented = matches[2].replace(/^ {1,4}/gm, '');
  const children = this.tokenizeChildBlock(outdented);

  return eat(subvalue, 'footnoteDefinition', children, {identifier});
};

export default footnoteDefinition;
