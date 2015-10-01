import { compose, spread } from 'fnutil/utils';
import {
  getInitialState, getStateStream,
  getStoreActions, actionsToStreams, mergeStreams,
  combineStreams, plugOnValue
} from './core/store';
import { inherit } from './core/utils';

let createStore = compose(
  spread(inherit),
  plugOnValue,
  combineStreams,
  mergeStreams,
  actionsToStreams,
  getStoreActions,
  getStateStream,
  getInitialState,
  ::Object.create
);

export default createStore;
