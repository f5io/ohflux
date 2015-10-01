import test from 'tape';
import lib from '../';
import {
  connect, createAction,
  createActions, createConstants,
  createStore, compose
} from '../';

import { isAction, actionName } from '../core/utils/symbols';

test('[lib] all functions exist in package', t => {
  t.plan(6);
  t.ok(lib.connect, 'lib.connect should be defined');
  t.ok(lib.createAction, 'lib.createAction should be defined');
  t.ok(lib.createActions, 'lib.createActions should be defined');
  t.ok(lib.createConstants, 'lib.createConstants should be defined');
  t.ok(lib.createStore, 'lib.createStore should be defined');
  t.ok(lib.compose, 'lib.compose should be defined');
});

test('[lib] all functions can be destructured', t => {
  t.plan(6);
  t.ok(connect, 'connect should be defined');
  t.ok(createAction, 'createAction should be defined');
  t.ok(createActions, 'createActions should be defined');
  t.ok(createConstants, 'createConstants should be defined');
  t.ok(createStore, 'createStore should be defined');
  t.ok(compose, 'compose should be defined');
});

test('[lib] createAction', t => {
  t.plan(4);
  let a = createAction('foo', {});
  let output = [];
  t.equal(typeof a, 'function', 'returned action should be a function');
  t.ok(a[isAction], 'returned action should have an `isAction` flag');
  t.equal(a[actionName], 'foo', 'returned action should have an `actionName` of `foo`');
  a.onValue(::output.push);
  a(4);
  t.deepEqual(output, [ 4 ], 'returned action should be an observable');
});

test('[lib] createActions', t => {
  t.plan(2);
  let b = createActions(['foo'], 'bar', { baz: x => x.map(y => y * 3) });
  let output = [];
  t.deepEqual(Object.keys(b), [ 'baz', 'foo', 'bar' ], 'should return an object with actions as keys');
  b.baz.onValue(::output.push);
  b.baz(3);
  t.deepEqual(output, [ 9 ], 'should use the supplied reducer method');
});

test('[lib] createConstants', t => {
  t.plan(3);
  let c = createConstants(['foo'], 'bar', { baz: 'beam' });
  let fn = () => { c.bar = 'boo'; };
  t.equal(c.foo, 'foo', 'should mirror keys with undefined values');
  t.equal(c.baz, 'beam', 'should use supplied value for key');
  t.throws(fn, /Error/, 'should be immutable');
});

test('[lib] createStore', t => {
  t.plan(1);
  let state = { a: 1 };
  let fn = ({ a }, val) => {
    a = val;
    return { a };
  }
  let a = createActions('foo', 'bar', 'baz');
  let b = createStore({
    actions: a,
    getInitialState() {
      return state;
    },
    onFoo: fn,
    onBar: fn,
    onBaz: fn
  });
  let output = [];
  b.map(x => x.a).onValue(::output.push);
  a.foo(2);
  a.bar(3);
  a.baz(4);
  setTimeout(() => t.deepEqual(output, [ 1, 2, 3, 4 ], 'should get new state each time an action is called'), 1);
});

test('[lib] createStore errors', t => {
  t.plan(2);
  let a = createAction('foo');
  let fnX = () => createStore({
    getInitialState() {
      return 1;
    }
  });
  let fnY = () => createStore({
    actions: a
  });
  t.throws(fnX, /Error/, 'should throw when actions is empty');
  t.throws(fnY, /Error/, 'should throw when no `getInitialState` method supplied');
});

test('[lib] connect', t => {
  t.plan(4);
  let a = createActions('foo');
  let b = createStore({
    actions: a,
    getInitialState() {
      return 1;
    },
    onFoo: (s, v) => {
      s = v;
      return s;
    }
  });
  let output = connect(b, store => store.map(x => x * 10));
  t.ok(output.getInitialState, 'should define `getInitialState`');
  t.ok(output.componentDidMount, 'should define `componentWillMount`');
  t.ok(output.componentWillUnmount, 'should define `componentWillUnmount`');
  t.equal(output.getInitialState(), 10, 'should run through the supplied `reducer`');
});
