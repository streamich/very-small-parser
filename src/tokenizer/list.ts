import type {TTokenizer, IList} from '../types';
import {list as REG, item as REG_PARTS} from '../regex';

const REG_BULLET = /^(\s*)([*+-]|\d\.)(\s{1,2}|\t)/;
const REG_LOOSE = /\n\n(?!\s*$)/;
const getParts = (subvalue: string): string[] | null => {
  const parts = subvalue.match(REG_PARTS);

  return parts;
};

const list: TTokenizer<IList> = function (eat, value) {
  const matches = value.match(REG);

  if (!matches) {
    return;
  }

  const subvalue = matches[0];
  const parts = getParts(subvalue);
  // const [, ...parts] = subvalue.split(/^(?: *)(?:\-) [^\n]*(?:\n(?!\1\- )[^\n]*)*/gm);
  // const bullets = subvalue.match(REG_SPLIT);

  if (!parts) {
    return;
  }

  const length = parts.length;
  const children: any[] = [];

  let ordered = false;
  let start = null;
  let loose = false;

  for (let i = 0; i < length; i++) {
    const part = parts[i];
    const bulletMatch = part.match(REG_BULLET);

    // This should never happen.
    if (!bulletMatch) {
      return;
    }

    const sansBullet = part.substr(bulletMatch[0].length);

    // const indent = bulletMatch[1].length;
    const bulletMarker = bulletMatch[2];
    // const space = indent + bulletMarker.length;

    if (i === 0) {
      if (bulletMarker.length > 1) {
        ordered = true;
        start = Number.parseInt(bulletMarker, 10);
      }
    }

    // Outdent
    let outdented = sansBullet.replace(/^ {1,4}/gm, '');
    // const outdented = part.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
    let checked: null | boolean = null;

    if (outdented[0] === '[' && outdented[2] === ']') {
      switch (outdented[1]) {
        case 'x':
        case 'X':
          outdented = outdented.substr(3);
          checked = true;
          break;
        case ' ':
          outdented = outdented.substr(3);
          checked = false;
          break;
      }
    }

    const partLoose = REG_LOOSE.test(sansBullet);

    if (partLoose) {
      loose = true;
    }

    children.push({
      type: 'listItem',
      loose: partLoose,
      checked,
      children: this.tokenizeChildBlock(outdented),
    });
  }

  return eat(subvalue, 'list', children, {
    ordered,
    start,
    loose,
  });
};

export default list;
