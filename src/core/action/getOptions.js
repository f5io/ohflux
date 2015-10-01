import { curry } from 'fnutil/core';
import { compose, map, filter, head, combine, filterSplit } from 'fnutil/utils';
import { isFunction, isObject, toArray } from '../utils';
import { actionName } from '../utils/symbols';
import DEFAULTS from './defaults';

let assignName = name => opts => ({ ...opts, [actionName]: name });
let mergeOptions = curry((defaults, supplied) => ({ ...defaults, ...supplied }));

let logThrough = val => x => {
  console.log(val);
  console.log(x);
  return x;
}

let getOptions = (name) => compose(
  assignName(name),
  mergeOptions(DEFAULTS),
  head,
  combine,
  filterSplit(
    compose(
      map(reduce => ({ reduce })),
      filter(isFunction)
    ),
    filter(isObject)
  ),
  toArray
);

export default getOptions;
