import test from 'tape';

import {
  actionsToStreams, combineStreams,
  getInitialState, getStateStream,
  getStoreActions, inheritStreamProto,
  mergeStreams, plugOnValue, updateState
} from '../core/store';

import { createAction } from '../';

import { of } from 'fnutil/observable';

test('[core.store] actionsToStreams', t => {
  t.plan(4);
  let store = {
    onFoo({ a }, x) {
      a = x * 3;
      return { a };
    },
    onBar({ a }, x) {
      a = x * 2;
      return { a };
    }
  }
  let pool = of({ a: 1 });
  let aX = createAction('foo');
  let aY = createAction('bar');
  let stream = actionsToStreams([ pool, store, [ aX, aY ] ]);
  let output = [];
  stream[2][0].map(x => x.a).onValue(::output.push);
  stream[2][1].map(x => x.a).onValue(::output.push);
  aX(4);
  aY(5);
  t.deepEqual(stream[0], pool, 'should return the original pool');
  t.deepEqual(stream[1], store, 'should return the original store');
  t.ok(Array.isArray(stream[2]), 'should return an array of handled actions');
  t.deepEqual(output, [ 12, 10 ], 'should create a stream that runs through a stores handlers');
});

test('[core.store] combineStreams', t => {
  t.plan(3);
  let store = { a: 1, b: 2 };
  let pool = of(store);
  let combined = of(x => {
    x.a = 4;
    return x;
  });
  let stream = combineStreams([ pool, store, combined ]);
  let output = [];
  stream[2].onValue(::output.push);
  combined.plug(store);
  t.deepEqual(stream[0], pool, 'should return the original pool');
  t.deepEqual(stream[1], store, 'should return the original store');
  t.deepEqual(output, [ { a: 4, b: 2 } ], 'should output the new store');
});

test('[core.store] getInitialState', t => {
  t.plan(2);
  let obj = { getInitialState: () => 1 };
  let fn = () => getInitialState({});
  t.deepEqual(getInitialState(obj), [ obj, 1 ], 'should return `getInitialState` for the supplied object');
  t.throws(fn, /Error/, 'should throw an error for an object with no `getInitialState` method');
});

test('[core.store] getStateStream', t => {
  t.plan(2);
  let store = { a: 1, b: 2 };
  let state = 3;
  let stream = getStateStream([ store, state ]);
  let output = [];
  stream[0].onValue(::output.push);
  t.deepEqual(stream[1], store, 'should return the original store');
  t.deepEqual(output, [ state ], 'should return an observable of the supplied state');
});

test('[core.store] mergeStreams', t => {
  t.plan(3);
  let pX = of(), pY = of(), pZ = of();
  let pool = of();
  let store = { a: 1, b: 2 };
  let stream = mergeStreams([ pool, store, [ pX, pY, pZ ] ]);
  let output = [];
  stream[2].onValue(::output.push);
  pX.plug(1);
  pY.plug(2);
  pZ.plug(3);
  t.deepEqual(stream[0], pool, 'should return the original pool');
  t.deepEqual(stream[1], store, 'should return the original store');
  setTimeout(() => t.deepEqual(output, [1, 2, 3], 'should return an observable that merges the supplied observables'));
});

test('[core.store] plugOnValue', t => {
  t.plan(3);
  let pool = of();
  let combined = of();
  let store = { a: 1, b: 2 };
  let stream = plugOnValue([ pool, store, combined ]);
  let output = [];
  stream[0].onValue(::output.push);
  combined.plug(4);
  t.deepEqual(stream[0], pool, 'should return the original pool');
  t.deepEqual(stream[1], store, 'should return the original store');
  t.deepEqual(output, [ 4 ], 'should pass from the combined observable into the pool');
});

test('[core.store] updateState', t => {
  t.plan(1);
  let oX = { a: 1, b: 2 };
  let oY = { a: 2, c: 3 };
  t.deepEqual(updateState([ oX, oY ]), { a: 2, b: 2, c: 3 }, 'should merge the next state into the previous');
});
