/*jshint node: true */
/*global describe, it */
'use strict';
var expect = require('expect.js');
var OrderedHashMap = require('../');

describe('OrderedHashMap', function () {
  it('is a constructor function', function () {
    expect(OrderedHashMap).to.be.a('function');
    var m = new OrderedHashMap();
    expect(m).to.be.an(OrderedHashMap);
  });
  it('assigns a unique ID', function () {
    var m1 = new OrderedHashMap();
    var m2 = new OrderedHashMap();
    expect(m2._id).not.to.equal(m1._id);
  });
});

describe('OrderedHashMap.from', function () {
  it('is a function', function () {
    expect(OrderedHashMap.from).to.be.a('function');
  });
  it('returns a new OrderedHashMap', function () {
    var m1 = OrderedHashMap.from([]);
    expect(m1).to.be.an(OrderedHashMap);
    var m2 = OrderedHashMap.from([]);
    expect(m2).not.to.equal(m1);
  });
  it('takes an array of values', function () {
    var vals = ['a', 'b', 'c'];
    var m = OrderedHashMap.from(vals);
    expect(m.get(0)).to.equal(vals[0]);
    expect(m.get(1)).to.equal(vals[1]);
    expect(m.get(2)).to.equal(vals[2]);
  });
  it('takes an array of values and a key property name', function () {
    var vals = [{x: 1}, {x: 2}, {x: 3}];
    var m = OrderedHashMap.from(vals, 'x');
    expect(m.get(1)).to.equal(vals[0]);
    expect(m.get(2)).to.equal(vals[1]);
    expect(m.get(3)).to.equal(vals[2]);
  });
  it('takes an array of values and a key generation function', function () {
    var vals = ['x', 'y', 'z'];
    var args = [];
    var m = OrderedHashMap.from(vals, function (obj, i, arr) {
      args.push([obj, i, arr]);
      return String.fromCharCode('a'.charCodeAt(0) + i);
    });
    expect(args).to.eql([
      [vals[0], 0, vals],
      [vals[1], 1, vals],
      [vals[2], 2, vals]
    ]);
    expect(m.get('a')).to.equal(vals[0]);
    expect(m.get('b')).to.equal(vals[1]);
    expect(m.get('c')).to.equal(vals[2]);
  });
});

describe('OrderedHashMap.fromTuples', function () {
  it('is a function', function () {
    expect(OrderedHashMap.fromTuples).to.be.a('function');
  });
  it('returns a new OrderedHashMap', function () {
    var m1 = OrderedHashMap.fromTuples([]);
    expect(m1).to.be.an(OrderedHashMap);
    var m2 = OrderedHashMap.fromTuples([]);
    expect(m2).not.to.equal(m1);
  });
  it('takes an array of key/value tuples', function () {
    var m = OrderedHashMap.fromTuples([
      ['a', 1],
      ['b', 2]
    ]);
    expect(m.get('a')).to.equal(1);
    expect(m.get('b')).to.equal(2);
  });
});

describe('OrderedHashMap::_hash', function () {
  var hash = OrderedHashMap.prototype._hash;
  it('is a function', function () {
    expect(hash).to.be.a('function');
  });
  it('prefixes non-string scalars with %', function () {
    expect(hash(undefined)).to.equal('%undefined');
    expect(hash(null)).to.equal('%null');
    expect(hash(true)).to.equal('%true');
    expect(hash(false)).to.equal('%false');
    expect(hash(0)).to.equal('%0');
    expect(hash(1)).to.equal('%1');
    expect(hash(3.14)).to.equal('%3.14');
    expect(hash(1/0)).to.equal('%Infinity');
    expect(hash(Number(undefined))).to.equal('%NaN');
  });
  it('prefixes strings with "', function () {
    expect(hash('')).to.equal('"');
    expect(hash('x')).to.equal('"x');
    expect(hash('NaN')).to.equal('"NaN');
  });
  it('converts dates to @-prefixed numeric timestamps', function () {
    var now = new Date();
    expect(hash(now)).to.equal('@' + Number(now));
    expect(hash(new Date(0))).to.equal('@0');
    expect(hash(new Date(undefined))).to.equal('@NaN');
  });
  it('prefixes regular expressions with !', function () {
    expect(hash(/x/)).to.equal('!/x/');
    expect(hash(/a/i)).to.equal('!/a/i');
  });
  it('assigns incremental IDs to objects', function () {
    var self = {_id: 'x', _nextId: 23};
    var obj1 = {};
    var obj2 = {};
    expect(hash.call(self, obj1)).to.equal('#23');
    expect(hash.call(self, obj2)).to.equal('#24');
    expect(obj1).to.have.property('__hash$x', 23);
    expect(obj2).to.have.property('__hash$x', 24);
    expect(self._nextId).to.equal(25);
  });
  it('assigns incremental IDs to functions', function () {
    var self = {_id: 'x', _nextId: 23};
    var fn1 = function () {};
    var fn2 = function () {};
    expect(hash.call(self, fn1)).to.equal('#23');
    expect(hash.call(self, fn2)).to.equal('#24');
    expect(fn1).to.have.property('__hash$x', 23);
    expect(fn2).to.have.property('__hash$x', 24);
    expect(self._nextId).to.equal(25);
  });
});