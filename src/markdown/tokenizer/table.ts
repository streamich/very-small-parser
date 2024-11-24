import type {TTokenizer, ITable, ITableRow} from '../types';

const REG = /^ *\|(.+)\n *\|?( *[-:]+[-| :]*)(?:\n((?: *[^>\n ].*(?:\n|$))*)\n*|$)/;

const splitCells = (tableRow: string, count?: number) => {
  const cells = tableRow.replace(/([^\\])\|/g, '$1 |').split(/ +\| */);

  if (count !== void 0) {
    if (cells.length > count) {
      cells.splice(count);
    } else {
      while (cells.length < count) {
        cells.push('');
      }
    }
  }

  for (let i = 0; i < cells.length; i++) {
    cells[i] = cells[i].replace(/\\\|/g, '|');
  }

  return cells;
};

const table: TTokenizer<ITable> = function (eat, value) {
  const matches = value.match(REG);

  if (!matches) {
    return;
  }

  const subvalue = matches[0];
  const header = matches[1];
  const align = matches[2]
    .replace(/^ *|\| *$/g, '')
    .split(/ *\| */)
    .map((spec) => {
      spec = spec.trim();

      return spec[0] === ':'
        ? spec[spec.length - 1] === ':'
          ? 'center'
          : 'left'
        : spec[spec.length - 1] === ':'
          ? 'right'
          : null;
    });
  const rows = matches[3] ? matches[3].replace(/(?: *\| *)?\n$/, '').split('\n') : [];
  const children: ITableRow[] = [];
  const headers = splitCells(header.replace(/^ *| *\| *$/g, '')).map((headerText) => ({
    type: 'tableCell',
    children: this.tokenizeInline(headerText),
  }));

  children.push({
    type: 'tableRow',
    children: headers,
  } as ITableRow);

  if (rows && rows.length) {
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const cells = splitCells(row.replace(/^ *\| *| *\| *$/g, ''), headers.length);

      children.push({
        type: 'tableRow',
        children: cells.map((cellRawValue) => ({
          type: 'tableCell',
          children: this.tokenizeInline(cellRawValue),
        })),
      } as ITableRow);
    }
  }

  return eat(subvalue, 'table', children, {align});
};

export default table;
