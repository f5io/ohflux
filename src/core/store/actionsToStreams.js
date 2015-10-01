import { compose, map, filter } from 'fnutil/utils';
import { combine, of } from 'fnutil/observable';
import { actionName } from '../utils/symbols';
import { isFunction, toSentenceCase } from '../utils';

let stateThroughHandler = store => ([ handler, values, state ]) => store[handler](state, values);

let actionsToStreams = ([ pool, store, actions ]) => {
  let streams = compose(
    map(action => combine([
      of(`on${toSentenceCase(action[actionName])}`).sampledBy(action),
      action,
      pool.sampledBy(action)
    ], stateThroughHandler(store))),
    filter(action => isFunction(store[`on${toSentenceCase(action[actionName])}`]))
  )(actions);
  return [ pool, store, streams ];
};

export default actionsToStreams;
