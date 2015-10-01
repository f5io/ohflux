import isObject from './isObject';
import objectToKV from './objectToKV';
import keyToKV from './keyToKV';
import {
  compose, map,
  filter, filterNot, filterSplit,
  combine, flatten
} from 'fnutil/utils';

let filterObjectsToKV = compose(combine, map(objectToKV), filter(isObject));
let filterKeysToKV = compose(map(keyToKV), filterNot(isObject));
let argsToKV = compose(combine, filterSplit(filterObjectsToKV, filterKeysToKV), flatten);

export default argsToKV;
