/*jshint browserify: true, es3: true */
'use strict';
var _defineProperty = (function () {
  try {
    Object.defineProperty({}, 'x', {});
    return function (obj, name, value) {
      Object.defineProperty(obj, name, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: value
      });
    };
  } catch(e) {
    return function (obj, name, value) {
      obj[name] = value;
    };
  }
}());

module.exports = OrderedHashMap;
function OrderedHashMap() {
  this._values = {};
  this._keys = {};
  this._order = [];
  this._id = Date.now() + '$' + String(Math.random()).slice(2);
  this._nextId = 0;
}
OrderedHashMap.from = function (arr, keyProp) {
  var Ctor = this;
  var m = new Ctor();
  for (var i = 0; i < arr.length; i++) {
    var value = arr[i];
    var key = keyProp ? (
      typeof keyProp === 'function' ? keyProp(value, i, arr) : value[keyProp]
    ) : i;
    var hash = m._hash(key);
    m._order.push(hash);
    m._keys[hash] = key;
    m._values[hash] = value;
  }
  return m;
};
OrderedHashMap.fromTuples = function (arr) {
  var Ctor = this;
  var m = new Ctor();
  for (var i = 0; i < arr.length; i++) {
    var item = arr[i];
    var key = item[0];
    var hash = m._hash(key);
    m._order.push(hash);
    m._keys[hash] = item[0];
    m._values[hash] = item[1];
  }
  return m;
};
OrderedHashMap.prototype._hash = function (key) {
  var t = typeof key;
  if (key === null || key === undefined || t === 'boolean' || t === 'number') return '%' + key;
  if (t === 'string') return '"' + key;
  if (t !== 'object' && t !== 'function') return '?' + key;
  if (key instanceof Date) return '@' + Number(key);
  if (key instanceof RegExp) return '!' + key;
  var h = '__hash$' + this._id;
  if (key[h] === undefined) {
    _defineProperty(key, h, this._nextId);
    this._nextId += 1;
  }
  return '#' + key[h];
};
OrderedHashMap.prototype.count = function () {
  return this._order.length;
};
OrderedHashMap.prototype.keyAt = function (i) {
  if (i < 0 || i > this._order.length) return undefined;
  return this._keys[this._order[i]];
};
OrderedHashMap.prototype.valueAt = function (i) {
  if (i < 0 || i > this._order.length) return undefined;
  return this._values[this._order[i]];
};
OrderedHashMap.prototype.indexOf = function (key) {
  var hash = this._hash(key);
  return this._order.indexOf(hash);
};
OrderedHashMap.prototype.insert = function (index, key, value) {
  var hash = this._hash(key);
  var i = this._order.indexOf(hash);
  if (i !== -1) this._order.splice(i, 1);
  if (index >= this._order.length) this._order.push(hash);
  else if (index < 0) this._order.unshift(hash);
  else this._order.splice(index, 0, hash);
  this._keys[hash] = key;
  this._values[hash] = value;
};
OrderedHashMap.prototype.set = function (key, value) {
  var hash = this._hash(key);
  var i = this._order.indexOf(hash);
  if (i === -1) this._order.push(hash);
  this._keys[hash] = key;
  this._values[hash] = value;
};
OrderedHashMap.prototype.get = function (key) {
  var hash = this._hash(key);
  return this._values[hash];
};
OrderedHashMap.prototype.remove = function (key) {
  var hash = this._hash(key);
  var i = this._order.indexOf(hash);
  if (i === -1) return false;
  this._order.splice(i, 1);
  delete this._keys[hash];
  delete this._values[hash];
  return true;
};
OrderedHashMap.prototype.unshift = function (key, value) {
  var hash = this._hash(key);
  var i = this._order.indexOf(hash);
  if (i !== -1) this._order.splice(i, 1);
  this._order.unshift(hash);
  this._keys[hash] = key;
  this._values[hash] = value;
};
OrderedHashMap.prototype.shift = function () {
  if (!this._order.length) return undefined;
  var hash = this._order.shift();
  var key = this._keys[hash];
  var value = this._values[hash];
  delete this._keys[hash];
  delete this._values[hash];
  return [key, value];
};
OrderedHashMap.prototype.push = function (key, value) {
  var hash = this._hash(key);
  var i = this._order.indexOf(hash);
  if (i !== -1) this._order.splice(i, 1);
  this._order.push(hash);
  this._keys[hash] = key;
  this._values[hash] = value;
};
OrderedHashMap.prototype.pop = function () {
  if (!this._order.length) return undefined;
  var hash = this._order.pop();
  var key = this._keys[hash];
  var value = this._values[hash];
  delete this._keys[hash];
  delete this._values[hash];
  return [key, value];
};
OrderedHashMap.prototype.items = function () {
  var arr = [];
  for (var i = 0; i < this._order.length; i++) {
    var hash = this._order[i];
    arr.push([this._keys[hash], this._values[hash]]);
  }
  return arr;
};
OrderedHashMap.prototype.values = function () {
  var arr = [];
  for (var i = 0; i < this._order.length; i++) {
    var hash = this._order[i];
    arr.push(this._values[hash]);
  }
  return arr;
};
OrderedHashMap.prototype.keys = function () {
  var arr = [];
  for (var i = 0; i < this._order.length; i++) {
    var hash = this._order[i];
    arr.push(this._keys[hash]);
  }
  return arr;
};
OrderedHashMap.prototype.forEach = function (fn) {
  for (var i = 0; i < this._order.length; i++) {
    var hash = this._order[i];
    fn(this._values[hash], this._keys[hash], this);
  }
};
OrderedHashMap.prototype.map = function (fn) {
  var arr = [];
  for (var i = 0; i < this._order.length; i++) {
    var hash = this._order[i];
    arr.push(fn(this._values[hash], this._keys[hash], this));
  }
  return arr;
};
OrderedHashMap.prototype.filter = function (fn) {
  var m = new OrderedHashMap();
  for (var i = 0; i < this._order.length; i++) {
    var hash = this._order[i];
    var key = this._keys[hash];
    var value = this._values[hash];
    if (!fn(value, key, this)) continue;
    m._order.push(hash);
    m._keys[hash] = key;
    m._values[hash] = value;
  }
  return m;
};
OrderedHashMap.prototype.reduce = function (fn, initial) {
  var i = 0;
  var accu = initial;
  if (accu === undefined) {
    if (!this._order.length) throw new TypeError('Must provide an initial value for empty maps');
    accu = this._values[this._order[0]];
    i = 1;
  }
  for (; i < this._order.length; i++) {
    var hash = this._order[i];
    accu = fn(accu, this._values[hash], this._keys[hash], this);
  }
  return accu;
};
OrderedHashMap.prototype.reduceRight = function (fn, initial) {
  var i = this._order.length;
  var accu = initial;
  if (accu === undefined) {
    if (!this._order.length) throw new TypeError('Must provide an initial value for empty maps');
    accu = this._values[this._order[i - 1]];
    i -= 1;
  }
  for (var i = this._order.length; i > 0; i--) {
    var hash = this._order[i - 1];
    accu = fn(accu, this._values[hash], this._keys[hash], this);
  }
  return accu;
};