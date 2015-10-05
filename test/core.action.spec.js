import test from 'tape';

import {
  createActionHandler,
  createStream,
  decorateAction,
  getOptions,
  handleAsyncAction,
  inheritStreamProto,
  reducePoolToStream
} from '../core/action';
import { isAction, actionName } from '../core/utils/symbols';
import { of } from 'fnutil/observable';

test('[core.action] createActionHandler', t => {
  t.plan(4);
  let stream = of();
  let pool = of();
  let options = { a: 2, c: 3 };
  let [ fn, str, opts ] = createActionHandler([ stream, pool, options ]);
  let output = [];
  pool.map(x => x * 4).onValue(::output.push);
  t.equal(str, stream, 'should return the original stream');
  t.equal(opts, options, 'should return the original options');
  t.equal(typeof fn, 'function', 'should return a new function');
  fn(4);
  t.deepEqual(output, [ 16 ], 'should plug value passed into the pool');
});

test('[core.action] decorateAction', t => {
  t.plan(7);
  let action = { foo: () => 1 };
  let options = { [actionName]: 'bar' };
  let [ act, opts ] = decorateAction([ action, options ]);
  t.deepEqual(action, act, 'should mutate the original action');
  t.equal(options, opts, 'should return the original options');
  t.ok(act[isAction], 'should define the `isAction` symbol on the action');
  t.equal(act[actionName], options[actionName], 'should define the `actionName` symbol from the options');
  t.equal(typeof act.listen, 'function', 'should define the `listen` function on the action');
  t.equal(typeof act.listenAndPromise, 'function', 'should define the `listenAndPromise` on the action');
  t.throws(act.listenAndPromise, /Error/, 'should throw an error because the action options define it as non-async');
});

test('[core.action] getOptions', t => {
  t.plan(5);
  let name = 'foo';
  let getOptsForName = getOptions(name);
  let fn = x => x * 2;
  t.equal(typeof getOptsForName, 'function', 'should return a function when supplied a name');
  let options = getOptsForName(fn);
  t.equal(options[actionName], name, 'should return an options object with the correct name');
  t.equal(options.reduce, fn, 'should return an options object with the supplied function as the `reduce` property');
  t.notOk(options.asyncResult, 'should return an options object where `asyncResult` is set to false');
  let optX = getOptsForName({ asyncResult: true });
  t.ok(optX.asyncResult, 'should return an options object with `asyncResult` is true');
});

test('[core.action] handleAsyncAction', t => {
  t.plan(6);
  let options = { [actionName]: 'foo', asyncResult: false };
  let action = of();
  let act = handleAsyncAction([ action, options ]);
  t.equal(action, act, 'should return the same action if `asyncResult` is false in the options');
  options = { [actionName]: 'bar', asyncResult: true, children: [ 'progress' ] };
  act = handleAsyncAction([ action, options ]);
  t.equal(action, act, 'should mutate the original supplied action if `asyncResult` is true');
  t.ok(action.progress[isAction], 'should append supplied child actions to the action object');
  t.ok(action.completed[isAction], 'should append default child action (`completed`) to the action object');
  t.ok(action.failed[isAction], 'should append default child action (`failed`) to the action object');
  t.deepEqual(action.children, [ 'progress', 'completed', 'failed' ], 'should contain all child actions in `children` array');
});

test('[core.action] inheritStreamProto', t => {
  t.plan(3);
  let options = { [actionName]: 'foo', asyncResult: false };
  let action = { [isAction]: true };
  let stream = of();
  let [ merged, opts ] = inheritStreamProto([ action, stream, options ]);
  t.equal(opts, options, 'should return the original supplied `options` object');
  t.ok(merged.onValue, 'should inherit the streams `onValue` prototype');
  t.ok(merged.map, 'should inherit the streams `map` prototype');
});

test('[core.action] reducePoolToStream', t => {
  t.plan(3);
  let pool = of();
  let options = { reduce: (x) => x.map(y => y * 2).map(y => y * 3) };
  let output = [];
  let [ reduced, p, opts ] = reducePoolToStream([ options, pool ]);
  reduced.onValue(::output.push);
  pool.plug(2);
  t.equal(pool, p, 'should return the original supplied `pool`');
  t.equal(options, opts, 'should return the original supplied `options` object');
  t.deepEqual(output, [ 12 ], 'should supply a reduced pool that outputs the correct value');
});
