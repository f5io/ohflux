import handleAsyncAction from './handleAsyncAction';
import decorateAction from './decorateAction';
import inheritStreamProto from './inheritStreamProto';
import createActionHandler from './createActionHandler';
import reducePoolToStream from './reducePoolToStream';

import { compose, filterSplit } from 'fnutil/utils';
import { observable } from 'fnutil';


let logThrough = val => x => {
  console.log(val);
  console.log(x);
  return x;
}

let createStream = compose(
  handleAsyncAction,
  decorateAction,
  inheritStreamProto,
  createActionHandler,
  reducePoolToStream,
  filterSplit(x => x, () => observable.of())
);

export default createStream;
