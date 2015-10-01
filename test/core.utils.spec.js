import test from 'tape';

import {
  argsToKV, inherit,
  isDefined, isFunction, isObject,
  keyToKV, kvToObject, kvToObjectWithModifier,
  objectToKV, toArray, toSentenceCase,
  undefinedToMirror
} from '../core/utils';

test('[core.utils] argsToKV', t => {
  t.plan(1);
  let output = argsToKV(['one', ['two'], { three: 3 }]);
  t.deepEqual(output, [ ['three', 3], ['one', undefined], ['two', undefined] ], 'should convert an array of arguments to key/value pairs');
});

test('[core.utils] inherit', t => {
  t.plan(1);
  let Test = Object.create({
    hello() {
      return 'hello';
    }
  });
  let output = inherit(Test, {});
  t.ok(output.hello, 'should copy prototypes');
});

test('[core.utils] isDefined', t => {
  t.plan(2);
  t.equal(isDefined(), false, 'should return false for `undefined` input');
  t.equal(isDefined(1), true, 'should return true for defined input');
});

test('[core.utils] isFunction', t => {
  t.plan(2);
  t.equal(isFunction({}), false, 'should return false for an input that isn`t a function');
  t.equal(isFunction(() => {}), true, 'should return true for an input that is a function');
});

test('[core.utils] isObject', t => {
  t.plan(2);
  t.equal(isObject(() => {}), false, 'should return false for an input that isn`t an object');
  t.equal(isObject({}), true, 'should return true for an input that is an object');
});

test('[core.utils] keyToKV', t => {
  t.plan(1);
  t.deepEqual(keyToKV('key'), [ 'key', undefined ], 'should return a key/value pair from a key');
});

test('[core.utils] kvToObject', t => {
  t.plan(1);
  let input = [ ['a', 1], ['b', 2], ['c', 3] ];
  t.deepEqual(input.reduce(kvToObject, {}), { a: 1, b: 2, c: 3 }, 'should return an object of the supplied key/value pairs');
});

test('[core.utils] kvToObjectWithModifier', t => {
  t.plan(1);
  let input = [ ['a', 1], ['b', 2], ['c', 3] ];
  t.deepEqual(input.reduce(kvToObjectWithModifier((k, v) => v * 3), {}), { a: 3, b: 6, c: 9 }, 'should return an object of the supplied key/value pairs with a modification');
});

test('[core.utils] objectToKV', t => {
  t.plan(1);
  let input = { a: 1, b: 2, c: 3 };
  t.deepEqual(objectToKV(input), [ ['a', 1], ['b', 2], ['c', 3] ], 'should return an array of key/value pairs from a supplied object');
});

test('[core.utils] toArray', t => {
  t.plan(2);
  let x = [ 1 ];
  t.deepEqual(toArray(1), x, 'should convert an item to an array if it isn`t one');
  t.equal(toArray(x), x, 'should leave the supplied input alone if it is already an array');
});

test('[core.utils] toSentenceCase', t => {
  t.plan(1);
  let x = 'hello';
  t.equal(toSentenceCase(x), 'Hello', 'should capitalise the first letter of a string');
});

test('[core.utils] undefinedToMirror', t => {
  t.plan(2);
  let x = [ 'key', undefined ];
  let y = [ 'a', 'b' ];
  t.deepEqual(undefinedToMirror(x), [ 'key', 'key' ], 'should convert a key/value pair with an undefined value into a key mirror');
  t.deepEqual(undefinedToMirror(y), [ 'a', 'b' ], 'should leave the supplied input alone if the value is defined');
});
