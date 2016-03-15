/// <reference path='./models.ts' />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Collection = (function (_super) {
            __extends(Collection, _super);
            function Collection() {
                _super.call(this);
                this._count = 0;
                this._keys = [];
            }
            Collection.prototype._getKey = function (data) {
                if (data && data.guid) {
                    return data.guid;
                }
                else {
                    //throw new Error('Object does not have a guid');
                    console.error('Object does not have a guid');
                }
            };
            Collection.prototype._ensureKeyType = function (key) {
                if (typeof key == 'string') {
                    // could be valid string 'foo' or number hidden as string '2'
                    // convert '2' to 2
                    var k = key.toString();
                    var ki = parseInt(k);
                    key = isNaN(ki) || k.indexOf('-') > -1 ? k : ki;
                }
                return key;
            };
            Collection.prototype.size = function () {
                return this._count;
            };
            Collection.prototype.isEmpty = function () {
                return this.size() == 0;
            };
            Collection.prototype.hasElements = function () {
                return this.size() > 0;
            };
            Collection.prototype.get = function (key) {
                key = this._ensureKeyType(key);
                return this[key];
            };
            Collection.prototype.exists = function (key) {
                return this.contains(key);
            };
            Collection.prototype.first = function () {
                return this.getOne();
            };
            Collection.prototype.getOne = function () {
                return this[this._keys[0]];
            };
            Collection.prototype.getIndex = function (index) {
                return this.get(this._keys[index]);
            };
            Collection.prototype.getAll = function () {
                var obj = {};
                for (var i = 0; i < this._keys.length; i++) {
                    var key = this._keys[i];
                    // shitty way of hiding private properties
                    obj[key] = this.get(key);
                }
                return obj;
            };
            /**
             * Retrieves the last element in the collection
             * @return {T} [description]
             */
            Collection.prototype.getLast = function () {
                var key = this._keys[this._keys.length - 1];
                return this.get(key);
            };
            Collection.prototype.set = function (key, data) {
                if (!this.hasOwnProperty(key.toString()))
                    throw Error('Object does not have key ' + key + '. Use the add(key) method.');
                this[key] = data;
            };
            Collection.prototype.replace = function (replaceKey, data) {
                var key = this._getKey(data);
                this._keys[this._keys.indexOf(replaceKey)] = key;
                this[key] = data;
                delete this[replaceKey];
            };
            Collection.prototype.setAtIndex = function (index, data) {
            };
            Collection.prototype.add = function (data) {
                var key = this._getKey(data);
                if (this[key] && this._keys.indexOf(key) > -1) {
                    this.set(key, data);
                }
                else {
                    this[key] = data;
                    this._keys.push(key);
                    this._count++;
                }
            };
            Collection.prototype.addAtIndex = function (data, index) {
                var key = this._getKey(data);
                var exists = this._keys.indexOf(key) > -1;
                if (!exists || this._keys.indexOf(key) == index) {
                    // element exists at that index, update	
                    // OR, element does not exist, add at index
                    this[key] = data;
                    this._keys[index] = key;
                    if (!exists)
                        this._count++;
                }
                else {
                    // element exists at different index...
                    // ignore for now...
                    var currentIndex = this._keys.indexOf(key);
                    throw new Error([
                        'The element you want to add at this',
                        ' index already exists at index (',
                        currentIndex,
                        '). Ignoring for now...'
                    ].join(''));
                }
            };
            Collection.prototype.append = function (collection) {
                // adds the given collection onto the end of this collection
                // E.g.
                // this -> [1, 2, 3]
                // collection -> [4, 5, 6]
                // this.append(collection) -> [1, 2, 3, 4, 5, 6]
                var self = this;
                collection.forEach(function (item, index) {
                    if (item && item.guid) {
                        self.add(item);
                    }
                    else {
                        throw new Error('item is null or does not have guid');
                    }
                });
            };
            Collection.prototype.forEach = function (iterator) {
                if (!this._keys)
                    return;
                for (var i = 0; i < this._keys.length; i++) {
                    var key = this._keys[i];
                    iterator(this[key], i);
                }
            };
            Collection.prototype.hasElementWhich = function (predicate) {
                return this.filterFirst(predicate) != null;
            };
            Collection.prototype.filter = function (predicate) {
                var results = [];
                this.forEach(function (element, index) {
                    if (predicate(element)) {
                        results.push(element);
                    }
                });
                return results;
            };
            Collection.prototype.filterFirst = function (predicate) {
                var results = this.filter(predicate);
                return results && results.length > 0 ? results[0] : null;
            };
            Collection.prototype.remove = function (key) {
                if (!this[key])
                    throw Error('Object at key ' + key + ' does not exist');
                var obj = this[key];
                delete this[key];
                this._keys.splice(this._keys.indexOf(key), 1);
                this._count--;
                return obj;
            };
            Collection.prototype.removeAll = function () {
                while (this._count > 0) {
                    var key = this._keys[0];
                    this.remove(key);
                }
            };
            /**
             * Allows you to run an iterator method over each item
             * in the collection before the collection is completely
             * emptied.
             */
            Collection.prototype.removeEach = function (iterator) {
                // first, run the iterator over each item in the
                // collection
                this.forEach(iterator);
                // now remove all of them
                this.removeAll();
            };
            Collection.prototype.contains = function (key) {
                return this[key] != null && this[key] != undefined;
            };
            Collection.prototype.toArray = function () {
                var arr = [];
                for (var i = 0; i < this._keys.length; i++) {
                    arr.push(this.get(this._keys[i]));
                }
                return arr;
            };
            Collection.prototype.toJson = function () {
                var results = [];
                this.forEach(function (element, index) {
                    results.push(element.toJson());
                });
                return results;
            };
            return Collection;
        })(Common.Models.Storable);
        Models.Collection = Collection;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
