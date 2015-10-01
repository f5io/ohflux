import { compose } from 'fnutil/utils';
import { createStream , getOptions, DEFAULTS } from './core/action';

let createAction = (name, opts = DEFAULTS) => compose(
  createStream,
  getOptions(name)
)(opts);

export default createAction;

