import { compose, reduce } from 'fnutil/utils';
import { argsToKV, kvToObjectWithModifier } from './core/utils';
import createAction from './createAction';

let createActions = (...args) => compose(
  reduce(kvToObjectWithModifier(createAction), {}),
  argsToKV
)(args);

export default createActions;
