/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var ModifiableCollection = (function () {
            function ModifiableCollection() {
                this._modifiable = new Common.Models.Modifiable(this);
                this._collection = new Common.Models.Collection();
                this.guid = this._modifiable.guid;
            }
            ModifiableCollection.prototype.setModified = function (forciblyModify) {
                return this._modifiable.setModified(forciblyModify === true);
            };
            ModifiableCollection.prototype.onModified = function (callback) {
                var self = this;
                this._modifiable.onModified(callback);
                this._collection.forEach(function (modifiableItem, index) {
                    modifiableItem.onModified(function () {
                        // child elements modified, 
                        // propegate changes up to the parent
                        self.isModified();
                    });
                });
            };
            ModifiableCollection.prototype.isModified = function () {
                this._modifiable.isModified();
            };
            /**
             * When commanding the collection whether to listen,
             * apply the true/false argument to all of its contents as well
             * @param {boolean} startListening true to start listening, false to stop
             */
            ModifiableCollection.prototype.listen = function (startListening) {
                this._modifiable.listening = startListening;
                return this;
            };
            ModifiableCollection.prototype.size = function () {
                return this._collection.size();
            };
            ModifiableCollection.prototype.isEmpty = function () {
                return this._collection.isEmpty();
            };
            ModifiableCollection.prototype.hasElements = function () {
                return this._collection.hasElements();
            };
            ModifiableCollection.prototype.get = function (key) {
                return this._collection.get(key);
            };
            ModifiableCollection.prototype.first = function () {
                return this._collection.first();
            };
            ModifiableCollection.prototype.getOne = function () {
                return this._collection.getOne();
            };
            ModifiableCollection.prototype.getIndex = function (index) {
                return this._collection.getIndex(index);
            };
            ModifiableCollection.prototype.set = function (key, data) {
                this._collection.set(key, data);
                this._modifiable.setModified();
                return this;
            };
            ModifiableCollection.prototype.replace = function (replaceKey, data) {
                this._collection.replace(replaceKey, data);
                this._modifiable.setModified();
                return this;
            };
            ModifiableCollection.prototype.setAtIndex = function (index, data) {
                this._collection.setAtIndex(index, data);
                this._modifiable.setModified();
                return this;
            };
            ModifiableCollection.prototype.add = function (data) {
                this._collection.add(data);
                this._modifiable.setModified();
                return this;
            };
            ModifiableCollection.prototype.addAtIndex = function (data, index) {
                this._collection.addAtIndex(data, index);
                this._modifiable.setModified();
                return this;
            };
            ModifiableCollection.prototype.append = function (collection) {
                this._collection.append(collection);
                this._modifiable.setModified();
                return this;
            };
            ModifiableCollection.prototype.forEach = function (iterator) {
                this._collection.forEach(iterator);
            };
            ModifiableCollection.prototype.hasElementWhich = function (predicate) {
                return this._collection.hasElementWhich(predicate);
            };
            ModifiableCollection.prototype.filter = function (predicate) {
                return this._collection.filter(predicate);
            };
            ModifiableCollection.prototype.filterFirst = function (predicate) {
                return this._collection.filterFirst(predicate);
            };
            ModifiableCollection.prototype.remove = function (key) {
                var results = this._collection.remove(key);
                this._modifiable.setModified();
                return results;
            };
            ModifiableCollection.prototype.removeAll = function () {
                this._collection.removeAll();
                this._modifiable.setModified();
            };
            ModifiableCollection.prototype.empty = function () {
                this.removeAll();
            };
            /**
             * Allows you to run an iterator method over each item
             * in the collection before the collection is completely
             * emptied.
             */
            ModifiableCollection.prototype.removeEach = function (iterator) {
                this._collection.removeEach(iterator);
                this._modifiable.setModified();
            };
            ModifiableCollection.prototype.contains = function (key) {
                return this._collection.contains(key);
            };
            ModifiableCollection.prototype.getAll = function () {
                return this._collection.getAll();
            };
            ModifiableCollection.prototype.getLast = function () {
                return this._collection.getLast();
            };
            ModifiableCollection.prototype.toArray = function () {
                return this._collection.toArray();
            };
            ModifiableCollection.prototype.toJson = function () {
                return this._collection.toJson();
            };
            ModifiableCollection.prototype.copy = function (newElement, context) {
                console.error('ModifiableCollection copy() not implemented');
                return null;
            };
            return ModifiableCollection;
        })();
        Models.ModifiableCollection = ModifiableCollection;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
