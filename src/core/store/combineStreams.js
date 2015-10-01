import updateState from './updateState';
import { combine } from 'fnutil/observable';

let combineStreams = ([ pool, store, streams ]) => [ pool, store, combine([
  pool.sampledBy(streams),
  streams
], updateState) ];

export default combineStreams;
