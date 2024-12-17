import {UndefIterator} from '../../../util/iterator';
import {walk as walk0} from '../walk';
import type {JsonMlNode} from '../types';

export class UndefEndIter<T> implements IterableIterator<T> {
  constructor(private readonly i: UndefIterator<T>) {}

  public next(): IteratorResult<T, T> {
    const value = this.i();
    return new IterRes(value, value === undefined) as IteratorResult<T>;
  }

  [Symbol.iterator]() {
    return this;
  }
}

export class IterRes<T> {
  constructor(
    public readonly value: T,
    public readonly done: boolean,
  ) {}
}

export const iter = <T>(i: UndefIterator<T>) => new UndefEndIter(i);
export const walk = (node: JsonMlNode) => iter(walk0(node));


test('simple text', () => {
  const node: JsonMlNode = 'hello';
  const res = [...walk(node)];
  expect(res).toEqual(['hello']);
});

test('a single node', () => {
  const node: JsonMlNode = ['span', null, 'hello'];
  const res = [...walk(node)];
  expect(res).toEqual([['span', null, 'hello'], 'hello']);
});

test('nested nodes', () => {
  const node: JsonMlNode = ['div', {class: 'test'}, ['span', null, 'hello'], ['p', null, 'world'], '!!!'];
  const res = [...walk(node)];
  expect(res).toEqual([
    ['div', {class: 'test'}, ['span', null, 'hello'], ['p', null, 'world'], '!!!'],
    ['span', null, 'hello'],
    'hello',
    ['p', null, 'world'],
    'world',
    '!!!',
  ]);
});
