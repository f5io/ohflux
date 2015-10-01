import { compose, map, reduce } from 'fnutil/utils';
import { argsToKV, kvToObject, undefinedToMirror } from './core/utils';

let createConstants = (...args) => compose(
  ::Object.freeze,
  reduce(kvToObject, {}),
  map(undefinedToMirror),
  argsToKV
)(args);

export default createConstants;
