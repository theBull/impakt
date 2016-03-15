var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var AssociationArray = (function (_super) {
            __extends(AssociationArray, _super);
            function AssociationArray() {
                _super.call(this, this);
                this._array = [];
            }
            AssociationArray.prototype.size = function () {
                return this._array.length;
            };
            AssociationArray.prototype.add = function (guid) {
                this._array.push(guid);
            };
            AssociationArray.prototype.addAll = function (guids) {
                this._array.concat(guids);
            };
            AssociationArray.prototype.addAtIndex = function (guid, index) {
                this._array[index] = guid;
            };
            AssociationArray.prototype.primary = function () {
                return this.getAtIndex(0);
            };
            AssociationArray.prototype.getAtIndex = function (index) {
                return this._array[index];
            };
            AssociationArray.prototype.first = function (guid) {
                this.addAtIndex(guid, 0);
            };
            AssociationArray.prototype.only = function (guid) {
                this._array = [];
                this.add(guid);
            };
            AssociationArray.prototype.empty = function () {
                this._array = [];
            };
            AssociationArray.prototype.remove = function (guid) {
                if (this.exists(guid)) {
                    this._array.splice(this._array.indexOf(guid), 1);
                    return guid;
                }
                else {
                    throw new Error(['Association does not exist: ', guid].join(''));
                    return null;
                }
            };
            /**
             * Returns whether the given guid exists
             * @param  {string}  guid the guid to check
             * @return {boolean}      true if it exists, otherwise false
             */
            AssociationArray.prototype.exists = function (guid) {
                return this.hasElements() && this._array.indexOf(guid) > -1;
            };
            /**
             * Returns whether the array has elements
             * @return {boolean} true or false
             */
            AssociationArray.prototype.hasElements = function () {
                return this.size() > 0;
            };
            /**
             * Replaces guid1, if found, with guid2
             * @param  {string} guid1 guid to be replaced
             * @param  {string} guid2 guid to replace with
             */
            AssociationArray.prototype.replace = function (guid1, guid2) {
                if (this.exists(guid1)) {
                    this._array[this._array.indexOf(guid1)] = guid2;
                }
            };
            /**
             * Iterates over each element in the array
             * @param {Function} iterator the iterator function to call per element
             */
            AssociationArray.prototype.forEach = function (iterator) {
                for (var i = 0; i < this._array.length; i++) {
                    var guid = this._array[i];
                    iterator(guid, i);
                }
            };
            AssociationArray.prototype.toArray = function () {
                return this._array;
            };
            AssociationArray.prototype.toJson = function () {
                return this.toArray();
            };
            AssociationArray.prototype.fromJson = function (json) {
                this._array = json;
            };
            return AssociationArray;
        })(Common.Models.Modifiable);
        Models.AssociationArray = AssociationArray;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
