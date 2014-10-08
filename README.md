# Synopsis

**ordered-hashmap** is an ES3-compatible implementation of a map (or dictionary) data type that accepts arbitrary keys and maintains insertion order.

[![license - MIT](http://b.repl.ca/v1/license-MIT-blue.png)](http://pluma.mit-license.org) [![Flattr this](https://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=pluma&url=https://github.com/pluma/ordered-hashmap)

[![Build Status](https://travis-ci.org/pluma/ordered-hashmap.png?branch=master)](https://travis-ci.org/pluma/ordered-hashmap) [![Coverage Status](https://coveralls.io/repos/pluma/ordered-hashmap/badge.png?branch=master)](https://coveralls.io/r/pluma/ordered-hashmap?branch=master) [![Dependencies](https://david-dm.org/pluma/ordered-hashmap.png?theme=shields.io)](https://david-dm.org/pluma/ordered-hashmap)

[![NPM status](https://nodei.co/npm/ordered-hashmap.png?compact=true)](https://npmjs.org/package/ordered-hashmap)

# Why not just use objects?

Aside from not guaranteeing that insertion order will be maintained when iterating over an object's properties, objects also have nasty built-in properties that could conflict with arbitrary keys. Additionally property names will always be coerced to a string, so multiple keys can overlap (e.g. `1` and `"1"` refer to the same property).

# Why not use Map/WeakMap?

Although these ES6 features can be polyfilled in ES5 environments, some people have to work with ES3 environments where complete polyfills will not work. Also, these data structures are built around the concept of iterators, which creates a lot of unnecessary overhead in non-ES6 environments.

# Why not use {insert module here}?

Most alternative implementations either have a clunky API or try to re-implement Map/WeakMap.

# Install

## With NPM

```sh
npm install ordered-hashmap
```

## From source

```sh
git clone https://github.com/pluma/ordered-hashmap.git
cd ordered-hashmap
npm install
```

# Basic usage example

```js
var OrderedHashMap = require('ordered-hashmap');
var m = new OrderedHashMap();
m.set(25, 'potato');
m.get('25') === undefined;
m.get(25) === 'potato';
m.indexOf(25) === 0;
m.keyAt(0) === 25;
m.count() === 1;
m.unshift('hello', 'chicken');
m.keyAt(0) === 'hello';
m.count() === 2;
m.push('hello', 'world');
m.count() === 2;
m.keyAt(0) === 25;
```

# API

## new OrderedHashMap()

Creates a new `OrderedHashMap`.

## OrderedHashMap.from(values:Array):OrderedHashMap

Creates a new `OrderedHashMap` from an array of values with the keys being set to the index of each value in the array.

Example:

```js
var m = OrderedHashMap.from([
  'x',
  23,
  'hello'
]);
m.count() === 3;
m.get(0) === 'x';
m.get(1) === 23;
m.keyAt(2) === 2;
```

## OrderedHashMap.from(values:Array, name:String):OrderedHashMap

Creates a new `OrderedHashMap` from an array of objects with the keys being set to the value of the property with the given name of each object.

Example:

```js
var objs = [
  {key: 'x'},
  {key: 23},
  {key: 'hello'}
];
var m = OrderedHashMap.from(objs, 'key');
m.count() === 3;
m.get('x') === objs[0];
m.get(23) === objs[1];
m.keyAt(2) === 'hello';
```

## OrderedHashMap.from(values:Array, callback:Function):OrderedHashMap

Creates a new `OrderedHashMap` from an array of values with the keys being set to the result of the given callback function.

The callback function will be passed the following arguments for each item in the array:

 * the item itself
 * the index of the item within the array
 * the values array

Example:

```js
function alpha(value, i, arr) {
  return String.fromCharCode('a'.charCodeAt(0) + i);
}
var m = OrderedHashMap.from([
  'x',
  23,
  'hello'
], alpha);
m.count() === 3;
m.get('a') === 'x';
m.get('b') === 23;
m.keyAt(2) === 'c';
```

## OrderedHashMap.fromTuples(tuples:Array):OrderedHashMap

Creates a new `OrderedHashMap` from an array of key/value tuples.

Example:

```js
var m = OrderedHashMap.fromTuples([
  ['x', 'hello'],
  [23, 'fnord'],
  ['chicken', 5]
]);
m.count() === 3;
m.get('x') === 'hello';
m.keyAt(1) === 23;
m.indexOf('chicken') === 2;
```

## OrderedHashMap::count():Number

Returns the number of items in the map.

## OrderedHashMap::keyAt(index:Number):*

Returns the key of the item at the given index.

Example:

```js
var m = new OrderedHashMap();
m.set('x', 'hello');
m.keyAt(0) === 'x';
```

## OrderedHashMap::indexOf(key:*):Number

Returns the index of the item with the given key in the map, or `-1` if there is no matching item in the map.

```js
var m = new OrderedHashMap();
m.set('x', 'hello');
m.indexOf('x') === 0;
m.indexOf('y') === -1;
```

## OrderedHashMap::insert(index:Number, key:*, value:*)

Inserts the given key/value at the given index.

If index is less than zero, the key will be prepended to the beginning of the map.

If index is greater than or equal to the size of the map, the key will be appended to the end of the map.

## OrderedHashMap::set(key:*, value:*)

Replaces the value for the given key with the given value. If the key does not already exist in the map, it will be appended to the end of the map.

## OrderedHashMap::get(key:*):*

Returns the value for the given key.

## OrderedHashMap::remove(key:*):Boolean

Removes the item with the given key from the map. Returns `false` if the key does not exist in the map or `true` if the item was removed successfully.

## OrderedHashMap::unshift(key:*, value:*)

Prepends the given key/value to the map. If the map already contains an item with the given key, that item will be removed.

## OrderedHashMap::shift():Array

Removes the first item in the map and returns it as a key/value tuple.

Example:

```js
var m = new OrderedHashMap();
m.set('a', 'x');
m.set('b', 'y');
m.shift(); // ['a', 'x']
m.count() === 1;
```

## OrderedHashMap::push(key:*, value:*)

Appends the given key/value to the map. If the map already contains an item with the given key, that item will be removed.

## OrderedHashMap::pop():Array

Removes the last item in the map and returns it as a key/value tuple.

Example:

```js
var m = new OrderedHashMap();
m.set('a', 'x');
m.set('b', 'y');
m.pop(); // ['b', 'y']
m.count() === 1;
```

## OrderedHashMap::items():Array

Returns an array containing key/value tuples for each item in the map.

Example:

```js
var m = new OrderedHashMap();
m.set('a', 'x');
m.set('b', 'y');
m.items(); // [['a', 'x'], ['b', 'y']]
m.count() === 2;
```

## OrderedHashMap::values():Array

Returns an array containing the value of each item in the map.

Example:

```js
var m = new OrderedHashMap();
m.set('a', 'x');
m.set('b', 'y');
m.values(); // ['x', 'y']
m.count() === 2;
```

## OrderedHashMap::values():Array

Returns an array containing the key of each item in the map.

Example:

```js
var m = new OrderedHashMap();
m.set('a', 'x');
m.set('b', 'y');
m.values(); // ['a', 'b']
m.count() === 2;
```

### OrderedHashMap::forEach(callback:Function)

Invokes the given callback function for each item in the map.

The callback function will be passed the following arguments for each item in the map:

 * the value of the item
 * the key of the item
 * the map itself

Example:

```js
var m = new OrderedHashMap();
m.set('x', 1);
m.set('y', 2);
m.forEach(function (v, k) {
  console.log(k, '->', v);
});
/*
Console output:
 x -> 1
 y -> 2
*/
```

### OrderedHashMap::map(callback:Function):*

Returns an array containing the result of calling the given callback function for each item in the map.

The callback function will be passed the following arguments for each item in the map:

 * the value of the item
 * the key of the item
 * the map itself

### OrderedHashMap::filter(callback:Function):OrderedHashMap

Returns a new `OrderedHashMap` containing only the items for which the given callback function returns a truthy value (e.g. `true`).

The callback function will be passed the following arguments for each item in the map:

 * the value of the item
 * the key of the item
 * the map itself

### OrderedHashMap::reduce(callback:Function, [initial:*]):*

Applies the callback function against an accumulator and each item in the map, starting with the first item, and returns the accumulator.

The accumulator will be initialised with `initial`. If `initial` is undefined, the accumulator will be set to the first value in the map instead and the callback will not be invoked for the first item.

If `initial` is not defined and the map is empty, a `TypeError` will be thrown.

The callback function will be passed the following arguments for each item in the map:

 * the accumulator
 * the value of the item
 * the key of the item
 * the map itself

```js
var m = new OrderedHashMap();
m.set('x', 20);
m.set('banana', 40);
var sum = m.reduce(function (a, b) {return a + b;});
sum === 60;
```

### OrderedHashMap::reduceRight(callback:Function, [initial:*]):*

Applies the callback function against an accumulator and each item in the map, starting with the last item, and returns the accumulator.

The accumulator will be initialised with `initial`. If `initial` is undefined, the accumulator will be set to the last value in the map instead and the callback will not be invoked for the last item.

If `initial` is not defined and the map is empty, a `TypeError` will be thrown.

The callback function will be passed the following arguments for each item in the map:

 * the accumulator
 * the value of the item
 * the key of the item
 * the map itself

## Sub-classing

If you want to use a different hash function, it is easy to define your own sub-class.

Example using `util`:

```js
function OrderedStringMap() {
  OrderedHashMap.call(this);
}
var inherits = require('util').inherits;
inherits(OrderedStringMap, OrderedHashMap);
OrderedStringMap.prototype._hash = function (x) {
  // Let's just hash keys by their string value:
  return '#' + x; // prefix to avoid name clashes with internal properties
};
OrderedStringMap.from = OrderedHashMap.from; // these work as expected
OrderedStringMap.fromTuples = OrderedHashMap.fromTuples;

// Usage example:

var m = new OrderedStringMap();
m.set(25, 'hello');
m.get('25') === 'hello';
m.get(25) === 'hello';
m.count() === 1;
// Objects are not identical, but their hashes are ("#[Object object]"):
var a = {x: 1};
var b = {y: 2};
m.set(a, 'chicken');
m.get(b) === 'chicken';
a !== b;
```

# License

The MIT/Expat license. For more information, see http://pluma.mit-license.org/ or the accompanying [LICENSE](https://github.com/pluma/ordered-hashmap/blob/master/LICENSE) file.