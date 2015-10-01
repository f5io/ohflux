import { isFunction } from '../utils';

let getInitialState = store => {
  if (!isFunction(store.getInitialState)) throw new Error('Please supply a `getInitialState` method');
  return [ store, store.getInitialState() ];
}

export default getInitialState;
