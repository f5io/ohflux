import { merge } from 'fnutil/observable';

let mergeStreams = ([ pool, store, streams ]) => [ pool, store, merge(streams) ];

export default mergeStreams;
