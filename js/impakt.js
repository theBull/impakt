/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='../models/models.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./interfaces.ts' />
/// <reference path='./ICollection.ts' />
/// <reference path='./ICollectionItem.ts' />
/// <reference path='./ILinkedListNode.ts' />
/// <reference path='./IModifiable.ts' />
/// <reference path='./IModifiableCollection.ts' />
/// <reference path='./IStorable.ts' />
/// <reference path='./IActionable.ts' />
/// <reference path='./IActionableCollection.ts' />
/// <reference path='./IScrollable.ts' />
/// <reference path='./IListener.ts' />
/// <reference path='./IPlaceable.ts' />
/// <reference path='./ISelectable.ts' />
/// <reference path='./IDraggable.ts' />
/// <reference path='./ILayerable.ts' />
/// <reference path='./IDrawable.ts' />
/// <reference path='./IContextual.ts' />
/// <reference path='./IHoverable.ts' />
/// <reference path='./IAssociable.ts' />
/// <reference path='./IPaper.ts' />
/// <reference path='./IGrid.ts' />
/// <reference path='./ICanvas.ts' />
/// <reference path='./IField.ts' />
/// <reference path='./IFieldElement.ts' />
/// <reference path='./IPlayer.ts' />
/// <reference path='./IBall.ts' />
/// <reference path='./IGround.ts' />
/// <reference path='./IEndzone.ts' />
/// <reference path='./ILineOfScrimmage.ts' />
/// <reference path='./IHashmark.ts' />
/// <reference path='./ISideline.ts' />
/// <reference path='./IPlayer.ts' />
/// <reference path='./IPlayerSelectionBox.ts' />
/// <reference path='./IPlayerIcon.ts' />
/// <reference path='./IPlayerRelativeCoordinatesLabel.ts' />
/// <reference path='./IPlayerPersonnelLabel.ts' />
/// <reference path='./IPlayerIndexLabel.ts' />
/// <reference path='./IRoute.ts' />
/// <reference path='./IRouteAction.ts' />
/// <reference path='./IRouteControlPath.ts' />
/// <reference path='./IRouteNode.ts' />
/// <reference path='./IRoutePath.ts' />
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Storable = (function () {
            function Storable() {
                this.guid = Common.Utilities.guid();
            }
            Storable.prototype.toJson = function () {
                return {
                    guid: this.guid
                };
            };
            Storable.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.guid = json.guid;
            };
            return Storable;
        })();
        Models.Storable = Storable;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
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
        var Modifiable = (function (_super) {
            __extends(Modifiable, _super);
            function Modifiable() {
                _super.call(this);
                this.lastModified = Date.now();
                this.modified = false;
                this.checksum = null;
                this.original = null;
                // always listening. To prevent re-hashing from occurring when initializing
                // an object, insert the .listen(false) method into the method chain prior
                // to calling a method that will trigger a modification.
                this.listening = true;
                this.callbacks = [];
                this.isContextSet = false;
            }
            Modifiable.prototype.checkContextSet = function () {
                if (!this.context || !this.isContextSet)
                    throw new Error('Modifiable: context is not set. Call setContext(context) before using this class');
            };
            Modifiable.prototype.setContext = function (context) {
                this.context = context;
                this.isContextSet = true;
            };
            /**
             * Allows for switching the listening mechanism on or off
             * within a method chain. listen(false) would prevent
             * any mutation from triggering a rehash. Does not
             * trigger a modification event when setting to true,
             * you must invoke the modification event directly and
             * separately if needed.
             *
             * @param {boolean} startListening true or false
             */
            Modifiable.prototype.listen = function (startListening) {
                this.listening = startListening;
                return this;
            };
            Modifiable.prototype.clearListeners = function () {
                // empty all callbacks
                this.callbacks = [];
            };
            /**
             * Register listeners to be fired when this object is modified.
             * NOTE: the modifier will only keep the listener passed in if
             * listening == true; otherwise, listeners will be ignored.
             *
             * @param {Function} callback function to invoke when a modification
             * occurs to this object.
             */
            Modifiable.prototype.onModified = function (callback) {
                if (this.listening) {
                    this.callbacks.push(callback);
                }
            };
            Modifiable.prototype.isModified = function () {
                if (this.listening) {
                    // current checksum and stored checksum mismatch; modified
                    this.modified = true;
                    // track the modification date/time
                    this.lastModified = Date.now();
                    // invoke each of the modifiable's callbacks
                    for (var i = 0; i < this.callbacks.length; i++) {
                        var callback = this.callbacks[i];
                        callback(this.context);
                    }
                }
            };
            /**
             * Determines whether there are any changes to the object,
             * or allows for explicitly committing a modification to the
             * object to trigger its modification listeners to fire.
             *
             * @param  {boolean} isModified (optional) true forces modification
             * @return {boolean}            returns whether the object is modified
             */
            Modifiable.prototype.setModified = function (forciblyModify) {
                if (!this.listening) {
                    this.modified = false;
                    return false;
                }
                else {
                    var cs = this.generateChecksum();
                    if (forciblyModify || cs !== this.checksum) {
                        // trigger all callbacks listening for changes
                        this.isModified();
                    }
                    else {
                        this.modified = false;
                    }
                    this.checksum = cs;
                }
                return this.modified;
            };
            /**
             * Generates a new checksum from the current object
             * @return {string} the newly generated checksum
             */
            Modifiable.prototype.generateChecksum = function () {
                this.checkContextSet();
                // determine current checksum
                var json = this.context.toJson();
                return Common.Utilities.generateChecksum(json);
            };
            Modifiable.prototype.copy = function (newElement, context) {
                this.checkContextSet();
                var copiedJson = context.toJson();
                newElement.fromJson(copiedJson);
                newElement.setModified(true);
                return newElement;
            };
            Modifiable.prototype.toJson = function () {
                return $.extend({
                    lastModified: this.lastModified,
                    checksum: this.checksum
                }, _super.prototype.toJson.call(this));
            };
            Modifiable.prototype.fromJson = function (json) {
                this.modified = json.modified;
                this.lastModified = json.lastModified;
                this.original = json.checksum;
                this.checksum = Common.Utilities.generateChecksum(this.toJson());
                _super.prototype.fromJson.call(this, json);
            };
            return Modifiable;
        })(Common.Models.Storable);
        Models.Modifiable = Modifiable;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Collection = (function (_super) {
            __extends(Collection, _super);
            function Collection(size) {
                if (!Common.Utilities.isNullOrUndefined(size) && size < 0)
                    throw new Error('Collection constructor(): Cannot create a collection with size < 0');
                _super.call(this);
                _super.prototype.setContext.call(this, this);
                this._count = 0;
                this._keys = new Array(size || 0);
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
                var self = this;
                data.onModified(function () {
                    self.setModified(true);
                });
                this.setModified(true);
            };
            Collection.prototype.replace = function (replaceKey, data) {
                var key = this._getKey(data);
                this._keys[this._keys.indexOf(replaceKey)] = key;
                this[key] = data;
                delete this[replaceKey];
                var self = this;
                data.onModified(function () {
                    self.setModified(true);
                });
                this.setModified(true);
            };
            Collection.prototype.setAtIndex = function (index, data) {
                if (index < 0 || index > this._count - 1)
                    throw new Error('Collection setAtIndex(): index is out of bounds; ' + index);
                var key = this._keys[index];
                if (Common.Utilities.isNullOrUndefined(key))
                    return null;
                this.set(key, data);
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
                    var self_1 = this;
                    data.onModified(function () {
                        self_1.setModified(true);
                    });
                    this.setModified(true);
                }
            };
            Collection.prototype.addAll = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                if (!args)
                    return;
                for (var i = 0; i < args.length; i++) {
                    var item = args[i];
                    if (item) {
                        this.add(item);
                    }
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
                    if (!exists) {
                        this._count++;
                        var self_2 = this;
                        data.onModified(function () {
                            self_2.setModified(true);
                        });
                        this.setModified(true);
                    }
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
            Collection.prototype.only = function (data) {
                this.removeAll();
                this.add(data);
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
                        if (this.clearListeners) {
                            item.clearListeners();
                        }
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
                if (!this[key]) {
                    console.warn('Collection remove(): Tried to remove item, \
					but item with guid does not exist: ', key);
                    return;
                }
                var obj = this[key];
                delete this[key];
                this._keys.splice(this._keys.indexOf(key), 1);
                this._count--;
                this.setModified(true);
                return obj;
            };
            Collection.prototype.empty = function () {
                this.removeAll();
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
                    results.push(element ? element.toJson() : null);
                });
                return results;
            };
            Collection.prototype.getGuids = function () {
                return this._keys;
            };
            return Collection;
        })(Common.Models.Modifiable);
        Models.Collection = Collection;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var LinkedList = (function (_super) {
            __extends(LinkedList, _super);
            function LinkedList() {
                _super.call(this);
                this.root = null;
                this.last = null;
                this._length = 0;
                this._modifiable = new Common.Models.Modifiable();
                this._modifiable.setContext(this);
                this.callbacks = this._modifiable.callbacks;
                this.modified = this._modifiable.modified;
                this.checksum = this._modifiable.checksum;
                this.original = this._modifiable.original;
                this.lastModified = this._modifiable.lastModified;
                this.context = this._modifiable.context;
                this.isContextSet = this._modifiable.isContextSet;
                this.listening = this._modifiable.listening;
            }
            LinkedList.prototype.setModified = function (forciblyModify) {
                var modified = this._modifiable.setModified(forciblyModify === true);
                this.modified = this._modifiable.modified;
                this.checksum = this._modifiable.checksum;
                this.lastModified = this._modifiable.lastModified;
                return modified;
            };
            LinkedList.prototype.onModified = function (callback) {
                var self = this;
                this._modifiable.onModified(callback);
                this.forEach(function (modifiableItem, index) {
                    if (Common.Utilities.isNullOrUndefined(modifiableItem))
                        return;
                    modifiableItem.onModified(function () {
                        // child elements modified, 
                        // propegate changes up to the parent
                        self.setModified(true);
                    });
                });
            };
            LinkedList.prototype.isModified = function () {
                this._modifiable.isModified();
                this.lastModified = this._modifiable.lastModified;
            };
            /**
             * When commanding the collection whether to listen,
             * apply the true/false argument to all of its contents as well
             * @param {boolean} startListening true to start listening, false to stop
             */
            LinkedList.prototype.listen = function (startListening) {
                this._modifiable.listening = startListening;
                this.listening = startListening;
                return this;
            };
            LinkedList.prototype.add = function (node) {
                if (!this.root) {
                    this.root = node;
                    this.root.prev = null;
                }
                else {
                    var temp = this.root;
                    while (temp.next != null) {
                        temp = temp.next;
                    }
                    node.prev = temp;
                    temp.next = node;
                }
                this.last = node;
                this._length++;
                var self = this;
                node.onModified(function () {
                    self.setModified(true);
                });
                this.setModified(true);
            };
            LinkedList.prototype.getIndex = function (index) {
                var count = 0;
                var temp = this.root;
                if (!temp)
                    return null;
                while (temp) {
                    if (count == index)
                        return temp;
                    if (temp.next) {
                        temp = temp.next;
                        count++;
                    }
                    else {
                        return null;
                    }
                }
            };
            LinkedList.prototype.forEach = function (iterator) {
                var index = 0;
                var temp = this.root;
                iterator(temp, index);
                if (!temp)
                    return;
                while (temp.next != null) {
                    temp = temp.next;
                    index++;
                    iterator(temp, index);
                }
            };
            LinkedList.prototype.toJson = function () {
                var arr = [];
                this.forEach(function (node, i) {
                    if (node && node.toJson) {
                        arr.push(node.toJson());
                    }
                });
                return arr;
            };
            LinkedList.prototype.toArray = function () {
                var arr = Array();
                this.forEach(function (node, i) {
                    arr.push(node);
                });
                return arr;
            };
            LinkedList.prototype.getLast = function () {
                return this.last;
            };
            LinkedList.prototype.getRoot = function () {
                return this.root;
            };
            LinkedList.prototype.remove = function (guid) {
                return;
            };
            LinkedList.prototype.size = function () {
                return this._length;
            };
            LinkedList.prototype.hasElements = function () {
                return this.size() > 0;
            };
            LinkedList.prototype.isEmpty = function () {
                return !this.hasElements();
            };
            return LinkedList;
        })(Common.Models.Storable);
        Models.LinkedList = LinkedList;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var ModifiableCollection = (function () {
            function ModifiableCollection(size) {
                this._modifiable = new Common.Models.Modifiable();
                this._modifiable.setContext(this);
                this.callbacks = this._modifiable.callbacks;
                this.modified = this._modifiable.modified;
                this.lastModified = this._modifiable.lastModified;
                this.original = this._modifiable.original;
                this.checksum = this._modifiable.checksum;
                this.context = this._modifiable.context;
                this.isContextSet = this._modifiable.isContextSet;
                this.listening = this._modifiable.listening;
                this._collection = new Common.Models.Collection(size);
                this.guid = this._modifiable.guid;
            }
            ModifiableCollection.prototype.setModified = function (forciblyModify) {
                var modified = this._modifiable.setModified(forciblyModify === true);
                this.modified = this._modifiable.modified;
                this.checksum = this._modifiable.checksum;
                this.lastModified = this._modifiable.lastModified;
                return modified;
            };
            ModifiableCollection.prototype.onModified = function (callback) {
                var self = this;
                this._modifiable.onModified(callback);
                this._collection.forEach(function (modifiableItem, index) {
                    if (Common.Utilities.isNullOrUndefined(modifiableItem))
                        return;
                    modifiableItem.onModified(function () {
                        // child elements modified, 
                        // propegate changes up to the parent
                        self.isModified();
                    });
                });
            };
            ModifiableCollection.prototype.isModified = function () {
                this._modifiable.isModified();
                this.lastModified = this._modifiable.lastModified;
            };
            /**
             * When commanding the collection whether to listen,
             * apply the true/false argument to all of its contents as well
             * @param {boolean} startListening true to start listening, false to stop
             */
            ModifiableCollection.prototype.listen = function (startListening) {
                this._modifiable.listening = startListening;
                this.listening = startListening;
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
            ModifiableCollection.prototype.exists = function (key) {
                return this._collection.exists(key);
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
                var self = this;
                data.onModified(function () {
                    self.setModified(true);
                });
                this.setModified(true);
                return this;
            };
            ModifiableCollection.prototype.replace = function (replaceKey, data) {
                this._collection.replace(replaceKey, data);
                var self = this;
                data.onModified(function () {
                    self.setModified(true);
                });
                this.setModified(true);
                return this;
            };
            ModifiableCollection.prototype.setAtIndex = function (index, data) {
                this._collection.setAtIndex(index, data);
                var self = this;
                data.onModified(function () {
                    self.setModified(true);
                });
                this.setModified(true);
                return this;
            };
            ModifiableCollection.prototype.add = function (data) {
                this._collection.add(data);
                var self = this;
                data.onModified(function () {
                    self.setModified(true);
                });
                this.setModified(true);
                return this;
            };
            ModifiableCollection.prototype.addAll = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                if (!args || args.length == 0)
                    return this;
                (_a = this._collection).addAll.apply(_a, args);
                var self = this;
                for (var i = 0; i < args.length; i++) {
                    var modifiable = args[i];
                    modifiable.onModified(function () {
                        self.setModified(true);
                    });
                }
                this.setModified(true);
                return this;
                var _a;
            };
            ModifiableCollection.prototype.addAtIndex = function (data, index) {
                this._collection.addAtIndex(data, index);
                var self = this;
                data.onModified(function () {
                    self.setModified(true);
                });
                this.setModified(true);
                return this;
            };
            ModifiableCollection.prototype.only = function (data) {
                this._collection.only(data);
                var self = this;
                data.onModified(function () {
                    self.setModified(true);
                });
                this.setModified(true);
                return this;
            };
            ModifiableCollection.prototype.append = function (collection, clearListeners) {
                this._collection.append(collection);
                var self = this;
                collection.forEach(function (modifiable, index) {
                    // clear any existing listeners from the
                    // items in the appended collection and
                    // re-register new listeners
                    if (clearListeners)
                        modifiable.clearListeners();
                    modifiable.onModified(function () {
                        self.setModified(true);
                    });
                });
                this.setModified(true);
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
                this.setModified(true);
                return results;
            };
            ModifiableCollection.prototype.removeAll = function () {
                this._collection.removeAll();
                this.setModified(true);
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
                this.setModified(true);
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
            ModifiableCollection.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this._collection.fromJson(json._collection);
            };
            ModifiableCollection.prototype.copy = function (newElement, context) {
                console.error('ModifiableCollection copy() not implemented');
                return null;
            };
            ModifiableCollection.prototype.getGuids = function () {
                return this._collection.getGuids();
            };
            return ModifiableCollection;
        })();
        Models.ModifiableCollection = ModifiableCollection;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var ContextmenuData = (function () {
            function ContextmenuData(data, pageX, pageY, message) {
                this.data = data;
                this.url = data.contextmenuTemplateUrl;
                this.pageX = pageX;
                this.pageY = pageY;
                this.message = message || 'Contextmenu opened';
            }
            return ContextmenuData;
        })();
        Models.ContextmenuData = ContextmenuData;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Actionable = (function (_super) {
            __extends(Actionable, _super);
            function Actionable(impaktDataType) {
                _super.call(this);
                _super.prototype.setContext.call(this, this);
                this.impaktDataType = impaktDataType;
                this.disabled = false;
                this.selected = false;
                this.clickable = true;
                this.hoverable = true;
                this.dragging = false;
                this.draggable = true;
                this.dragged = false;
                this.selectable = true;
            }
            Actionable.prototype.toJson = function () {
                return _super.prototype.toJson.call(this);
            };
            Actionable.prototype.fromJson = function (json) {
                if (!json)
                    return;
                _super.prototype.fromJson.call(this, json);
            };
            /**
             * Generic selection toggle
             */
            Actionable.prototype.isSelectable = function () {
                return !this.disabled && this.selectable;
            };
            Actionable.prototype.toggleSelect = function () {
                if (!this.isSelectable())
                    return;
                if (this.selected)
                    this.deselect();
                else
                    this.select();
            };
            /**
             * Generic selection method
             */
            Actionable.prototype.select = function () {
                if (!this.isSelectable())
                    return;
                this.selected = true;
            };
            /**
             * Generic deselection method
             */
            Actionable.prototype.deselect = function () {
                if (!this.isSelectable())
                    return;
                this.selected = false;
            };
            /**
             * Generic disable method
             */
            Actionable.prototype.disable = function () {
                this.disabled = true;
            };
            /**
             * Generic enable method
             */
            Actionable.prototype.enable = function () {
                this.disabled = false;
            };
            // TODO @theBull - implement here?
            Actionable.prototype.oncontextmenu = function (fn, context) {
            };
            // TODO @theBull - implement here?
            Actionable.prototype.contextmenu = function (e, context) {
            };
            Actionable.prototype.getContextmenuUrl = function () {
                return this.contextmenuTemplateUrl;
            };
            return Actionable;
        })(Common.Models.Modifiable);
        Models.Actionable = Actionable;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var ActionableCollection = (function (_super) {
            __extends(ActionableCollection, _super);
            function ActionableCollection() {
                _super.call(this);
            }
            ActionableCollection.prototype.toJson = function () {
                return _super.prototype.toJson.call(this);
            };
            ActionableCollection.prototype.fromJson = function (json) {
                _super.prototype.fromJson.call(this, json);
            };
            ActionableCollection.prototype.deselectAll = function () {
                this.forEach(function (element, index) {
                    element.deselect();
                });
            };
            ActionableCollection.prototype.selectAll = function () {
                this.forEach(function (element, index) {
                    element.select();
                });
            };
            ActionableCollection.prototype.select = function (element) {
                if (Common.Utilities.isNullOrUndefined(element))
                    return;
                this.deselectAll();
                var selectedElement = this.get(element.guid);
                if (!Common.Utilities.isNullOrUndefined(selectedElement))
                    selectedElement.select();
            };
            ActionableCollection.prototype.deselect = function (element) {
                if (Common.Utilities.isNullOrUndefined(element))
                    return;
                var deselectedElement = this.get(element.guid);
                if (!Common.Utilities.isNullOrUndefined(deselectedElement))
                    deselectedElement.deselect();
            };
            ActionableCollection.prototype.toggleSelect = function (element) {
                if (Common.Utilities.isNullOrUndefined(element))
                    return;
                if (element.selected)
                    this.deselect(element);
                else
                    this.select(element);
            };
            return ActionableCollection;
        })(Common.Models.Collection);
        Models.ActionableCollection = ActionableCollection;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var AssociableEntity = (function (_super) {
            __extends(AssociableEntity, _super);
            function AssociableEntity(impaktDataType) {
                _super.call(this, impaktDataType);
                this.key = 0;
                this.impaktDataType = impaktDataType;
                this.associationKey = null;
            }
            AssociableEntity.prototype.generateAssociationKey = function () {
                this.associationKey = [
                    this.impaktDataType,
                    '|',
                    this.key,
                    '|',
                    this.guid
                ].join('');
            };
            AssociableEntity.prototype.toJson = function () {
                return $.extend({
                    key: this.key,
                    impaktDataType: this.impaktDataType,
                    associationKey: this.associationKey
                }, _super.prototype.toJson.call(this));
            };
            AssociableEntity.prototype.fromJson = function (json) {
                if (!json)
                    throw new Error('AssociableEntity fromJson(): json is null or undefined');
                this.key = json.key;
                this.impaktDataType = json.impaktDataType;
                _super.prototype.fromJson.call(this, json);
                if (Common.Utilities.isNullOrUndefined(json.associationKey)) {
                    this.generateAssociationKey();
                }
                else {
                    this.associationKey = json.associationKey;
                }
            };
            return AssociableEntity;
        })(Common.Models.Actionable);
        Models.AssociableEntity = AssociableEntity;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var AssociableEntityCollection = (function (_super) {
            __extends(AssociableEntityCollection, _super);
            function AssociableEntityCollection(impaktDataType, size) {
                _super.call(this, size);
                this._associableEntity = new Common.Models.AssociableEntity(impaktDataType);
            }
            AssociableEntityCollection.prototype.toJson = function () {
                return $.extend(this._associableEntity.toJson(), _super.prototype.toJson.call(this));
            };
            AssociableEntityCollection.prototype.fromJson = function (json) {
                if (!json)
                    throw new Error('AssociableEntity fromJson(): json is null or undefined');
                this._associableEntity.fromJson(json);
                _super.prototype.fromJson.call(this, json);
            };
            return AssociableEntityCollection;
        })(Common.Models.Collection);
        Models.AssociableEntityCollection = AssociableEntityCollection;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var AssociationCollection = (function (_super) {
            __extends(AssociationCollection, _super);
            function AssociationCollection(contextId) {
                _super.call(this);
                _super.prototype.setContext.call(this, this);
                this._data = {};
                this._size = 0;
                this.contextId = contextId;
            }
            /**
             * Returns the size of the association collection
             * @return {number} size
             */
            AssociationCollection.prototype.size = function () {
                return this._size;
            };
            /**
             * Returns whether the association collection has elements
             * @return {boolean} true or false
             */
            AssociationCollection.prototype.isEmpty = function () {
                return this.size() == 0;
            };
            /**
             * Returns whether the array has elements
             * @return {boolean} true or false
             */
            AssociationCollection.prototype.hasElements = function () {
                return this.size() > 0;
            };
            /**
             * Creates an association, and an inverse association, between
             * the two given entities.
             *
             * @param {Common.Interfaces.IAssociable} fromEntity [description]
             * @param {Common.Interfaces.IAssociable} toEntity   [description]
             */
            AssociationCollection.prototype.add = function (fromEntity, toEntity) {
                var fromAssociation = new Common.Models.Association(fromEntity.key, fromEntity.impaktDataType, fromEntity.guid, toEntity.key, toEntity.impaktDataType, toEntity.guid, this.contextId);
                this.addAssociation(fromAssociation);
            };
            /**
             * Creates an association between the given entity and all of the
             * given array of entities.
             *
             * @param {Common.Interfaces.IAssociable}   fromEntity [description]
             * @param {Common.Interfaces.IAssociable[]} entities   [description]
             */
            AssociationCollection.prototype.addAll = function (fromEntity, entities) {
                if (Common.Utilities.isNullOrUndefined(entities))
                    throw new Error('AssociationCollection addAll(): entities[] is null or undefined');
                for (var i = 0; i < entities.length; i++) {
                    var toEntity = entities[i];
                    if (Common.Utilities.isNullOrUndefined(toEntity))
                        continue;
                    var fromAssociation = new Common.Models.Association(fromEntity.key, fromEntity.impaktDataType, fromEntity.guid, toEntity.key, toEntity.impaktDataType, toEntity.guid, this.contextId);
                    this.addAssociation(fromAssociation);
                }
            };
            /**
             * Creates an 'inverse' association with the given association, and
             * adds both to the association collection
             *
             * @param {Common.Models.Association} association the 'from' association
             */
            AssociationCollection.prototype.addAssociation = function (association) {
                var toAssociation = new Common.Models.Association(association.toKey, association.toType, association.toGuid, association.fromKey, association.fromType, association.fromGuid, this.contextId);
                if (!this._data[association.internalKey]) {
                    this._data[association.internalKey] = [];
                    this._size++;
                }
                if (this._data[association.internalKey].indexOf(toAssociation.internalKey) < 0)
                    this._data[association.internalKey].push(toAssociation.internalKey);
                if (!this._data[toAssociation.internalKey]) {
                    this._data[toAssociation.internalKey] = [];
                    this._size++;
                }
                if (this._data[toAssociation.internalKey].indexOf(association.internalKey) < 0)
                    this._data[toAssociation.internalKey].push(association.internalKey);
            };
            AssociationCollection.prototype.addInternalKey = function (internalKey, associations) {
                if (Common.Utilities.isNullOrUndefined(internalKey) ||
                    Common.Utilities.isNullOrUndefined(associations)) {
                    throw new Error('AssociationCollection addInternalKey(): \
					internalKey or associations[] is null or undefined');
                }
                if (this.exists(internalKey)) {
                    // merge the internalKey's associations
                    // with the existing internalKey's associations
                    this._data[internalKey] = Common.Utilities.uniqueArray(this._data[internalKey].concat(associations));
                }
                else {
                    this._data[internalKey] = associations;
                    this._size++;
                }
            };
            /**
             * Merges another association collection into this association collection;
             * ignores any duplicate entries.
             *
             * @param {Common.Models.AssociationCollection} associationCollection association collection to merge
             */
            AssociationCollection.prototype.merge = function (associationCollection) {
                if (Common.Utilities.isNullOrUndefined(associationCollection))
                    throw new Error('AssignmentCollection merge(): associationCollection to \
					merge is null or undefined');
                if (associationCollection.isEmpty())
                    return;
                // iterate over all entries in associationCollection to merge
                var targetCollection = this;
                associationCollection.forEach(function (self, internalKey) {
                    // gather the to merge collection's array of associations
                    var associations = self.getByInternalKey(internalKey);
                    // add the internalKey to the target collection with blank array
                    targetCollection.addInternalKey(internalKey, associations);
                });
            };
            AssociationCollection.prototype.getByInternalKey = function (internalKey) {
                if (Common.Utilities.isNullOrUndefined(internalKey))
                    throw new Error('AssociationCollection get(): internalKey is null or undefined');
                return this._data[internalKey];
            };
            AssociationCollection.prototype.hasAssociations = function (internalKey) {
                if (Common.Utilities.isNullOrUndefined(internalKey))
                    throw new Error('AssociationCollection hasAssociations(): internalKey is null or undefined');
                if (!this.exists(internalKey)) {
                    return false;
                }
                var associations = this._data[internalKey];
                if (Common.Utilities.isNullOrUndefined(associations)) {
                    // shouldn't be null or undefined, so let's set it
                    // for proper house keeping...any issues with this,
                    // or any reason an internal key might point to null/undefined?
                    this._data[internalKey] = [];
                }
                return associations.length > 0;
            };
            AssociationCollection.prototype.empty = function () {
                this._data = {};
                this._size = 0;
            };
            AssociationCollection.prototype.delete = function (internalKey) {
                if (Common.Utilities.isNullOrUndefined(internalKey))
                    throw new Error('AssociationCollection remove(): internalKey is null or undefined');
                var associationsRemoved = new Common.Models.AssociationCollection(this.contextId);
                if (this.exists(internalKey)) {
                    var internalKeyParts = Common.Models.Association.parse(internalKey);
                    var associations = this._data[internalKey];
                    for (var i = 0; i < associations.length; i++) {
                        if (Common.Utilities.isNullOrUndefined(associations[i]))
                            continue;
                        var associatedKeyParts = Common.Models.Association.parse(associations[i]);
                        var association = new Common.Models.Association(internalKeyParts.entityKey, internalKeyParts.entityType, internalKeyParts.entityGuid, associatedKeyParts.entityKey, associatedKeyParts.entityType, associatedKeyParts.entityGuid, this.contextId);
                        associationsRemoved.addAssociation(association);
                    }
                    delete this._data[internalKey];
                    this._size--;
                    this.forEach(function (self, associationKey) {
                        var associations = self._data[associationKey].associations;
                        if (!associations || associations.length == 0) {
                            // Clean up; we shouldn't have empty arrays
                            // in the associations collection; we know that
                            // if there is only 1 element in the associations array,
                            // then we should effectively 
                            delete self._data[associationKey];
                            self._size--;
                            return;
                        }
                        if (associations.length > 0) {
                            var index = associations.indexOf(internalKey);
                            if (index >= 0) {
                                associations.splice(index, 1);
                                if (associations.length == 0) {
                                    delete self._data[associationKey];
                                    self._size--;
                                }
                            }
                        }
                    });
                }
                return associationsRemoved;
            };
            /**
             * Removes the association ONLY between the two entities, and only
             * completely removes them if their respective association arrays
             * are empty as a result.
             *
             * @param {Common.Interfaces.IAssociable} fromEntity [description]
             * @param {Common.Interfaces.IAssociable} toEntity   [description]
             */
            AssociationCollection.prototype.disassociate = function (fromEntity, toEntity) {
                if (Common.Utilities.isNullOrUndefined(fromEntity) ||
                    Common.Utilities.isNullOrUndefined(toEntity))
                    throw new Error('AssociationCollection disassociate(): from or to entity is null or undefined');
                var fromAssociation = new Common.Models.Association(fromEntity.key, fromEntity.impaktDataType, fromEntity.guid, toEntity.key, toEntity.impaktDataType, toEntity.guid, this.contextId);
                var toAssociation = new Common.Models.Association(toEntity.key, toEntity.impaktDataType, toEntity.guid, fromEntity.key, fromEntity.impaktDataType, fromEntity.guid, this.contextId);
                var fromAssociations = this._data[fromAssociation.internalKey];
                if (!Common.Utilities.isNullOrUndefined(fromAssociations)) {
                    if (fromAssociations.length > 1) {
                        var index = fromAssociations.indexOf(toAssociation.internalKey);
                        if (index >= 0) {
                            fromAssociations.splice(index, 1);
                        }
                    }
                    else {
                        delete this._data[fromAssociation.internalKey];
                        this._size--;
                    }
                }
                else {
                    throw new Error('AssociationCollection disassociate(): No from association found');
                }
                var toAssociations = this._data[toAssociation.internalKey];
                if (!Common.Utilities.isNullOrUndefined(toAssociations)) {
                    if (toAssociations.length > 1) {
                        var index = toAssociations.indexOf(fromAssociation.internalKey);
                        if (index >= 0) {
                            toAssociations.splice(index, 1);
                        }
                    }
                    else {
                        delete this._data[toAssociation.internalKey];
                        this._size--;
                    }
                }
                else {
                    throw new Error('AssociationCollection disassociate(): No to association found');
                }
            };
            /**
             * Returns whether the given guid exists
             * @param  {string}  guid the guid to check
             * @return {boolean}      true if it exists, otherwise false
             */
            AssociationCollection.prototype.exists = function (internalKey) {
                return !Common.Utilities.isNullOrUndefined(this._data[internalKey]);
            };
            /**
             * Returns whether there is an existing association between the given
             * 'from' internalKey, 'to' the given internal key
             * @param  {string}  fromInternalKey [description]
             * @param  {string}  toInternalKey   [description]
             * @return {boolean}                 [description]
             */
            AssociationCollection.prototype.associationExists = function (fromInternalKey, toInternalKey) {
                if (this.exists(fromInternalKey)) {
                    var associations = this.getByInternalKey(fromInternalKey);
                    return associations.indexOf(toInternalKey) >= 0;
                }
                else {
                    return false;
                }
            };
            /**
             * Replaces guid1, if found, with guid2
             * @param  {string} guid1 guid to be replaced
             * @param  {string} guid2 guid to replace with
             */
            AssociationCollection.prototype.replace = function (guid1, guid2) {
                // TODO @theBull
            };
            /**
             * Iterates over each element in the array
             * @param {Function} iterator the iterator function to call per element
             */
            AssociationCollection.prototype.forEach = function (iterator) {
                // TODO @theBull
                for (var internalKey in this._data) {
                    iterator(this, internalKey);
                }
            };
            AssociationCollection.prototype.toArray = function (toJson) {
                toJson = toJson === true;
                var array = [];
                for (var fromInternalKey in this._data) {
                    var fromParts = Common.Models.Association.parse(fromInternalKey);
                    var associations = this._data[fromInternalKey];
                    for (var i = 0; i < associations.length; i++) {
                        var toInternalKey = associations[i];
                        var toParts = Common.Models.Association.parse(toInternalKey);
                        var association = new Common.Models.Association(fromParts.entityKey, fromParts.entityType, fromParts.entityGuid, toParts.entityKey, toParts.entityType, toParts.entityGuid, this.contextId);
                        if (toJson) {
                            array.push(association.toJson());
                        }
                        else {
                            array.push(association);
                        }
                    }
                }
                return array;
            };
            AssociationCollection.prototype.toJson = function () {
                return this.toArray(true);
            };
            AssociationCollection.prototype.fromJson = function (json) {
                if (!json)
                    return;
                // iterate over array of associations
                for (var i = 0; i < json.length; i++) {
                    var rawAssociation = json[i];
                    if (Common.Utilities.isNullOrUndefined(rawAssociation)) {
                        throw new Error('AssociationCollection fromJson(): an association result\
						is null or undefined');
                    }
                    if (Common.Utilities.isNullOrUndefined(rawAssociation.data)) {
                        throw new Error('AssociationCollection fromJson(): the data property of\
						an association result is null or undefined');
                    }
                    var association = new Common.Models.Association(rawAssociation.fromKey, rawAssociation.fromType, rawAssociation.data.fromGuid, rawAssociation.toKey, rawAssociation.toType, rawAssociation.data.toGuid, rawAssociation.contextID);
                    if (!this.exists(association.internalKey)) {
                        this.addAssociation(association);
                    }
                }
            };
            AssociationCollection.prototype.getInternalKeys = function () {
                var internalKeyArray = [];
                for (var internalKey in this._data) {
                    internalKeyArray.push(internalKey);
                }
                return internalKeyArray;
            };
            return AssociationCollection;
        })(Common.Models.Modifiable);
        Models.AssociationCollection = AssociationCollection;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        /**
         * Associates an element with one or more other elements
         * by guid.
         */
        var Association = (function (_super) {
            __extends(Association, _super);
            function Association(fromKey, fromType, fromGuid, toKey, toType, toGuid, contextId) {
                _super.call(this);
                _super.prototype.setContext.call(this, this);
                this.fromKey = fromKey;
                this.fromType = fromType;
                this.fromGuid = fromGuid;
                this.toKey = toKey;
                this.toType = toType;
                this.toGuid = toGuid;
                this.data = {
                    guid: this.guid,
                    fromGuid: this.fromGuid,
                    toGuid: this.toGuid
                };
                this.version = 1;
                this.contextId = contextId;
                this.internalKey = Common.Models.Association.buildKey(this);
                this.associationType = Common.Enums.AssociationTypes.Peer;
            }
            Association.buildKey = function (association) {
                return [association.fromType, '|', association.fromKey, '|', association.fromGuid].join('');
            };
            Association.parse = function (internalKey) {
                if (Common.Utilities.isNullOrUndefined(internalKey))
                    throw new Error('Association parse(): internalKey is null or undefined');
                var parts = internalKey.split('|');
                if (parts.length <= 0)
                    throw new Error('Association parse(): internalKey is invalid; missing "|" separator');
                if (parts.length != Common.Models.Association.KEY_PART_LENGTH)
                    throw new Error('Association parse(): internalKey is invalid; invalid number of parts');
                // assume by this point we have an array of 3 parts
                // part 1: EntityType
                // part 2: EntityKey (fromKey)
                // part 3: Entity guid (client-generated for quick lookup)
                // - get the entity type
                // - ensure it exists in the ImpaktDataTypes enum
                if (Common.Utilities.isNullOrUndefined(parts[0])) {
                    throw new Error('Association parse(): internalKey is invalid; entityType is null or undefined');
                }
                var entityType = parseInt(parts[0]);
                if (Common.Utilities.isNullOrUndefined(Common.Enums.ImpaktDataTypes[entityType])) {
                    throw new Error('Association parse(): internalKey is invalid; entityType is not valid ImpaktDataType');
                }
                // - get the entity key
                // - ensure it is a valid key
                if (Common.Utilities.isNullOrUndefined(parts[1]) || parseInt(parts[1]) <= 0) {
                    throw new Error('Association parse(): internalKey is invalid; entityKey is invalid');
                }
                var entityKey = parseInt(parts[1]);
                // - get the entity guid
                if (Common.Utilities.isNullOrUndefined(parts[2])) {
                    throw new Error('Association parse(): internalKey is invalid; entity guid is null or undefined');
                }
                var entityGuid = parts[2];
                return new Common.Models.AssociationParts(entityType, entityKey, entityGuid);
            };
            Association.prototype.toJson = function () {
                return {
                    fromKey: this.fromKey,
                    fromType: this.fromType,
                    toKey: this.toKey,
                    toType: this.toType,
                    contextID: this.contextId + '',
                    data: this.data,
                    version: this.version,
                    associationType: this.associationType
                };
            };
            Association.prototype.fromJson = function (json) {
                if (!json)
                    return;
                if (json.data) {
                    this.guid = json.data.guid;
                    this.fromGuid = json.data.fromGuid;
                    this.toGuid = json.data.toGuid;
                }
                else {
                    throw new Error('Association fromJson(): data is null or undefined');
                }
                this.fromKey = json.fromKey;
                this.fromType = json.fromType;
                this.toKey = json.toKey;
                this.toType = json.toType;
                this.contextId = json.contextID;
                this.data = json.data;
                this.associationType = json.associationType;
                this.version = json.version;
            };
            Association.KEY_PART_LENGTH = 3;
            return Association;
        })(Common.Models.Modifiable);
        Models.Association = Association;
        var AssociationParts = (function () {
            function AssociationParts(entityType, entityKey, guid) {
                this.entityType = entityType;
                this.entityKey = entityKey;
                this.entityGuid = guid;
            }
            return AssociationParts;
        })();
        Models.AssociationParts = AssociationParts;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Notification = (function (_super) {
            __extends(Notification, _super);
            function Notification(message, type) {
                _super.call(this);
                _super.prototype.setContext.call(this, this);
                this.message = message;
                this.type = type;
            }
            /**
             * Updates this notification with the given message and type
             * @param  {string}                         updatedMessage New message to display
             * @param  {Common.Models.NotificationType} updatedType    New type to display as
             * @return {Common.Models.Notification}                    This updated notification
             */
            Notification.prototype.update = function (updatedMessage, updatedType) {
                this.message = updatedMessage;
                this.type = updatedType;
                return this;
            };
            /**
             * Shorthand to update this notification as successful
             * @param  {string}                     message The updated message to display
             * @return {Common.Models.Notification}         This updated success notification
             */
            Notification.prototype.success = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return this.update(this._concat(args), Common.Models.NotificationType.Success);
            };
            /**
             * Shorthand to update this notification as an error
             * @param  {string}                     message The updated error message to display
             * @return {Common.Models.Notification}         This updated error notification
             */
            Notification.prototype.error = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return this.update(this._concat(args), Common.Models.NotificationType.Error);
            };
            /**
             * Shorthand to update this notification as a warning
             * @param  {string}                     message The updated warning message to display
             * @return {Common.Models.Notification}         This updated warning notification
             */
            Notification.prototype.warning = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return this.update(this._concat(args), Common.Models.NotificationType.Warning);
            };
            /**
             * Shorthand to update this notification as an info notification
             * @param  {string}                     message The updated info message to display
             * @return {Common.Models.Notification}         This updated info notification
             */
            Notification.prototype.info = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return this.update(this._concat(args), Common.Models.NotificationType.Info);
            };
            /**
             * Shorthand to update this notification as pending
             * @param  {string}                     message The updated pending message to display
             * @return {Common.Models.Notification}         This updated pending notification
             */
            Notification.prototype.pending = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return this.update(this._concat(args), Common.Models.NotificationType.Pending);
            };
            Notification.prototype._concat = function (args) {
                return !args || !args.length || args.length <= 0 ? '' : args.join('');
            };
            return Notification;
        })(Common.Models.Modifiable);
        Models.Notification = Notification;
        (function (NotificationType) {
            NotificationType[NotificationType["None"] = 0] = "None";
            NotificationType[NotificationType["Success"] = 1] = "Success";
            NotificationType[NotificationType["Error"] = 2] = "Error";
            NotificationType[NotificationType["Warning"] = 3] = "Warning";
            NotificationType[NotificationType["Info"] = 4] = "Info";
            NotificationType[NotificationType["Pending"] = 5] = "Pending";
        })(Models.NotificationType || (Models.NotificationType = {}));
        var NotificationType = Models.NotificationType;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var NotificationCollection = (function (_super) {
            __extends(NotificationCollection, _super);
            function NotificationCollection() {
                _super.call(this);
            }
            return NotificationCollection;
        })(Common.Models.Collection);
        Models.NotificationCollection = NotificationCollection;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Icons;
    (function (Icons) {
        var Glyphicon = (function () {
            function Glyphicon(icon) {
                this.prefix = 'glyphicon glyphicon-';
                this.icon = 'asterisk';
                this.icon = icon || this.icon;
            }
            Object.defineProperty(Glyphicon.prototype, "name", {
                get: function () {
                    return this.prefix + this.icon;
                },
                set: function (n) {
                    this.name = n;
                },
                enumerable: true,
                configurable: true
            });
            return Glyphicon;
        })();
        Icons.Glyphicon = Glyphicon;
    })(Icons = Common.Icons || (Common.Icons = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Assignment = (function (_super) {
            __extends(Assignment, _super);
            function Assignment(unitType) {
                _super.call(this, Common.Enums.ImpaktDataTypes.Assignment);
                _super.prototype.setContext.call(this, this);
                this.unitType = unitType;
                this.routes = new Common.Models.RouteCollection();
                this.positionIndex = -1;
                this.setType = Common.Enums.SetTypes.Assignment;
                var self = this;
                this.routes.onModified(function () {
                    self.setModified(true);
                });
            }
            Assignment.prototype.remove = function () {
                this.routes.forEach(function (route, index) {
                    route.remove();
                });
            };
            Assignment.prototype.setContext = function (context) {
                this.routes.forEach(function (route, index) {
                    route.setContext(context);
                });
            };
            Assignment.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.routes.fromJson(json.routes);
                this.positionIndex = json.positionIndex;
                this.unitType = json.unitType;
                _super.prototype.fromJson.call(this, json);
            };
            Assignment.prototype.toJson = function () {
                return $.extend({
                    routes: this.routes.toJson(),
                    positionIndex: this.positionIndex,
                    unitType: this.unitType
                }, _super.prototype.toJson.call(this));
            };
            return Assignment;
        })(Common.Models.AssociableEntity);
        Models.Assignment = Assignment;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var AssignmentGroup = (function (_super) {
            __extends(AssignmentGroup, _super);
            // at this point I'm expecting an object literal with data / count
            // properties, but not a valid AssignmentCollection; Essentially
            // this is to get around 
            function AssignmentGroup(unitType, count) {
                _super.call(this, Common.Enums.ImpaktDataTypes.AssignmentGroup);
                this.unitType = unitType;
                this.assignments = new Common.Models.Collection(11);
                if (count) {
                    for (var i = 0; i < count; i++) {
                        var assignment = new Common.Models.Assignment(this.unitType);
                        assignment.positionIndex = i;
                        this.assignments.add(assignment);
                    }
                }
                this.name = 'Untitled';
                this.key = -1;
                this.onModified(function () {
                    // TODO
                });
            }
            AssignmentGroup.prototype.toJson = function () {
                return $.extend({
                    unitType: this.unitType,
                    name: this.name,
                    assignments: this.assignments.toJson()
                }, _super.prototype.toJson.call(this));
            };
            AssignmentGroup.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.unitType = json.unitType;
                this.name = json.name;
                var assignments = json.assignments || [];
                for (var i = 0; i < assignments.length; i++) {
                    var rawAssignment = assignments[i];
                    if (Common.Utilities.isNullOrUndefined(rawAssignment))
                        continue;
                    rawAssignment.unitType = !Common.Utilities.isNullOrUndefined(rawAssignment.unitType) &&
                        rawAssignment.unitType >= 0 ? rawAssignment.unitTpe : Team.Enums.UnitTypes.Other;
                    var assignmentModel = new Common.Models.Assignment(rawAssignment.unitType);
                    assignmentModel.fromJson(rawAssignment);
                    this.assignments.add(assignmentModel);
                }
                _super.prototype.fromJson.call(this, json);
            };
            AssignmentGroup.prototype.getAssignmentByPositionIndex = function (index) {
                var result = null;
                if (this.assignments.hasElements()) {
                    result = this.assignments.filterFirst(function (assignment) {
                        return assignment.positionIndex == index;
                    });
                }
                return result;
            };
            return AssignmentGroup;
        })(Common.Models.AssociableEntity);
        Models.AssignmentGroup = AssignmentGroup;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var AssignmentGroupCollection = (function (_super) {
            __extends(AssignmentGroupCollection, _super);
            // at this point I'm expecting an object literal with data / count
            // properties, but not a valid AssignmentCollection; Essentially
            // this is to get around 
            function AssignmentGroupCollection(unitType) {
                _super.call(this);
                this.unitType = unitType;
                this.onModified(function () {
                    // TODO
                });
            }
            AssignmentGroupCollection.prototype.toJson = function () {
                return {
                    unitType: this.unitType,
                    assignmentCollections: _super.prototype.toJson.call(this)
                };
            };
            AssignmentGroupCollection.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.unitType = json.unitType;
                var assignmentCollections = json.assignmentCollections || [];
                for (var i = 0; i < assignmentCollections.length; i++) {
                    var rawAssignmentCollection = assignmentCollections[i];
                    if (Common.Utilities.isNullOrUndefined(rawAssignmentCollection))
                        continue;
                    rawAssignmentCollection.unitType =
                        !Common.Utilities.isNullOrUndefined(rawAssignmentCollection.unitType) &&
                            rawAssignmentCollection.unitType >= 0 ?
                            rawAssignmentCollection.unitTpe :
                            Team.Enums.UnitTypes.Other;
                    var assignmentCollection = new Common.Models.AssignmentGroup(rawAssignmentCollection.unitType);
                    assignmentCollection.fromJson(rawAssignmentCollection);
                    this.add(assignmentCollection);
                }
            };
            return AssignmentGroupCollection;
        })(Common.Models.ActionableCollection);
        Models.AssignmentGroupCollection = AssignmentGroupCollection;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Formation = (function (_super) {
            __extends(Formation, _super);
            function Formation(unitType) {
                _super.call(this, Common.Enums.ImpaktDataTypes.Formation);
                this.unitType = unitType;
                this.parentRK = 1;
                this.editorType = Playbook.Enums.EditorTypes.Formation;
                this.name = name || 'New formation';
                this.placements = new Common.Models.PlacementCollection();
                this.png = null;
                //this.setDefault();
                var self = this;
                this.onModified(function () { });
                this.placements.onModified(function () {
                    self.setModified(true);
                });
            }
            Formation.prototype.copy = function (newFormation) {
                var copyFormation = newFormation || new Common.Models.Formation(this.unitType);
                return _super.prototype.copy.call(this, copyFormation, this);
            };
            Formation.prototype.toJson = function () {
                return $.extend({
                    name: this.name,
                    parentRK: this.parentRK,
                    unitType: this.unitType,
                    editorType: this.editorType,
                    placements: this.placements.toJson(),
                    png: this.png
                }, _super.prototype.toJson.call(this));
            };
            Formation.prototype.fromJson = function (json) {
                if (!json)
                    return;
                var self = this;
                this.parentRK = json.parentRK;
                this.editorType = Playbook.Enums.EditorTypes.Formation;
                this.name = json.name;
                this.unitType = json.unitType;
                this.placements.fromJson(json.placements);
                this.png = json.png;
                _super.prototype.fromJson.call(this, json);
                this.placements.onModified(function () {
                    console.log('formation modified: placement collection:', self.guid);
                    self.setModified(true);
                });
                this.onModified(function () {
                    console.log('formation modified?', self.modified);
                });
            };
            Formation.prototype.setDefault = function (ball) {
                if (!ball)
                    throw new Error('Formation setDefault(): \
					Field reference is null or undefined');
                this.placements.removeAll();
                this.placements.addAll(new Common.Models.Placement(0, -1, ball, 0), new Common.Models.Placement(1.5, -1, ball, 1), new Common.Models.Placement(-1.5, -1, ball, 2), new Common.Models.Placement(-3, -1, ball, 3), new Common.Models.Placement(3, -1, ball, 4), new Common.Models.Placement(0, -2, ball, 5), new Common.Models.Placement(-4, -2, ball, 6), new Common.Models.Placement(-16, -1, ball, 7), new Common.Models.Placement(14, -1, ball, 8), new Common.Models.Placement(0, -4, ball, 9), new Common.Models.Placement(0, -6, ball, 10));
            };
            Formation.prototype.isValid = function () {
                // TODO add validation for 7 players on LOS
                return this.placements.size() == 11;
            };
            Formation.prototype.setPlacements = function (placements) {
                this.placements = placements;
                this.setModified(true);
            };
            return Formation;
        })(Common.Models.AssociableEntity);
        Models.Formation = Formation;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var FormationCollection = (function (_super) {
            __extends(FormationCollection, _super);
            // at this point I'm expecting an object literal with data / count
            // properties, but not a valid FormationCollection; Essentially
            // this is to get around 
            function FormationCollection(unitType) {
                _super.call(this);
                this.parentRK = -1;
                this.unitType = unitType;
                this.onModified(function () { });
            }
            FormationCollection.prototype.toJson = function () {
                return {
                    formations: _super.prototype.toJson.call(this),
                    unitType: this.unitType,
                    guid: this.guid
                };
            };
            FormationCollection.prototype.fromJson = function (json) {
                if (!json)
                    return;
                // this.guid = json.guid || this.guid;
                // this.unitType = json.unitType || this.unitType;
                // this.parentRK = json.parentRK || this.parentRK
                var self = this;
                var formations = json || [];
                for (var i = 0; i < formations.length; i++) {
                    var rawFormation = formations[i];
                    if (Common.Utilities.isNullOrUndefined(rawFormation))
                        continue;
                    rawFormation.unitType = !Common.Utilities.isNullOrUndefined(rawFormation.unitType) &&
                        rawFormation.unitType >= 0 ? rawFormation.unitType : Team.Enums.UnitTypes.Other;
                    var formationModel = new Common.Models.Formation(rawFormation.unitType);
                    formationModel.fromJson(rawFormation);
                    this.add(formationModel);
                }
                this.forEach(function (formation, index) {
                    formation.onModified(function () {
                        console.log('formation collection modified: formation');
                        self.setModified(true);
                    });
                });
            };
            return FormationCollection;
        })(Common.Models.ActionableCollection);
        Models.FormationCollection = FormationCollection;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Play = (function (_super) {
            __extends(Play, _super);
            function Play(unitType) {
                _super.call(this, Common.Enums.ImpaktDataTypes.Play);
                this.field = null;
                this.name = 'New play';
                this.unitType = unitType;
                this.assignmentGroup = null;
                this.formation = null;
                this.personnel = null;
                this.editorType = Playbook.Enums.EditorTypes.Play;
                this.png = null;
                this.contextmenuTemplateUrl = Common.Constants.PLAY_CONTEXTMENU_TEMPLATE_URL;
            }
            Play.prototype.setPlaybook = function (playbook) {
                // TODO @theBull - handle associations
                // TODO @theBull
                // - add playbook field?
                // - what happens when changing to playbooks of different unit types? 
                this.setModified(true);
            };
            Play.prototype.setFormation = function (formation) {
                if (!Common.Utilities.isNullOrUndefined(formation)) {
                    if (formation.unitType != this.unitType) {
                    }
                }
                else {
                    this.setAssignmentGroup(null);
                    this.setPersonnel(null);
                }
                this.formation = formation;
                this.unitType = formation.unitType;
                this.setModified(true);
            };
            Play.prototype.setAssignmentGroup = function (assignmentGroup) {
                if (!Common.Utilities.isNullOrUndefined(assignmentGroup)) {
                    if (assignmentGroup.unitType != this.unitType)
                        throw new Error('Play setAssignmentGroup(): Assignments unit type does not match play unit type');
                }
                else {
                }
                this.assignmentGroup = assignmentGroup;
                this.setModified(true);
            };
            Play.prototype.setPersonnel = function (personnel) {
                if (!Common.Utilities.isNullOrUndefined(personnel)) {
                    if (personnel.unitType != this.unitType)
                        throw new Error('Play setPersonnel(): Cannot apply personnel with different unit type.');
                }
                else {
                }
                this.personnel = personnel;
                this.setModified(true);
            };
            Play.prototype.setUnitType = function (unitType) {
                this.isFieldSet(this.field);
                this.isBallSet(this.field.ball);
                // 1. if formation doesn't match unit type, select default formation
                // of unit type
                if (this.formation && this.formation.unitType != unitType) {
                    var confirmed = confirm('Formation unit type mismatch.\nContinue with a default formation of the correct unit type?');
                    if (confirmed) {
                        this.formation.unitType = unitType;
                    }
                    else {
                        return;
                    }
                }
                // Handle the formation / confirm dialog first; that way if user clicks cancel
                // in the confirm, we don't end up setting the play's unit type anyway.
                this.unitType = unitType;
                // 2. if personnel doesn't match unit type, select default personnel
                // of unit type
                if (this.personnel && this.personnel.unitType != unitType) {
                    this.personnel.unitType = unitType;
                    this.personnel.setDefault();
                }
                // 3. if assignments do not match unit type, clear them.
                if (this.assignmentGroup.unitType != this.unitType) {
                    this.assignmentGroup = new Common.Models.AssignmentGroup(this.unitType);
                }
            };
            Play.prototype.draw = function (field) {
                this.isFieldSet(field);
                this.isBallSet(field.ball);
                this.field = field;
                // Clear the players
                this.field.clearPlayers();
                var self = this;
                // set defaults, in case no assignments / personnel were assigned
                if (!this.personnel) {
                    this.personnel = new Team.Models.Personnel(this.unitType);
                }
                if (!this.personnel.positions) {
                    this.personnel.setDefault();
                }
                if (!this.assignmentGroup) {
                    this.assignmentGroup = new Common.Models.AssignmentGroup(this.unitType);
                }
                if (!this.formation) {
                    this.formation = new Common.Models.Formation(this.unitType);
                }
                if (!this.formation.placements || this.formation.placements.isEmpty()) {
                    this.formation.setDefault(this.field.ball);
                }
                this.formation.placements.forEach(function (placement, index) {
                    var position = self.personnel.positions.getIndex(index);
                    var assignment = self.assignmentGroup.assignments.getIndex(index);
                    self.field.addPlayer(placement, position, assignment);
                });
            };
            Play.prototype.fromJson = function (json) {
                // TODO
                this.name = json.name;
                this.unitType = json.unitType;
                this.editorType = json.editorType;
                this.png = json.png;
                _super.prototype.fromJson.call(this, json);
            };
            Play.prototype.toJson = function () {
                return $.extend({
                    name: this.name,
                    unitType: this.unitType,
                    editorType: this.editorType,
                    png: this.png
                }, _super.prototype.toJson.call(this));
            };
            Play.prototype.hasAssignments = function () {
                return this.assignmentGroup && this.assignmentGroup.assignments.size() > 0;
            };
            Play.prototype.setDefault = function (field) {
                this.isFieldSet(field);
                this.field = field;
                // empty what's already there, if anything...
                if (!this.personnel)
                    this.personnel = new Team.Models.Personnel(this.unitType);
                if (!this.formation)
                    this.formation = new Common.Models.Formation(this.unitType);
                this.personnel.setDefault();
                this.formation.setDefault(this.field.ball);
                // assignments?
                // this.draw(field);
            };
            Play.prototype.getOpposingUnitType = function () {
                var opponentUnitType = Team.Enums.UnitTypes.Other;
                switch (this.unitType) {
                    case Team.Enums.UnitTypes.Offense:
                        opponentUnitType = Team.Enums.UnitTypes.Defense;
                        break;
                    case Team.Enums.UnitTypes.Defense:
                        opponentUnitType = Team.Enums.UnitTypes.Offense;
                        break;
                }
                return opponentUnitType;
            };
            Play.prototype.isFieldSet = function (field) {
                if (!field)
                    throw new Error('Play draw(): Field is null or undefined');
                return true;
            };
            Play.prototype.isBallSet = function (ball) {
                if (!ball)
                    throw new Error('Play draw(): Ball is null or undefined');
                return true;
            };
            return Play;
        })(Common.Models.AssociableEntity);
        Models.Play = Play;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var PlayPrimary = (function (_super) {
            __extends(PlayPrimary, _super);
            function PlayPrimary(unitType) {
                _super.call(this, unitType);
                this.playType = Playbook.Enums.PlayTypes.Primary;
            }
            return PlayPrimary;
        })(Common.Models.Play);
        Models.PlayPrimary = PlayPrimary;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var PlayOpponent = (function (_super) {
            __extends(PlayOpponent, _super);
            function PlayOpponent(unitType) {
                _super.call(this, unitType);
                this.playType = Playbook.Enums.PlayTypes.Opponent;
            }
            PlayOpponent.prototype.draw = function (field) {
                // TODO @theBull - flip the play over
                _super.prototype.draw.call(this, field);
            };
            return PlayOpponent;
        })(Common.Models.Play);
        Models.PlayOpponent = PlayOpponent;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var PlayCollection = (function (_super) {
            __extends(PlayCollection, _super);
            function PlayCollection(unitType) {
                _super.call(this);
                this.unitType = unitType;
            }
            PlayCollection.prototype.toJson = function () {
                var self = this;
                return $.extend(_super.prototype.toJson.call(this), {
                    unitType: self.unitType
                });
            };
            PlayCollection.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.unitType = json.unitType;
                var plays = json.plays;
                if (!plays)
                    plays = [];
                for (var i = 0; i < plays.length; i++) {
                    var obj = plays[i];
                    var rawPlay = obj.data.play;
                    if (Common.Utilities.isNullOrUndefined(rawPlay))
                        continue;
                    rawPlay.unitType = Common.Utilities.isNullOrUndefined(rawPlay.unitType) &&
                        rawPlay.unitType >= 0 ? rawPlay.unitType : Team.Enums.UnitTypes.Other;
                    rawPlay.key = obj.key;
                    // TODO
                    var playModel = new Common.Models.Play(rawPlay.unitType);
                    playModel.fromJson(rawPlay);
                    this.add(playModel);
                }
            };
            return PlayCollection;
        })(Common.Models.ActionableCollection);
        Models.PlayCollection = PlayCollection;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var PlaybookModel = (function (_super) {
            __extends(PlaybookModel, _super);
            function PlaybookModel(unitType) {
                _super.call(this, Common.Enums.ImpaktDataTypes.Playbook);
                _super.prototype.setContext.call(this, this);
                this.name = 'Untitled';
                this.unitType = unitType;
            }
            PlaybookModel.prototype.toJson = function () {
                return $.extend({
                    name: this.name,
                    unitType: this.unitType
                }, _super.prototype.toJson.call(this));
            };
            PlaybookModel.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.name = json.name;
                this.unitType = json.unitType;
                _super.prototype.fromJson.call(this, json);
            };
            return PlaybookModel;
        })(Common.Models.AssociableEntity);
        Models.PlaybookModel = PlaybookModel;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var PlaybookModelCollection = (function (_super) {
            __extends(PlaybookModelCollection, _super);
            function PlaybookModelCollection(unitType) {
                _super.call(this);
                this.unitType = unitType;
            }
            PlaybookModelCollection.prototype.toJson = function () {
                return {
                    guid: this.guid,
                    playbooks: _super.prototype.toJson.call(this),
                    unitType: this.unitType
                };
            };
            PlaybookModelCollection.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.guid = json.guid || this.guid;
                this.unitType = json.unitType;
                var playbooks = json.playbooks || [];
                for (var i = 0; i < playbooks.length; i++) {
                    var rawPlaybook = playbooks[i];
                    if (Common.Utilities.isNullOrUndefined(rawPlaybook))
                        continue;
                    rawPlaybook.unitType = !Common.Utilities.isNullOrUndefined(rawPlaybook.unitType) &&
                        rawPlaybook.unitType >= 0 ? rawPlaybook.unitType : Team.Enums.UnitTypes.Mixed;
                    // Allow mixed unit types to be added to the playbookmodel collection;
                    // a variety of unit types may exist in a playbook model collection
                    if (rawPlaybook.unitType != this.unitType) {
                        this.unitType = Team.Enums.UnitTypes.Mixed;
                    }
                    var playbookModel = new Common.Models.PlaybookModel(rawPlaybook.unitType);
                    playbookModel.fromJson(rawPlaybook);
                    this.add(playbookModel);
                }
            };
            return PlaybookModelCollection;
        })(Common.Models.ActionableCollection);
        Models.PlaybookModelCollection = PlaybookModelCollection;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Tab = (function (_super) {
            __extends(Tab, _super);
            function Tab(playPrimary, playOpponent) {
                _super.call(this);
                this.title = 'Untitled';
                this.active = true;
                _super.prototype.setContext.call(this, this);
                this.playPrimary = playPrimary;
                this.editorType = this.playPrimary.editorType;
                this.key = this.playPrimary.key;
                this.unitType = this.playPrimary.unitType;
                this.title = this.playPrimary.name;
                this._closeCallbacks = [function () {
                        console.log('tab closed', this.guid);
                    }];
            }
            Tab.prototype.onclose = function (callback) {
                this._closeCallbacks.push(callback);
            };
            Tab.prototype.close = function () {
                for (var i = 0; i < this._closeCallbacks.length; i++) {
                    this._closeCallbacks[i]();
                }
            };
            return Tab;
        })(Common.Models.Modifiable);
        Models.Tab = Tab;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var TabCollection = (function (_super) {
            __extends(TabCollection, _super);
            function TabCollection() {
                _super.call(this);
            }
            TabCollection.prototype.getByPlayGuid = function (guid) {
                return this.filterFirst(function (tab, index) {
                    return tab.play.guid == guid;
                });
            };
            TabCollection.prototype.close = function (tab) {
                this.remove(tab.guid);
                tab.close();
            };
            return TabCollection;
        })(Common.Models.Collection);
        Models.TabCollection = TabCollection;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Template = (function (_super) {
            __extends(Template, _super);
            function Template(name, url) {
                _super.call(this);
                _super.prototype.setContext.call(this, this);
                this.name = name;
                this.url = url;
                this.data = {};
            }
            return Template;
        })(Common.Models.Modifiable);
        Models.Template = Template;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var TemplateCollection = (function (_super) {
            __extends(TemplateCollection, _super);
            function TemplateCollection(name) {
                _super.call(this);
                this.name = name;
            }
            return TemplateCollection;
        })(Common.Models.Collection);
        Models.TemplateCollection = TemplateCollection;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
var Common;
(function (Common) {
    var Input;
    (function (Input) {
        var KeyboardInputListener = (function () {
            function KeyboardInputListener() {
            }
            // TODO
            KeyboardInputListener.prototype.shiftPressed = function () {
            };
            KeyboardInputListener.prototype.ctrlPressed = function () {
            };
            KeyboardInputListener.prototype.altPressed = function () {
            };
            KeyboardInputListener.prototype.metaPressed = function () {
            };
            return KeyboardInputListener;
        })();
        Input.KeyboardInputListener = KeyboardInputListener;
        var MouseInputListener = (function () {
            function MouseInputListener() {
            }
            return MouseInputListener;
        })();
        Input.MouseInputListener = MouseInputListener;
        (function (Which) {
            Which[Which["LeftClick"] = 1] = "LeftClick";
            Which[Which["RightClick"] = 3] = "RightClick";
            Which[Which["Esc"] = 27] = "Esc";
            /**
             *
             * Uppercase (shift pressed)
             *
             */
            Which[Which["A"] = 65] = "A";
            Which[Which["B"] = 66] = "B";
            Which[Which["C"] = 67] = "C";
            Which[Which["D"] = 68] = "D";
            Which[Which["E"] = 69] = "E";
            Which[Which["F"] = 70] = "F";
            Which[Which["G"] = 71] = "G";
            Which[Which["H"] = 72] = "H";
            Which[Which["I"] = 73] = "I";
            Which[Which["J"] = 74] = "J";
            Which[Which["K"] = 75] = "K";
            Which[Which["L"] = 76] = "L";
            Which[Which["M"] = 77] = "M";
            Which[Which["N"] = 78] = "N";
            Which[Which["O"] = 79] = "O";
            Which[Which["P"] = 80] = "P";
            Which[Which["Q"] = 81] = "Q";
            Which[Which["R"] = 82] = "R";
            Which[Which["S"] = 83] = "S";
            Which[Which["T"] = 84] = "T";
            Which[Which["U"] = 85] = "U";
            Which[Which["V"] = 86] = "V";
            Which[Which["W"] = 87] = "W";
            Which[Which["X"] = 88] = "X";
            Which[Which["Y"] = 89] = "Y";
            Which[Which["Z"] = 90] = "Z";
            /**
             *
             * Lowercase (shift key not pressed)
             *
             */
            Which[Which["a"] = 97] = "a";
            Which[Which["b"] = 98] = "b";
            Which[Which["c"] = 99] = "c";
            Which[Which["d"] = 100] = "d";
            Which[Which["e"] = 101] = "e";
            Which[Which["f"] = 102] = "f";
            Which[Which["g"] = 103] = "g";
            Which[Which["h"] = 104] = "h";
            Which[Which["i"] = 105] = "i";
            Which[Which["j"] = 106] = "j";
            Which[Which["k"] = 107] = "k";
            Which[Which["l"] = 108] = "l";
            Which[Which["m"] = 109] = "m";
            Which[Which["n"] = 110] = "n";
            Which[Which["o"] = 111] = "o";
            Which[Which["p"] = 112] = "p";
            Which[Which["q"] = 113] = "q";
            Which[Which["r"] = 114] = "r";
            Which[Which["s"] = 115] = "s";
            Which[Which["t"] = 116] = "t";
            Which[Which["u"] = 117] = "u";
            Which[Which["v"] = 118] = "v";
            Which[Which["w"] = 119] = "w";
            Which[Which["x"] = 120] = "x";
            Which[Which["y"] = 121] = "y";
            Which[Which["z"] = 122] = "z";
        })(Input.Which || (Input.Which = {}));
        var Which = Input.Which;
    })(Input = Common.Input || (Common.Input = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var Listener = (function () {
            function Listener(context) {
                this.actions = {};
            }
            Listener.prototype.listen = function (actionId, fn) {
                if (!this.actions.hasOwnProperty[actionId])
                    this.actions[actionId] = [];
                this.actions[actionId].push(fn);
            };
            Listener.prototype.invoke = function (actionId, data, context) {
                if (!this.actions[actionId])
                    return;
                for (var i = 0; i < this.actions[actionId].length; i++) {
                    this.actions[actionId][i](data, context);
                }
            };
            return Listener;
        })();
        Models.Listener = Listener;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Canvas = (function (_super) {
            __extends(Canvas, _super);
            function Canvas(width, height) {
                _super.call(this);
                _super.prototype.setContext.call(this, this);
                /**
                 * Note that paper is created during the initialize() method;
                 * canvas is dependent on angular directive / dynamic HTML include
                 * of the canvas, before the $container/container properties are
                 * available; these containers are required by the paper, which
                 * implements a Raphael object, that requires a container HTML element.
                 */
                this.dimensions = new Common.Models.Dimensions();
                this.dimensions.setMinWidth(500);
                this.dimensions.setMinHeight(400);
                // TODO @theBull - look for performance improvements here
                // 
                // Maintains a window interval timer which checks every 1ms for
                // a change in container width; will fire a resize() if necessary
                this.widthChangeInterval = null;
                this.readyCallbacks = [];
                this.listener = new Common.Models.CanvasListener(this);
            }
            Canvas.prototype.clear = function () {
                this.playOpponent = null;
                this.playPrimary = null;
                this.paper.clear();
                this.clearListeners();
                this.setModified(true);
            };
            /**
             * Converts this canvas's SVG graphics element into a data-URI
             * which can be used in an <img/> src attribute to render the image
             * as a PNG. Allows for retrieval and storage of the image as well.
             *
             * 3/9/2016: https://css-tricks.com/data-uris/
             * @return {string} [description]
             */
            Canvas.prototype.exportToPng = function () {
                if (!this.$container) {
                    throw new Error('Canvas exportToPng(): Cannot export to png; \
                SVG parent $container is null or undefined');
                }
                var svgElement = this.$container.find('svg')[0];
                if (!svgElement) {
                    throw new Error('Canvas exportToPng(): Cannot export to png; \
                Could not find SVG element inside of canvas $container');
                }
                return Common.Utilities.exportToPng(this, svgElement);
            };
            Canvas.prototype.getSvg = function () {
                var $svg = $('svg');
                var serializer = new XMLSerializer();
                var svg_blob = serializer.serializeToString($svg[0]);
                return svg_blob;
            };
            Canvas.prototype.refresh = function () {
                if (Common.Utilities.isNullOrUndefined(this.paper))
                    throw new Error('Canvas refresh(): paper is null or undefined');
                this.paper.draw();
            };
            Canvas.prototype.onready = function (callback) {
                if (this.readyCallbacks && this.readyCallbacks.length > 1000)
                    throw new Error('Canvas onready(): callback not added; max ready callback limit exceeded');
                this.readyCallbacks.push(callback);
            };
            Canvas.prototype._ready = function () {
                if (Common.Utilities.isNullOrUndefined(this.readyCallbacks))
                    return;
                for (var i = 0; i < this.readyCallbacks.length; i++) {
                    this.readyCallbacks.pop()();
                }
            };
            Canvas.prototype.clearListeners = function () {
                this.readyCallbacks = [];
            };
            Canvas.prototype.resize = function () {
                var self = this;
                this.dimensions.width = this.$container.width();
                this.dimensions.height = this.$container.height();
                this.paper.resize();
                if (this.scrollable) {
                    this.scrollable.initialize(this.$container, this.paper);
                    this.scrollable.onready(function (content) {
                        self.scrollable.scrollToPercentY(0.5);
                    });
                }
            };
            Canvas.prototype.setScrollable = function (scrollable) {
                this.scrollable = scrollable;
            };
            return Canvas;
        })(Common.Models.Modifiable);
        Models.Canvas = Canvas;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Drawing;
    (function (Drawing) {
        var Utilities = (function () {
            function Utilities(canvas, grid) {
                this.grid = grid;
                this.canvas = canvas;
                this.Raphael = this.Raphael || new Raphael(this.canvas.container, this.grid.dimensions.width, this.grid.dimensions.height // * 2
                );
            }
            Utilities.prototype.clear = function () {
                this.Raphael.clear();
            };
            Utilities.prototype.setAttribute = function (attribute, value) {
                this.Raphael.canvas.setAttribute(attribute, value);
            };
            Utilities.prototype.setViewBox = function (x, y, width, height, fit) {
                this.Raphael.setViewBox(x, y, width, height, fit);
            };
            Utilities.prototype.alignToGrid = function (x, y, absolute) {
                var coords = new Common.Models.Coordinates(x, y);
                return !absolute ?
                    this.grid.getAbsoluteFromCoordinates(coords.x, coords.y) :
                    coords;
            };
            Utilities.prototype.path = function (path) {
                return this.Raphael.path(path);
            };
            Utilities.prototype.rect = function (x, y, width, height, absolute, offsetX, offsetY) {
                var pixels = this.alignToGrid(x, y, absolute);
                offsetX = offsetX || 0;
                offsetY = offsetY || 0;
                var rect = this.Raphael.rect(pixels.x + offsetX, pixels.y + offsetY, width, height).attr({
                    x: pixels.x + offsetX,
                    y: pixels.y + offsetY
                });
                return rect;
            };
            Utilities.prototype.rhombus = function (x, y, width, height, absolute, offsetX, offsetY) {
                var rect = this.rect(x, y, width, height, absolute, offsetX, offsetY);
                rect.transform('r-45');
                return rect;
            };
            Utilities.prototype.ellipse = function (x, y, width, height, absolute, offsetX, offsetY) {
                var pixels = this.alignToGrid(x, y, absolute);
                offsetX = offsetX || 0;
                offsetY = offsetY || 0;
                var ellipse = this.Raphael.ellipse(pixels.x + offsetX, pixels.y + offsetY, width, height).attr({
                    cx: pixels.x + offsetX,
                    cy: pixels.y + offsetY
                });
                return ellipse;
            };
            Utilities.prototype.circle = function (x, y, radius, absolute, offsetX, offsetY) {
                var pixels = this.alignToGrid(x, y, absolute);
                offsetX = offsetX || 0;
                offsetY = offsetY || 0;
                var circle = this.Raphael.circle(pixels.x + offsetX, pixels.y + offsetY, radius).attr({
                    cx: pixels.x + offsetX,
                    cy: pixels.y + offsetY
                });
                return circle;
            };
            Utilities.prototype.triangle = function (x, y, height, absolute, offsetX, offsetY) {
                var pixels = this.alignToGrid(x, y, absolute);
                offsetX = offsetX || 0;
                offsetY = offsetY || 0;
                // get height of center
                var centerHeight = height / 2;
                // get side length
                var sideLength = (2 * height) / Math.sqrt(3);
                // create path string
                var pathString = Common.Drawing.Utilities.getClosedPathString(true, [
                    ((pixels.x + offsetX) - (sideLength / 2)), ((pixels.y + offsetY) + centerHeight),
                    (pixels.x + offsetX), ((pixels.y + offsetY) - centerHeight),
                    ((pixels.x + offsetX) + (sideLength / 2)), ((pixels.y + offsetY) + centerHeight)
                ]);
                return this.Raphael.path(pathString);
            };
            Utilities.prototype.text = function (x, y, text, absolute, offsetX, offsetY) {
                var pixels = this.alignToGrid(x, y, absolute);
                offsetX = offsetX || 0;
                offsetY = offsetY || 0;
                return this.Raphael.text(pixels.x + offsetX, pixels.y + offsetY, text).attr({
                    'x': pixels.x + offsetX,
                    'y': pixels.y + offsetY
                });
            };
            Utilities.prototype.print = function (x, y, text, font, size, origin, letterSpacing, offsetX, offsetY) {
                var pixels = this.alignToGrid(x, y, false);
                offsetX = offsetX || 0;
                offsetY = offsetY || 0;
                return this.Raphael.print(pixels.x + offsetX, pixels.y + offsetY, text, font, size, origin, letterSpacing).attr({
                    'x': pixels.x + offsetX,
                    'y': pixels.y + offsetY
                });
            };
            Utilities.prototype.getFont = function (family, weight, style, stretch) {
                var fontWeight = weight || 100;
                var fontStyle = style || 'normal';
                var fontStretch = stretch || null;
                return this.Raphael.getFont(family, fontWeight, fontStyle, fontStretch);
            };
            Utilities.prototype.set = function () {
                return this.Raphael.set();
            };
            Utilities.pathMoveTo = function (ax, ay) {
                return ['M', ax, ' ', ay].join('');
            };
            Utilities.getPathString = function (initialize, coords) {
                // arguments must be passed; must be at least 4 arguments; number of arguments must be even
                if (!coords ||
                    coords.length < 4 ||
                    coords.length % 2 != 0)
                    return undefined;
                var str = initialize ? Common.Drawing.Utilities.pathMoveTo(coords[0], coords[1]) : '';
                for (var i = 2; i < coords.length; i += 2) {
                    str += Common.Drawing.Utilities.pathLineTo(coords[i], coords[i + 1]);
                }
                return str;
            };
            Utilities.pathLineTo = function (x, y) {
                return ['L', x, ' ', y].join('');
            };
            Utilities.getClosedPathString = function (initialize, coords) {
                return Common.Drawing.Utilities.getPathString(initialize, coords) + ' Z';
            };
            /**
             *
             * ---
             * From the W3C SVG specification:
             * Draws a quadratic Bézier curve from the current point to (x,y)
             * using (x1,y1) as the control point.
             * Q (uppercase) indicates that absolute coordinates will follow;
             * q (lowercase) indicates that relative coordinates will follow.
             * Multiple sets of coordinates may be specified to draw a polybézier.
             * At the end of the command, the new current point becomes
             * the final (x,y) coordinate pair used in the polybézier.
             * ---
             *
             * @param  {any[]}  ...args [description]
             * @return {string}         [description]
             */
            Utilities.getCurveString = function (initialize, coords) {
                // arguments must be passed; must be at least 4 arguments; 
                // number of arguments must be even
                if (!coords || coords.length % 2 != 0) {
                    throw new Error([
                        'You must pass an even number',
                        ' of coords to getCurveString()'
                    ].join(''));
                }
                // current (start) point
                var str = '';
                if (initialize) {
                    if (coords.length != 6) {
                        throw new Error([
                            'You must pass at least 6 coords to initialize',
                            ' a curved path'
                        ].join(''));
                    }
                    var initialCoords = coords.splice(0, 2);
                    str = Common.Drawing.Utilities.pathMoveTo(initialCoords[0], initialCoords[1]);
                }
                if (coords.length < 4) {
                    throw new Error([
                        'There must be 4 coords to create a curved path:',
                        ' control -> (x, y); end -> (x, y);',
                        ' [control.x, control.y, end.x, end.y]'
                    ].join(''));
                }
                for (var i = 0; i < coords.length; i += 4) {
                    str += Common.Drawing.Utilities.quadraticCurveTo(coords[i], // x1 (control x)
                    coords[i + 1], // y1 (control y)
                    coords[i + 2], // x (end x)
                    coords[i + 3] // y (end y)
                    );
                }
                return str;
            };
            Utilities.quadraticCurveTo = function (x1, y1, x, y) {
                return ['Q', x1, ',', y1, ' ', x, ',', y].join('');
            };
            Utilities.buildPath = function (from, to, width) {
                //console.log(from, to, width);
                var dist = this.distance(from.x, from.y, to.x, to.y);
                var theta = this.theta(from.x, from.y, to.x, to.y);
                var p1 = {
                    x: (Math.cos(theta + (Math.PI / 2)) * (width / 2)) + from.x,
                    y: (Math.sin(theta + (Math.PI / 2)) * (width / 2)) + from.y
                };
                var p2 = {
                    x: (Math.cos(theta) * dist) + p1.x,
                    y: (Math.sin(theta) * dist) + p1.y
                };
                var p3 = {
                    x: (Math.cos(theta + (1.5 * Math.PI)) * width) + p2.x,
                    y: (Math.sin(theta + (1.5 * Math.PI)) * width) + p2.y
                };
                var p4 = {
                    x: (Math.cos(theta + Math.PI) * dist) + p3.x,
                    y: (Math.sin(theta + Math.PI) * dist) + p3.y
                };
                var pathStr = Common.Drawing.Utilities.getClosedPathString(true, [p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y]);
                console.log(pathStr);
                return pathStr;
            };
            Utilities.distance = function (x1, y1, x2, y2) {
                return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
            };
            Utilities.theta = function (x1, y1, x2, y2) {
                var t = Math.atan2((y2 - y1), (x2 - x1));
                return t == Math.PI ? 0 : t;
            };
            Utilities.toDegrees = function (angle) {
                return angle * (180 / Math.PI);
            };
            Utilities.toRadians = function (angle) {
                return angle * (Math.PI / 180);
            };
            return Utilities;
        })();
        Drawing.Utilities = Utilities;
    })(Drawing = Common.Drawing || (Common.Drawing = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Layer = (function (_super) {
            __extends(Layer, _super);
            function Layer(paper, layerType) {
                _super.call(this);
                _super.prototype.setContext.call(this, this);
                this.paper = paper;
                this.graphics = new Common.Models.Graphics(this.paper);
                this.type = layerType;
                this.visible = true;
                // sub layers
                this.layers = new Common.Models.LayerCollection();
                var self = this;
                this.graphics.onModified(function () {
                    self.setModified(true);
                });
            }
            Layer.prototype.containsLayer = function (layer) {
                if (!this.hasLayers())
                    return false;
                var self = this;
                var predicate = function (layer, index) {
                    return self.guid == layer.guid;
                };
                return this.guid == layer.guid || this.layers.hasElementWhich(predicate);
            };
            Layer.prototype.addLayer = function (layer) {
                if (this.hasLayers())
                    this.layers.add(layer);
                this.graphics.set.push(layer.graphics);
            };
            Layer.prototype.removeLayer = function (layer) {
                if (this.hasGraphics())
                    layer.graphics.remove();
                this.graphics.set.exclude(layer.graphics);
                return this.hasLayers() ? this.layers.remove(layer.guid) : null;
            };
            Layer.prototype.removeAllLayers = function () {
                if (this.hasLayers())
                    this.layers.removeAll();
            };
            Layer.prototype.toFront = function () {
                if (this.hasLayers()) {
                    this.layers.forEach(function (layer, index) {
                        if (layer && layer.graphics) {
                            layer.graphics.toFront();
                        }
                    });
                }
            };
            Layer.prototype.toBack = function () {
                if (this.hasLayers()) {
                    this.layers.forEach(function (layer, index) {
                        if (layer && layer.graphics) {
                            layer.graphics.toBack();
                        }
                    });
                }
            };
            Layer.prototype.show = function () {
                this.visible = true;
                this.graphics.show();
                this.showLayers();
            };
            Layer.prototype.showLayers = function () {
                this.visible = true;
                if (this.hasLayers())
                    this.layers.forEach(function (layer, index) {
                        layer.show();
                    });
            };
            Layer.prototype.hide = function () {
                this.visible = false;
                this.graphics.hide();
                this.hideLayers();
            };
            Layer.prototype.hideLayers = function () {
                if (this.hasLayers())
                    this.layers.forEach(function (layer, index) {
                        layer.hide();
                    });
            };
            Layer.prototype.remove = function () {
                this.removeGraphics();
                this.removeAllLayers();
            };
            Layer.prototype.removeGraphics = function () {
                if (this.hasGraphics())
                    this.graphics.remove();
            };
            Layer.prototype.moveByDelta = function (dx, dy) {
                this.graphics.moveByDelta(dx, dy);
                if (this.hasLayers()) {
                    this.layers.forEach(function (layer, index) {
                        layer.moveByDelta(dx, dy);
                    });
                }
            };
            Layer.prototype.drop = function () {
                this.graphics.drop();
                if (this.hasLayers()) {
                    this.layers.forEach(function (layer, index) {
                        layer.drop();
                    });
                }
            };
            Layer.prototype.hasLayers = function () {
                return this.layers != null && this.layers != undefined;
            };
            Layer.prototype.hasGraphics = function () {
                return this.graphics != null && this.graphics != undefined;
            };
            Layer.prototype.hasPlacement = function () {
                return this.hasGraphics() && this.graphics.hasPlacement();
            };
            /**
             * Draws the current layer and its nested layers (recursive)
             */
            Layer.prototype.draw = function () {
                if (this.hasGraphics())
                    this.graphics.draw();
                if (this.hasLayers() && this.layers.hasElements())
                    this.layers.forEach(function (layer, index) {
                        layer.draw();
                    });
            };
            return Layer;
        })(Common.Models.Modifiable);
        Models.Layer = Layer;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var LayerCollection = (function (_super) {
            __extends(LayerCollection, _super);
            function LayerCollection() {
                _super.call(this);
                this.onModified(function () { });
            }
            LayerCollection.prototype.dragAll = function (dx, dy) {
                // Not implemented
            };
            LayerCollection.prototype.removeAll = function () {
                // Recursively remove all sub layers
                this.forEach(function (layer, index) {
                    layer.remove();
                });
                _super.prototype.removeAll.call(this);
            };
            LayerCollection.prototype.drop = function () {
                this.forEach(function (layer, index) {
                    if (layer.hasGraphics())
                        layer.graphics.drop();
                });
            };
            LayerCollection.prototype.hide = function () {
                this.forEach(function (layer, index) {
                    if (layer.hasGraphics()) {
                        layer.graphics.hide();
                        if (layer.graphics.hasSet()) {
                            layer.graphics.set.hide();
                        }
                    }
                });
            };
            return LayerCollection;
        })(Common.Models.Collection);
        Models.LayerCollection = LayerCollection;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var CanvasListener = (function () {
            function CanvasListener(context) {
                this.context = context;
                this.actions = {};
            }
            CanvasListener.prototype.listen = function (actionId, fn) {
                if (!this.actions.hasOwnProperty[actionId])
                    this.actions[actionId] = [];
                this.actions[actionId].push(fn);
            };
            CanvasListener.prototype.invoke = function (actionId, data) {
                if (!this.actions[actionId])
                    return;
                for (var i = 0; i < this.actions[actionId].length; i++) {
                    this.actions[actionId][i](data, this.context);
                }
            };
            return CanvasListener;
        })();
        Models.CanvasListener = CanvasListener;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Paper = (function () {
            function Paper(canvas) {
                this.canvas = this.canvas || canvas;
                // By default, paper should be scaled based on max canvas width
                this.sizingMode = this.sizingMode || Common.Enums.PaperSizingModes.MaxCanvasWidth;
                this.x = 0;
                this.y = 0;
                this.scrollSpeed = 0.5;
                this.zoomSpeed = 100;
                this.showBorder = false;
            }
            Paper.prototype.getWidth = function () {
                return this.grid.dimensions.width;
            };
            Paper.prototype.getHeight = function () {
                return this.grid.dimensions.height;
            };
            Paper.prototype.getXOffset = function () {
                return -Math.round((this.canvas.dimensions.width
                    - this.grid.dimensions.width) / 2);
            };
            Paper.prototype.draw = function () {
                this.field.initialize();
                if (this.showBorder)
                    this.drawOutline();
            };
            Paper.prototype.resize = function () {
                this.grid.resize(this.sizingMode);
                this.setViewBox();
                this.draw();
            };
            Paper.prototype.clear = function () {
                this.field.clearPlay();
            };
            Paper.prototype.setViewBox = function (center) {
                center = center === true;
                this.drawing.setAttribute('width', this.grid.dimensions.width);
                //this.x = this.getXOffset();
                var setting = this.drawing.setViewBox(this.x, this.y, this.grid.dimensions.width, this.grid.dimensions.height, true);
            };
            Paper.prototype.drawOutline = function () {
                var self = this;
                if (this.showBorder) {
                    // paper view port
                    if (!this.viewOutline) {
                        this.viewOutline = this.drawing.rect(this.x, this.y, this.canvas.dimensions.width, this.canvas.dimensions.height, true);
                    }
                    this.viewOutline.attr({
                        x: self.x + 1,
                        y: self.y + 1,
                        width: self.canvas.dimensions.width - 1,
                        height: self.canvas.dimensions.height - 1,
                        stroke: 'red'
                    });
                }
            };
            /**
             * Scrolls to the given x/y pixels (top/left). If center is set to true,
             * centers the scroll on the x/y pixels.
             *
             * @param {number}  scrollToX [description]
             * @param {number}  scrollToY [description]
             * @param {boolean} center    [description]
             */
            Paper.prototype.scroll = function (scrollToX, scrollToY, center) {
                center = center === true;
                this.y = center ? this.field.getLOSAbsolute() : scrollToY;
                return this.setViewBox(center);
            };
            return Paper;
        })();
        Models.Paper = Paper;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Grid = (function () {
            function Grid(paper, cols, rows) {
                this.paper = paper;
                this.cols = cols;
                this.rows = rows;
                this.dimensions = new Common.Models.Dimensions();
                this.dimensions.offset.x = 0;
                // sets this.width and this.height
                this.size = this.resize(this.paper.sizingMode);
                this.base = Playbook.Constants.GRID_BASE;
                this.divisor = 2; // TODO @theBull document this
                this.dashArray = ['- '];
                this.verticalStrokeOpacity = 0.2;
                this.horizontalStrokeOpacity = 0.25;
                this.strokeWidth = 0.5;
                this.color = '#000000';
                this.snapping = true;
            }
            Grid.prototype.getSize = function () {
                return this.size;
            };
            Grid.prototype.getWidth = function () {
                return this.dimensions.width;
            };
            Grid.prototype.getHeight = function () {
                return this.dimensions.height;
            };
            Grid.prototype.setSnapping = function (snapping) {
                this.snapping = snapping;
            };
            Grid.prototype.toggleSnapping = function () {
                this.snapping = !this.snapping;
            };
            /**
             * TODO @theBull - document this
             * @return {any} [description]
             */
            Grid.prototype.draw = function () {
                var cols = this.cols;
                var rows = this.rows;
                //var font = this.paper.getFont('Arial');
                for (var c = 1; c <= cols; c++) {
                    var colX = c * this.size;
                    var pathStr = Common.Drawing.Utilities.getPathString(true, [
                        colX,
                        0,
                        colX,
                        rows * this.size
                    ]);
                    var p = this.paper.drawing.path(pathStr).attr({
                        'stroke-dasharray': this.dashArray,
                        'stroke-opacity': this.verticalStrokeOpacity,
                        'stroke-width': this.strokeWidth,
                        'stroke': this.color,
                        'class': 'pointer-events-none'
                    });
                }
                for (var r = 1; r <= rows; r++) {
                    var rowY = r * this.size;
                    var pathStr = Common.Drawing.Utilities.getPathString(true, [
                        this.getSize(),
                        rowY,
                        this.dimensions.width,
                        rowY
                    ]);
                    var opacity, dashes;
                    if (r % 10 == 0) {
                        if (r > 10 && r < 100) {
                            var value = (r - 10);
                            if (value > 50)
                                value = value - ((value - 50) * 2);
                            var str = value.toString();
                            // let lineNumbersLeft = this.paper.print(
                            // 	2,
                            // 	r,
                            // 	str,
                            // 	font,
                            // 	30
                            // );.transform('r-90');
                            var lineNumbersLeft = this.paper.drawing.text(2, r, str, false).transform('r-90').attr({ 'class': 'no-highlight' });
                            // let lineNumbersRight = this.paper.print(
                            // 	50, 
                            // 	r, 
                            // 	str, 
                            // 	font, 
                            // 	30
                            // ).transform('r90');
                            var lineNumbersRight = this.paper.drawing.text(50, r, str, false).transform('r90').attr({ 'class': 'no-highlight' });
                        }
                        opacity = 1;
                        this.paper.drawing.path(pathStr).attr({
                            'stroke-opacity': this.horizontalStrokeOpacity,
                            'stroke-width': 3,
                            'stroke': '#ffffff',
                            'class': 'pointer-events-none'
                        });
                    }
                    else {
                        this.paper.drawing.path(pathStr).attr({
                            'stroke-dasharray': this.dashArray,
                            'stroke-opacity': this.horizontalStrokeOpacity,
                            'stroke-width': this.strokeWidth,
                            'stroke': this.color,
                            'class': 'pointer-events-none'
                        });
                    }
                }
            };
            /**
             * recalculates the width and height of the grid
             * with the context width and height
             */
            Grid.prototype.resize = function (sizingMode) {
                if (this.cols <= 0)
                    throw new Error('Grid cols must be defined and greater than 0');
                var canvasWidth = this.paper.canvas.dimensions.width;
                if (canvasWidth == 0)
                    throw new Error('Grid canvas width must be greater than 0');
                switch (this.paper.sizingMode) {
                    case Common.Enums.PaperSizingModes.TargetGridWidth:
                        this.size = Playbook.Constants.GRID_SIZE;
                        break;
                    case Common.Enums.PaperSizingModes.MaxCanvasWidth:
                        this.size = Math.floor(this.paper.canvas.dimensions.width / this.cols);
                        break;
                    case Common.Enums.PaperSizingModes.PreviewWidth:
                        this.size = this.paper.canvas.dimensions.width / this.cols; // don't round
                        break;
                }
                this.dimensions.width = this.cols * this.size;
                this.dimensions.height = this.rows * this.size;
                return this.size;
            };
            /**
             * TODO @theBull - document this
             * returns the grid value for the bottom-most grid line (horizontal)
             * @return {number} [description]
             */
            Grid.prototype.bottom = function () {
                return this.rows;
            };
            /**
             * TODO @theBull - document this
             * returns the grid value for the right-most grid line (vertical)
             * @return {number} [description]
             */
            Grid.prototype.right = function () {
                return this.cols;
            };
            /**
             * TODO @theBull - document this
             * @return {Playbook.Models.Coordinate} [description]
             */
            Grid.prototype.getCenter = function () {
                return new Common.Models.Coordinates((Math.round(this.cols / 2) + this.dimensions.offset.x), Math.round(this.rows / 2));
            };
            /**
             * TODO @theBull - document this
             * @return {Playbook.Models.Coordinate} [description]
             */
            Grid.prototype.getCenterInPixels = function () {
                var centerCoords = this.getCenter();
                return this.getAbsoluteFromCoordinates(centerCoords.x, centerCoords.y);
            };
            Grid.prototype.getCursorOffset = function (offsetX, offsetY) {
                var canvasOffsetX = offsetX + this.paper.x - this.getSize(); // -1 for left sideline offset
                var canvasOffsetY = offsetY + this.paper.y - (10 * this.getSize()); // -10 to account for endzones
                return new Common.Models.Coordinates(canvasOffsetX, canvasOffsetY);
            };
            Grid.prototype.getCursorPositionAbsolute = function (offsetX, offsetY) {
                return this.getCursorOffset(offsetX, offsetY);
            };
            Grid.prototype.getCursorPositionCoordinates = function (offsetX, offsetY) {
                var cursorOffset = this.getCursorOffset(offsetX, offsetY);
                return this.getCoordinatesFromAbsolute(cursorOffset.x, cursorOffset.y);
            };
            /**
             * TODO @theBull - document this
             * @return {Playbook.Models.Coordinate} [description]
             */
            Grid.prototype.getCoordinates = function () {
                return new Common.Models.Coordinates(-1, -1); // TODO
            };
            /**
             * TODO @theBull - document this
             * @return {Playbook.Models.Coordinate} [description]
             */
            Grid.prototype.getDimensions = function () {
                return this.dimensions;
            };
            /**
             * TODO @theBull - document this
             * @return {number} [description]
             */
            Grid.prototype.gridProportion = function () {
                return this.size / this.base;
            };
            /**
             * TODO @theBull - document this
             * @param  {number} val [description]
             * @return {number}     [description]
             */
            Grid.prototype.computeGridZoom = function (val) {
                return val * this.gridProportion();
            };
            /**
             * Calculates a single absolute pixel value from the given grid value
             * @param  {number} val the coord value to calculate
             * @return {number}     The calculated absolute pixel
             */
            Grid.prototype.getAbsoluteFromCoordinate = function (val) {
                return val * this.size;
            };
            /**
             * Returns the absolute pixel values of the given grid coords
             * @param  {Common.Models.Coordinate} coords the grid coords to calculate
             * @return {Common.Models.Coordinate}        the absolute pixel coords
             */
            Grid.prototype.getAbsoluteFromCoordinates = function (x, y) {
                var coords = new Common.Models.Coordinates(x, y);
                var calculatedCoords = new Common.Models.Coordinates(this.getAbsoluteFromCoordinate(coords.x + this.dimensions.offset.x), this.getAbsoluteFromCoordinate(coords.y));
                return calculatedCoords;
            };
            /**
             * Calculates grid coords from the given pixel values
             * @param {Playbook.Models.Coordinate} coords coordinates in raw pixel form
             * @return {Playbook.Models.Coordinate}		the matching grid pixels as coords
             */
            Grid.prototype.getCoordinatesFromAbsolute = function (x, y) {
                // TODO: add in paper scroll offset
                var coordX = Math.round((x / this.size) * this.divisor) / this.divisor;
                var coordY = Math.round((y / this.size) * this.divisor) / this.divisor;
                return new Common.Models.Coordinates(coordX + this.dimensions.offset.x, coordY);
            };
            Grid.prototype.getRelativeFromAbsolute = function (ax, ay, relativeElement) {
                //let coords = this.getCoordinatesFromAbsolute(ax, ay);
                throw new Error('grid getRelativeFromAbsolute(): not implemented');
            };
            /**
             * Takes the given coords and snaps them to the nearest grid coords
             *
             * @param {Playbook.Models.Coordinate} coords Coordinates to snap
             * @return {Playbook.Models.Coordinate}		The nearest snapped coordinates
             */
            Grid.prototype.snapToNearest = function (ax, ay) {
                return this.getCoordinatesFromAbsolute(ax, ay);
            };
            /**
             * Snaps the given coords to the grid
             * @param {Playbook.Models.Coordinate} coords assumed non-snapped coordinates
             * @return {Playbook.Models.Coordinate}		the snapped coordinates
             */
            Grid.prototype.snap = function (x, y) {
                var coords = new Common.Models.Coordinates(x, y);
                var snapX = this.snapPixel(coords.x);
                var snapY = this.snapPixel(coords.y);
                return new Common.Models.Coordinates(snapX, snapY);
            };
            /**
             * takes a pixel value and translates it into a corresponding
             * number of grid units
             *
             * @param  {number} val value to calculate
             * @return {number}     calculated value
             */
            Grid.prototype.snapPixel = function (val) {
                return (Math.round(val / (this.size / this.divisor)) * (this.size / this.divisor)) + this.dimensions.offset.x;
            };
            /**
             * Determines whether the given value is equally divisible
             * by the gridsize
             *
             * @param {number} val The value to calculate
             * @return {boolean}	true if divisible, otherwise false
             */
            Grid.prototype.isDivisible = function (val) {
                return val % (this.size / this.divisor) == 0;
            };
            return Grid;
        })();
        Models.Grid = Grid;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Field = (function (_super) {
            __extends(Field, _super);
            function Field(paper, playPrimary, playOpponent) {
                _super.call(this);
                _super.prototype.setContext.call(this, this);
                this.paper = paper;
                this.grid = this.paper.grid;
                this.playPrimary = playPrimary;
                this.playOpponent = playOpponent;
                this.players = new Common.Models.PlayerCollection();
                this.selected = new Common.Models.Collection();
                this.layers = new Common.Models.LayerCollection();
                this.cursorCoordinates = new Common.Models.Coordinates(0, 0);
                var self = this;
                this.selected.onModified(function () {
                    self.setModified(true);
                });
                this.players.onModified(function () {
                    //self.updatePlacements();
                    self.setModified(true);
                });
                this.onModified(function () {
                });
            }
            Field.prototype.registerLayer = function (layer) {
                this.layers.add(layer);
            };
            Field.prototype.draw = function () {
                this.ground.draw();
                this.grid.draw();
                this.los.draw();
                this.ball.draw();
                this.drawPlay();
            };
            Field.prototype.clearPlayers = function () {
                this.players.forEach(function (player, index) {
                    player.layer.remove();
                });
                this.players.removeAll();
            };
            Field.prototype.clearPlay = function () {
                this.clearPlayers();
                this.playPrimary = null;
                this.playOpponent = null;
            };
            Field.prototype.drawPlay = function () {
                // draw the play data onto the field
                if (this.playPrimary)
                    this.playPrimary.draw(this);
                // draw the opponent play data onto the field
                if (this.playOpponent)
                    this.playOpponent.draw(this);
                //this.updatePlacements();
            };
            Field.prototype.updatePlay = function (playPrimary, playOpponent) {
                this.clearPlay();
                this.playPrimary = playPrimary;
                this.playOpponent = playOpponent;
                this.drawPlay();
                this.updatePlacements();
            };
            Field.prototype.updatePlacements = function () {
                var self = this;
                var placementCollection = new Common.Models.PlacementCollection();
                this.players.forEach(function (player, index) {
                    placementCollection.add(player.icon.layer.graphics.placement);
                });
                self.playPrimary.formation.setPlacements(placementCollection);
            };
            Field.prototype.setCursorCoordinates = function (offsetX, offsetY) {
                this.cursorCoordinates = this.grid.getCursorPositionCoordinates(offsetX, offsetY);
                this.setModified(true);
            };
            Field.prototype.getPlayerWithPositionIndex = function (index) {
                var matchingPlayer = this.players.filterFirst(function (player) {
                    return player.hasPosition() && (player.position.index == index);
                });
                return matchingPlayer;
            };
            Field.prototype.applyPrimaryPlay = function (play) {
                throw new Error('field applyPrimaryPlay() not implemented');
            };
            Field.prototype.applyPrimaryFormation = function (formation) {
                if (Common.Utilities.isNullOrUndefined(formation))
                    return;
                //console.log(formation);
                // the order of placements within the formation get applied straight across
                // to the order of personnel and positions.
                var self = this;
                this.players.forEach(function (player, index) {
                    // NOTE: we're not using the index from the forEach callback,
                    // because we can't assume the players collection stores the players
                    // in the order according to the player's actual index property
                    var playerIndex = player.position.index;
                    if (playerIndex < 0) {
                        throw new Error('Player must have a position index');
                    }
                    var newPlacement = formation.placements.getIndex(playerIndex);
                    if (!newPlacement) {
                        throw new Error('Updated player placement is invalid');
                    }
                    player.setPlacement(newPlacement);
                    player.draw();
                });
                // update the field play formation
                this.playPrimary.setFormation(formation);
                // TODO @theBull - implement set formation for opponent formation
            };
            Field.prototype.applyPrimaryAssignmentGroup = function (assignmentGroup) {
                if (Common.Utilities.isNullOrUndefined(assignmentGroup))
                    return;
                var self = this;
                if (assignmentGroup.assignments.hasElements()) {
                    assignmentGroup.assignments.forEach(function (assignment, index) {
                        if (Common.Utilities.isNullOrUndefined(assignment))
                            return;
                        var player = self.getPlayerWithPositionIndex(assignment.positionIndex);
                        if (player) {
                            assignment.setContext(player);
                            player.assignment.remove();
                            player.assignment = assignment;
                            player.draw();
                        }
                    });
                    // TODO @theBull - implement apply opponent assignments
                    this.playPrimary.setAssignmentGroup(assignmentGroup);
                }
            };
            Field.prototype.applyPrimaryPersonnel = function (personnel) {
                if (Common.Utilities.isNullOrUndefined(personnel))
                    return;
                var self = this;
                if (personnel && personnel.hasPositions()) {
                    this.players.forEach(function (player, index) {
                        var newPosition = personnel.positions.getIndex(index);
                        if (self.playPrimary.personnel &&
                            self.playPrimary.personnel.hasPositions()) {
                            self.playPrimary.personnel.positions.getIndex(index).fromJson(newPosition.toJson());
                        }
                        player.position.fromJson(newPosition.toJson());
                        player.draw();
                    });
                    // TODO @theBull - implement apply opponent assignments
                    this.playPrimary.setPersonnel(personnel);
                }
                else {
                    var details = personnel ? '# positions: ' + personnel.positions.size() : 'Personnel is undefined.';
                    alert([
                        'There was an error applying this personnel group. ',
                        'Please inspect it in the Team Management module. \n\n',
                        details
                    ].join(''));
                }
            };
            Field.prototype.applyPrimaryUnitType = function (unitType) {
                if (Common.Utilities.isNullOrUndefined(unitType))
                    return;
                if (Common.Utilities.isNullOrUndefined(this.playPrimary))
                    return;
                this.playPrimary.setUnitType(unitType);
                if (!Common.Utilities.isNullOrUndefined(this.playOpponent))
                    this.playOpponent.setUnitType(this.playPrimary.getOpposingUnitType());
                this.clearPlayers();
                this.drawPlay();
            };
            Field.prototype.deselectAll = function () {
                if (this.selected.isEmpty())
                    return;
                this.selected.forEach(function (element, index) {
                    element.layer.graphics.deselect();
                });
                this.selected.removeAll();
            };
            Field.prototype.getSelectedByLayerType = function (layerType) {
                var collection = new Common.Models.Collection();
                this.selected.forEach(function (selectedElement, index) {
                    if (selectedElement.layer.type == layerType) {
                        collection.add(selectedElement);
                    }
                });
                return collection;
            };
            Field.prototype.toggleSelectionByLayerType = function (layerType) {
                var selectedElements = this.selected.filter(function (selectedElement, index) {
                    return selectedElement.layer.type == layerType;
                });
                if (selectedElements && selectedElements.length > 0) {
                    for (var i = 0; i < selectedElements.length; i++) {
                        var selectedElement = selectedElements[i];
                        if (selectedElement)
                            this.toggleSelection(selectedElement);
                    }
                }
            };
            /**
             * Sets the selected items to a single selected element; removes and deselects any
             * other currently selected elements.
             * @param {Common.Interfaces.IFieldElement} element [description]
             */
            Field.prototype.setSelection = function (element) {
                // clear any selected players
                this.selected.forEach(function (selectedElement, index) {
                    selectedElement.layer.graphics.deselect();
                });
                this.selected.removeAll();
                element.layer.graphics.select();
                this.selected.add(element);
            };
            /**
             * Toggles the selection state of the given element; adds it to the
             * list of selected elements if it isn't already added; if it's already
             * selected, deselects the element and removes it from the selected
             * @param {Common.Interfaces.IFieldElement} element [description]
             */
            Field.prototype.toggleSelection = function (element) {
                // element.layer.graphics.toggleSelect();
                if (this.selected.contains(element.guid)) {
                    this.selected.remove(element.guid);
                    element.layer.graphics.deselect();
                }
                else {
                    this.selected.add(element);
                    element.layer.graphics.select();
                }
            };
            /**
             * Returns the absolute y-coordinate of the line of scrimmage
             * @return {number} [description]
             */
            Field.prototype.getLOSAbsolute = function () {
                if (!this.los)
                    throw new Error('Field getLOSAbsolute(): los is null or undefined');
                return this.los.layer.graphics.location.ay;
            };
            return Field;
        })(Common.Models.Modifiable);
        Models.Field = Field;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var FieldElement = (function (_super) {
            __extends(FieldElement, _super);
            function FieldElement(field, relativeElement) {
                _super.call(this);
                _super.prototype.setContext.call(this, this);
                this.field = field;
                this.ball = this.field.ball;
                this.relativeElement = relativeElement;
                this.paper = this.field.paper;
                this.canvas = this.paper.canvas;
                this.grid = this.paper.grid;
                this.contextmenuTemplateUrl = Common.Constants.DEFAULT_CONTEXTMENU_TEMPLATE_URL;
                this.layer = new Common.Models.Layer(this.paper, Common.Enums.LayerTypes.FieldElement);
                this._originalScreenPositionX = null;
                this._originalScreenPositionY = null;
                var self = this;
                this.onModified(function () {
                    self.field.setModified(true);
                });
            }
            FieldElement.prototype.hasLayer = function () {
                return this.layer != null && this.layer != undefined;
            };
            FieldElement.prototype.getLayer = function () {
                return this.layer;
            };
            FieldElement.prototype.hasGraphics = function () {
                return this.layer.hasGraphics();
            };
            FieldElement.prototype.getGraphics = function () {
                return this.hasGraphics() ? this.layer.graphics : null;
            };
            FieldElement.prototype.hasPlacement = function () {
                return this.layer.hasPlacement();
            };
            FieldElement.prototype.getContextmenuUrl = function () {
                return this.contextmenuTemplateUrl;
            };
            FieldElement.prototype.toggleSelect = function (metaKey) {
                this.field.toggleSelection(this);
                {
                    if (metaKey) {
                        this.field.toggleSelection(this);
                    }
                    else {
                        this.field.setSelection(this);
                    }
                }
            };
            FieldElement.prototype.hoverIn = function (e) {
            };
            FieldElement.prototype.hoverOut = function (e) {
            };
            FieldElement.prototype.click = function (e) {
                console.log('fieldelement click');
                if (this.layer.graphics.disabled)
                    return;
                this.layer.graphics.toggleSelect();
                if (e.metaKey) {
                    this.field.toggleSelection(this);
                }
                else {
                    this.field.setSelection(this);
                }
            };
            FieldElement.prototype.mouseup = function (e) {
            };
            FieldElement.prototype.mousedown = function (e) {
                if (e.keyCode == Common.Input.Which.RightClick) {
                    this.contextmenu(e);
                }
            };
            FieldElement.prototype.mousemove = function (e) {
                // TODO @theBull - implement
            };
            FieldElement.prototype.contextmenu = function (e) {
                // TODO @theBull - handle contextmenu
            };
            FieldElement.prototype.dragMove = function (dx, dy, posx, posy, e) {
            };
            FieldElement.prototype.dragStart = function (x, y, e) {
                this.setOriginalDragPosition(x, y);
                if (this.isOverDragThreshold(this.getOriginalScreenPosition().x - x, this.getOriginalScreenPosition().y - y)) {
                    this.layer.graphics.dragging = true;
                }
            };
            FieldElement.prototype.dragEnd = function (e) {
                this.setOriginalDragPosition(null, null);
                this.layer.graphics.dragging = false;
            };
            FieldElement.prototype.drop = function () {
                this.layer.drop();
            };
            FieldElement.prototype.getOriginalScreenPosition = function () {
                return {
                    x: this._originalScreenPositionX,
                    y: this._originalScreenPositionY
                };
            };
            FieldElement.prototype.setOriginalDragPosition = function (x, y) {
                this._originalScreenPositionX = x;
                this._originalScreenPositionY = y;
            };
            FieldElement.prototype.isOriginalDragPositionSet = function () {
                return !Common.Utilities.isNull(this._originalScreenPositionX) &&
                    !Common.Utilities.isNull(this._originalScreenPositionY);
            };
            FieldElement.prototype.isOverDragThreshold = function (x, y) {
                return Math.abs(x) > Playbook.Constants.DRAG_THRESHOLD_X ||
                    Math.abs(y) > Playbook.Constants.DRAG_THRESHOLD_Y;
            };
            return FieldElement;
        })(Common.Models.Modifiable);
        Models.FieldElement = FieldElement;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Ball = (function (_super) {
            __extends(Ball, _super);
            function Ball(field) {
                _super.call(this, field, null);
                this.layer.type = Common.Enums.LayerTypes.Ball;
                this.layer.graphics.fill = 'brown';
                this.layer.graphics.dimensions.setWidth(this.grid.getSize() * 0.15);
                this.layer.graphics.dimensions.setHeight(this.grid.getSize() * 0.25);
                this.layer.graphics.updateFromCoordinates(Playbook.Constants.BALL_DEFAULT_PLACEMENT_X, Playbook.Constants.BALL_DEFAULT_PLACEMENT_Y);
            }
            Ball.prototype.draw = function () {
                this.layer.graphics.ellipse();
            };
            return Ball;
        })(Common.Models.FieldElement);
        Models.Ball = Ball;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Ground = (function (_super) {
            __extends(Ground, _super);
            function Ground(field) {
                _super.call(this, field, null);
                this.layer.graphics.selectable = false;
                this.layer.graphics.updateFromCoordinates(this.paper.x, this.paper.y);
                this.layer.graphics.dimensions.setWidth(this.grid.dimensions.width + 2);
                this.layer.graphics.dimensions.setHeight(this.grid.dimensions.height + 2);
                this.layer.graphics.setOriginalOpacity(1);
                this.layer.graphics.setOriginalStrokeWidth(0);
                this.layer.graphics.setOriginalFill(Playbook.Constants.FIELD_COLOR);
            }
            Ground.prototype.draw = function () {
                this.layer.graphics.rect();
                this.layer.graphics.onclick(this.click, this);
            };
            Ground.prototype.click = function (e) {
                // Do nothing
                console.log('ground clicked');
            };
            Ground.prototype.dragMove = function (dx, dy, posx, posy, e) {
                // create selection box
            };
            Ground.prototype.dragStart = function (x, y, e) {
                this.layer.graphics.dragging = true;
                console.log('ground drag start');
            };
            Ground.prototype.dragEnd = function (e) {
                this.layer.graphics.dragging = false;
                console.log('ground drag end');
            };
            Ground.prototype.getClickCoordinates = function (offsetX, offsetY) {
                return this.grid.getCoordinatesFromAbsolute(offsetX + this.layer.graphics.dimensions.offset.x - Math.abs(this.paper.x), offsetY + Math.abs(this.paper.y) + this.layer.graphics.dimensions.offset.y);
            };
            return Ground;
        })(Common.Models.FieldElement);
        Models.Ground = Ground;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var LineOfScrimmage = (function (_super) {
            __extends(LineOfScrimmage, _super);
            function LineOfScrimmage(field) {
                _super.call(this, field, null);
                this.layer.type = Common.Enums.LayerTypes.LineOfScrimmage;
                this.layer.graphics.setOriginalFill('yellow');
                this.layer.graphics.setOriginalStrokeWidth(0);
                this.layer.graphics.setOriginalOpacity(1);
                this.layer.graphics.dimensions.width = this.grid.dimensions.width - (this.grid.getSize() * 2);
                this.layer.graphics.dimensions.height = 1;
                this.layer.graphics.updateFromCoordinates(1, this.field.ball.layer.graphics.placement.coordinates.y);
            }
            return LineOfScrimmage;
        })(Common.Models.FieldElement);
        Models.LineOfScrimmage = LineOfScrimmage;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Endzone = (function (_super) {
            __extends(Endzone, _super);
            function Endzone(context, offsetY) {
                _super.call(this, context, null);
                this.layer.type = Common.Enums.LayerTypes.Endzone;
                this.layer.graphics.fill = 'black';
                this.layer.graphics.setOpacity(0.25);
                this.layer.graphics.updateFromCoordinates(1, offsetY);
                this.layer.graphics.dimensions.setWidth(this.paper.getWidth() - (2 * this.grid.getSize()));
                this.layer.graphics.dimensions.setHeight(10 * this.grid.getSize());
            }
            Endzone.prototype.draw = function () {
                this.layer.graphics.rect();
            };
            return Endzone;
        })(Common.Models.FieldElement);
        Models.Endzone = Endzone;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Hashmark = (function (_super) {
            __extends(Hashmark, _super);
            function Hashmark(field, x) {
                _super.call(this, field, null);
                // hash marks should be -x- grid units from center
                this.layer.type = Common.Enums.LayerTypes.Hashmark;
                this.layer.graphics.dimensions.offset.x = -0.25 * this.grid.getSize();
                this.layer.graphics.dimensions.offset.y = 0;
                this.layer.graphics.placement.coordinates.x = x;
                this.start = 11;
                this.yards = 110;
            }
            Hashmark.prototype.draw = function () {
                var hashmarkWidth = this.grid.getSize() / 2;
                for (var i = this.start; i < this.yards; i++) {
                    var hashmark = this.paper.drawing.rect(this.layer.graphics.placement.coordinates.x, i, hashmarkWidth, 1, false, this.layer.graphics.dimensions.offset.x, 0).attr({
                        'fill': 'white',
                        'stroke-width': 0
                    });
                }
            };
            return Hashmark;
        })(Common.Models.FieldElement);
        Models.Hashmark = Hashmark;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Sideline = (function (_super) {
            __extends(Sideline, _super);
            function Sideline(field, x) {
                _super.call(this, field, null);
                this.field = field;
                this.layer.graphics.fill = 'white';
                this.layer.graphics.strokeWidth = 0;
                this.layer.graphics.updateFromCoordinates(x, 0);
                this.layer.graphics.dimensions.width = this.grid.getSize();
                this.layer.graphics.dimensions.height = this.grid.getHeight();
            }
            Sideline.prototype.draw = function () {
                this.layer.graphics.rect();
            };
            return Sideline;
        })(Common.Models.FieldElement);
        Models.Sideline = Sideline;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        // @todo treat Player as a FieldElementSet
        var Player = (function (_super) {
            __extends(Player, _super);
            function Player(field, placement, position, assignment) {
                _super.call(this, field, field.ball);
                this.layer.type = Common.Enums.LayerTypes.Player;
                this.layer.graphics.setPlacement(placement);
                this.position = position;
                this.assignment = assignment || new Common.Models.Assignment(this.position.unitType);
                this.assignment.positionIndex = this.position.index;
                this.layer.graphics.dimensions.setWidth(this.grid.getSize());
                this.layer.graphics.dimensions.setHeight(this.grid.getSize());
                var self = this;
                this.onModified(function () {
                    self.field.players.setModified(true);
                });
                this.layer.onModified(function () {
                    self.setModified(true);
                });
            }
            Player.prototype.remove = function () {
                this.layer.remove();
            };
            Player.prototype.getPositionRelativeToBall = function () {
                return this.layer.graphics.placement.relative;
            };
            Player.prototype.getCoordinatesFromAbsolute = function () {
                return this.layer.graphics.placement.coordinates;
            };
            /**
             *
             * Assignment
             *
             */
            Player.prototype.hasAssignment = function () {
                return Common.Utilities.isNullOrUndefined(this.assignment);
            };
            Player.prototype.getAssignment = function () {
                return this.assignment;
            };
            Player.prototype.setAssignment = function (assignment) {
                this.assignment = assignment;
                this.setModified(true);
            };
            /**
             *
             * Position
             *
             */
            Player.prototype.hasPosition = function () {
                return Common.Utilities.isNullOrUndefined(this.position);
            };
            Player.prototype.getPosition = function () {
                return this.position;
            };
            Player.prototype.setPosition = function (position) {
                this.position = position;
                this.setModified(true);
            };
            /**
             *
             * Placement
             *
             */
            Player.prototype.hasPlacement = function () {
                return Common.Utilities.isNullOrUndefined(this.layer.graphics.placement);
            };
            Player.prototype.getPlacement = function () {
                return this.layer.graphics.placement;
            };
            Player.prototype.setPlacement = function (placement) {
                this.layer.graphics.updateFromCoordinates(placement.coordinates.x, placement.coordinates.y);
                this.setModified(true);
                var self = this;
                this.layer.layers.forEach(function (layer, index) {
                    layer.graphics.setPlacement(placement);
                });
            };
            return Player;
        })(Common.Models.FieldElement);
        Models.Player = Player;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var PlayerCollection = (function (_super) {
            __extends(PlayerCollection, _super);
            function PlayerCollection() {
                _super.call(this);
                this.onModified(function () { });
            }
            return PlayerCollection;
        })(Common.Models.Collection);
        Models.PlayerCollection = PlayerCollection;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var PlayerSelectionBox = (function (_super) {
            __extends(PlayerSelectionBox, _super);
            function PlayerSelectionBox(player) {
                _super.call(this, player.field, player.ball);
                this.player = player;
                this.layer.type = Common.Enums.LayerTypes.PlayerSelectionBox;
                this.layer.graphics.selectable = false;
                this.layer.graphics.setOriginalOpacity(1);
                this.layer.graphics.setOriginalFill('');
                this.layer.graphics.setOriginalStroke('blue');
                this.layer.graphics.setOriginalStrokeWidth(1);
                this.layer.graphics.dimensions.width = (this.player.layer.graphics.dimensions.getWidth());
                this.layer.graphics.dimensions.height = (this.player.layer.graphics.dimensions.getHeight());
                this.layer.graphics.dimensions.offset.x = -this.player.layer.graphics.dimensions.getWidth() / 2;
                this.layer.graphics.dimensions.offset.y = -this.player.layer.graphics.dimensions.getHeight() / 2;
                this.layer.graphics.updateLocation(this.player.layer.graphics.location.ax + this.layer.graphics.dimensions.offset.x, this.player.layer.graphics.location.ay + this.layer.graphics.dimensions.offset.y);
            }
            PlayerSelectionBox.prototype.draw = function () {
                this.layer.graphics.rect();
            };
            return PlayerSelectionBox;
        })(Common.Models.FieldElement);
        Models.PlayerSelectionBox = PlayerSelectionBox;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var PlayerIcon = (function (_super) {
            __extends(PlayerIcon, _super);
            function PlayerIcon(player) {
                _super.call(this, player.field, player);
                this.player = player;
                this.layer.type = Common.Enums.LayerTypes.PlayerIcon;
                this.layer.graphics.dimensions.setRadius(this.grid.getSize() / 2);
                this.layer.graphics.dimensions.setWidth(this.player.layer.graphics.dimensions.getWidth());
                this.layer.graphics.dimensions.setHeight(this.player.layer.graphics.dimensions.getHeight());
                this.layer.graphics.setPlacement(player.layer.graphics.placement);
                // this.layer.graphics.dimensions.offset.x = -this.layer.graphics.dimensions.getRadius();
                // this.layer.graphics.dimensions.offset.y = -this.layer.graphics.dimensions.getRadius();
                this.layer.graphics.updateLocation(this.player.layer.graphics.location.ax, this.player.layer.graphics.location.ay);
            }
            PlayerIcon.prototype.draw = function () {
                switch (this.player.position.unitType) {
                    case Team.Enums.UnitTypes.Offense:
                        this.layer.graphics.circle();
                        break;
                    case Team.Enums.UnitTypes.Defense:
                        this.layer.graphics.triangle();
                        break;
                    case Team.Enums.UnitTypes.SpecialTeams:
                        this.layer.graphics.rect();
                        break;
                    case Team.Enums.UnitTypes.Other:
                        this.layer.graphics.rhombus();
                        break;
                }
            };
            return PlayerIcon;
        })(Common.Models.FieldElement);
        Models.PlayerIcon = PlayerIcon;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var PlayerRelativeCoordinatesLabel = (function (_super) {
            __extends(PlayerRelativeCoordinatesLabel, _super);
            function PlayerRelativeCoordinatesLabel(player) {
                _super.call(this, player.field, player);
                this.player = player;
                this.layer.type = Common.Enums.LayerTypes.PlayerRelativeCoordinatesLabel;
                this.layer.graphics.selectable = false;
                this.layer.graphics.dimensions.offset.y = 8;
                this.layer.graphics.updateLocation(this.player.layer.graphics.location.ax, this.player.layer.graphics.location.ay + this.layer.graphics.dimensions.offset.y);
            }
            PlayerRelativeCoordinatesLabel.prototype.draw = function () {
                this.layer.graphics.text([
                    this.layer.graphics.placement.relative.rx, ', ',
                    this.layer.graphics.placement.relative.ry
                ].join(''));
                this.layer.graphics.setAttribute('class', 'no-highlight');
                this.layer.hide();
            };
            return PlayerRelativeCoordinatesLabel;
        })(Common.Models.FieldElement);
        Models.PlayerRelativeCoordinatesLabel = PlayerRelativeCoordinatesLabel;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var PlayerPersonnelLabel = (function (_super) {
            __extends(PlayerPersonnelLabel, _super);
            function PlayerPersonnelLabel(player) {
                _super.call(this, player.field, player);
                this.player = player;
                this.layer.type = Common.Enums.LayerTypes.PlayerPersonnelLabel;
                this.layer.graphics.selectable = false;
                this.layer.graphics.dimensions.offset.y =
                    -(this.player.layer.graphics.dimensions.getHeight() / 2) * 0.4;
                this.layer.graphics.updateLocation(this.player.layer.graphics.location.ax, this.player.layer.graphics.location.ay + this.layer.graphics.dimensions.offset.y);
            }
            PlayerPersonnelLabel.prototype.draw = function () {
                this.layer.graphics.text(this.player.position.label);
                this.layer.graphics.setAttribute('class', 'no-highlight');
            };
            return PlayerPersonnelLabel;
        })(Common.Models.FieldElement);
        Models.PlayerPersonnelLabel = PlayerPersonnelLabel;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var PlayerIndexLabel = (function (_super) {
            __extends(PlayerIndexLabel, _super);
            function PlayerIndexLabel(player) {
                _super.call(this, player.field, player);
                this.player = player;
                this.layer.type = Common.Enums.LayerTypes.PlayerIndexLabel;
                this.layer.graphics.selectable = false;
                this.layer.graphics.dimensions.offset.y =
                    (this.player.layer.graphics.dimensions.getHeight() / 2) * 0.4;
                this.layer.graphics.updateLocation(this.player.layer.graphics.location.ax, this.player.layer.graphics.location.ay + this.layer.graphics.dimensions.offset.y);
            }
            PlayerIndexLabel.prototype.draw = function () {
                this.layer.graphics.text((this.player.position.index).toString());
                this.layer.graphics.setAttribute('class', 'no-highlight');
            };
            return PlayerIndexLabel;
        })(Common.Models.FieldElement);
        Models.PlayerIndexLabel = PlayerIndexLabel;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Route = (function (_super) {
            __extends(Route, _super);
            function Route(player) {
                _super.call(this, player.field, player);
                this.player = player;
                if (this.player) {
                    this.nodes = new Common.Models.LinkedList();
                    var self_3 = this;
                    this.nodes.onModified(function () {
                        self_3.setModified(true);
                    });
                }
                /**
                 * Add layer to Player layers
                 * @type {[type]}
                 */
                this.layer.type = Common.Enums.LayerTypes.PlayerRoute;
            }
            Route.prototype.fromJson = function (json) {
                this.guid = json.guid;
            };
            Route.prototype.toJson = function () {
                return {
                    nodes: this.nodes.toJson()
                };
            };
            Route.prototype.remove = function () {
                this.routePath.remove();
                this.nodes.forEach(function (node, index) {
                    node.data.clear();
                });
            };
            Route.prototype.draw = function () {
                if (!this.player) {
                    throw new Error('Route player is not set');
                }
                this.routePath.pathString = this.getMixedStringFromNodes(this.nodes.toArray());
                this.routePath.draw();
                // ensure the route nodes are above the route path
                this.bringNodesToFront();
            };
            Route.prototype.drawCurve = function (node) {
                if (!this.player) {
                    throw new Error('Route player is not set');
                }
                if (node) {
                }
                // update path
                this.routePath.pathString = this.getCurveStringFromNodes(true, this.nodes.toArray());
                this.routePath.draw();
                // ensure the route nodes are above the route path
                this.bringNodesToFront();
            };
            Route.prototype.drawLine = function () {
                if (!this.player) {
                    throw new Error('Route player is not set');
                }
                this.routePath.pathString = this.getPathStringFromNodes(true, this.nodes.toArray());
                this.routePath.draw();
                // ensure the route nodes are above the route path
                this.bringNodesToFront();
            };
            Route.prototype.bringNodesToFront = function () {
                this.nodes.forEach(function (routeNode) {
                    routeNode.layer.graphics.toFront();
                });
                // move the player to the front above the route
                this.player.layer.toFront();
            };
            Route.prototype.addNode = function (routeNode, render) {
                if (this.nodes.isEmpty() && (routeNode.type != Common.Enums.RouteNodeTypes.Root &&
                    routeNode.type != Common.Enums.RouteNodeTypes.CurveStart)) {
                    throw new Error('Route addNode(): first route node must be of type Root or CurveStart');
                }
                this.nodes.add(routeNode);
                routeNode.draw();
                if (render !== false) {
                    this.draw();
                }
                return routeNode;
            };
            Route.prototype.getLastNode = function () {
                //return this.nodes.getLast<Common.Models.FieldElement>();
                return null;
            };
            Route.prototype.getMixedStringFromNodes = function (nodeArray) {
                if (!nodeArray || nodeArray.length <= 1) {
                    return '';
                }
                var str = '';
                for (var i = 0; i < nodeArray.length; i++) {
                    var routeNode = nodeArray[i];
                    if (Common.Utilities.isNullOrUndefined(routeNode))
                        continue;
                    if (!routeNode.next) {
                        // just in case
                        break;
                    }
                    // must always have at least 2 nodes
                    var type = routeNode.type;
                    var nextType = routeNode.next.type;
                    if (type == Common.Enums.RouteNodeTypes.CurveStart) {
                        if (nextType != Common.Enums.RouteNodeTypes.CurveControl) {
                            throw new Error('A curve start node must be followed by a curve control node');
                        }
                        // Good: next node is curve control
                        // check for 2 subsequent nodes
                        if (!routeNode.next.next) {
                            throw new Error('a curve must have a control and end node');
                        }
                        var endType = routeNode.next.next.type;
                        if (endType != Common.Enums.RouteNodeTypes.CurveEnd) {
                            throw new Error('A curve must end with a curve end node');
                        }
                        str += this.getCurveStringFromNodes(true, [
                            routeNode,
                            routeNode.next,
                            routeNode.next.next // next (end)
                        ]);
                        i++;
                    }
                    else if (type == Common.Enums.RouteNodeTypes.CurveEnd) {
                        if (i == 0) {
                            throw new Error('curveEnd node cannot be the first node');
                        }
                        if (nextType == Common.Enums.RouteNodeTypes.CurveControl) {
                            // check for 2 subsequent nodes
                            if (!routeNode.next.next) {
                                throw new Error('a curve must have a control and end node');
                            }
                            var endType = routeNode.next.next.type;
                            if (endType != Common.Enums.RouteNodeTypes.CurveEnd) {
                                throw new Error('A curve must end with a curve end node');
                            }
                            str += this.getCurveStringFromNodes(false, [
                                routeNode,
                                routeNode.next,
                                routeNode.next.next // next (end)
                            ]);
                            i++;
                        }
                        else {
                            // next node is normal node
                            str += this.getPathStringFromNodes(false, [
                                routeNode,
                                routeNode.next
                            ]);
                        }
                    }
                    else {
                        // assuming we are drawing a straight path
                        str += this.getPathStringFromNodes(i == 0, [
                            routeNode,
                            routeNode.next
                        ]);
                    }
                }
                return str;
            };
            Route.prototype.getPathStringFromNodes = function (initialize, nodeArray) {
                return Common.Drawing.Utilities.getPathString(initialize, this._prepareNodesForPath(nodeArray));
            };
            Route.prototype.getCurveStringFromNodes = function (initialize, nodeArray) {
                return Common.Drawing.Utilities.getCurveString(initialize, this._prepareNodesForPath(nodeArray));
            };
            Route.prototype._prepareNodesForPath = function (nodeArray) {
                var coords = [];
                for (var i = 0; i < nodeArray.length; i++) {
                    var routeNode = nodeArray[i];
                    if (Common.Utilities.isNullOrUndefined(routeNode))
                        continue;
                    coords.push(routeNode.layer.graphics.location.ax, routeNode.layer.graphics.location.ay);
                }
                return coords;
            };
            return Route;
        })(Common.Models.FieldElement);
        Models.Route = Route;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var RouteAction = (function (_super) {
            __extends(RouteAction, _super);
            function RouteAction(routeNode, action) {
                _super.call(this, routeNode.field, routeNode);
                this.routeNode = routeNode;
                this.action = action;
                this.actionable = !(this.routeNode.type == Common.Enums.RouteNodeTypes.CurveControl);
                this.layer.type = Common.Enums.LayerTypes.PlayerRouteAction;
            }
            RouteAction.prototype.draw = function () {
                Common.Factories.RouteActionFactory.draw(this);
            };
            RouteAction.prototype.toJson = function () {
                return {
                    action: this.action,
                    actionable: this.actionable
                };
            };
            RouteAction.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.action = json.action;
                this.actionable = json.actionable;
            };
            return RouteAction;
        })(Common.Models.FieldElement);
        Models.RouteAction = RouteAction;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var RouteCollection = (function (_super) {
            __extends(RouteCollection, _super);
            function RouteCollection() {
                _super.call(this);
            }
            RouteCollection.prototype.toJson = function () {
                return _super.prototype.toJson.call(this);
            };
            RouteCollection.prototype.fromJson = function (json) {
                var routes = json.routes || [];
                for (var i = 0; i < routes.length; i++) {
                    var rawRoute = routes[i];
                    var routeModel = void 0;
                    if (rawRoute.type == Common.Enums.RouteTypes.Preview) {
                        routeModel = new Playbook.Models.PreviewRoute(null);
                    }
                    else {
                        routeModel = new Playbook.Models.EditorRoute(null);
                    }
                    routeModel.fromJson(rawRoute);
                    this.add(routeModel);
                }
            };
            return RouteCollection;
        })(Common.Models.Collection);
        Models.RouteCollection = RouteCollection;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var RouteControlPath = (function (_super) {
            __extends(RouteControlPath, _super);
            function RouteControlPath(routeNode) {
                _super.call(this, routeNode.field, routeNode);
                this.routeNode = routeNode;
                this.layer.type = Common.Enums.LayerTypes.PlayerRouteControlPath;
                this.layer.graphics.setStroke('grey');
                this.layer.graphics.setStrokeWidth(1);
                this.layer.graphics.setOpacity(0.2);
            }
            RouteControlPath.prototype.toJson = function () {
                return {
                    pathString: this.pathString
                };
            };
            RouteControlPath.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.pathString = json.pathString;
            };
            RouteControlPath.prototype.draw = function () {
                // TODO @theBull - implement
                // let startNode, controlNode, endNode;
                // if (this.routeNode.type == Common.Enums.RouteNodeTypes.CurveControl) {
                //     if (!this.routeNode.node.next || !this.routeNode.node.prev) {
                //         throw new Error('controlNode does not have next and prev nodes');
                //     }
                //     startNode = this.routeNode.node.prev.data;
                //     controlNode = this;
                //     endNode = this.routeNode.node.next.data;
                // }
                // else if (this.routeNode.type == Common.Enums.RouteNodeTypes.CurveEnd) {
                //     if (!this.routeNode.node.prev || !this.routeNode.node.prev.prev) {
                //         throw new Error(['endNode node does not have previous controlNode or previous',
                //             'curve startNode nodes'].join(''));
                //     }
                //     startNode = this.routeNode.node.prev.prev.data;
                //     controlNode = this.routeNode.node.prev.data;
                //     endNode = this;
                // }
                // else if (this.routeNode.type == Common.Enums.RouteNodeTypes.CurveStart) {
                //     if (!this.routeNode.node.next || !this.routeNode.node.next.next) {
                //         throw new Error(['curve startNode node does not have subsequent',
                //             'controlNode and endNode nodes'].join(''));
                //     }
                //     startNode = this;
                //     controlNode = this.routeNode.node.next.data;
                //     endNode = this.routeNode.node.next.next.data;
                // }
                // // Generate a path string between the given startNode, controlNode, and endNode nodes
                // this.pathString = this.routeNode.player.route.getPathStringFromNodes(true, [startNode, controlNode, endNode]);
                // startNode.layer.graphics.path(this.pathString);
            };
            return RouteControlPath;
        })(Common.Models.FieldElement);
        Models.RouteControlPath = RouteControlPath;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var RouteNode = (function (_super) {
            __extends(RouteNode, _super);
            function RouteNode(route, relativeCoordinates, type) {
                _super.call(this, route.field, route.player);
                this.route = route;
                this.player = route.player;
                this.layer.graphics.updateFromRelative(relativeCoordinates.rx, relativeCoordinates.ry, this.player);
                this.layer.graphics.dimensions.radius = this.grid.getSize() / 3.5;
                this.layer.graphics.dimensions.width = this.layer.graphics.dimensions.radius * 2;
                this.layer.graphics.dimensions.height = this.layer.graphics.dimensions.radius * 2;
                this.type = type;
                /**
                 * Add layer to route layers
                 * @type {[type]}
                 */
                this.layer.type = Common.Enums.LayerTypes.PlayerRouteNode;
            }
            RouteNode.prototype.draw = function () {
                this.layer.graphics.circle();
            };
            RouteNode.prototype.setContext = function (route) {
                this.route = route;
                this.player = route.player;
                this.field = route.field;
                this.grid = this.context.grid;
                this.paper = this.context.paper;
                this.layer.graphics.updateLocation();
                this.layer.graphics.dimensions.radius = this.grid.getSize() / 4;
                this.layer.graphics.dimensions.width = this.layer.graphics.dimensions.radius * 2;
                this.layer.graphics.dimensions.height = this.layer.graphics.dimensions.radius * 2;
                this.draw();
            };
            RouteNode.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.routeAction.fromJson(json.routeAction);
                this.contextmenuTemplateUrl = json.contextmenuTemplateUrl;
                this.guid = json.guid;
                this.type = json.type;
                this.layer.graphics.fromJson(json.graphics);
                // route node has been modified
                this.setModified();
            };
            RouteNode.prototype.toJson = function () {
                var inherited = _super.prototype.toJson.call(this);
                var self = {
                    type: this.type,
                    routeAction: this.routeAction.toJson(),
                    graphics: this.layer.graphics.toJson()
                };
                return $.extend(inherited, self);
            };
            RouteNode.prototype.isCurveNode = function () {
                return this.type == Common.Enums.RouteNodeTypes.CurveControl ||
                    this.type == Common.Enums.RouteNodeTypes.CurveEnd ||
                    this.type == Common.Enums.RouteNodeTypes.CurveStart;
            };
            RouteNode.prototype.setAction = function (action) {
                this.routeAction.action = action;
                this.routeAction.draw();
                // route node has been modified
                this.setModified();
            };
            return RouteNode;
        })(Common.Models.FieldElement);
        Models.RouteNode = RouteNode;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var RoutePath = (function (_super) {
            __extends(RoutePath, _super);
            function RoutePath(route) {
                _super.call(this, route.player.field, route.player);
                this.route = route;
                this.layer.graphics.setOriginalFill(null);
                this.layer.graphics.setOriginalStroke('black');
                this.layer.graphics.setOriginalStrokeWidth(3);
                this.layer.type = Common.Enums.LayerTypes.PlayerRoutePath;
            }
            RoutePath.prototype.toJson = function () {
                return {
                    pathString: this.pathString
                };
            };
            RoutePath.prototype.remove = function () {
                this.layer.remove();
            };
            RoutePath.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.pathString = json.pathString;
            };
            /**
             * Draws a RoutePath graphic onto the paper;
             * NOTE: assumes the pathString is already set to a valid SVG path string
             */
            RoutePath.prototype.draw = function () {
                this.layer.graphics.path(this.pathString);
                this.layer.graphics.setAttribute('class', 'painted-fill');
            };
            return RoutePath;
        })(Common.Models.FieldElement);
        Models.RoutePath = RoutePath;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Placement = (function (_super) {
            __extends(Placement, _super);
            function Placement(rx, ry, relativeElement, index) {
                _super.call(this);
                _super.prototype.setContext.call(this, this);
                this.updateFromRelative(rx, ry, relativeElement);
                this.index = index >= 0 ? index : -1;
                //this.onModified(function() {});
            }
            Placement.prototype.toJson = function () {
                return {
                    relative: this.relative.toJson(),
                    coordinates: this.coordinates.toJson(),
                    index: this.index,
                    guid: this.guid
                };
            };
            Placement.prototype.fromJson = function (json) {
                this.relative.fromJson(json.relative);
                this.coordinates.fromJson(json.coordinates);
                this.index = json.index;
                this.guid = json.guid;
                //this.setModified(true);
            };
            Placement.prototype.updateFromCoordinates = function (x, y) {
                this.coordinates.update(x, y);
                this.relative.updateFromGridCoordinates(this.coordinates.x, this.coordinates.y);
                //this.setModified(true);
            };
            Placement.prototype.updateFromRelative = function (rx, ry, relativeElement) {
                if (!relativeElement) {
                    this.coordinates = new Common.Models.Coordinates(rx, ry);
                    this.relative = new Common.Models.RelativeCoordinates(0, 0, null);
                    this.relativeElement = null;
                    this.grid = null;
                }
                else {
                    this.relativeElement = relativeElement;
                    this.grid = this.relativeElement.grid;
                    this.relative = new Common.Models.RelativeCoordinates(rx, ry, this.relativeElement);
                    this.coordinates = this.relative.getCoordinates();
                }
            };
            return Placement;
        })(Common.Models.Modifiable);
        Models.Placement = Placement;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var PlacementCollection = (function (_super) {
            __extends(PlacementCollection, _super);
            function PlacementCollection() {
                _super.call(this);
            }
            PlacementCollection.prototype.fromJson = function (placements) {
                if (!placements)
                    return;
                var self = this;
                this.empty();
                for (var i = 0; i < placements.length; i++) {
                    var rawPlacement = placements[i];
                    var placementModel = new Common.Models.Placement(0, 0, null);
                    placementModel.fromJson(rawPlacement);
                    this.add(placementModel);
                }
                this.forEach(function (placement, index) {
                    placement.onModified(function () {
                        console.log('placement collection modified: placement:', placement.guid);
                        self.setModified(true);
                    });
                });
                this.setModified(true);
            };
            PlacementCollection.prototype.toJson = function () {
                return _super.prototype.toJson.call(this);
            };
            return PlacementCollection;
        })(Common.Models.Collection);
        Models.PlacementCollection = PlacementCollection;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Coordinates = (function (_super) {
            __extends(Coordinates, _super);
            // public ax: number;
            // public ay: number;
            // public ox: number;
            // public oy: number;
            // public dx: number;
            // public dy: number;
            // x/y are grid coords
            function Coordinates(x, y) {
                _super.call(this);
                _super.prototype.setContext.call(this, this);
                this.x = x;
                this.y = y;
                //this.onModified(function() { });
            }
            Coordinates.prototype.toJson = function () {
                return {
                    x: this.x,
                    y: this.y
                };
            };
            Coordinates.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.x = json.x;
                this.y = json.y;
            };
            Coordinates.prototype.update = function (x, y) {
                this.x = x;
                this.y = y;
                //this.setModified(true);
            };
            /**
             * Gets the relative coordinates from this' coordinates TO the given coordinates.
             * Example: An element 3 grid squares to the right of 'this' would result in an x value of -3
             * @param {Common.Models.Coordinates}       coords  [description]
             * @param {Common.Interfaces.IFieldElement} element [description]
             */
            Coordinates.prototype.getRelativeTo = function (coords, element) {
                return new Common.Models.RelativeCoordinates(coords.x - this.x, this.y - coords.y, element);
            };
            return Coordinates;
        })(Common.Models.Modifiable);
        Models.Coordinates = Coordinates;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var RelativeCoordinates = (function (_super) {
            __extends(RelativeCoordinates, _super);
            function RelativeCoordinates(rx, ry, relativeElement) {
                _super.call(this);
                this.rx = rx;
                this.ry = ry;
                if (relativeElement) {
                    this.relativeElement = relativeElement;
                    this.distance = this.getDistance();
                    this.theta = this.getTheta();
                }
                else {
                    this.relativeElement = null;
                    this.distance = 0;
                    this.theta = 0;
                }
            }
            RelativeCoordinates.prototype.drop = function () {
            };
            RelativeCoordinates.prototype.toJson = function () {
                return {
                    rx: this.rx,
                    ry: this.ry
                };
            };
            RelativeCoordinates.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.rx = json.rx;
                this.ry = json.ry;
            };
            RelativeCoordinates.prototype.getDistance = function () {
                if (Common.Utilities.isNullOrUndefined(this.relativeElement))
                    return null;
                return this.relativeElement ? Common.Drawing.Utilities.distance(this.rx, this.ry, this.relativeElement.layer.graphics.placement.coordinates.x, this.relativeElement.layer.graphics.placement.coordinates.y) : null;
            };
            RelativeCoordinates.prototype.getTheta = function () {
                if (Common.Utilities.isNullOrUndefined(this.relativeElement))
                    return null;
                return this.relativeElement ? Common.Drawing.Utilities.theta(this.rx, this.ry, this.relativeElement.layer.graphics.placement.coordinates.x, this.relativeElement.layer.graphics.placement.coordinates.y) : null;
            };
            RelativeCoordinates.prototype.updateFromGridCoordinates = function (x, y) {
                if (Common.Utilities.isNullOrUndefined(this.relativeElement))
                    return;
                this.rx = x - this.relativeElement.layer.graphics.placement.coordinates.x;
                this.ry = this.relativeElement.layer.graphics.placement.coordinates.y - y;
            };
            RelativeCoordinates.prototype.updateFromAbsoluteCoordinates = function (ax, ay) {
                // snap absolute coordinates to grid coordinates first...
                var gridCoords = this.relativeElement.grid.getCoordinatesFromAbsolute(ax, ay);
                this.updateFromGridCoordinates(gridCoords.x, gridCoords.y);
            };
            /**
             * Takes a set of relative x,y coordinates and returns the exact grid
             * coordinates; assumes the rx/ry values passed in are value grid coordinates
             *
             * @param  {number}                    rx relative x (grid coordinate)
             * @param  {number}                    ry relative y (grid coordinate)
             * @return {Common.Models.Coordinates}    The calculated coordinate
             */
            RelativeCoordinates.prototype.getCoordinatesFromRelative = function (rx, ry) {
                if (Common.Utilities.isNullOrUndefined(this.relativeElement))
                    return null;
                return new Common.Models.Coordinates(this.relativeElement.layer.graphics.placement.coordinates.x + rx, this.relativeElement.layer.graphics.placement.coordinates.y - ry);
            };
            RelativeCoordinates.prototype.getCoordinates = function () {
                var self = this;
                return new Common.Models.Coordinates(this.relativeElement.layer.graphics.placement.coordinates.x + self.rx, this.relativeElement.layer.graphics.placement.coordinates.y - self.ry);
            };
            return RelativeCoordinates;
        })(Common.Models.Storable);
        Models.RelativeCoordinates = RelativeCoordinates;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Location = (function (_super) {
            __extends(Location, _super);
            function Location(ax, ay) {
                _super.call(this);
                _super.prototype.setContext.call(this, this);
                this.ax = ax;
                this.ay = ay;
                this.ox = this.ax;
                this.oy = this.ay;
                this.dx = 0;
                this.dy = 0;
                //this.onModified(function() { });
            }
            Location.prototype.toJson = function () {
                return {
                    ax: this.ax,
                    ay: this.ay,
                    ox: this.ox,
                    oy: this.oy,
                    dx: this.dx,
                    dy: this.dy
                };
            };
            Location.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.ax = json.ax;
                this.ay = json.ay;
                this.ox = json.ox;
                this.oy = json.oy;
                this.dx = json.dx;
                this.dy = json.dy;
            };
            Location.prototype.drop = function () {
                this.ox = this.ax;
                this.oy = this.ay;
                this.dx = 0;
                this.dy = 0;
            };
            Location.prototype.moveByDelta = function (dx, dy) {
                this.dx = dx;
                this.dy = dy;
                this.ax = this.ox + this.dx;
                this.ay = this.oy + this.dy;
                //this.setModified(true);
            };
            Location.prototype.updateFromAbsolute = function (ax, ay) {
                this.ax = Common.Utilities.isNullOrUndefined(ax) ? this.ax : ax;
                this.ay = Common.Utilities.isNullOrUndefined(ay) ? this.ay : ay;
                this.dx = 0;
                this.dy = 0;
                this.ox = this.ax;
                this.oy = this.ay;
                //this.setModified(true);
            };
            Location.prototype.hasChanged = function () {
                return Math.abs(this.dx) > 0 || Math.abs(this.dy) > 0;
            };
            return Location;
        })(Common.Models.Modifiable);
        Models.Location = Location;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Graphics = (function (_super) {
            __extends(Graphics, _super);
            function Graphics(paper) {
                _super.call(this, Common.Enums.ImpaktDataTypes.Unknown);
                this.paper = paper;
                this.grid = paper.grid;
                this.set = new Common.Models.GraphicsSet(this);
                this.location = new Common.Models.Location(0, 0);
                this.placement = new Common.Models.Placement(0, 0);
                this.dimensions = new Common.Models.Dimensions();
                this.containment = new Common.Models.Containment(0, this.grid.getWidth(), 0, this.grid.getHeight());
                this.originalFill = 'white';
                this.originalStroke = 'black';
                this.originalOpacity = 1;
                this.originalStrokeWidth = 1;
                this.fill = this.originalFill;
                this.stroke = this.originalStroke;
                this.opacity = this.originalOpacity;
                this.strokeWidth = this.originalStrokeWidth;
                this.selectedFill = 'white';
                this.selectedStroke = 'red';
                this.selectedOpacity = 1;
                this.disabledFill = '#aaaaaa';
                this.disabledStroke = '#777777';
                this.disabledOpacity = 0.5;
                this.hoverOpacity = 0.4;
                this.font = this.paper.drawing.getFont('Arial');
                this.drawingHandler = new Common.Models.DrawingHandler(this);
                this.set = new Common.Models.GraphicsSet(this);
            }
            Graphics.prototype.toJson = function () {
                return {
                    dimensions: this.dimensions.toJson(),
                    opacity: this.opacity,
                    fill: this.fill,
                    stroke: this.stroke,
                    strokeWidth: this.strokeWidth,
                    originalOpacity: this.originalOpacity,
                    originalFill: this.originalFill,
                    originalStroke: this.originalStroke,
                    originalStrokeWidth: this.originalStrokeWidth,
                    selectedFill: this.selectedFill,
                    selectedStroke: this.selectedStroke,
                    selectedOpacity: this.selectedOpacity,
                    disabledFill: this.disabledFill,
                    disabledStroke: this.disabledStroke,
                    disabledOpacity: this.disabledOpacity,
                    hoverOpacity: this.hoverOpacity,
                    disabled: this.disabled,
                    selected: this.selected,
                    clickable: this.clickable,
                    hoverable: this.hoverable,
                    dragging: this.dragging,
                    draggable: this.draggable,
                    dragged: this.dragged,
                    placement: this.placement.toJson(),
                    location: this.location.toJson()
                };
            };
            Graphics.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.dimensions.fromJson(json.dimensions);
                this.opacity = json.opacity;
                this.fill = json.fill;
                this.stroke = json.stroke;
                this.strokeWidth = json.strokeWidth;
                this.placement.fromJson(json.placement);
                this.location.fromJson(json.location);
                this.originalOpacity = json.originalOpacity;
                this.originalFill = json.originalFill;
                this.originalStroke = json.originalStroke;
                this.originalStrokeWidth = json.originalStrokeWidth;
                this.selectedFill = json.selectedFill;
                this.selectedStroke = json.selectedStroke;
                this.selectedOpacity = json.selectedOpacity;
                this.disabledFill = json.disabledFill;
                this.disabledStroke = json.disabledStroke;
                this.disabledOpacity = json.disabledOpacity;
                this.hoverOpacity = json.hoverOpacity;
                this.disabled = json.disabled;
                this.selected = json.selected;
                this.clickable = json.clickable;
                this.hoverable = json.hoverable;
                this.dragging = json.dragging;
                this.draggable = json.draggable;
                this.dragged = json.dragged;
            };
            /**
             * Alias for hasRaphael()
             * @return {boolean} [description]
             */
            Graphics.prototype.hasGraphics = function () {
                return this.hasRaphael();
            };
            Graphics.prototype.hasRaphael = function () {
                return this.raphael != null && this.raphael != undefined;
            };
            Graphics.prototype.hasLocation = function () {
                return !Common.Utilities.isNullOrUndefined(this.location);
            };
            Graphics.prototype.hasPlacement = function () {
                return !Common.Utilities.isNullOrUndefined(this.placement);
            };
            Graphics.prototype.setPlacement = function (placement) {
                this.placement = placement;
                this.updateFromCoordinates(placement.coordinates.x, placement.coordinates.y);
            };
            Graphics.prototype.hasSet = function () {
                return !Common.Utilities.isNullOrUndefined(this.set);
            };
            Graphics.prototype.getFill = function () {
                return this.fill;
            };
            Graphics.prototype.setFill = function (fill) {
                this.fill = fill;
                return this.attr({ 'fill': this.fill });
            };
            Graphics.prototype.setOriginalFill = function (fill) {
                this.setFill(fill);
                this.originalFill = fill;
                return this;
            };
            Graphics.prototype.getStroke = function () {
                return this.stroke;
            };
            Graphics.prototype.setStroke = function (stroke) {
                this.stroke = stroke;
                return this.attr({ 'stroke': this.stroke });
            };
            Graphics.prototype.setOriginalStroke = function (stroke) {
                this.setStroke(stroke);
                this.originalStroke = stroke;
                return this;
            };
            Graphics.prototype.setSelectedStroke = function (stroke) {
                this.setStroke(stroke);
                this.selectedStroke = stroke;
                return this;
            };
            Graphics.prototype.getStrokeWidth = function () {
                return this.strokeWidth;
            };
            Graphics.prototype.setStrokeWidth = function (width) {
                this.strokeWidth = width;
                return this.attr({ 'stroke-width': this.strokeWidth });
            };
            Graphics.prototype.setOriginalStrokeWidth = function (width) {
                this.setStrokeWidth(width);
                this.originalStrokeWidth = width;
                return this;
            };
            Graphics.prototype.setHoverOpacity = function (opacity) {
                if (opacity < 0 || opacity > 1)
                    throw new Error('Graphics setHoverOpacity(): opacity must be between 0 and 1, inclusive');
                this.hoverOpacity = opacity;
                return this;
            };
            /**
             *
             * Dimension pass-through methods
             *
             */
            Graphics.prototype.setOffsetXY = function (x, y) {
                this.dimensions.setOffsetXY(x, y);
                this.updateLocation();
            };
            /**
             * Gets the current opacity
             * @return {number} [description]
             */
            Graphics.prototype.getOpacity = function () {
                return this.opacity;
            };
            /**
             * Sets the opacity to the given value
             * @param {number} value The opacity to set
             */
            Graphics.prototype.setOpacity = function (opacity) {
                if (opacity > 1 || opacity < 0)
                    throw new Error('Graphics setOpacity(): opacity must be between 0 and 1');
                var self = this;
                this.opacity = opacity;
                return this.attr({ 'opacity': opacity });
            };
            Graphics.prototype.setOriginalOpacity = function (opacity) {
                this.setOpacity(opacity);
                this.originalOpacity = opacity;
                return this;
            };
            /**
             * Toggles the opacity for show/hide effect
             */
            Graphics.prototype.toggleOpacity = function () {
                if (!this.disabled && !this.selected && this.hoverable) {
                    this.setOpacity(this.opacity == this.originalOpacity ?
                        this.hoverOpacity : this.originalOpacity);
                }
            };
            /**
             * Generic selection method
             */
            Graphics.prototype.toggleSelect = function () {
                if (!_super.prototype.isSelectable.call(this))
                    return;
                this.selected ? this.deselect() : this.select();
            };
            Graphics.prototype.select = function () {
                _super.prototype.select.call(this);
                this.fill = this.selectedFill;
                this.stroke = this.selectedStroke;
                this.opacity = this.selectedOpacity;
                var self = this;
                this.attr({
                    'fill': self.fill,
                    'stroke': self.stroke,
                    'opacity': self.opacity
                });
            };
            /**
             * Generic deselection method
             */
            Graphics.prototype.deselect = function () {
                _super.prototype.deselect.call(this);
                this.fill = this.originalFill;
                this.stroke = this.originalStroke;
                this.opacity = this.originalOpacity;
                var self = this;
                this.attr({
                    'fill': self.fill,
                    'stroke': self.stroke,
                    'opacity': self.opacity
                });
            };
            /**
             * Generic disable method
             */
            Graphics.prototype.disable = function () {
                _super.prototype.disable.call(this);
                this.fill = this.disabledFill;
                this.stroke = this.disabledStroke;
                this.opacity = this.disabledOpacity;
                var self = this;
                this.attr({
                    'fill': self.fill,
                    'stroke': self.stroke,
                    'opacity': self.opacity
                });
            };
            /**
             * Generic enable method
             */
            Graphics.prototype.enable = function () {
                _super.prototype.enable.call(this);
                this.fill = this.originalFill;
                this.stroke = this.originalStroke;
                this.opacity = this.originalOpacity;
                var self = this;
                this.attr({
                    'fill': self.fill,
                    'stroke': self.stroke,
                    'opacity': self.opacity
                });
            };
            Graphics.prototype.setContainment = function (left, right, top, bottom) {
                this.containment.left = left;
                this.containment.right = right;
                this.containment.top = top;
                this.containment.bottom = bottom;
            };
            Graphics.prototype.getCoordinates = function () {
                return this.placement.coordinates;
            };
            /**
             * Returns whether the given difference in absolute x/y location
             * from the current absolute location is within the graphic's
             * containment area.
             *
             * @param  {number}  dx The potential move-to ax location
             * @param  {number}  dy The potential move-to ay location
             * @return {boolean}    true if the location to move to is within
             *                           the containment area
             */
            Graphics.prototype.canMoveByDelta = function (dx, dy) {
                return this.canMoveByDeltaX(dx) && this.canMoveByDeltaY(dy);
            };
            Graphics.prototype.canMoveByDeltaX = function (dx) {
                return this.containment.isContainedX(dx + this.dimensions.offset.x);
            };
            Graphics.prototype.canMoveByDeltaY = function (dy) {
                return this.containment.isContainedY(dy + this.dimensions.offset.y);
            };
            /**
             * [moveByDelta description]
             * @param {number} dx [description]
             * @param {number} dy [description]
             */
            Graphics.prototype.moveByDelta = function (dx, dy) {
                if (!this.hasRaphael())
                    return;
                if (!this.location)
                    throw new Error('Graphics moveByDelta(): location is null or undefined');
                // Update graphical location
                this.location.moveByDelta(dx, dy);
                // Update placement when dropping
                var coords = this.grid.getCoordinatesFromAbsolute(this.location.ax, this.location.ay);
                this.placement.updateFromCoordinates(coords.x, coords.y);
                // Transform (move to updateAbsolute/Coordinates methods?)
                this.transform(this.location.dx, this.location.dy);
            };
            Graphics.prototype.moveByDeltaX = function (dx) {
                if (this.canMoveByDeltaX(dx)) {
                    this.moveByDelta(dx, 0);
                }
            };
            Graphics.prototype.moveByDeltaY = function (dy) {
                if (this.canMoveByDeltaY(dy)) {
                    this.moveByDelta(0, dy);
                }
            };
            Graphics.prototype.updatePlacement = function (x, y) {
                this.updateFromCoordinates(Common.Utilities.isNullOrUndefined(x) ? this.placement.coordinates.x : x, Common.Utilities.isNullOrUndefined(y) ? this.placement.coordinates.y : y);
            };
            Graphics.prototype.updateLocation = function (ax, ay) {
                var setAx = Common.Utilities.isNullOrUndefined(ax) ? this.location.ax : ax;
                var setAy = Common.Utilities.isNullOrUndefined(ay) ? this.location.ay : ay;
                this.updateFromAbsolute(setAx, setAy);
            };
            Graphics.prototype.updateFromAbsolute = function (ax, ay) {
                // Update location
                this.location.updateFromAbsolute(ax, ay);
                // convert absolute coordinates into grid coordinates & update placement
                var coords = this.grid.getCoordinatesFromAbsolute(ax, ay);
                this.placement.updateFromCoordinates(coords.x, coords.y);
                this.refresh();
            };
            Graphics.prototype.updateFromCoordinates = function (x, y) {
                // convert grid coordinates to absolute & update location
                var absCoords = this.grid.getAbsoluteFromCoordinates(x, y);
                this.location.updateFromAbsolute(absCoords.x + this.dimensions.offset.x, absCoords.y + this.dimensions.offset.y);
                // Update graphical location
                this.placement.updateFromCoordinates(x, y);
                this.refresh();
            };
            Graphics.prototype.updateFromRelative = function (rx, ry, relativeElement) {
                this.placement.updateFromRelative(rx, ry, relativeElement);
                var absCoords = this.grid.getAbsoluteFromCoordinates(this.placement.coordinates.x, this.placement.coordinates.y);
                this.location.updateFromAbsolute(absCoords.x + this.dimensions.offset.x, absCoords.y + this.dimensions.offset.y);
                this.refresh();
            };
            /**
             *
             * DRAWING METHODS
             *
             */
            Graphics.prototype.path = function (path) {
                this.remove();
                this.raphael = this.paper.drawing.path(path);
                this.refresh();
                return this;
            };
            Graphics.prototype.rect = function () {
                this.remove();
                this.raphael = this.paper.drawing.rect(this.placement.coordinates.x, this.placement.coordinates.y, this.dimensions.getWidth(), this.dimensions.getHeight(), false, this.dimensions.getOffsetX(), this.dimensions.getOffsetY());
                this.refresh();
                return this;
            };
            Graphics.prototype.rhombus = function () {
                this.remove();
                this.rect();
                this.dimensions.rotation = -45;
                this.refresh();
                this.transform(0, 0);
                return this;
            };
            Graphics.prototype.ellipse = function () {
                this.remove();
                this.raphael = this.paper.drawing.ellipse(this.placement.coordinates.x, this.placement.coordinates.y, this.dimensions.getWidth(), this.dimensions.getHeight(), false, this.dimensions.getOffsetX(), this.dimensions.getOffsetY());
                this.refresh();
                return this;
            };
            Graphics.prototype.circle = function () {
                this.remove();
                this.raphael = this.paper.drawing.circle(this.placement.coordinates.x, this.placement.coordinates.y, this.dimensions.getRadius(), false, this.dimensions.getOffsetX(), this.dimensions.getOffsetY());
                this.refresh();
                return this;
            };
            Graphics.prototype.triangle = function () {
                this.remove();
                this.raphael = this.paper.drawing.triangle(this.placement.coordinates.x, this.placement.coordinates.y, this.dimensions.getHeight(), false, this.dimensions.getOffsetX(), this.dimensions.getOffsetY());
                this.refresh();
                return this;
            };
            Graphics.prototype.text = function (text) {
                this.remove();
                this.raphael = this.paper.drawing.text(this.placement.coordinates.x, this.placement.coordinates.y, text, false, this.dimensions.getOffsetX(), this.dimensions.getOffsetY());
                return this;
            };
            Graphics.prototype.refresh = function () {
                if (!this.hasRaphael())
                    return;
                var attrs = {
                    x: this.location.ax,
                    y: this.location.ay,
                };
                if (this.getType() == 'circle') {
                    attrs['cx'] = this.location.ax;
                    attrs['cy'] = this.location.ay;
                }
                if (this.getType() != 'text') {
                    attrs['fill'] = this.fill;
                    attrs['fill-opacity'] = !Common.Utilities.isNullOrUndefined(this.fill) ? 1 : 0;
                    attrs['opacity'] = this.opacity;
                    attrs['stroke'] = this.stroke;
                    attrs['stroke-width'] = this.strokeWidth;
                }
                this.attr(attrs);
            };
            Graphics.prototype.toFront = function () {
                if (!this.hasRaphael())
                    return this;
                this.raphael.toFront();
                return this;
            };
            Graphics.prototype.toBack = function () {
                if (!this.hasRaphael())
                    return this;
                this.raphael.toBack();
                return this;
            };
            Graphics.prototype.attr = function (attrs) {
                if (!this.hasRaphael())
                    return;
                return this.raphael.attr(attrs);
            };
            Graphics.prototype.setAttribute = function (attribute, value) {
                if (!this.hasRaphael())
                    return;
                this.raphael.node.setAttribute(attribute, value);
            };
            Graphics.prototype.getBBox = function (isWithoutTransforms) {
                if (!this.hasRaphael())
                    return;
                this.raphael.getBBox(isWithoutTransforms === true);
            };
            Graphics.prototype.transform = function (ax, ay) {
                if (!this.hasRaphael())
                    return;
                this.raphael.transform(['t', ax, ', ', ay, 'r', this.dimensions.rotation].join(''));
            };
            Graphics.prototype.rotate = function (degrees) {
                if (!this.hasRaphael())
                    return;
                this.raphael.rotate(degrees);
            };
            Graphics.prototype.remove = function () {
                if (!this.hasRaphael())
                    return;
                this.raphael && this.raphael[0] && this.raphael[0].remove();
                this.raphael = null;
            };
            Graphics.prototype.show = function () {
                if (!this.hasRaphael())
                    return;
                this.raphael.show();
                if (this.hasSet())
                    this.set.show();
            };
            Graphics.prototype.hide = function () {
                if (!this.hasRaphael())
                    return;
                this.raphael.hide();
                if (this.hasSet())
                    this.set.hide();
            };
            Graphics.prototype.glow = function () {
                if (!this.hasRaphael())
                    return;
                this.raphael.glow();
            };
            Graphics.prototype.getType = function () {
                if (!this.hasRaphael())
                    return;
                return this.raphael.type;
            };
            /**
             * Handles drawing of graphical element
             * @param  {any[]} ...args [description]
             * @return {any}           [description]
             */
            Graphics.prototype.ondraw = function (callback) {
                this.drawingHandler.ondraw(callback);
            };
            Graphics.prototype.draw = function () {
                this.drawingHandler.draw();
            };
            /**
             * Hover in/out handler registration method;
             * handles generic opacity toggling for all field elements.
             *
             * @param {any} hoverIn  [description]
             * @param {any} hoverOut [description]
             * @param {any} context  [description]
             */
            Graphics.prototype.onhover = function (hoverIn, hoverOut, context) {
                if (!this.hasRaphael())
                    return;
                var self = this;
                this.raphael.hover(function (e) {
                    hoverIn.call(context, e);
                }, function (e) {
                    hoverOut.call(context, e);
                });
            };
            Graphics.prototype.hoverIn = function (e, context) {
                if (!this.hasRaphael())
                    return;
                // Generic hover in functionality
                console.log('graphics hoverIn');
                this.toggleOpacity();
            };
            Graphics.prototype.hoverOut = function (e, context) {
                if (!this.hasRaphael())
                    return;
                // Generic hover out functionality
                console.log('graphics hoverOut');
                this.toggleOpacity();
            };
            /**
             * Click events
             * @param {any} fn      [description]
             * @param {any} context [description]
             */
            Graphics.prototype.onclick = function (fn, context) {
                if (!this.hasRaphael())
                    return;
                //console.log('fieldElement click');
                this.raphael.click(function (e) {
                    fn.call(context, e);
                });
            };
            Graphics.prototype.click = function (e, context) {
            };
            Graphics.prototype.oncontextmenu = function (fn, context) {
                if (!this.hasRaphael())
                    return;
                this.raphael.mousedown(function (e) {
                    if (e.which == Common.Input.Which.RightClick) {
                        fn.call(context, e);
                    }
                });
            };
            Graphics.prototype.contextmenu = function (e, context) {
            };
            /**
             * Mouse down event handler registration method
             * @param {any}                             fn      [description]
             * @param {Common.Interfaces.IFieldElement} context [description]
             */
            Graphics.prototype.onmousedown = function (fn, context) {
                if (!this.hasRaphael())
                    return;
                this.raphael.mousedown(function (e) {
                    fn.call(context, e);
                });
            };
            /**
             * Mouse up event handler registration method
             * @param {any}                             fn      [description]
             * @param {Common.Interfaces.IFieldElement} context [description]
             */
            Graphics.prototype.onmouseup = function (fn, context) {
                if (!this.hasRaphael())
                    return;
                this.raphael.mouseup(function (e) {
                    fn.call(context, e);
                });
            };
            /**
             * Default mousedown handler to be called if no other handlers are
             * registered with onmousedown
             * @param {any}                             e       [description]
             * @param {Common.Interfaces.IFieldElement} context [description]
             */
            Graphics.prototype.mousedown = function (e, context) {
                if (!this.hasRaphael())
                    return;
            };
            /**
             * Mouse move event handler registration method; attaches listeners
             * to be fired when the cursor moves over an element (such as for cursor tracking)
             * @param {any}                             fn      [description]
             * @param {Common.Interfaces.IFieldElement} context [description]
             */
            Graphics.prototype.onmousemove = function (fn, context) {
                if (!this.hasRaphael())
                    return;
                this.raphael.mousemove(function (e) {
                    fn.call(context, e);
                });
            };
            /**
             * Default mouse move handler to be called if no other handlers are
             * registered with onmousedown
             * @param {any}                             e       [description]
             * @param {Common.Interfaces.IFieldElement} context [description]
             */
            Graphics.prototype.mousemove = function (e, context) {
                if (!this.hasRaphael())
                    return;
            };
            Graphics.prototype.ondrag = function (dragMove, dragStart, dragEnd, context) {
                if (!this.hasRaphael())
                    return;
                this.raphael.drag(dragMove, dragStart, dragEnd, context, context, context);
            };
            Graphics.prototype.drop = function () {
                this.dragged = false;
                this.dragging = false;
                if (this.location.hasChanged())
                    this.setModified(true);
                // Apply snap on drop
                this.updateLocation(this.grid.snapPixel(this.location.ax), this.grid.snapPixel(this.location.ay));
                this.transform(0, 0);
            };
            return Graphics;
        })(Common.Models.Actionable);
        Models.Graphics = Graphics;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var GraphicsSet = (function () {
            function GraphicsSet(context) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                this.context = context;
                this.paper = this.context.paper;
                this.canvas = this.paper.canvas;
                this.grid = this.paper.grid;
                this.items = [];
                this.raphaelSet = this.paper.drawing.set();
                if (args && args.length > 0) {
                    this.push.apply(this, args);
                }
                //console.log(this.items);
                this.length = this.items.length;
            }
            GraphicsSet.prototype.size = function () {
                return this.items.length;
            };
            GraphicsSet.prototype.push = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                for (var i = 0; i < args.length; i++) {
                    var graphics = args[i];
                    this.length++;
                    this.raphaelSet.exclude(graphics.raphael);
                    this.raphaelSet.push(graphics.raphael);
                    this.items.push(graphics);
                }
            };
            GraphicsSet.prototype.pop = function () {
                this.length--;
                this.raphaelSet.pop();
                return this.items.pop();
            };
            GraphicsSet.prototype.exclude = function (graphics) {
                var matchingGraphics = this.getByGuid(graphics.guid);
                if (!matchingGraphics)
                    throw new Error('GraphicsSet exclude(): no matching graphics found for exclusion');
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    if (item.guid == matchingGraphics.guid) {
                        this.splice(i, 1);
                        this.length--;
                        break;
                    }
                }
                return this.raphaelSet.exclude(matchingGraphics.raphael);
            };
            GraphicsSet.prototype.forEach = function (iterator, context) {
                return this.raphaelSet.forEach(iterator, context);
            };
            GraphicsSet.prototype.getByGuid = function (guid) {
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    if (item && item.guid && item.guid == guid)
                        return item;
                }
                return null;
            };
            GraphicsSet.prototype.splice = function (index, count) {
                this.length -= count;
                this.raphaelSet.splice(index, count);
                return this.items.splice(index, count);
            };
            GraphicsSet.prototype.removeAll = function () {
                while (this.raphaelSet.length > 0) {
                    this.pop();
                }
                this.items = [];
                this.length = 0;
            };
            GraphicsSet.prototype.dragOne = function (guid, dx, dy) {
                var graphics = this.getByGuid(guid);
                graphics.moveByDelta(dx, dy);
            };
            GraphicsSet.prototype.dragAll = function (dx, dy) {
                //console.log('dragging ' + this.length + ' items');
                // for each item in the set, update its drag position
                for (var i = 0; i < this.items.length; i++) {
                    var graphics = this.items[i];
                    graphics.moveByDelta(dx, dy);
                }
            };
            GraphicsSet.prototype.show = function () {
                this.raphaelSet.show();
            };
            GraphicsSet.prototype.hide = function () {
                this.raphaelSet.hide();
            };
            GraphicsSet.prototype.drop = function () {
                // iterate over each item and update its final position
                for (var i = 0; i < this.items.length; i++) {
                    var item = this.items[i];
                    item.drop();
                }
            };
            GraphicsSet.prototype.setOriginalPositions = function () {
                // for each item in the set, update its drag position
                for (var i = 0; i < this.items.length; i++) {
                    var graphics = this.items[i];
                    graphics.location.ax = graphics.location.ox;
                    graphics.location.ay = graphics.location.oy;
                }
            };
            return GraphicsSet;
        })();
        Models.GraphicsSet = GraphicsSet;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Dimensions = (function (_super) {
            __extends(Dimensions, _super);
            function Dimensions() {
                _super.call(this);
                _super.prototype.setContext.call(this, this);
                this.width = 0;
                this.height = 0;
                this.minWidth = 0;
                this.minHeight = 0;
                this.length = 0;
                this.depth = 0;
                this.radius = 0;
                this.diameter = 2 * this.radius;
                this.perimeter = 0;
                this.circumference = 0;
                this.area = 0;
                this.circularArea = 0;
                this.offset = new Common.Models.Offset(0, 0);
                this.rotation = 0;
            }
            Dimensions.prototype.toJson = function () {
                return {
                    width: this.width,
                    height: this.height,
                    minWidth: this.minWidth,
                    minHeight: this.minHeight,
                    length: this.length,
                    depth: this.depth,
                    radius: this.radius,
                    diameter: this.diameter,
                    perimeter: this.perimeter,
                    area: this.area,
                    circumference: this.circumference,
                    offset: this.offset.toJson(),
                    rotation: this.rotation
                };
            };
            Dimensions.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.width = json.width;
                this.height = json.height;
                this.minWidth = json.minWidth;
                this.minHeight = json.minHeight;
                this.length = json.length;
                this.depth = json.depth;
                this.radius = json.radius;
                this.diameter = json.diameter;
                this.perimeter = json.perimeter;
                this.area = json.area;
                this.circumference = json.circumference;
                this.offset.fromJson(json.offset);
                this.rotation = json.rotation;
            };
            Dimensions.prototype.calculateDimensions = function () {
                this._calculateDiameter();
                this._calculateArea();
                this._calculatePerimeter();
                this._calculateCircumference();
                this._calculateCircularArea();
                //this.setModified(true);
            };
            Dimensions.prototype.getHeight = function () {
                return this.height;
            };
            Dimensions.prototype.setHeight = function (height) {
                this.height = height;
                this.calculateDimensions();
            };
            Dimensions.prototype.getWidth = function () {
                return this.width;
            };
            Dimensions.prototype.setWidth = function (width) {
                this.width = width;
                this.calculateDimensions();
            };
            Dimensions.prototype.getMinWidth = function () {
                return this.minWidth;
            };
            Dimensions.prototype.setMinWidth = function (minWidth) {
                this.minWidth = minWidth;
                // only recalculate / set as modified if
                // the minWidth is greater then the current width;
                // enforce that the width isn't less than the minWidth
                if (this.minWidth > this.width)
                    this.setWidth(this.minWidth);
            };
            Dimensions.prototype.getMinHeight = function () {
                return this.minHeight;
            };
            Dimensions.prototype.setMinHeight = function (minHeight) {
                this.minHeight = minHeight;
                // only recalculate / set as modified if
                // the minHeight is greater then the current height;
                // enforce that the height isn't less than the minHeight
                if (this.minHeight > this.height)
                    this.setHeight(this.minHeight);
            };
            /**
             * Mostly for line segments
             * @return {number} [description]
             */
            Dimensions.prototype.getLength = function () {
                return this.length;
            };
            Dimensions.prototype.setLength = function (length) {
                this.length = length;
            };
            Dimensions.prototype.getDepth = function () {
                return this.depth;
            };
            Dimensions.prototype.setDepth = function (depth) {
                this.depth = depth;
                //this.setModified(true);
            };
            Dimensions.prototype.getRadius = function () {
                return this.radius;
            };
            Dimensions.prototype.setRadius = function (radius) {
                this.radius = radius;
                this.calculateDimensions();
            };
            Dimensions.prototype.getDiameter = function () {
                return this.diameter;
            };
            Dimensions.prototype.setDiameter = function (diameter) {
                this.diameter = diameter;
                this.radius = this.diameter / 2;
                //this.setModified(true);
            };
            Dimensions.prototype._calculateDiameter = function () {
                this.diameter = this.getRadius() * 2;
                return this.diameter;
            };
            Dimensions.prototype.getPerimeter = function () {
                return this.perimeter;
            };
            Dimensions.prototype._calculatePerimeter = function () {
                this.perimeter = (this.height * 2) + (this.width * 2);
                return this.perimeter;
            };
            Dimensions.prototype.getArea = function () {
                return this.area;
            };
            Dimensions.prototype._calculateArea = function () {
                this.area = this.height * this.width;
                return this.area;
            };
            Dimensions.prototype.getCircumference = function () {
                return this.circumference;
            };
            Dimensions.prototype._calculateCircumference = function () {
                this.circumference = 2 * Math.PI * this.getRadius();
                return this.circumference;
            };
            Dimensions.prototype.getCircularArea = function () {
                return this.circularArea;
            };
            Dimensions.prototype._calculateCircularArea = function () {
                this.circularArea = Math.PI * Math.pow(this.getRadius(), 2);
                return this.circularArea;
            };
            Dimensions.prototype.hasOffset = function () {
                return !Common.Utilities.isNullOrUndefined(this.offset);
            };
            Dimensions.prototype.getOffset = function () {
                return this.offset;
            };
            Dimensions.prototype.setOffset = function (offset) {
                if (!this.hasOffset())
                    this.offset = new Common.Models.Offset(offset.x, offset.y);
                else
                    this.offset = offset;
                //this.setModified(true);
            };
            Dimensions.prototype.getOffsetX = function () {
                return this.hasOffset() ? this.offset.getX() : null;
            };
            Dimensions.prototype.setOffsetX = function (x) {
                if (!this.hasOffset())
                    this.offset = new Common.Models.Offset(x, 0);
                else
                    this.offset.x = x;
                //this.setModified(true);
            };
            Dimensions.prototype.getOffsetY = function () {
                return this.hasOffset() ? this.offset.getY() : null;
            };
            Dimensions.prototype.setOffsetY = function (y) {
                if (!this.hasOffset())
                    this.offset = new Common.Models.Offset(0, y);
                else
                    this.offset.y = y;
                //this.setModified(true);
            };
            Dimensions.prototype.setOffsetXY = function (x, y) {
                this.offset.setXY(x, y);
                //this.setModified(true);
            };
            return Dimensions;
        })(Common.Models.Modifiable);
        Models.Dimensions = Dimensions;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Offset = (function (_super) {
            __extends(Offset, _super);
            function Offset(x, y) {
                _super.call(this);
                _super.prototype.setContext.call(this, this);
                this.x = x || 0;
                this.y = y || 0;
                this.onModified(function () {
                    //console.log('offset modified');
                });
            }
            Offset.prototype.toJson = function () {
                return {
                    x: this.x,
                    y: this.y
                };
            };
            Offset.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.x = json.x;
                this.y = json.y;
            };
            Offset.prototype.set = function (offset) {
                this.x = offset.x;
                this.y = offset.y;
                this.setModified(true);
            };
            Offset.prototype.hasXY = function () {
                return this.hasX() && this.hasY();
            };
            Offset.prototype.hasX = function () {
                return Common.Utilities.isNullOrUndefined(this.x);
            };
            Offset.prototype.getX = function () {
                return this.x;
            };
            Offset.prototype.setX = function (x) {
                this.x = x;
                this.setModified(true);
            };
            Offset.prototype.hasY = function () {
                return Common.Utilities.isNullOrUndefined(this.y);
            };
            Offset.prototype.getY = function () {
                return this.y;
            };
            Offset.prototype.setY = function (y) {
                this.y = y;
                this.setModified(true);
            };
            Offset.prototype.setXY = function (x, y) {
                this.x = x;
                this.y = y;
                this.setModified(true);
            };
            return Offset;
        })(Common.Models.Modifiable);
        Models.Offset = Offset;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Containment = (function () {
            function Containment(left, right, top, bottom) {
                this.left = left;
                this.right = right;
                this.top = top;
                this.bottom = bottom;
            }
            Containment.prototype.isContained = function (coordinates) {
                return this.isContainedX(coordinates.x) &&
                    this.isContainedY(coordinates.y);
            };
            Containment.prototype.isContainedX = function (x) {
                return x >= this.left && x <= this.right;
            };
            Containment.prototype.isContainedY = function (y) {
                return y <= this.top && y >= this.bottom;
            };
            return Containment;
        })();
        Models.Containment = Containment;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var RelativeContainment = (function (_super) {
            __extends(RelativeContainment, _super);
            function RelativeContainment(left, right, top, bottom) {
                _super.call(this, left, right, top, bottom);
            }
            return RelativeContainment;
        })(Common.Models.Containment);
        Models.RelativeContainment = RelativeContainment;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var DrawingHandler = (function () {
            function DrawingHandler(graphics) {
                this.callbacks = [];
            }
            DrawingHandler.prototype.ondraw = function (callback) {
                if (!this.callbacks)
                    throw new Error('Drawable ondraw(): callbacks array is null or undefined');
                this.callbacks.push(callback);
            };
            DrawingHandler.prototype.draw = function () {
                if (!this.callbacks)
                    return;
                for (var i = 0; i < this.callbacks.length; i++) {
                    var callback = this.callbacks[i];
                    if (callback && typeof callback == 'Function')
                        callback(this.graphics);
                }
            };
            return DrawingHandler;
        })();
        Models.DrawingHandler = DrawingHandler;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Quote = (function () {
            function Quote(quote, author) {
                this.quote = quote;
                this.author = author;
            }
            return Quote;
        })();
        Models.Quote = Quote;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
/// <reference path='../common.ts' />
/// <reference path='../interfaces/interfaces.ts' />
/// <reference path='./Storable.ts' />
/// <reference path='./Modifiable.ts' />
/// <reference path='./Collection.ts' />
/// <reference path='./LinkedList.ts' />
/// <reference path='./ModifiableCollection.ts' />
/// <reference path='./ContextmenuData.ts' />
/// <reference path='./Actionable.ts' />
/// <reference path='./ActionableCollection.ts' />
/// <reference path='./AssociableEntity.ts' />
/// <reference path='./AssociableEntityCollection.ts' />
/// <reference path='./AssociationCollection.ts' />
/// <reference path='./Association.ts' />
/// <reference path='./Notification.ts' />
/// <reference path='./NotificationCollection.ts' />
/// <reference path='./Icon.ts' />
/// <reference path='./Assignment.ts' />
/// <reference path='./AssignmentGroup.ts' />
/// <reference path='./AssignmentGroupCollection.ts' />
/// <reference path='./Formation.ts' />
/// <reference path='./FormationCollection.ts' />
/// <reference path='./Play.ts' />
/// <reference path='./PlayPrimary.ts' />
/// <reference path='./PlayOpponent.ts' />
/// <reference path='./PlayCollection.ts' />
/// <reference path='./PlaybookModel.ts' />
/// <reference path='./PlaybookModelCollection.ts' />
/// <reference path='./Tab.ts' />
/// <reference path='./TabCollection.ts' />
/// <reference path='./Template.ts' />
/// <reference path='./TemplateCollection.ts' />
/// <reference path='./Input.ts' />
/// <reference path='./Listener.ts' />
/// <reference path='./Canvas.ts' />
/// <reference path='./Drawing.ts' />
/// <reference path='./Layer.ts' />
/// <reference path='./LayerCollection.ts' />
/// <reference path='./CanvasListener.ts' />
/// <reference path='./Paper.ts' />
/// <reference path='./Grid.ts' />
/// <reference path='./Field.ts' />
/// <reference path='./FieldElement.ts' />
/// <reference path='./Ball.ts' />
/// <reference path='./Ground.ts' />
/// <reference path='./LineOfScrimmage.ts' />
/// <reference path='./Endzone.ts' />
/// <reference path='./Hashmark.ts' />
/// <reference path='./Ground.ts' />
/// <reference path='./Sideline.ts' />
/// <reference path='./Player.ts' />
/// <reference path='./PlayerCollection.ts' />
/// <reference path='./PlayerSelectionBox.ts' />
/// <reference path='./PlayerIcon.ts' />
/// <reference path='./PlayerRelativeCoordinatesLabel.ts' />
/// <reference path='./PlayerPersonnelLabel.ts' />
/// <reference path='./PlayerIndexLabel.ts' />
/// <reference path='./Route.ts' />
/// <reference path='./RouteAction.ts' />
/// <reference path='./RouteCollection.ts' />
/// <reference path='./RouteControlPath.ts' />
/// <reference path='./RouteNode.ts' />
/// <reference path='./RoutePath.ts' />
/// <reference path='./Placement.ts' />
/// <reference path='./PlacementCollection.ts' />
/// <reference path='./Coordinates.ts' />
/// <reference path='./RelativeCoordinates.ts' />
/// <reference path='./Location.ts' />
/// <reference path='./Graphics.ts' />
/// <reference path='./GraphicsSet.ts' />
/// <reference path='./Dimensions.ts' />
/// <reference path='./Offset.ts' />
/// <reference path='./Containment.ts' />
/// <reference path='./RelativeContainment.ts' />
/// <reference path='./DrawingHandler.ts' />
/// <reference path='./Quote.ts' />
/// <reference path='../common.ts' />
var Common;
(function (Common) {
    var Enums;
    (function (Enums) {
        (function (ImpaktDataTypes) {
            ImpaktDataTypes[ImpaktDataTypes["Unknown"] = 0] = "Unknown";
            ImpaktDataTypes[ImpaktDataTypes["PlaybookView"] = 1] = "PlaybookView";
            ImpaktDataTypes[ImpaktDataTypes["Playbook"] = 2] = "Playbook";
            ImpaktDataTypes[ImpaktDataTypes["Formation"] = 3] = "Formation";
            ImpaktDataTypes[ImpaktDataTypes["Set"] = 4] = "Set";
            ImpaktDataTypes[ImpaktDataTypes["Play"] = 10] = "Play";
            ImpaktDataTypes[ImpaktDataTypes["PlayTemplate"] = 98] = "PlayTemplate";
            ImpaktDataTypes[ImpaktDataTypes["Variant"] = 99] = "Variant";
            ImpaktDataTypes[ImpaktDataTypes["Team"] = 200] = "Team";
            ImpaktDataTypes[ImpaktDataTypes["GenericEntity"] = 1000] = "GenericEntity";
            ImpaktDataTypes[ImpaktDataTypes["League"] = 1010] = "League";
            ImpaktDataTypes[ImpaktDataTypes["Season"] = 1011] = "Season";
            ImpaktDataTypes[ImpaktDataTypes["Opponent"] = 1012] = "Opponent";
            ImpaktDataTypes[ImpaktDataTypes["Game"] = 1013] = "Game";
            ImpaktDataTypes[ImpaktDataTypes["Position"] = 1014] = "Position";
            ImpaktDataTypes[ImpaktDataTypes["PersonnelGroup"] = 1015] = "PersonnelGroup";
            ImpaktDataTypes[ImpaktDataTypes["TeamMember"] = 1016] = "TeamMember";
            ImpaktDataTypes[ImpaktDataTypes["UnitType"] = 1017] = "UnitType";
            ImpaktDataTypes[ImpaktDataTypes["Conference"] = 1018] = "Conference";
            ImpaktDataTypes[ImpaktDataTypes["Scenario"] = 1020] = "Scenario";
            ImpaktDataTypes[ImpaktDataTypes["MatchupPlaybook"] = 1021] = "MatchupPlaybook";
            ImpaktDataTypes[ImpaktDataTypes["Situation"] = 1022] = "Situation";
            ImpaktDataTypes[ImpaktDataTypes["Assignment"] = 1023] = "Assignment";
            ImpaktDataTypes[ImpaktDataTypes["AssignmentGroup"] = 1024] = "AssignmentGroup";
            ImpaktDataTypes[ImpaktDataTypes["GamePlan"] = 1030] = "GamePlan";
            ImpaktDataTypes[ImpaktDataTypes["PracticePlan"] = 1031] = "PracticePlan";
            ImpaktDataTypes[ImpaktDataTypes["PracticeSchedule"] = 1032] = "PracticeSchedule";
            ImpaktDataTypes[ImpaktDataTypes["ScoutCard"] = 1033] = "ScoutCard";
            ImpaktDataTypes[ImpaktDataTypes["Drill"] = 1034] = "Drill";
            ImpaktDataTypes[ImpaktDataTypes["QBWristband"] = 1035] = "QBWristband";
            ImpaktDataTypes[ImpaktDataTypes["GameAnalysis"] = 1050] = "GameAnalysis";
            ImpaktDataTypes[ImpaktDataTypes["PlayByPlayAnalysis"] = 1051] = "PlayByPlayAnalysis";
            ImpaktDataTypes[ImpaktDataTypes["GenericSetting"] = 2000] = "GenericSetting";
            ImpaktDataTypes[ImpaktDataTypes["User"] = 2010] = "User";
            ImpaktDataTypes[ImpaktDataTypes["SecureUser"] = 2011] = "SecureUser";
            ImpaktDataTypes[ImpaktDataTypes["Account"] = 2020] = "Account";
            ImpaktDataTypes[ImpaktDataTypes["Organization"] = 2021] = "Organization";
        })(Enums.ImpaktDataTypes || (Enums.ImpaktDataTypes = {}));
        var ImpaktDataTypes = Enums.ImpaktDataTypes;
        (function (AssociationTypes) {
            AssociationTypes[AssociationTypes["Unknown"] = 0] = "Unknown";
            AssociationTypes[AssociationTypes["Peer"] = 1] = "Peer";
            AssociationTypes[AssociationTypes["Dependency"] = 2] = "Dependency";
        })(Enums.AssociationTypes || (Enums.AssociationTypes = {}));
        var AssociationTypes = Enums.AssociationTypes;
        (function (DimensionTypes) {
            DimensionTypes[DimensionTypes["Square"] = 0] = "Square";
            DimensionTypes[DimensionTypes["Circle"] = 1] = "Circle";
            DimensionTypes[DimensionTypes["Ellipse"] = 2] = "Ellipse";
        })(Enums.DimensionTypes || (Enums.DimensionTypes = {}));
        var DimensionTypes = Enums.DimensionTypes;
        /**
         * Allows the paper to be scaled/sized differently.
         * To specify an initial paper size, for example,
         * Paper is initialized with MaxCanvasWidth,
         * which causes the paper to determine its width based
         * on the current maximum width of its parent canvas. On the
         * contrary, the paper can be told to set its width based
         * on a given, target grid cell size. For example, if the target
         * grid width is 20px and the grid is 50 cols, the resulting
         * paper width will calculate to 1000px.
         */
        (function (PaperSizingModes) {
            PaperSizingModes[PaperSizingModes["TargetGridWidth"] = 0] = "TargetGridWidth";
            PaperSizingModes[PaperSizingModes["MaxCanvasWidth"] = 1] = "MaxCanvasWidth";
            PaperSizingModes[PaperSizingModes["PreviewWidth"] = 2] = "PreviewWidth";
        })(Enums.PaperSizingModes || (Enums.PaperSizingModes = {}));
        var PaperSizingModes = Enums.PaperSizingModes;
        var CursorTypes = (function () {
            function CursorTypes() {
            }
            CursorTypes.pointer = 'pointer';
            CursorTypes.crosshair = 'crosshair';
            return CursorTypes;
        })();
        Enums.CursorTypes = CursorTypes;
        (function (SetTypes) {
            SetTypes[SetTypes["None"] = 0] = "None";
            SetTypes[SetTypes["Personnel"] = 1] = "Personnel";
            SetTypes[SetTypes["Assignment"] = 2] = "Assignment";
            SetTypes[SetTypes["UnitType"] = 3] = "UnitType";
        })(Enums.SetTypes || (Enums.SetTypes = {}));
        var SetTypes = Enums.SetTypes;
        (function (LayerTypes) {
            LayerTypes[LayerTypes["Generic"] = 0] = "Generic";
            LayerTypes[LayerTypes["FieldElement"] = 1] = "FieldElement";
            LayerTypes[LayerTypes["Player"] = 2] = "Player";
            LayerTypes[LayerTypes["PlayerIcon"] = 3] = "PlayerIcon";
            LayerTypes[LayerTypes["PlayerPersonnelLabel"] = 4] = "PlayerPersonnelLabel";
            LayerTypes[LayerTypes["PlayerIndexLabel"] = 5] = "PlayerIndexLabel";
            LayerTypes[LayerTypes["PlayerCoordinates"] = 6] = "PlayerCoordinates";
            LayerTypes[LayerTypes["PlayerRelativeCoordinatesLabel"] = 7] = "PlayerRelativeCoordinatesLabel";
            LayerTypes[LayerTypes["PlayerSelectionBox"] = 8] = "PlayerSelectionBox";
            LayerTypes[LayerTypes["PlayerRoute"] = 9] = "PlayerRoute";
            LayerTypes[LayerTypes["PlayerSecondaryRoutes"] = 10] = "PlayerSecondaryRoutes";
            LayerTypes[LayerTypes["PlayerAlternateRoutes"] = 11] = "PlayerAlternateRoutes";
            LayerTypes[LayerTypes["PlayerRouteAction"] = 12] = "PlayerRouteAction";
            LayerTypes[LayerTypes["PlayerRouteNode"] = 13] = "PlayerRouteNode";
            LayerTypes[LayerTypes["PlayerRoutePath"] = 14] = "PlayerRoutePath";
            LayerTypes[LayerTypes["PlayerRouteControlPath"] = 15] = "PlayerRouteControlPath";
            LayerTypes[LayerTypes["PrimaryPlayer"] = 16] = "PrimaryPlayer";
            LayerTypes[LayerTypes["PrimaryPlayerIcon"] = 17] = "PrimaryPlayerIcon";
            LayerTypes[LayerTypes["PrimaryPlayerLabel"] = 18] = "PrimaryPlayerLabel";
            LayerTypes[LayerTypes["PrimaryPlayerCoordinates"] = 19] = "PrimaryPlayerCoordinates";
            LayerTypes[LayerTypes["PrimaryPlayerRelativeCoordinatesLabel"] = 20] = "PrimaryPlayerRelativeCoordinatesLabel";
            LayerTypes[LayerTypes["PrimaryPlayerSelectionBox"] = 21] = "PrimaryPlayerSelectionBox";
            LayerTypes[LayerTypes["PrimaryPlayerRoute"] = 22] = "PrimaryPlayerRoute";
            LayerTypes[LayerTypes["PrimaryPlayerSecondaryRoutes"] = 23] = "PrimaryPlayerSecondaryRoutes";
            LayerTypes[LayerTypes["PrimaryPlayerAlternateRoutes"] = 24] = "PrimaryPlayerAlternateRoutes";
            LayerTypes[LayerTypes["PrimaryPlayerRouteAction"] = 25] = "PrimaryPlayerRouteAction";
            LayerTypes[LayerTypes["PrimaryPlayerRouteNode"] = 26] = "PrimaryPlayerRouteNode";
            LayerTypes[LayerTypes["PrimaryPlayerRoutePath"] = 27] = "PrimaryPlayerRoutePath";
            LayerTypes[LayerTypes["PrimaryPlayerRouteControlPath"] = 28] = "PrimaryPlayerRouteControlPath";
            LayerTypes[LayerTypes["OpponentPlayer"] = 29] = "OpponentPlayer";
            LayerTypes[LayerTypes["OpponentPlayerIcon"] = 30] = "OpponentPlayerIcon";
            LayerTypes[LayerTypes["OpponentPlayerLabel"] = 31] = "OpponentPlayerLabel";
            LayerTypes[LayerTypes["OpponentPlayerCoordinates"] = 32] = "OpponentPlayerCoordinates";
            LayerTypes[LayerTypes["OpponentPlayerRelativeCoordinatesLabel"] = 33] = "OpponentPlayerRelativeCoordinatesLabel";
            LayerTypes[LayerTypes["OpponentPlayerSelectionBox"] = 34] = "OpponentPlayerSelectionBox";
            LayerTypes[LayerTypes["OpponentPlayerRoute"] = 35] = "OpponentPlayerRoute";
            LayerTypes[LayerTypes["OpponentPlayerSecondaryRoutes"] = 36] = "OpponentPlayerSecondaryRoutes";
            LayerTypes[LayerTypes["OpponentPlayerAlternateRoutes"] = 37] = "OpponentPlayerAlternateRoutes";
            LayerTypes[LayerTypes["OpponentPlayerRouteAction"] = 38] = "OpponentPlayerRouteAction";
            LayerTypes[LayerTypes["OpponentPlayerRouteNode"] = 39] = "OpponentPlayerRouteNode";
            LayerTypes[LayerTypes["OpponentPlayerRoutePath"] = 40] = "OpponentPlayerRoutePath";
            LayerTypes[LayerTypes["OpponentPlayerRouteControlPath"] = 41] = "OpponentPlayerRouteControlPath";
            LayerTypes[LayerTypes["Ball"] = 42] = "Ball";
            LayerTypes[LayerTypes["Field"] = 43] = "Field";
            LayerTypes[LayerTypes["Sideline"] = 44] = "Sideline";
            LayerTypes[LayerTypes["Hashmark"] = 45] = "Hashmark";
            LayerTypes[LayerTypes["SidelineHashmark"] = 46] = "SidelineHashmark";
            LayerTypes[LayerTypes["Endzone"] = 47] = "Endzone";
            LayerTypes[LayerTypes["LineOfScrimmage"] = 48] = "LineOfScrimmage";
        })(Enums.LayerTypes || (Enums.LayerTypes = {}));
        var LayerTypes = Enums.LayerTypes;
        (function (RouteTypes) {
            RouteTypes[RouteTypes["None"] = 0] = "None";
            RouteTypes[RouteTypes["Generic"] = 1] = "Generic";
            RouteTypes[RouteTypes["Block"] = 2] = "Block";
            RouteTypes[RouteTypes["Scan"] = 3] = "Scan";
            RouteTypes[RouteTypes["Run"] = 4] = "Run";
            RouteTypes[RouteTypes["Route"] = 5] = "Route";
            RouteTypes[RouteTypes["Cover"] = 6] = "Cover";
            RouteTypes[RouteTypes["Zone"] = 7] = "Zone";
            RouteTypes[RouteTypes["Spy"] = 8] = "Spy";
            RouteTypes[RouteTypes["Option"] = 9] = "Option";
            RouteTypes[RouteTypes["HandOff"] = 10] = "HandOff";
            RouteTypes[RouteTypes["Pitch"] = 11] = "Pitch";
            RouteTypes[RouteTypes["Preview"] = 12] = "Preview";
        })(Enums.RouteTypes || (Enums.RouteTypes = {}));
        var RouteTypes = Enums.RouteTypes;
        (function (RouteNodeTypes) {
            RouteNodeTypes[RouteNodeTypes["None"] = 0] = "None";
            RouteNodeTypes[RouteNodeTypes["Normal"] = 1] = "Normal";
            RouteNodeTypes[RouteNodeTypes["Root"] = 2] = "Root";
            RouteNodeTypes[RouteNodeTypes["CurveStart"] = 3] = "CurveStart";
            RouteNodeTypes[RouteNodeTypes["CurveControl"] = 4] = "CurveControl";
            RouteNodeTypes[RouteNodeTypes["CurveEnd"] = 5] = "CurveEnd";
            RouteNodeTypes[RouteNodeTypes["End"] = 6] = "End";
        })(Enums.RouteNodeTypes || (Enums.RouteNodeTypes = {}));
        var RouteNodeTypes = Enums.RouteNodeTypes;
        (function (RouteNodeActions) {
            RouteNodeActions[RouteNodeActions["None"] = 0] = "None";
            RouteNodeActions[RouteNodeActions["Block"] = 1] = "Block";
            RouteNodeActions[RouteNodeActions["Delay"] = 2] = "Delay";
            RouteNodeActions[RouteNodeActions["Continue"] = 3] = "Continue";
            RouteNodeActions[RouteNodeActions["Juke"] = 4] = "Juke";
            RouteNodeActions[RouteNodeActions["ZigZag"] = 5] = "ZigZag";
        })(Enums.RouteNodeActions || (Enums.RouteNodeActions = {}));
        var RouteNodeActions = Enums.RouteNodeActions;
    })(Enums = Common.Enums || (Common.Enums = {}));
})(Common || (Common = {}));
/// <reference path='../common.ts' />
var Common;
(function (Common) {
    var Constants;
    (function (Constants) {
        Constants.DEFAULT_GRID_COLS = 100;
        Constants.DEFAULT_GRID_ROWS = 100;
        Constants.COMMON_URL = 'common/';
        Constants.MODULES_URL = 'modules/';
        Constants.PLAYBOOK_URL = 'playbook/';
        Constants.CONTEXTMENUS_URL = 'contextmenus/';
        /**
         *
         * Contextmenu template URLs
         *
         */
        Constants.DEFAULT_CONTEXTMENU_TEMPLATE_URL = [
            Common.Constants.COMMON_URL,
            Common.Constants.CONTEXTMENUS_URL,
            'default-contextmenu.tpl.html'
        ].join('');
        Constants.EDITOR_ROUTENODE_CONTEXTMENU_TEMPLATE_URL = [
            Common.Constants.MODULES_URL,
            Common.Constants.PLAYBOOK_URL,
            Common.Constants.CONTEXTMENUS_URL,
            'routeNode/contextmenu-routeNode.tpl.html'
        ].join('');
        Constants.PLAY_CONTEXTMENU_TEMPLATE_URL = [
            Common.Constants.MODULES_URL,
            Common.Constants.PLAYBOOK_URL,
            Common.Constants.CONTEXTMENUS_URL,
            'play/contextmenu-play.tpl.html'
        ].join('');
    })(Constants = Common.Constants || (Common.Constants = {}));
})(Common || (Common = {}));
/// <reference path='./factories.ts' />
var Common;
(function (Common) {
    var Factories;
    (function (Factories) {
        var PlayerIconFactory = (function () {
            function PlayerIconFactory() {
            }
            PlayerIconFactory.getPlayerIcon = function (player) {
            };
            return PlayerIconFactory;
        })();
        Factories.PlayerIconFactory = PlayerIconFactory;
    })(Factories = Common.Factories || (Common.Factories = {}));
})(Common || (Common = {}));
/// <reference path='./factories.ts' />
var Common;
(function (Common) {
    var Factories;
    (function (Factories) {
        var RouteActionFactory = (function () {
            function RouteActionFactory() {
            }
            RouteActionFactory.draw = function (routeAction) {
                if (Common.Utilities.isNullOrUndefined(routeAction))
                    throw new Error('RouteActionFactory draw(): route action is null or undefined');
                switch (routeAction.action) {
                    case Common.Enums.RouteNodeActions.None:
                        Common.Factories.RouteActionFactory.none(routeAction.getGraphics());
                        break;
                    case Common.Enums.RouteNodeActions.Block:
                        Common.Factories.RouteActionFactory.block(routeAction.routeNode.getGraphics(), routeAction.getGraphics());
                        break;
                    case Common.Enums.RouteNodeActions.Delay:
                        Common.Factories.RouteActionFactory.delay(routeAction.routeNode.getGraphics(), routeAction.getGraphics());
                        break;
                }
            };
            RouteActionFactory.none = function (routeActionGraphics) {
                if (Common.Utilities.isNullOrUndefined(routeActionGraphics))
                    throw new Error('RouteActionFactory none(): route action graphics is null');
                return routeActionGraphics.remove();
            };
            RouteActionFactory.block = function (routeNodeGraphics, routeActionGraphics) {
                if (Common.Utilities.isNullOrUndefined(routeActionGraphics))
                    throw new Error('RouteActionFactory block(): route action graphics is null');
                if (Common.Utilities.isNullOrUndefined(routeNodeGraphics))
                    throw new Error('RouteActionFactory block(): route node graphics is null');
                var theta = Common.Drawing.Utilities.theta(routeNodeGraphics.location.ax, routeNodeGraphics.location.ay, routeActionGraphics.location.ax, routeActionGraphics.location.ay);
                var thetaDegrees = Common.Drawing.Utilities.toDegrees(theta);
                routeActionGraphics.placement.coordinates.x = routeNodeGraphics.placement.coordinates.x;
                routeActionGraphics.placement.coordinates.y = routeNodeGraphics.placement.coordinates.y;
                routeActionGraphics.dimensions.offset.x = 0.5;
                routeActionGraphics.location.ax = routeNodeGraphics.location.ax - routeActionGraphics.dimensions.getWidth();
                routeActionGraphics.location.ay = routeNodeGraphics.location.ay;
                routeActionGraphics.setFill('blue');
                routeActionGraphics.setStrokeWidth(2);
                routeActionGraphics.dimensions.width = routeNodeGraphics.dimensions.getWidth() * 2;
                routeActionGraphics.dimensions.height = routeNodeGraphics.dimensions.getHeight() * 2;
                var pathStr = Common.Drawing.Utilities.getPathString(true, [
                    routeActionGraphics.location.ax,
                    routeActionGraphics.location.ay,
                    routeActionGraphics.location.ax + (routeActionGraphics.dimensions.getWidth() * 2),
                    routeActionGraphics.location.ay
                ]);
                routeActionGraphics.path(pathStr);
                routeActionGraphics.setAttribute('class', 'painted-fill');
                routeActionGraphics.rotate(90 - thetaDegrees);
            };
            RouteActionFactory.delay = function (routeNodeGraphics, routeActionGraphics) {
                if (Common.Utilities.isNullOrUndefined(routeActionGraphics))
                    throw new Error('RouteActionFactory block(): route action graphics is null');
                if (Common.Utilities.isNullOrUndefined(routeNodeGraphics))
                    throw new Error('RouteActionFactory block(): route node graphics is null');
                routeActionGraphics.dimensions.offset.x = 0.5;
                routeActionGraphics.dimensions.offset.y = 0.5;
                routeActionGraphics.dimensions.width = routeNodeGraphics.dimensions.getWidth() * 2;
                routeActionGraphics.dimensions.height = routeNodeGraphics.dimensions.getHeight() * 2;
                routeActionGraphics.setFill('orange');
                routeActionGraphics.setStrokeWidth(1);
                routeActionGraphics.rect();
                routeActionGraphics.setAttribute('class', 'painted-fill');
            };
            return RouteActionFactory;
        })();
        Factories.RouteActionFactory = RouteActionFactory;
    })(Factories = Common.Factories || (Common.Factories = {}));
})(Common || (Common = {}));
/// <reference path='../common.ts' />
/// <reference path='./PlayerIconFactory.ts' />
/// <reference path='./RouteActionFactory.ts' />
/// <reference path='../js/impakt.ts' />
/// <reference path='../modules/modules.ts' />
/// <reference path='./models/models.ts' />
/// <reference path='./enums/enums.ts' />
/// <reference path='./interfaces/interfaces.ts' />
/// <reference path='./constants/constants.ts' />
/// <reference path='./factories/factories.ts' />
var Common;
(function (Common) {
    var API;
    (function (API) {
        (function (Actions) {
            Actions[Actions["Nothing"] = 0] = "Nothing";
            Actions[Actions["Create"] = 1] = "Create";
            Actions[Actions["Overwrite"] = 2] = "Overwrite";
            Actions[Actions["Copy"] = 3] = "Copy";
        })(API.Actions || (API.Actions = {}));
        var Actions = API.Actions;
    })(API = Common.API || (Common.API = {}));
    var Base;
    (function (Base) {
        /**
         * The Common.Base.Component class allows you to dynamically
         * track when angular controllers, services, factories, etc. are
         * being loaded as dependencies of one another.
         *
         * TODO: Investigate this further; I implemented this early on
         * during development and may not have had a firm grasp on
         * the loading order of various angular components. I didn't
         * really take clear note of why I implemented this in the first place;
         * I believe it was necessary. I just need to validate my initial
         * assumptions.
         *
         */
        var Component = (function () {
            function Component(name, type, waitingOn) {
                this.name = name;
                this.type = type;
                this.guid = Common.Utilities.guid();
                this.waitingOn = waitingOn || [];
                this.loaded = this.waitingOn && this.waitingOn.length == 0;
                this.dependencies = new ComponentMap();
                this.onReadyCallback = function () {
                    //console.log('Component ready', this);
                };
            }
            Component.prototype.ready = function () {
                //console.log('component ready', this);
                this.loaded = true;
                this.onReadyCallback(this);
            };
            Component.prototype.onready = function (callback) {
                this.onReadyCallback = callback;
                // even when attaching the ready event listener,
                // if the component has no dependencies, and hence loaded,
                // fire off the ready callback
                if (this.loaded)
                    this.ready();
            };
            Component.prototype.loadDependency = function (dependency) {
                //console.log('loading dependency', dependency, this);
                this.dependencies.add(dependency);
                var index = this.waitingOn.indexOf(dependency.name);
                this.waitingOn.splice(index, 1);
                if (dependency.loaded)
                    dependency.ready();
                if (this.waitingOn.length == 0) {
                    this.ready();
                }
            };
            Component.prototype.registerDependencies = function () {
                for (var i = 0; i < this.waitingOn.length; i++) {
                    this.dependencies.add(new Component(this.waitingOn[i], Common.Base.ComponentType.Null));
                }
            };
            return Component;
        })();
        Base.Component = Component;
        (function (ComponentType) {
            ComponentType[ComponentType["Null"] = 0] = "Null";
            ComponentType[ComponentType["Service"] = 1] = "Service";
            ComponentType[ComponentType["Controller"] = 2] = "Controller";
            ComponentType[ComponentType["Directive"] = 3] = "Directive";
        })(Base.ComponentType || (Base.ComponentType = {}));
        var ComponentType = Base.ComponentType;
        var ComponentMap = (function () {
            function ComponentMap() {
                this.obj = {};
                this.count = 0;
            }
            /**
             * Adds a new component to the list or updates
             * the component if it already exists.
             * @param {Component} component The component to be added
             */
            ComponentMap.prototype.add = function (component) {
                if (this.obj[component.guid]) {
                    this.set(component);
                    return;
                }
                this.obj[component.guid] = component;
                this.count++;
            };
            ComponentMap.prototype.remove = function (guid) {
                var component = this.obj[guid];
                delete this.obj[guid];
                this.count--;
                return component;
            };
            ComponentMap.prototype.get = function (guid) {
                return this.obj[guid];
            };
            ComponentMap.prototype.set = function (component) {
                this.obj[component.guid] = component;
            };
            return ComponentMap;
        })();
        Base.ComponentMap = ComponentMap;
    })(Base = Common.Base || (Common.Base = {}));
    var Utilities = (function () {
        function Utilities() {
        }
        Utilities.notImplementedException = function () {
            throw new Error('Exception: Method not implemented');
        };
        Utilities.exportToPng = function (canvas, svgElement) {
            if (!svgElement)
                throw new Error('play-preview: Corresponding SVG element not found');
            // Serialize the SVG XML into a string
            var svgString = Common.Utilities.serializeXMLToString(svgElement);
            // canvg javascript library takes the canvas HTML element and the SVG
            // in string form
            canvg(canvas.exportCanvas, svgString);
            // the exportCanvas is a <canvas/> element, which possesses a method
            // to export its data as a PNG data URL
            var pngDataURI = canvas.exportCanvas.toDataURL("image/png");
            return pngDataURI;
        };
        /**
         * Compresses the given SVG element into a compressed string
         * @param  {HTMLElement} svg SVG element to handle
         * @return {string}          the compressed SVG string
         */
        Utilities.compressSVG = function (svg) {
            var serialized = Common.Utilities.serializeXMLToString(svg);
            var encoded = Common.Utilities.toBase64(serialized);
            // TODO: NEED TO FIX COMPRESSION ISSUE. USING THIS METHOD CAUSES 
            // THE COMPRESSED CHARACTERS (NON UTF-8) TO BE CONVERTED TO '?'
            // WHICH BREAKS PARSING
            //return Common.Utilities.compress(encoded);
            return encoded;
        };
        /**
         * Compresses the given string
         * @param  {string} svg String to compress
         * @return {any}        a compressed svg string
         */
        Utilities.compress = function (str) {
            return LZString.compress(str);
        };
        /**
         * Takes a compressed SVG data and decompresses it
         * @param  {string} compressed The compressed SVG data to decompress
         * @return {string}            The decompressed string of SVG
         */
        Utilities.decompressSVG = function (compressed) {
            // TO-DO: COMPRESSION BROKEN; SEE COMPRESSSVG ABOVE FOR NOTES
            //let decompressed = Common.Utilities.decompress(compressed);
            //return Common.Utilities.fromBase64(decompressed); 
            return Common.Utilities.fromBase64(compressed);
        };
        /**
         * Decompresses the given string
         * @param  {string} compressed The (compressed) string to decompress
         * @return {string}            the decompressed string
         */
        Utilities.decompress = function (compressed) {
            return LZString.decompress(compressed);
        };
        /**
         * Encodes the given string of SVG into base64
         * @param  {string} svgString svg string
         * @return {string}           base64 encoded svg string
         */
        Utilities.toBase64 = function (str) {
            return window.btoa(str);
        };
        /**
         * Decodes the given base64 encoded svg string
         * @param  {string} base64Svg base64 encoded svg string
         * @return {string}           decoded svg string
         */
        Utilities.fromBase64 = function (str) {
            return window.atob(str);
        };
        /**
         * Converts the given SVG HTML element into a string
         * @param  {HTMLElement} svg Element to convert to string
         * @return {string}          returns the stringified SVG element
         */
        Utilities.serializeXMLToString = function (xml) {
            return (new XMLSerializer()).serializeToString(xml);
        };
        Utilities.parseData = function (data) {
            for (var i = 0; i < data.length; i++) {
                try {
                    data[i].data = JSON.parse(data[i].data);
                }
                catch (error) {
                    console.log(error);
                }
            }
            return data;
        };
        Utilities.guid = function () {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        };
        /**
         * Returns a random number between min (inclusive) and max (inclusive)
         * @param  {number} min [description]
         * @param  {number} max [description]
         * @return {number}     [description]
         */
        Utilities.randomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        Utilities.randomId = function () {
            return (Math.floor(Math.random() * (9999999999 - 1000000000)) + 999999999);
        };
        Utilities.camelCaseToSpace = function (string, capitalizeFirst) {
            var result = string.replace(/([A-Z])/g, " $1");
            // capitalize the first letter - as an example.
            if (capitalizeFirst)
                result = Common.Utilities.sentenceCase(result);
            return result;
        };
        Utilities.sentenceCase = function (str) {
            return (str.charAt(0).toUpperCase() + str.slice(1)).trim();
        };
        Utilities.convertEnumToList = function (obj) {
            var list = {};
            for (var key in obj) {
                if (!isNaN(key)) {
                    list[parseInt(key)] = Common.Utilities.camelCaseToSpace(obj[key], true);
                }
            }
            return list;
        };
        Utilities.getEnumerationsOnly = function (obj) {
            var enums = {};
            for (var key in obj) {
                if (!!isNaN(key)) {
                    enums[key] = obj[key];
                }
            }
            return enums;
        };
        Utilities.getEnumerationsAsArray = function (obj) {
            var enums = [];
            for (var key in obj) {
                if (!isNaN(key)) {
                    enums.push(parseInt(key));
                }
            }
            return enums;
        };
        Utilities.isArray = function (obj) {
            return Object.prototype.toString.call(obj) == '[object Array]';
        };
        Utilities.isObject = function (obj) {
            return typeof obj === 'object';
        };
        Utilities.isFunction = function (obj) {
            typeof obj === 'function';
        };
        Utilities.toJson = function (obj) {
            var results = null;
            if (Common.Utilities.isObject(obj)) {
                results = Common.Utilities.toJsonRecursive(obj, {});
            }
            else if (Common.Utilities.isArray(obj)) {
                results = Common.Utilities.toJsonArrayRecursive(obj);
            }
            else {
                results = obj;
            }
            return results;
        };
        Utilities.toJsonArrayRecursive = function (arr) {
            var jsonArr = [];
            for (var i = 0; i < arr.length; i++) {
                var raw = arr[i];
                var results = null;
                if (Common.Utilities.isArray(raw)) {
                    results = Common.Utilities.toJsonArrayRecursive(raw);
                }
                else if (Common.Utilities.isObject(raw)) {
                    results = Common.Utilities.toJson(raw);
                }
                else {
                    results = raw;
                }
                jsonArr.push(results);
            }
            return jsonArr;
        };
        Utilities.toJsonRecursive = function (obj, results) {
            var keys = Object.keys(obj);
            if (!keys)
                return null;
            if (obj.toJson) {
                results = obj.toJson();
            }
            else {
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    if (!Common.Utilities.isFunction(obj[key])) {
                        if (Common.Utilities.isObject(obj[key])) {
                            if (obj[key].toJson) {
                                // recurse
                                results[key] = Common.Utilities.toJsonRecursive(obj[key].toJson(), {});
                            }
                        }
                        else if (Common.Utilities.isArray(obj[key])) {
                            results[key] = Common.Utilities.toJsonArrayRecursive(obj[key]);
                        }
                        else {
                            results[key] = obj[key];
                        }
                    }
                }
            }
            return results;
        };
        /**
         * Generates and returns a hashed string from the given JSON object
         * @param {any} json The object to be hashed
         */
        Utilities.generateChecksum = function (json) {
            return objectHash(json, {});
        };
        Utilities.prepareObjectForEncoding = function (obj) {
            var output = null;
            if (Array.isArray(obj)) {
                var arr = obj;
                for (var i_1 = 0; i_1 < arr.length; i_1++) {
                    var arrItem = arr[i_1];
                    output = Common.Utilities.prepareObjectForEncoding(arrItem);
                }
            }
            else {
                var keys = Object.keys(obj).sort();
                output = [];
                var prop;
                for (var i = 0; i < keys.length; i++) {
                    prop = keys[i];
                    output.push(prop);
                    output.push(obj[prop]);
                }
            }
            return output;
        };
        Utilities.isNullOrUndefined = function (obj) {
            return Common.Utilities.isNull(obj) || Common.Utilities.isUndefined(obj);
        };
        Utilities.isNull = function (obj) {
            return obj === null;
        };
        Utilities.isUndefined = function (obj) {
            return obj === undefined || obj === 'undefined';
        };
        Utilities.isEmptyString = function (str) {
            return Common.Utilities.isNullOrUndefined(str) || str === '';
        };
        /**
         * Iterates over the given array and removes any
         * duplicate entries
         *
         * @param  {any[]} array [description]
         * @return {any[]}       [description]
         */
        Utilities.uniqueArray = function (array) {
            if (Common.Utilities.isNullOrUndefined(array))
                throw new Error('Utilities uniqueArray(): array is null or undefined');
            var unique = [];
            for (var i = 0; i < array.length; i++) {
                var element = array[i];
                if (unique.indexOf(element) < 0)
                    unique.push(element);
            }
            return unique;
        };
        return Utilities;
    })();
    Common.Utilities = Utilities;
})(Common || (Common = {}));
var Common;
(function (Common) {
    var UI;
    (function (UI) {
        UI.SCROLL_BAR_SIZE = 12;
    })(UI = Common.UI || (Common.UI = {}));
})(Common || (Common = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var Tool = (function () {
            function Tool(title, action, glyphiconIcon, tooltip, cursor, mode, selected) {
                this.title = 'Generic tool';
                this.guid = Common.Utilities.guid();
                this.tooltip = 'Generic tool';
                this.glyphicon = new Common.Icons.Glyphicon();
                this.action = Playbook.Enums.ToolActions.Nothing;
                this.title = title || this.title;
                this.action = action || this.action;
                this.tooltip = tooltip || this.tooltip;
                this.glyphicon.icon = glyphiconIcon || this.glyphicon.icon;
                this.cursor = cursor || Common.Enums.CursorTypes.pointer;
                this.mode = mode || Playbook.Enums.ToolModes.Select;
                this.selected = selected || false;
            }
            return Tool;
        })();
        Models.Tool = Tool;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var EditorEndzone = (function (_super) {
            __extends(EditorEndzone, _super);
            function EditorEndzone(context, offsetY) {
                _super.call(this, context, offsetY);
            }
            return EditorEndzone;
        })(Common.Models.Endzone);
        Models.EditorEndzone = EditorEndzone;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PreviewEndzone = (function (_super) {
            __extends(PreviewEndzone, _super);
            function PreviewEndzone(context, offsetY) {
                _super.call(this, context, offsetY);
            }
            return PreviewEndzone;
        })(Common.Models.Endzone);
        Models.PreviewEndzone = PreviewEndzone;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var EditorBall = (function (_super) {
            __extends(EditorBall, _super);
            function EditorBall(field) {
                _super.call(this, field);
            }
            EditorBall.prototype.draw = function () {
                _super.prototype.draw.call(this);
                // Attach event handlers
                this.layer.graphics.onclick(this.click, this);
                this.layer.graphics.ondrag(this.dragMove, this.dragStart, this.dragEnd, this);
            };
            EditorBall.prototype.dragMove = function (dx, dy, posx, posy, e) {
                // NOTE: moveByDelta methods are called separately in the x and y
                // directions to ensure that even if the ball is moved to the
                // peripherals of its containment in either x or y direction,
                // it is still able to move in the other direction, provided
                // that it is still within its containment area
                this.layer.graphics.moveByDeltaX(dx);
                this.layer.graphics.moveByDeltaY(dy);
                // update line of scrimmage - do not track difference in x movement,
                // only track y movement up and down the field
                this.field.ball.layer.graphics.moveByDeltaY(dy);
            };
            EditorBall.prototype.dragStart = function (x, y, e) {
                // drag not implemented in preview
            };
            EditorBall.prototype.dragEnd = function (e) {
                this.layer.graphics.drop();
                this.field.ball.layer.graphics.drop();
            };
            return EditorBall;
        })(Common.Models.Ball);
        Models.EditorBall = EditorBall;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PreviewBall = (function (_super) {
            __extends(PreviewBall, _super);
            function PreviewBall(field) {
                _super.call(this, field);
            }
            PreviewBall.prototype.dragMove = function (dx, dy, posx, posy, e) {
                // Not implemented - preview ball does not have drag functionality
            };
            PreviewBall.prototype.dragStart = function (x, y, e) {
                // Not implemented - preview ball does not have drag functionality
            };
            PreviewBall.prototype.dragEnd = function (e) {
                // Not implemented - preview ball does not have drag functionality
            };
            return PreviewBall;
        })(Common.Models.Ball);
        Models.PreviewBall = PreviewBall;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var EditorField = (function (_super) {
            __extends(EditorField, _super);
            function EditorField(paper, playPrimary, playOpponent) {
                _super.call(this, paper, playPrimary, playOpponent);
                this.type = this.playPrimary.unitType;
                this.editorType = this.playPrimary.editorType;
                this.zoom = 1;
                var self = this;
                window.setInterval(function () {
                    self.debug(self);
                }, 1000);
                this.onModified(function () {
                    //console.log('field modified');
                });
            }
            EditorField.prototype.debug = function (context) {
                var breakpoint = 1;
            };
            EditorField.prototype.initialize = function () {
                this.ball = new Playbook.Models.EditorBall(this);
                this.ground = new Playbook.Models.EditorGround(this);
                this.los = new Playbook.Models.EditorLineOfScrimmage(this);
                this.endzone_top = new Playbook.Models.EditorEndzone(this, 0);
                this.endzone_bottom = new Playbook.Models.EditorEndzone(this, 110);
                this.sideline_left = new Playbook.Models.EditorSideline(this, 0);
                this.sideline_right = new Playbook.Models.EditorSideline(this, 51);
                this.hashmark_left = new Playbook.Models.EditorHashmark(this, 22);
                this.hashmark_right = new Playbook.Models.EditorHashmark(this, 28);
                this.hashmark_sideline_left = new Playbook.Models.EditorHashmark(this, 2);
                this.hashmark_sideline_right = new Playbook.Models.EditorHashmark(this, 50);
                // Set containment around the ball to restrict its drag area
                this.ball.layer.graphics.setContainment(this.hashmark_left.layer.graphics.placement.coordinates.x, this.hashmark_right.layer.graphics.placement.coordinates.x, this.endzone_top.layer.graphics.dimensions.getHeight(), this.endzone_top.layer.graphics.placement.coordinates.y);
                this.layers.add(this.ball.layer);
                this.layers.add(this.ground.layer);
                this.layers.add(this.los.layer);
                this.layers.add(this.endzone_top.layer);
                this.layers.add(this.endzone_bottom.layer);
                this.layers.add(this.sideline_left.layer);
                this.layers.add(this.sideline_right.layer);
                this.layers.add(this.hashmark_left.layer);
                this.layers.add(this.hashmark_right.layer);
                this.layers.add(this.hashmark_sideline_left.layer);
                this.layers.add(this.hashmark_sideline_right.layer);
                if (!this.playPrimary.formation) {
                    this.playPrimary.formation = new Common.Models.Formation(this.playPrimary.unitType);
                    this.playPrimary.formation.setDefault(this.ball);
                }
                this.draw();
            };
            EditorField.prototype.draw = function () {
                this.ground.draw();
                this.grid.draw();
                this.endzone_top.draw();
                this.endzone_bottom.draw();
                this.sideline_left.draw();
                this.sideline_right.draw();
                this.hashmark_left.draw();
                this.hashmark_right.draw();
                this.hashmark_sideline_left.draw();
                this.hashmark_sideline_right.draw();
                this.los.draw();
                this.ball.draw();
                this.drawPlay();
            };
            EditorField.prototype.useAssignmentTool = function (coords) {
                if (!this.selected.hasElements()) {
                    console.error('Select a player first');
                    return;
                }
                var selectedPlayers = this.getSelectedByLayerType(Common.Enums.LayerTypes.Player);
                var self = this;
                if (selectedPlayers.hasElements()) {
                    selectedPlayers.forEach(function (player, index) {
                        if (player.assignment.routes &&
                            player.assignment.routes.size() == 0) {
                            var route = new Playbook.Models.EditorRoute(player);
                            player.assignment.routes.add(route);
                        }
                        // TODO: this will only get the first route, implement
                        // route switching
                        var playerRoute = player.assignment.routes.getOne();
                        if (playerRoute.dragInitialized)
                            return;
                        var newNode = new Playbook.Models.EditorRouteNode(playerRoute, player.layer.graphics.placement.coordinates.getRelativeTo(coords, player), Common.Enums.RouteNodeTypes.Normal);
                        // route exists, append the node
                        playerRoute.addNode(newNode);
                        console.log('set player route', player.relativeCoordinatesLabel, playerRoute);
                        self.playPrimary.assignmentGroup.assignments.addAtIndex(player.assignment, player.position.index);
                    });
                }
            };
            EditorField.prototype.export = function () {
                return null;
            };
            EditorField.prototype.placeAtYardline = function (element, yardline) {
            };
            EditorField.prototype.remove = function () { };
            EditorField.prototype.getBBoxCoordinates = function () { };
            EditorField.prototype.addPlayer = function (placement, position, assignment) {
                var player = new Playbook.Models.EditorPlayer(this, placement, position, assignment);
                player.draw();
                var self = this;
                player.onModified(function () {
                    self.setModified(true);
                    if (self.playPrimary) {
                        self.playPrimary.setModified(true);
                    }
                    if (self.playOpponent) {
                        self.playOpponent.setModified(true);
                    }
                });
                this.players.add(player);
                return player;
            };
            return EditorField;
        })(Common.Models.Field);
        Models.EditorField = EditorField;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var EditorCanvas = (function (_super) {
            __extends(EditorCanvas, _super);
            function EditorCanvas(playPrimary, playOpponent, width, height) {
                _super.call(this);
                /**
                 * TODO @theBull - find a better way to pass data into the canvas...
                 * it shouldn't be dependent on play data at this level..........? maybe?
                 */
                this.playPrimary = playPrimary;
                this.playOpponent = playOpponent;
                /**
                 * Note that paper is created during the initialize() method;
                 * canvas is dependent on angular directive / dynamic HTML include
                 * of the canvas, before the $container/container properties are
                 * available; these containers are required by the paper, which
                 * implements a Raphael object, that requires a container HTML element.
                 */
                //this.unitType = this.playPrimary.unitType;
                //this.editorType = this.playPrimary.editorType;
                this.toolMode = Playbook.Enums.ToolModes.Select;
                // need to set tab explicitly if it's within an editor
                this.tab = null;
                this.listener = new Common.Models.CanvasListener(this);
                this.readyCallbacks = [function () {
                        console.log('CANVAS READY: default canvas ready callback');
                    }];
            }
            EditorCanvas.prototype.initialize = function ($container) {
                var self = this;
                this.container = $container[0]; // jquery lite converted to raw html
                this.$container = $container; // jquery lite object
                this.setDimensions();
                this.paper = new Playbook.Models.EditorPaper(this);
                this.paper.draw();
                // TODO @theBull - stop / pause this timer if the canvas is not
                // visible...
                // this.widthChangeInterval = setInterval(function() {
                // 	if(self.width != self.$container.width()) {
                // 		// width has changed; update the canvas dimensions and
                // 		// resize.
                // 		self.width = self.$container.width();
                // 		self.height = self.$container.height();
                // 		self.resize();
                // 	}
                // }, 1);
                this._ready();
            };
            EditorCanvas.prototype.setDimensions = function () {
                this.dimensions.width = this.$container.width();
                this.dimensions.height = this.$container.height();
            };
            EditorCanvas.prototype.updatePlay = function (playPrimary, playOpponent, redraw) {
                this.playPrimary = playPrimary || this.playPrimary;
                this.playOpponent = playOpponent || this.playOpponent;
                this.unitType = this.playPrimary.unitType;
                this.editorType = this.playPrimary.editorType;
                this.paper.updatePlay(this.playPrimary, this.playOpponent);
                this.setModified(true);
            };
            EditorCanvas.prototype.resetHeight = function () {
                //this.height = this.$container.height(this.$container.height());
            };
            EditorCanvas.prototype.zoomIn = function () {
                throw new Error('canvas zoomIn() not implemented');
            };
            EditorCanvas.prototype.zoomOut = function () {
                throw new Error('canvas zoomOut() not implemented');
            };
            EditorCanvas.prototype.getToolMode = function () {
                return this.toolMode;
            };
            EditorCanvas.prototype.getToolModeName = function () {
                return Playbook.Enums.ToolModes[this.toolMode];
            };
            return EditorCanvas;
        })(Common.Models.Canvas);
        Models.EditorCanvas = EditorCanvas;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var EditorPaper = (function (_super) {
            __extends(EditorPaper, _super);
            function EditorPaper(canvas) {
                _super.call(this, canvas);
                this.initialize();
            }
            EditorPaper.prototype.initialize = function () {
                // Grid will help the paper determine its sizing
                // and will be the basis for drawing objects' lengths and
                // dimensions.
                this.grid = this.grid || new Common.Models.Grid(this, Playbook.Constants.FIELD_COLS_FULL, Playbook.Constants.FIELD_ROWS_FULL);
                this.drawing = new Common.Drawing.Utilities(this.canvas, this.grid);
                // Paper methods within field are dependent on 
                // this.Raphael
                this.field = this.field ||
                    new Playbook.Models.EditorField(this, this.canvas.playPrimary, this.canvas.playOpponent);
            };
            EditorPaper.prototype.updatePlay = function (playPrimary, playOpponent) {
                this.field.updatePlay(playPrimary, playOpponent);
            };
            return EditorPaper;
        })(Common.Models.Paper);
        Models.EditorPaper = EditorPaper;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PreviewField = (function (_super) {
            __extends(PreviewField, _super);
            function PreviewField(paper, playPrimary, playOpponent) {
                _super.call(this, paper, playPrimary, playOpponent);
            }
            PreviewField.prototype.initialize = function () {
                this.ball = new Playbook.Models.PreviewBall(this);
                this.ground = new Playbook.Models.PreviewGround(this);
                this.los = new Playbook.Models.PreviewLineOfScrimmage(this);
                this.endzone_top = new Playbook.Models.PreviewEndzone(this, 0);
                this.endzone_bottom = new Playbook.Models.PreviewEndzone(this, 110);
                this.sideline_left = new Playbook.Models.PreviewSideline(this, 0);
                this.sideline_right = new Playbook.Models.PreviewSideline(this, 51);
                this.hashmark_left = new Playbook.Models.PreviewHashmark(this, 22);
                this.hashmark_right = new Playbook.Models.PreviewHashmark(this, 28);
                this.hashmark_sideline_left = new Playbook.Models.PreviewHashmark(this, 2);
                this.hashmark_sideline_right = new Playbook.Models.PreviewHashmark(this, 50);
                this.layers.add(this.ball.layer);
                this.layers.add(this.ground.layer);
                this.layers.add(this.los.layer);
                this.layers.add(this.endzone_top.layer);
                this.layers.add(this.endzone_bottom.layer);
                this.layers.add(this.sideline_left.layer);
                this.layers.add(this.sideline_right.layer);
                this.layers.add(this.hashmark_left.layer);
                this.layers.add(this.hashmark_right.layer);
                this.layers.add(this.hashmark_sideline_left.layer);
                this.layers.add(this.hashmark_sideline_right.layer);
                if (!this.playPrimary.formation) {
                    this.playPrimary.formation = new Common.Models.Formation(this.playPrimary.unitType);
                    this.playPrimary.formation.setDefault(this.ball);
                }
                this.draw();
            };
            PreviewField.prototype.draw = function () {
                this.ground.draw();
                this.hashmark_left.draw();
                this.hashmark_right.draw();
                this.sideline_left.draw();
                this.sideline_right.draw();
                this.endzone_top.draw();
                this.endzone_bottom.draw();
                this.los.draw();
                this.ball.draw();
                this.drawPlay();
            };
            PreviewField.prototype.addPlayer = function (placement, position, assignment) {
                // TODO @theBull - look into this
                // adjust for no sidelines...
                //placement.x -= 1;
                var player = new Playbook.Models.PreviewPlayer(this, placement, position, assignment);
                // TODO @theBull - add players to new layers
                player.draw();
                this.players.add(player);
                return player;
            };
            PreviewField.prototype.useAssignmentTool = function (coords) {
                // do nothing
            };
            return PreviewField;
        })(Common.Models.Field);
        Models.PreviewField = PreviewField;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PreviewCanvas = (function (_super) {
            __extends(PreviewCanvas, _super);
            function PreviewCanvas(playPrimary, playOpponent) {
                _super.call(this);
                this.playPrimary = playPrimary;
                this.playOpponent = playOpponent;
                this.dimensions.setMinWidth(250);
                this.dimensions.setMinHeight(200);
            }
            PreviewCanvas.prototype.initialize = function ($container) {
                this.container = $container[0]; // jquery lite converted to raw html
                this.$container = $container;
                this.setDimensions();
                this.paper = new Playbook.Models.PreviewPaper(this);
                this.paper.draw();
                this.$exportCanvas = $('<canvas/>', {
                    id: 'exportCanvas' + this.guid
                }).width(this.dimensions.width).height(this.dimensions.height);
                this.exportCanvas = this.$exportCanvas[0];
                this._ready();
            };
            PreviewCanvas.prototype.setDimensions = function () {
                this.dimensions.width = Math.min(500, this.$container.width());
                this.dimensions.height = Math.min(400, this.$container.height());
            };
            return PreviewCanvas;
        })(Common.Models.Canvas);
        Models.PreviewCanvas = PreviewCanvas;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PreviewPaper = (function (_super) {
            __extends(PreviewPaper, _super);
            function PreviewPaper(previewCanvas) {
                _super.call(this, previewCanvas);
                this.canvas = previewCanvas;
                this.sizingMode = Common.Enums.PaperSizingModes.PreviewWidth;
                this.showBorder = false;
                this.initialize();
            }
            PreviewPaper.prototype.initialize = function () {
                // NOTE: Grid size uses PREVIEW constants
                this.grid = new Common.Models.Grid(this, Playbook.Constants.FIELD_COLS_FULL, Playbook.Constants.FIELD_ROWS_FULL);
                this.drawing = new Common.Drawing.Utilities(this.canvas, this.grid);
                // Paper methods within field are dependent on 
                // this.Raphael
                this.field = new Playbook.Models.PreviewField(this, this.canvas.playPrimary, this.canvas.playOpponent);
            };
            PreviewPaper.prototype.updatePlay = function (playPrimary, playOpponent) {
                throw new Error('PreviewPaper updatePlay(): not implemented');
            };
            return PreviewPaper;
        })(Common.Models.Paper);
        Models.PreviewPaper = PreviewPaper;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PreviewLineOfScrimmage = (function (_super) {
            __extends(PreviewLineOfScrimmage, _super);
            function PreviewLineOfScrimmage(field) {
                _super.call(this, field);
                this.layer.graphics.setOffsetXY(0, 2);
                this.layer.graphics.dimensions.setHeight(1);
                this.layer.graphics.hoverable = false;
                this.layer.graphics.selectable = false;
            }
            PreviewLineOfScrimmage.prototype.draw = function () {
                this.layer.graphics.rect();
                //this.layer.graphics.disable();
            };
            return PreviewLineOfScrimmage;
        })(Common.Models.LineOfScrimmage);
        Models.PreviewLineOfScrimmage = PreviewLineOfScrimmage;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var EditorLineOfScrimmage = (function (_super) {
            __extends(EditorLineOfScrimmage, _super);
            function EditorLineOfScrimmage(field) {
                _super.call(this, field);
                this.layer.graphics.dimensions.offset.x = 0;
                this.layer.graphics.dimensions.offset.y = 8;
                this.layer.graphics.dimensions.setHeight(4);
                this.layer.graphics.selectedFill = 'blue';
            }
            EditorLineOfScrimmage.prototype.draw = function () {
                this.layer.graphics.rect();
                this.layer.graphics.setAttribute('class', 'ns-resize');
                // this.layer.graphics.onmousedown(
                //     this.mousedown,
                //     this
                // );
                // this.layer.graphics.onmouseup(
                //     this.mouseup,
                //     this
                // );
                // this.layer.graphics.onclick(
                //     this.click,
                //     this
                // );
                this.layer.graphics.ondrag(this.dragMove, this.dragStart, this.dragEnd, this);
            };
            // public mousedown(e: any, context: Common.Interfaces.IFieldElement): void {
            //     if (e.keyCode == Common.Input.Which.RightClick) {
            //         context.contextmenu(e, context);
            //     }
            //     this.layer.graphics.select();
            // }
            // public mouseup(e: any, context: Common.Interfaces.IFieldElement): void {
            //     this.layer.graphics.deselect();
            // }
            EditorLineOfScrimmage.prototype.dragMove = function (dx, dy, posx, posy, e) {
                var snapDx = this.grid.snapping ? this.grid.snapPixel(dx) : dx;
                var snapDy = this.grid.snapping ? this.grid.snapPixel(dy) : dy;
                this.layer.graphics.moveByDelta(this.layer.graphics.placement.coordinates.x, snapDy);
                this.field.ball.layer.graphics.dragging = true;
                this.field.ball.layer.graphics.moveByDelta(this.field.ball.layer.graphics.placement.coordinates.x, snapDy);
                this.field.players.forEach(function (player, index) {
                    player.layer.layers.forEach(function (layer) {
                        layer.graphics.moveByDelta(player.layer.graphics.placement.coordinates.x, snapDy);
                    });
                });
            };
            EditorLineOfScrimmage.prototype.dragStart = function (e) {
                this.layer.graphics.dragging = true;
            };
            EditorLineOfScrimmage.prototype.dragEnd = function (e) {
                this.drop();
                this.field.ball.drop();
                this.field.players.forEach(function (player, index) {
                    player.drop();
                });
            };
            return EditorLineOfScrimmage;
        })(Common.Models.LineOfScrimmage);
        Models.EditorLineOfScrimmage = EditorLineOfScrimmage;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PreviewGround = (function (_super) {
            __extends(PreviewGround, _super);
            function PreviewGround(field) {
                _super.call(this, field);
            }
            PreviewGround.prototype.draw = function () {
                _super.prototype.draw.call(this);
            };
            PreviewGround.prototype.hoverIn = function (e) {
                // hover not implemented in preview
            };
            PreviewGround.prototype.hoverOut = function (e) {
                // hover not implemented in preview
            };
            PreviewGround.prototype.click = function (e) {
                // click not implemented in preview
            };
            PreviewGround.prototype.mousedown = function (e) {
                // mousedown not implemented in preview
            };
            PreviewGround.prototype.dragMove = function (dx, dy, posx, posy, e) {
                // drag not implemented in preview
            };
            PreviewGround.prototype.dragStart = function (x, y, e) {
                // drag not implemented in preview
            };
            PreviewGround.prototype.dragEnd = function (e) {
                // drag not implemented in preview
            };
            return PreviewGround;
        })(Common.Models.Ground);
        Models.PreviewGround = PreviewGround;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var EditorGround = (function (_super) {
            __extends(EditorGround, _super);
            function EditorGround(field) {
                _super.call(this, field);
            }
            EditorGround.prototype.draw = function () {
                this.layer.graphics.rect();
                this.layer.graphics.onclick(this.click, this);
                this.layer.graphics.ondrag(this.dragMove, this.dragStart, this.dragEnd, this);
                this.layer.graphics.onmousemove(this.mousemove, this);
            };
            EditorGround.prototype.mousemove = function (e) {
                // get current coordinates
                this.field.setCursorCoordinates(e.offsetX, e.offsetY);
                //console.log(context.field.cursorCoordinates);
            };
            EditorGround.prototype.click = function (e) {
                var coords = this.getClickCoordinates(e.offsetX, e.offsetY);
                console.log('ground clicked', coords);
                var toolMode = this.paper.canvas.toolMode;
                switch (toolMode) {
                    case Playbook.Enums.ToolModes.Select:
                        console.log('selection mode');
                        this.field.deselectAll();
                        break;
                    case Playbook.Enums.ToolModes.None:
                        console.log('no mode');
                        this.field.deselectAll();
                        break;
                    case Playbook.Enums.ToolModes.Assignment:
                        this.field.useAssignmentTool(coords);
                        break;
                }
            };
            return EditorGround;
        })(Common.Models.Ground);
        Models.EditorGround = EditorGround;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PreviewHashmark = (function (_super) {
            __extends(PreviewHashmark, _super);
            function PreviewHashmark(field, x) {
                _super.call(this, field, x);
            }
            return PreviewHashmark;
        })(Common.Models.Hashmark);
        Models.PreviewHashmark = PreviewHashmark;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var EditorHashmark = (function (_super) {
            __extends(EditorHashmark, _super);
            function EditorHashmark(field, x) {
                _super.call(this, field, x);
            }
            return EditorHashmark;
        })(Common.Models.Hashmark);
        Models.EditorHashmark = EditorHashmark;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PreviewSideline = (function (_super) {
            __extends(PreviewSideline, _super);
            function PreviewSideline(field, offsetX) {
                _super.call(this, field, offsetX);
                this.layer.graphics.opacity = 0.35;
            }
            return PreviewSideline;
        })(Common.Models.Sideline);
        Models.PreviewSideline = PreviewSideline;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var EditorSideline = (function (_super) {
            __extends(EditorSideline, _super);
            function EditorSideline(field, offsetX) {
                _super.call(this, field, offsetX);
            }
            return EditorSideline;
        })(Common.Models.Sideline);
        Models.EditorSideline = EditorSideline;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var EditorPlayer = (function (_super) {
            __extends(EditorPlayer, _super);
            function EditorPlayer(field, placement, position, assignment) {
                _super.call(this, field, placement, position, assignment);
                this.contextmenuTemplateUrl
                    = 'modules/playbook/editor/canvas/player/playbook-editor-canvas-player-contextmenu.tpl.html';
                // the set acts as a group for the other graphical elements
                this.selectionBox = new Playbook.Models.EditorPlayerSelectionBox(this);
                this.icon = new Playbook.Models.EditorPlayerIcon(this);
                this.relativeCoordinatesLabel = new Playbook.Models.EditorPlayerRelativeCoordinatesLabel(this);
                this.personnelLabel = new Playbook.Models.EditorPlayerPersonnelLabel(this);
                this.indexLabel = new Playbook.Models.EditorPlayerIndexLabel(this);
                this.layer.addLayer(this.selectionBox.layer);
                this.layer.addLayer(this.icon.layer);
                this.layer.addLayer(this.relativeCoordinatesLabel.layer);
                this.layer.addLayer(this.personnelLabel.layer);
                this.layer.addLayer(this.indexLabel.layer);
                var self = this;
                this.icon.layer.onModified(function () {
                    console.log('editor player modified');
                    self.setModified(true);
                });
            }
            EditorPlayer.prototype.draw = function () {
                /**
                 * Player selection box
                 */
                this.selectionBox.draw();
                /**
                 *	Player icon
                 */
                this.icon.draw();
                this.icon.layer.graphics.ondrag(this.dragMove, this.dragStart, this.dragEnd, this);
                /**
                 * Relative Coordinates Text
                 */
                this.relativeCoordinatesLabel.draw();
                /**
                 * Personnel Label
                 */
                this.personnelLabel.draw();
                /**
                 * Index label
                 */
                this.indexLabel.draw();
                // Draw the player's assignment
                if (this.assignment) {
                    var route = this.assignment.routes.getOne();
                    // TODO: implement route switching
                    if (route) {
                        route.draw();
                    }
                }
            };
            EditorPlayer.prototype.remove = function () {
                this.layer.remove();
                this.assignment.remove();
            };
            EditorPlayer.prototype.mousedown = function (e) {
                // TODO: enumerate e.which (Event.SHIFT_)
                if (e.which == Common.Input.Which.RightClick) {
                    //console.log('right click');
                    this.canvas.listener.invoke(Playbook.Enums.Actions.PlayerContextmenu, this);
                }
            };
            EditorPlayer.prototype.click = function (e) {
                if (e.ctrlKey) {
                    e.preventDefault();
                    if (e.isDefaultPrevented()) {
                    }
                    else {
                        e.returnValue = false;
                    }
                }
                // Toggle the selection of this player
                this.field.toggleSelection(this);
                // determine the tool currently selected
                var toolMode = this.canvas.toolMode;
                switch (toolMode) {
                    case Playbook.Enums.ToolModes.Select:
                        //console.log('Select player');
                        break;
                    case Playbook.Enums.ToolModes.Assignment:
                        //console.log('Set player assignment');
                        break;
                }
                return e.returnValue;
            };
            EditorPlayer.prototype.dragMove = function (dx, dy, posx, posy, e) {
                // Ignore drag motions under specified threshold to prevent
                // click/mousedown from triggering drag method
                if (!this.isOverDragThreshold(dx, dy))
                    return;
                this.layer.graphics.dragged = true;
                // do not allow dragging while in route mode
                if (this.canvas.toolMode == Playbook.Enums.ToolModes.Assignment) {
                    if (!this.assignment) {
                        this.assignment = new Common.Models.Assignment(this.position.unitType);
                        this.assignment.positionIndex = this.position.index;
                    }
                    var route = this.assignment.routes.getOne();
                    // TODO: Implement route switching
                    if (!route) {
                        var newRoute = new Playbook.Models.EditorRoute(this, true);
                        this.assignment.routes.add(newRoute);
                        route = this.assignment.routes.get(newRoute.guid);
                    }
                    if (route.dragInitialized) {
                        var coords = new Common.Models.Coordinates(this.layer.graphics.location.ax + dx, this.layer.graphics.location.ay + dy);
                        route.initializeCurve(coords, e.shiftKey);
                    }
                    // prevent remaining logic from getting executed.
                    return;
                }
                else if (!e.shiftKey && e.which != Common.Input.Which.RightClick) {
                    // Update the placement to track for modification
                    this.layer.moveByDelta(dx, dy);
                    // Update relative coordinates label, if it exists
                    if (this.relativeCoordinatesLabel) {
                        this.relativeCoordinatesLabel.layer.graphics.text([
                            this.layer.graphics.placement.relative.rx,
                            ', ',
                            this.layer.graphics.placement.relative.ry
                        ].join(''));
                    }
                }
                else if (this.canvas.toolMode == Playbook.Enums.ToolModes.Select) {
                }
                else if (e.shiftKey) {
                }
                else if (e.which == Common.Input.Which.RightClick) {
                }
            };
            EditorPlayer.prototype.dragStart = function (x, y, e) {
                _super.prototype.dragStart.call(this, x, y, e);
                if (this.relativeCoordinatesLabel)
                    this.relativeCoordinatesLabel.layer.show();
                this.field.toggleSelection(this);
            };
            EditorPlayer.prototype.dragEnd = function (e) {
                _super.prototype.dragEnd.call(this, e);
                this.drop();
                if (this.assignment) {
                    // TODO: implement route switching
                    var route = this.assignment.routes.getOne();
                    if (route) {
                        if (route.dragInitialized) {
                            route.dragInitialized = false;
                        }
                        route.draw();
                    }
                }
                if (this.relativeCoordinatesLabel)
                    this.relativeCoordinatesLabel.layer.hide();
            };
            EditorPlayer.prototype.clearRoute = function () {
            };
            EditorPlayer.prototype.setRouteFromDefaults = function (routeTitle) {
            };
            EditorPlayer.prototype.onkeypress = function () {
            };
            EditorPlayer.prototype.getPositionRelativeToBall = function () {
                return this.layer.graphics.placement.relative;
            };
            EditorPlayer.prototype.getCoordinatesFromAbsolute = function () {
                return this.layer.graphics.placement.coordinates;
            };
            EditorPlayer.prototype.hasPlacement = function () {
                return this.layer.graphics.placement != null;
            };
            EditorPlayer.prototype.hasPosition = function () {
                return this.position != null;
            };
            return EditorPlayer;
        })(Common.Models.Player);
        Models.EditorPlayer = EditorPlayer;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PreviewPlayer = (function (_super) {
            __extends(PreviewPlayer, _super);
            function PreviewPlayer(context, placement, position, assignment) {
                _super.call(this, context, placement, position, assignment);
                // the set acts as a group for the other graphical elements
                this.icon = new Playbook.Models.PreviewPlayerIcon(this);
                this.layer.addLayer(this.icon.layer);
            }
            PreviewPlayer.prototype.draw = function () {
                this.icon.draw();
            };
            PreviewPlayer.prototype.dragMove = function (dx, dy, posx, posy, e) {
                // Not implemented - preview player does not have drag functionality
            };
            PreviewPlayer.prototype.dragStart = function (x, y, e) {
                // Not implemented - preview player does not have drag functionality
            };
            PreviewPlayer.prototype.dragEnd = function (e) {
                // Not implemented - preview player does not have drag functionality
            };
            return PreviewPlayer;
        })(Common.Models.Player);
        Models.PreviewPlayer = PreviewPlayer;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var EditorPlayerIcon = (function (_super) {
            __extends(EditorPlayerIcon, _super);
            function EditorPlayerIcon(player) {
                _super.call(this, player);
                this.layer.graphics.setHoverOpacity(0.6);
            }
            EditorPlayerIcon.prototype.draw = function () {
                _super.prototype.draw.call(this);
                this.layer.graphics.setAttribute('class', 'pointer');
                /**
                 *
                 * Attach event handlers to the player icon, but defer the functionality and
                 * scope to the actual player object itself, not to this icon.
                 *
                 */
                this.layer.graphics.onclick(this.click, this);
                this.layer.graphics.onhover(this.player.hoverIn, this.player.hoverOut, this.player);
                this.layer.graphics.onmousedown(this.player.mousedown, this.player);
            };
            EditorPlayerIcon.prototype.click = function (e) {
                _super.prototype.click.call(this, e);
                this.player.click(e);
            };
            return EditorPlayerIcon;
        })(Common.Models.PlayerIcon);
        Models.EditorPlayerIcon = EditorPlayerIcon;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PreviewPlayerIcon = (function (_super) {
            __extends(PreviewPlayerIcon, _super);
            function PreviewPlayerIcon(player) {
                _super.call(this, player);
                this.layer.graphics.fill = 'black';
                this.layer.graphics.setStrokeWidth(0);
            }
            return PreviewPlayerIcon;
        })(Common.Models.PlayerIcon);
        Models.PreviewPlayerIcon = PreviewPlayerIcon;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PreviewPlayerRelativeCoordinatesLabel = (function (_super) {
            __extends(PreviewPlayerRelativeCoordinatesLabel, _super);
            function PreviewPlayerRelativeCoordinatesLabel(player) {
                _super.call(this, player);
            }
            return PreviewPlayerRelativeCoordinatesLabel;
        })(Common.Models.PlayerRelativeCoordinatesLabel);
        Models.PreviewPlayerRelativeCoordinatesLabel = PreviewPlayerRelativeCoordinatesLabel;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var EditorPlayerRelativeCoordinatesLabel = (function (_super) {
            __extends(EditorPlayerRelativeCoordinatesLabel, _super);
            function EditorPlayerRelativeCoordinatesLabel(player) {
                _super.call(this, player);
            }
            return EditorPlayerRelativeCoordinatesLabel;
        })(Common.Models.PlayerRelativeCoordinatesLabel);
        Models.EditorPlayerRelativeCoordinatesLabel = EditorPlayerRelativeCoordinatesLabel;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var EditorPlayerPersonnelLabel = (function (_super) {
            __extends(EditorPlayerPersonnelLabel, _super);
            function EditorPlayerPersonnelLabel(player) {
                _super.call(this, player);
            }
            return EditorPlayerPersonnelLabel;
        })(Common.Models.PlayerPersonnelLabel);
        Models.EditorPlayerPersonnelLabel = EditorPlayerPersonnelLabel;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PreviewPlayerPersonnelLabel = (function (_super) {
            __extends(PreviewPlayerPersonnelLabel, _super);
            function PreviewPlayerPersonnelLabel(player) {
                _super.call(this, player);
            }
            PreviewPlayerPersonnelLabel.prototype.draw = function () {
                // player label not visible for preview player
            };
            return PreviewPlayerPersonnelLabel;
        })(Common.Models.PlayerPersonnelLabel);
        Models.PreviewPlayerPersonnelLabel = PreviewPlayerPersonnelLabel;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var EditorPlayerIndexLabel = (function (_super) {
            __extends(EditorPlayerIndexLabel, _super);
            function EditorPlayerIndexLabel(player) {
                _super.call(this, player);
            }
            return EditorPlayerIndexLabel;
        })(Common.Models.PlayerIndexLabel);
        Models.EditorPlayerIndexLabel = EditorPlayerIndexLabel;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PreviewPlayerIndexLabel = (function (_super) {
            __extends(PreviewPlayerIndexLabel, _super);
            function PreviewPlayerIndexLabel(player) {
                _super.call(this, player);
            }
            PreviewPlayerIndexLabel.prototype.draw = function () {
                // player index is not visible in preview mode
            };
            return PreviewPlayerIndexLabel;
        })(Common.Models.PlayerIndexLabel);
        Models.PreviewPlayerIndexLabel = PreviewPlayerIndexLabel;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var EditorPlayerSelectionBox = (function (_super) {
            __extends(EditorPlayerSelectionBox, _super);
            function EditorPlayerSelectionBox(player) {
                _super.call(this, player);
            }
            return EditorPlayerSelectionBox;
        })(Common.Models.PlayerSelectionBox);
        Models.EditorPlayerSelectionBox = EditorPlayerSelectionBox;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PreviewPlayerSelectionBox = (function (_super) {
            __extends(PreviewPlayerSelectionBox, _super);
            function PreviewPlayerSelectionBox(player) {
                _super.call(this, player);
            }
            PreviewPlayerSelectionBox.prototype.draw = function () {
                // preview selection box not visible
            };
            return PreviewPlayerSelectionBox;
        })(Common.Models.PlayerSelectionBox);
        Models.PreviewPlayerSelectionBox = PreviewPlayerSelectionBox;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PreviewRoute = (function (_super) {
            __extends(PreviewRoute, _super);
            function PreviewRoute(player) {
                _super.call(this, player);
                this.dragInitialized = false;
                this.type = Common.Enums.RouteTypes.Preview;
                this.layer.graphics.disable();
                if (this.player) {
                    // add root node
                    var rootNode = new Playbook.Models.PreviewRouteNode(this, new Common.Models.RelativeCoordinates(0, 0, this.player), Common.Enums.RouteNodeTypes.Root);
                    this.addNode(rootNode, false);
                }
                this.routePath = new Playbook.Models.PreviewRoutePath(this);
                this.layer.addLayer(this.routePath.layer);
                this.player.layer.addLayer(this.layer);
            }
            PreviewRoute.prototype.draw = function () {
                // route nodes not visible in preview
            };
            PreviewRoute.prototype.setContext = function (player) {
                // TODO @theBull
            };
            PreviewRoute.prototype.moveNodesByDelta = function (dx, dy) {
                // no movement available for preview route nodes
            };
            PreviewRoute.prototype.initializeCurve = function (coords, flip) {
                // initialize Curve not available for preview
            };
            PreviewRoute.prototype.fromJson = function (json) {
                _super.prototype.fromJson.call(this, json);
                // initialize route nodes
                if (json.nodes) {
                    for (var i = 0; i < json.nodes.length; i++) {
                        var rawNode = json.nodes[i];
                        var relativeCoordinates = new Common.Models.RelativeCoordinates(rawNode.layer.graphics.placement.coordinates.x, rawNode.layer.graphics.placement.coordinates.y, this.player);
                        var routeNodeModel = new Playbook.Models.PreviewRouteNode(this, relativeCoordinates, rawNode.type);
                        routeNodeModel.fromJson(rawNode);
                        this.addNode(routeNodeModel, false);
                    }
                }
            };
            return PreviewRoute;
        })(Common.Models.Route);
        Models.PreviewRoute = PreviewRoute;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var EditorRoute = (function (_super) {
            __extends(EditorRoute, _super);
            function EditorRoute(player, dragInitialized) {
                _super.call(this, player);
                this.type = Common.Enums.RouteTypes.Generic;
                this.dragInitialized = dragInitialized === true;
                this.routePath = new Playbook.Models.EditorRoutePath(this);
                if (this.player) {
                    // add root node
                    var rootNode = new Playbook.Models.EditorRouteNode(this, new Common.Models.RelativeCoordinates(0, 0, this.player), Common.Enums.RouteNodeTypes.Root);
                    rootNode.layer.graphics.disable();
                    this.addNode(rootNode, false);
                }
                this.layer.addLayer(this.routePath.layer);
                this.player.layer.addLayer(this.layer);
            }
            EditorRoute.prototype.setContext = function (player) {
                if (player) {
                    this.player = player;
                    this.grid = this.player.grid;
                    this.field = this.player.field;
                    this.paper = this.player.paper;
                    var self_4 = this;
                    this.nodes.forEach(function (node, index) {
                        node.setContext(self_4);
                        if (!self_4.layer.containsLayer(node.layer)) {
                            self_4.layer.addLayer(node.layer);
                        }
                    });
                    this.draw();
                }
            };
            EditorRoute.prototype.fromJson = function (json) {
                _super.prototype.fromJson.call(this, json);
                this.dragInitialized = json.dragInitialized;
                this.guid = json.guid;
                // initialize route nodes
                if (json.nodes) {
                    for (var i = 0; i < json.nodes.length; i++) {
                        var rawNode = json.nodes[i];
                        var relativeCoordinates = new Common.Models.RelativeCoordinates(rawNode.layer.graphics.placement.coordinates.x, rawNode.layer.graphics.placement.coordinates.y, this.player);
                        var routeNodeModel = new Playbook.Models.EditorRouteNode(this, relativeCoordinates, rawNode.type);
                        routeNodeModel.fromJson(rawNode);
                        this.addNode(routeNodeModel, false);
                    }
                }
            };
            EditorRoute.prototype.initializeCurve = function (coords, flip) {
                /**
                 * TODO @theBull - add functionality for creating curves
                 * in subsequent segments of the route
                 */
                // pre-condition: we do not have < 1 nodes, since we
                // always create a node when we initialize the object.
                // TODO: if there are more than 3 nodes?
                if (this.nodes.size() == 0) {
                    // ignore this command if assignment node list is empty
                    // or if there are more than 3 nodes (TODO)
                    return;
                }
                var lastNode, controlNode, endNode;
                if (this.nodes.hasElements() && this.nodes.size() == 1) {
                    // last node is our start node
                    lastNode = this.nodes.getLast();
                    lastNode.type = Common.Enums.RouteNodeTypes.CurveStart;
                    // add control node and end node. They share the
                    // same relative coordinates as the root/last node to start
                    controlNode = new Playbook.Models.EditorRouteNode(this, new Common.Models.RelativeCoordinates(lastNode.layer.graphics.placement.relative.rx, lastNode.layer.graphics.placement.relative.ry, this.player), Common.Enums.RouteNodeTypes.CurveControl);
                    endNode = new Playbook.Models.EditorRouteNode(this, new Common.Models.RelativeCoordinates(lastNode.layer.graphics.placement.relative.rx, lastNode.layer.graphics.placement.relative.ry, this.player), Common.Enums.RouteNodeTypes.CurveEnd);
                    // false: do not render nodes
                    this.addNode(controlNode, false);
                    this.addNode(endNode, true);
                }
                else {
                    lastNode = this.nodes.getRoot();
                    controlNode = this.nodes.getIndex(1);
                    endNode = this.nodes.getIndex(2);
                }
                if (flip === true) {
                    controlNode.layer.graphics.updateLocation(coords.x, lastNode.layer.graphics.location.ay);
                }
                else {
                    controlNode.layer.graphics.updateLocation(lastNode.layer.graphics.location.ax, coords.y);
                }
                endNode.layer.graphics.updateLocation(coords.x, coords.y);
                this.drawCurve(controlNode);
            };
            EditorRoute.prototype.moveNodesByDelta = function (dx, dy) {
                this.nodes.forEach(function (node, index) {
                    if (node) {
                        node.moveByDelta(dx, dy);
                    }
                });
            };
            return EditorRoute;
        })(Common.Models.Route);
        Models.EditorRoute = EditorRoute;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PreviewRouteNode = (function (_super) {
            __extends(PreviewRouteNode, _super);
            function PreviewRouteNode(route, relativeCoordinates, type) {
                _super.call(this, route, relativeCoordinates, type);
                // preview route node does not have a contextmenu
                this.contextmenuTemplateUrl = null;
                // Related route node graphics
                this.routeAction = new Playbook.Models.PreviewRouteAction(this, Common.Enums.RouteNodeActions.None);
                this.routeControlPath = new Playbook.Models.PreviewRouteControlPath(this);
                this.layer.addLayer(this.routeAction.layer);
                this.layer.addLayer(this.routeControlPath.layer);
                this.route.layer.addLayer(this.layer);
            }
            return PreviewRouteNode;
        })(Common.Models.RouteNode);
        Models.PreviewRouteNode = PreviewRouteNode;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var EditorRouteNode = (function (_super) {
            __extends(EditorRouteNode, _super);
            function EditorRouteNode(route, relativeCoordinates, type) {
                _super.call(this, route, relativeCoordinates, type);
                this.layer.graphics.enable();
                this.layer.graphics.setOriginalFill('#222222');
                this.layer.graphics.setHoverOpacity(1);
                this.layer.graphics.setOriginalOpacity(0.05);
                this.contextmenuTemplateUrl = Common.Constants.EDITOR_ROUTENODE_CONTEXTMENU_TEMPLATE_URL;
                // Related route node graphics
                this.routeAction = new Playbook.Models.EditorRouteAction(this, Common.Enums.RouteNodeActions.None);
                this.routeControlPath = new Playbook.Models.EditorRouteControlPath(this);
                // Add layers
                this.layer.addLayer(this.routeAction.layer);
                this.layer.addLayer(this.routeControlPath.layer);
                this.route.layer.addLayer(this.layer);
            }
            EditorRouteNode.prototype.draw = function () {
                _super.prototype.draw.call(this);
                this.layer.graphics.setAttribute('class', 'grab');
                this.layer.graphics.onclick(this.click, this);
                this.layer.graphics.ondrag(this.dragMove, this.dragStart, this.dragEnd, this // drag end context
                );
                this.layer.graphics.onhover(this.hoverIn, this.hoverOut, this);
                this.layer.graphics.oncontextmenu(this.contextmenu, this);
                if (this.type == Common.Enums.RouteNodeTypes.CurveControl) {
                }
            };
            EditorRouteNode.prototype.hoverIn = function (e) {
                this.layer.graphics.toggleOpacity();
            };
            EditorRouteNode.prototype.hoverOut = function (e) {
                this.layer.graphics.toggleOpacity();
            };
            EditorRouteNode.prototype.click = function (e) {
                // Toggle the selection of this routeNode
                this.field.toggleSelection(this);
            };
            EditorRouteNode.prototype.contextmenu = function (e) {
                this.paper.canvas.listener.invoke(Playbook.Enums.Actions.RouteNodeContextmenu, new Common.Models.ContextmenuData(this, e.pageX, e.pageY));
            };
            EditorRouteNode.prototype.dragMove = function (dx, dy, posx, posy, e) {
                if (this.layer.graphics.disabled) {
                    return;
                }
                // Update RouteNode graphical position
                this.layer.graphics.moveByDelta(dx, dy);
                // Update RouteAction graphical position (if applicable)
                if (this.routeAction) {
                    this.routeAction.layer.moveByDelta(dx, dy);
                    // Rotate the route action to stay perpendicular to the node/route orientation
                    var theta = Common.Drawing.Utilities.theta(this.prev.layer.graphics.location.ax, this.prev.layer.graphics.location.ay, this.layer.graphics.location.ax, this.layer.graphics.location.ay);
                    var thetaDegrees = Common.Drawing.Utilities.toDegrees(theta);
                    this.routeAction.layer.graphics.rotate(90 - thetaDegrees);
                }
                // redraw the path
                if (this.isCurveNode()) {
                    console.log('dragging control:', this.type);
                }
                this.route.draw();
                this.setModified(true);
            };
            EditorRouteNode.prototype.dragStart = function (x, y, e) {
                _super.prototype.dragStart.call(this, x, y, e);
            };
            EditorRouteNode.prototype.dragEnd = function (e) {
                _super.prototype.dragEnd.call(this, e);
                this.drop();
                // re-draw the route again after dropping,
                // since .drop() will force the absolute
                // coordinates to snap to a grid point, which
                // doesn't happen during the onDrag method
                this.route.draw();
            };
            EditorRouteNode.prototype.drop = function () {
                _super.prototype.drop.call(this);
                if (this.routeAction)
                    this.routeAction.drop();
                // route node has been modified
                this.setModified();
            };
            return EditorRouteNode;
        })(Common.Models.RouteNode);
        Models.EditorRouteNode = EditorRouteNode;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PreviewRoutePath = (function (_super) {
            __extends(PreviewRoutePath, _super);
            function PreviewRoutePath(route) {
                _super.call(this, route);
                this.layer.graphics.setStrokeWidth(1);
                this.layer.graphics.refresh();
                this.route.layer.addLayer(this.layer);
            }
            return PreviewRoutePath;
        })(Common.Models.RoutePath);
        Models.PreviewRoutePath = PreviewRoutePath;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var EditorRoutePath = (function (_super) {
            __extends(EditorRoutePath, _super);
            function EditorRoutePath(route) {
                _super.call(this, route);
                this.layer.graphics.setOriginalStroke('#001199');
                this.route.layer.addLayer(this.layer);
            }
            return EditorRoutePath;
        })(Common.Models.RoutePath);
        Models.EditorRoutePath = EditorRoutePath;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PreviewRouteAction = (function (_super) {
            __extends(PreviewRouteAction, _super);
            function PreviewRouteAction(routeNode, action) {
                _super.call(this, routeNode, action);
                this.layer.graphics.setOffsetXY(0.5, 0.5);
            }
            PreviewRouteAction.prototype.draw = function () {
                // preview route action is not visible
            };
            return PreviewRouteAction;
        })(Common.Models.RouteAction);
        Models.PreviewRouteAction = PreviewRouteAction;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var EditorRouteAction = (function (_super) {
            __extends(EditorRouteAction, _super);
            function EditorRouteAction(routeNode, action) {
                _super.call(this, routeNode, action);
                this.layer.graphics.setOffsetXY(0.5, 0.5);
            }
            return EditorRouteAction;
        })(Common.Models.RouteAction);
        Models.EditorRouteAction = EditorRouteAction;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var PreviewRouteControlPath = (function (_super) {
            __extends(PreviewRouteControlPath, _super);
            function PreviewRouteControlPath(routeNode) {
                _super.call(this, routeNode);
            }
            PreviewRouteControlPath.prototype.draw = function () {
                // preview route curves do not have visible control paths
            };
            return PreviewRouteControlPath;
        })(Common.Models.RouteControlPath);
        Models.PreviewRouteControlPath = PreviewRouteControlPath;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='./models.ts' />
var Playbook;
(function (Playbook) {
    var Models;
    (function (Models) {
        var EditorRouteControlPath = (function (_super) {
            __extends(EditorRouteControlPath, _super);
            function EditorRouteControlPath(routeNode) {
                _super.call(this, routeNode);
            }
            return EditorRouteControlPath;
        })(Common.Models.RouteControlPath);
        Models.EditorRouteControlPath = EditorRouteControlPath;
    })(Models = Playbook.Models || (Playbook.Models = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../playbook.ts' />
/// <reference path='./Tool.ts' />
/// <reference path='./EditorEndzone.ts' />
/// <reference path='./PreviewEndzone.ts' />
/// <reference path='./EditorBall.ts' />
/// <reference path='./PreviewBall.ts' />
/// <reference path='./EditorField.ts' />
/// <reference path='./EditorCanvas.ts' />
/// <reference path='./EditorPaper.ts' />
/// <reference path='./PreviewField.ts' />
/// <reference path='./PreviewCanvas.ts' />
/// <reference path='./PreviewPaper.ts' />
/// <reference path='./PreviewLineOfScrimmage.ts' />
/// <reference path='./EditorLineOfScrimmage.ts' />
/// <reference path='./PreviewGround.ts' />
/// <reference path='./EditorGround.ts' />
/// <reference path='./PreviewHashmark.ts' />
/// <reference path='./EditorHashmark.ts' />
/// <reference path='./PreviewSideline.ts' /> 
/// <reference path='./EditorSideline.ts' /> 
/// <reference path='./EditorPlayer.ts' />
/// <reference path='./PreviewPlayer.ts' />
/// <reference path='./EditorPlayerIcon.ts' />
/// <reference path='./PreviewPlayerIcon.ts' />
/// <reference path='./PreviewPlayerRelativeCoordinatesLabel.ts' />
/// <reference path='./EditorPlayerRelativeCoordinatesLabel.ts' />
/// <reference path='./EditorPlayerPersonnelLabel.ts' />
/// <reference path='./PreviewPlayerPersonnelLabel.ts' />
/// <reference path='./EditorPlayerIndexLabel.ts' />
/// <reference path='./PreviewPlayerIndexLabel.ts' />
/// <reference path='./EditorPlayerSelectionBox.ts' />
/// <reference path='./PreviewPlayerSelectionBox.ts' />
/// <reference path='./PreviewRoute.ts' /> 
/// <reference path='./EditorRoute.ts' /> 
/// <reference path='./PreviewRouteNode.ts' /> 
/// <reference path='./EditorRouteNode.ts' /> 
/// <reference path='./PreviewRoutePath.ts' /> 
/// <reference path='./EditorRoutePath.ts' /> 
/// <reference path='./PreviewRouteAction.ts' /> 
/// <reference path='./EditorRouteAction.ts' /> 
/// <reference path='./PreviewRouteControlPath.ts' /> 
/// <reference path='./EditorRouteControlPath.ts' /> 
/// <reference path='../playbook.ts' />
var Playbook;
(function (Playbook) {
    var Enums;
    (function (Enums) {
        (function (Actions) {
            Actions[Actions["FieldElementContextmenu"] = 0] = "FieldElementContextmenu";
            Actions[Actions["PlayerContextmenu"] = 1] = "PlayerContextmenu";
            Actions[Actions["RouteNodeContextmenu"] = 2] = "RouteNodeContextmenu";
            Actions[Actions["RouteTreeSelection"] = 3] = "RouteTreeSelection";
        })(Enums.Actions || (Enums.Actions = {}));
        var Actions = Enums.Actions;
        (function (ToolModes) {
            ToolModes[ToolModes["None"] = 0] = "None";
            ToolModes[ToolModes["Select"] = 1] = "Select";
            ToolModes[ToolModes["Formation"] = 2] = "Formation";
            ToolModes[ToolModes["Assignment"] = 3] = "Assignment";
            ToolModes[ToolModes["Zoom"] = 4] = "Zoom";
        })(Enums.ToolModes || (Enums.ToolModes = {}));
        var ToolModes = Enums.ToolModes;
        (function (ToolActions) {
            ToolActions[ToolActions["Nothing"] = 0] = "Nothing";
            ToolActions[ToolActions["Select"] = 1] = "Select";
            ToolActions[ToolActions["ToggleMenu"] = 2] = "ToggleMenu";
            ToolActions[ToolActions["AddPlayer"] = 3] = "AddPlayer";
            ToolActions[ToolActions["Save"] = 4] = "Save";
            ToolActions[ToolActions["ZoomIn"] = 5] = "ZoomIn";
            ToolActions[ToolActions["ZoomOut"] = 6] = "ZoomOut";
            ToolActions[ToolActions["Assignment"] = 7] = "Assignment";
        })(Enums.ToolActions || (Enums.ToolActions = {}));
        var ToolActions = Enums.ToolActions;
        (function (EditorTypes) {
            EditorTypes[EditorTypes["Formation"] = 0] = "Formation";
            EditorTypes[EditorTypes["Assignment"] = 1] = "Assignment";
            EditorTypes[EditorTypes["Play"] = 2] = "Play";
        })(Enums.EditorTypes || (Enums.EditorTypes = {}));
        var EditorTypes = Enums.EditorTypes;
        (function (PlayTypes) {
            PlayTypes[PlayTypes["Any"] = 0] = "Any";
            PlayTypes[PlayTypes["Primary"] = 1] = "Primary";
            PlayTypes[PlayTypes["Opponent"] = 2] = "Opponent";
        })(Enums.PlayTypes || (Enums.PlayTypes = {}));
        var PlayTypes = Enums.PlayTypes;
        (function (PlayerIconTypes) {
            PlayerIconTypes[PlayerIconTypes["CircleEditor"] = 0] = "CircleEditor";
            PlayerIconTypes[PlayerIconTypes["SquareEditor"] = 1] = "SquareEditor";
            PlayerIconTypes[PlayerIconTypes["TriangleEditor"] = 2] = "TriangleEditor";
            PlayerIconTypes[PlayerIconTypes["CirclePreview"] = 3] = "CirclePreview";
            PlayerIconTypes[PlayerIconTypes["SquarePreview"] = 4] = "SquarePreview";
            PlayerIconTypes[PlayerIconTypes["TrianglePreview"] = 5] = "TrianglePreview";
        })(Enums.PlayerIconTypes || (Enums.PlayerIconTypes = {}));
        var PlayerIconTypes = Enums.PlayerIconTypes;
    })(Enums = Playbook.Enums || (Playbook.Enums = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../playbook.ts' />
var Playbook;
(function (Playbook) {
    var Constants;
    (function (Constants) {
        Constants.FIELD_COLS_FULL = 52;
        Constants.FIELD_ROWS_FULL = 120;
        Constants.FIELD_COLOR = '#638148';
        Constants.GRID_SIZE = 15;
        Constants.GRID_BASE = 10;
        Constants.BALL_DEFAULT_PLACEMENT_X = 25;
        Constants.BALL_DEFAULT_PLACEMENT_Y = 60;
        Constants.PREVIEW_PLAYER_ICON_RADIUS = 5;
        Constants.DRAG_THRESHOLD_X = 5;
        Constants.DRAG_THRESHOLD_Y = 5;
    })(Constants = Playbook.Constants || (Playbook.Constants = {}));
})(Playbook || (Playbook = {}));
/// <reference path='../modules.ts' />
/// <reference path='./models/models.ts' />
/// <reference path='./interfaces/interfaces.ts' />
/// <reference path='./enums/enums.ts' />
/// <reference path='./constants/constants.ts' />
/// <reference path='./models.ts' />
var Team;
(function (Team) {
    var Models;
    (function (Models) {
        var TeamModel = (function (_super) {
            __extends(TeamModel, _super);
            function TeamModel(teamType) {
                _super.call(this, Common.Enums.ImpaktDataTypes.Team);
                _super.prototype.setContext.call(this, this);
                this.name = 'Untitled';
                this.teamType = teamType;
                this.records = new Team.Models.TeamRecordCollection();
                var self = this;
                this.onModified(function (data) { });
            }
            TeamModel.prototype.toJson = function () {
                return $.extend({
                    name: this.name,
                    teamType: this.teamType,
                    records: this.records.toJson()
                }, _super.prototype.toJson.call(this));
            };
            TeamModel.prototype.fromJson = function (json) {
                if (!json)
                    return null;
                this.teamType = json.teamType;
                this.name = json.name;
                this.records.fromJson(json.records);
                _super.prototype.fromJson.call(this, json);
            };
            return TeamModel;
        })(Common.Models.AssociableEntity);
        Models.TeamModel = TeamModel;
    })(Models = Team.Models || (Team.Models = {}));
})(Team || (Team = {}));
/// <reference path='./models.ts' />
var Team;
(function (Team) {
    var Models;
    (function (Models) {
        var TeamModelCollection = (function (_super) {
            __extends(TeamModelCollection, _super);
            function TeamModelCollection(teamType) {
                _super.call(this);
                this.teamType = teamType;
            }
            TeamModelCollection.prototype.toJson = function () {
                return {
                    teamType: this.teamType,
                    guid: this.guid,
                    teams: _super.prototype.toJson.call(this)
                };
            };
            TeamModelCollection.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.teamType = json.teamType;
                this.guid = json.guid;
                var teamArray = json.teams || [];
                for (var i = 0; i < teamArray.length; i++) {
                    var rawTeamModel = teamArray[i];
                    if (Common.Utilities.isNullOrUndefined(rawTeamModel)) {
                        continue;
                    }
                    rawTeamModel.teamType = Common.Utilities.isNullOrUndefined(rawTeamModel.teamType) &&
                        rawTeamModel.teamType >= 0 ? rawTeamModel.teamType : Team.Enums.TeamTypes.Other;
                    var teamModel = new Team.Models.TeamModel(rawTeamModel.teamType);
                    teamModel.fromJson(rawTeamModel);
                    this.add(teamModel);
                }
            };
            return TeamModelCollection;
        })(Common.Models.Collection);
        Models.TeamModelCollection = TeamModelCollection;
    })(Models = Team.Models || (Team.Models = {}));
})(Team || (Team = {}));
/// <reference path='./models.ts' />
var Team;
(function (Team) {
    var Models;
    (function (Models) {
        var TeamRecord = (function (_super) {
            __extends(TeamRecord, _super);
            function TeamRecord() {
                _super.call(this);
                _super.prototype.setContext.call(this, this);
                this.wins = 0;
                this.losses = 0;
                this.season = 2016; // @theBull - TODO - how to tie this with the season...association?
            }
            TeamRecord.prototype.toJson = function () {
                return {
                    wins: this.wins,
                    losses: this.losses,
                    season: this.season
                };
            };
            TeamRecord.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.wins = json.wins;
                this.losses = json.losses;
                this.season = json.season;
            };
            return TeamRecord;
        })(Common.Models.Modifiable);
        Models.TeamRecord = TeamRecord;
    })(Models = Team.Models || (Team.Models = {}));
})(Team || (Team = {}));
/// <reference path='./models.ts' />
var Team;
(function (Team) {
    var Models;
    (function (Models) {
        var TeamRecordCollection = (function (_super) {
            __extends(TeamRecordCollection, _super);
            function TeamRecordCollection() {
                _super.call(this);
            }
            TeamRecordCollection.prototype.toJson = function () {
                return _super.prototype.toJson.call(this);
            };
            TeamRecordCollection.prototype.fromJson = function (json) {
                if (!json)
                    return;
                var recordArray = json.records || [];
                for (var i = 0; i < recordArray.length; i++) {
                    var rawTeamRecordModel = recordArray[i];
                    if (Common.Utilities.isNullOrUndefined(rawTeamRecordModel)) {
                        continue;
                    }
                    var teamRecordModel = new Team.Models.TeamRecord();
                    teamRecordModel.fromJson(rawTeamRecordModel);
                    this.add(teamRecordModel);
                }
            };
            return TeamRecordCollection;
        })(Common.Models.Collection);
        Models.TeamRecordCollection = TeamRecordCollection;
    })(Models = Team.Models || (Team.Models = {}));
})(Team || (Team = {}));
/// <reference path='./models.ts' />
var Team;
(function (Team) {
    var Models;
    (function (Models) {
        var PrimaryTeam = (function (_super) {
            __extends(PrimaryTeam, _super);
            function PrimaryTeam() {
                _super.call(this, Team.Enums.TeamTypes.Primary);
                _super.prototype.setContext.call(this, this);
                this.onModified(function (data) { });
            }
            PrimaryTeam.prototype.toJson = function () {
                return {};
            };
            PrimaryTeam.prototype.fromJson = function (json) {
                if (!json)
                    return;
            };
            return PrimaryTeam;
        })(Team.Models.TeamModel);
        Models.PrimaryTeam = PrimaryTeam;
    })(Models = Team.Models || (Team.Models = {}));
})(Team || (Team = {}));
/// <reference path='./models.ts' />
var Team;
(function (Team) {
    var Models;
    (function (Models) {
        var OpponentTeam = (function (_super) {
            __extends(OpponentTeam, _super);
            function OpponentTeam() {
                _super.call(this, Team.Enums.TeamTypes.Opponent);
                _super.prototype.setContext.call(this, this);
                this.onModified(function (data) { });
            }
            OpponentTeam.prototype.toJson = function () {
                return {};
            };
            OpponentTeam.prototype.fromJson = function (json) {
                if (!json)
                    return;
            };
            return OpponentTeam;
        })(Team.Models.TeamModel);
        Models.OpponentTeam = OpponentTeam;
    })(Models = Team.Models || (Team.Models = {}));
})(Team || (Team = {}));
/// <reference path='./models.ts' />
var Team;
(function (Team) {
    var Models;
    (function (Models) {
        var Personnel = (function (_super) {
            __extends(Personnel, _super);
            function Personnel(unitType) {
                _super.call(this, Common.Enums.ImpaktDataTypes.PersonnelGroup);
                _super.prototype.setContext.call(this, this);
                this.name = 'Untitled';
                this.unitType = unitType;
                this.positions = null;
                this.setType = Common.Enums.SetTypes.Personnel;
                this.onModified(function (data) { });
            }
            Personnel.prototype.hasPositions = function () {
                return this.positions && this.positions.size() > 0;
            };
            Personnel.prototype.update = function (personnel) {
                this.unitType = personnel.unitType;
                this.key = personnel.key;
                this.name = personnel.name;
                this.guid = personnel.guid;
            };
            Personnel.prototype.copy = function (newPersonnel) {
                return _super.prototype.copy.call(this, newPersonnel, this);
            };
            Personnel.prototype.fromJson = function (json) {
                if (!json)
                    return null;
                this.unitType = json.unitType;
                if (!this.positions) {
                    this.positions = new Team.Models.PositionCollection(this.unitType);
                }
                else {
                    this.positions.removeAll();
                }
                this.positions.fromJson(json.positions);
                this.name = json.name;
                _super.prototype.fromJson.call(this, json);
            };
            Personnel.prototype.toJson = function () {
                return $.extend({
                    name: this.name,
                    unitType: this.unitType,
                    positions: this.positions.toJson()
                }, _super.prototype.toJson.call(this));
            };
            Personnel.prototype.setDefault = function () {
                this.positions = Team.Models.PositionDefault.getBlank(this.unitType);
                this.positions.onModified(function (data) { });
            };
            Personnel.prototype.setUnitType = function (unitType) {
                this.unitType = unitType;
                this.setDefault();
            };
            return Personnel;
        })(Common.Models.AssociableEntity);
        Models.Personnel = Personnel;
    })(Models = Team.Models || (Team.Models = {}));
})(Team || (Team = {}));
/// <reference path='./models.ts' />
var Team;
(function (Team) {
    var Models;
    (function (Models) {
        var PersonnelCollection = (function (_super) {
            __extends(PersonnelCollection, _super);
            function PersonnelCollection(unitType) {
                _super.call(this);
                this.unitType = unitType;
                this.setType = Common.Enums.SetTypes.Personnel;
            }
            PersonnelCollection.prototype.toJson = function () {
                return {
                    unitType: this.unitType,
                    setType: this.setType,
                    personnel: _super.prototype.toJson.call(this)
                };
            };
            PersonnelCollection.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.unitType = json.unitType;
                this.guid = json.guid;
                this.setType = json.setType;
                var personnelArray = json.personnel || [];
                for (var i = 0; i < personnelArray.length; i++) {
                    var rawPersonnel = personnelArray[i];
                    if (Common.Utilities.isNullOrUndefined(rawPersonnel)) {
                        continue;
                    }
                    rawPersonnel.unitType = Common.Utilities.isNullOrUndefined(rawPersonnel.unitType) &&
                        rawPersonnel.unitType >= 0 ? rawPersonnel.unitType : Team.Enums.UnitTypes.Other;
                    var personnelModel = new Team.Models.Personnel(rawPersonnel.unitType);
                    personnelModel.fromJson(rawPersonnel);
                    this.add(personnelModel);
                }
            };
            return PersonnelCollection;
        })(Common.Models.Collection);
        Models.PersonnelCollection = PersonnelCollection;
    })(Models = Team.Models || (Team.Models = {}));
})(Team || (Team = {}));
/// <reference path='./models.ts' />
var Team;
(function (Team) {
    var Models;
    (function (Models) {
        var Position = (function (_super) {
            __extends(Position, _super);
            function Position(unitType, options) {
                _super.call(this);
                _super.prototype.setContext.call(this, this);
                if (!options)
                    options = {};
                this.unitType = unitType;
                this.positionListValue = options.positionListValue || PositionList.Other;
                this.title = options.title || 'Untitled';
                this.label = options.label || '-';
                this.eligible = options.eligible || false;
                this.index = options.index >= 0 ? options.index : -1;
            }
            Position.prototype.toJson = function () {
                return {
                    positionListValue: this.positionListValue,
                    title: this.title,
                    label: this.label,
                    eligible: this.eligible,
                    index: this.index,
                    unitType: this.unitType,
                    guid: this.guid
                };
            };
            Position.prototype.fromJson = function (json) {
                this.positionListValue = json.positionListValue;
                this.label = json.label;
                this.eligible = json.eligible;
                this.title = json.title;
                this.unitType = json.unitType;
                this.index = json.index;
                this.guid = json.guid;
            };
            return Position;
        })(Common.Models.Modifiable);
        Models.Position = Position;
        (function (PositionList) {
            PositionList[PositionList["BlankOffense"] = 0] = "BlankOffense";
            PositionList[PositionList["BlankDefense"] = 1] = "BlankDefense";
            PositionList[PositionList["BlankSpecialTeams"] = 2] = "BlankSpecialTeams";
            PositionList[PositionList["BlankOther"] = 3] = "BlankOther";
            PositionList[PositionList["Quarterback"] = 4] = "Quarterback";
            PositionList[PositionList["RunningBack"] = 5] = "RunningBack";
            PositionList[PositionList["FullBack"] = 6] = "FullBack";
            PositionList[PositionList["TightEnd"] = 7] = "TightEnd";
            PositionList[PositionList["Center"] = 8] = "Center";
            PositionList[PositionList["Guard"] = 9] = "Guard";
            PositionList[PositionList["Tackle"] = 10] = "Tackle";
            PositionList[PositionList["WideReceiver"] = 11] = "WideReceiver";
            PositionList[PositionList["SlotReceiver"] = 12] = "SlotReceiver";
            PositionList[PositionList["NoseGuard"] = 13] = "NoseGuard";
            PositionList[PositionList["DefensiveTackle"] = 14] = "DefensiveTackle";
            PositionList[PositionList["DefensiveGuard"] = 15] = "DefensiveGuard";
            PositionList[PositionList["DefensiveEnd"] = 16] = "DefensiveEnd";
            PositionList[PositionList["Linebacker"] = 17] = "Linebacker";
            PositionList[PositionList["Safety"] = 18] = "Safety";
            PositionList[PositionList["FreeSafety"] = 19] = "FreeSafety";
            PositionList[PositionList["StrongSafety"] = 20] = "StrongSafety";
            PositionList[PositionList["DefensiveBack"] = 21] = "DefensiveBack";
            PositionList[PositionList["Cornerback"] = 22] = "Cornerback";
            PositionList[PositionList["Kicker"] = 23] = "Kicker";
            PositionList[PositionList["Holder"] = 24] = "Holder";
            PositionList[PositionList["Punter"] = 25] = "Punter";
            PositionList[PositionList["LongSnapper"] = 26] = "LongSnapper";
            PositionList[PositionList["KickoffSpecialist"] = 27] = "KickoffSpecialist";
            PositionList[PositionList["PuntReturner"] = 28] = "PuntReturner";
            PositionList[PositionList["KickReturner"] = 29] = "KickReturner";
            PositionList[PositionList["Upback"] = 30] = "Upback";
            PositionList[PositionList["Gunner"] = 31] = "Gunner";
            PositionList[PositionList["Jammer"] = 32] = "Jammer";
            PositionList[PositionList["Other"] = 33] = "Other";
        })(Models.PositionList || (Models.PositionList = {}));
        var PositionList = Models.PositionList;
        var PositionDefault = (function () {
            function PositionDefault() {
                Team.Models.PositionDefault.defaults = {
                    blankOffense: {
                        positionListValue: Team.Models.PositionList.BlankOffense,
                        title: 'Blank',
                        label: '',
                        unitType: Team.Enums.UnitTypes.Offense,
                        eligible: false
                    },
                    blankDefense: {
                        positionListValue: Team.Models.PositionList.BlankDefense,
                        title: 'Blank',
                        label: '',
                        unitType: Team.Enums.UnitTypes.Defense,
                        eligible: false
                    },
                    blankSpecialTeams: {
                        positionListValue: Team.Models.PositionList.BlankSpecialTeams,
                        title: 'Blank',
                        label: '',
                        unitType: Team.Enums.UnitTypes.SpecialTeams,
                        eligible: false
                    },
                    blankOther: {
                        positionListValue: Team.Models.PositionList.BlankOther,
                        title: 'Blank',
                        label: '',
                        unitType: Team.Enums.UnitTypes.Other,
                        eligible: false
                    },
                    quarterback: {
                        positionListValue: Team.Models.PositionList.Quarterback,
                        title: 'Quarterback',
                        label: 'QB',
                        unitType: Team.Enums.UnitTypes.Offense,
                        eligible: false
                    },
                    runningBack: {
                        positionListValue: Team.Models.PositionList.RunningBack,
                        title: 'Running Back',
                        label: 'RB',
                        unitType: Team.Enums.UnitTypes.Offense,
                        eligible: true
                    },
                    fullBack: {
                        positionListValue: Team.Models.PositionList.FullBack,
                        title: 'Full Back',
                        label: 'FB',
                        unitType: Team.Enums.UnitTypes.Offense,
                        eligible: true
                    },
                    tightEnd: {
                        positionListValue: Team.Models.PositionList.TightEnd,
                        title: 'Tight End',
                        label: 'TE',
                        unitType: Team.Enums.UnitTypes.Offense,
                        eligible: true
                    },
                    center: {
                        positionListValue: Team.Models.PositionList.Center,
                        title: 'Center',
                        label: 'C',
                        unitType: Team.Enums.UnitTypes.Offense,
                        eligible: false
                    },
                    guard: {
                        positionListValue: Team.Models.PositionList.Guard,
                        title: 'Guard',
                        label: 'G',
                        unitType: Team.Enums.UnitTypes.Offense,
                        eligible: false
                    },
                    tackle: {
                        positionListValue: Team.Models.PositionList.Tackle,
                        title: 'Tackle',
                        label: 'T',
                        unitType: Team.Enums.UnitTypes.Offense,
                        eligible: false
                    },
                    wideReceiver: {
                        positionListValue: Team.Models.PositionList.WideReceiver,
                        title: 'Wide Receiver',
                        label: 'WR',
                        unitType: Team.Enums.UnitTypes.Offense,
                        eligible: true
                    },
                    slotReceiver: {
                        positionListValue: Team.Models.PositionList.SlotReceiver,
                        title: 'Slot Receiver',
                        label: 'SL',
                        unitType: Team.Enums.UnitTypes.Offense,
                        eligible: true
                    },
                    noseGuard: {
                        positionListValue: Team.Models.PositionList.NoseGuard,
                        title: 'Nose Guard',
                        label: 'N',
                        unitType: Team.Enums.UnitTypes.Defense,
                        eligible: false
                    },
                    defensiveGuard: {
                        positionListValue: Team.Models.PositionList.DefensiveGuard,
                        title: 'Guard',
                        label: 'G',
                        unitType: Team.Enums.UnitTypes.Defense,
                        eligible: false
                    },
                    defensiveTackle: {
                        positionListValue: Team.Models.PositionList.DefensiveTackle,
                        title: 'Tackle',
                        label: 'T',
                        unitType: Team.Enums.UnitTypes.Defense,
                        eligible: false
                    },
                    defensiveEnd: {
                        positionListValue: Team.Models.PositionList.DefensiveEnd,
                        title: 'Defensive End',
                        label: 'DE',
                        unitType: Team.Enums.UnitTypes.Defense,
                        eligible: false
                    },
                    linebacker: {
                        positionListValue: Team.Models.PositionList.Linebacker,
                        title: 'Linebacker',
                        label: 'LB',
                        unitType: Team.Enums.UnitTypes.Defense,
                        eligible: false
                    },
                    safety: {
                        positionListValue: Team.Models.PositionList.Safety,
                        title: 'Safety',
                        label: 'S',
                        unitType: Team.Enums.UnitTypes.Defense,
                        eligible: false
                    },
                    freeSafety: {
                        positionListValue: Team.Models.PositionList.FreeSafety,
                        title: 'Free Safety',
                        label: 'FS',
                        unitType: Team.Enums.UnitTypes.Defense,
                        eligible: false
                    },
                    strongSafety: {
                        positionListValue: Team.Models.PositionList.StrongSafety,
                        title: 'Strong Safety',
                        label: 'SS',
                        unitType: Team.Enums.UnitTypes.Defense,
                        eligible: false
                    },
                    defensiveBack: {
                        positionListValue: Team.Models.PositionList.DefensiveBack,
                        title: 'Defensive Back',
                        label: 'DB',
                        unitType: Team.Enums.UnitTypes.Defense,
                        eligible: false
                    },
                    cornerback: {
                        positionListValue: Team.Models.PositionList.Cornerback,
                        title: 'Cornerback',
                        label: 'CB',
                        unitType: Team.Enums.UnitTypes.Defense,
                        eligible: false
                    },
                    kicker: {
                        positionListValue: Team.Models.PositionList.Kicker,
                        title: 'Kicker',
                        label: 'K',
                        unitType: Team.Enums.UnitTypes.SpecialTeams,
                        eligible: false
                    },
                    holder: {
                        positionListValue: Team.Models.PositionList.Holder,
                        title: 'Holder',
                        label: 'H',
                        unitType: Team.Enums.UnitTypes.SpecialTeams,
                        eligible: false
                    },
                    punter: {
                        positionListValue: Team.Models.PositionList.Punter,
                        title: 'Punter',
                        label: 'P',
                        unitType: Team.Enums.UnitTypes.SpecialTeams,
                        eligible: false
                    },
                    longSnapper: {
                        positionListValue: Team.Models.PositionList.LongSnapper,
                        title: 'Long Snapper',
                        label: 'LS',
                        unitType: Team.Enums.UnitTypes.SpecialTeams,
                        eligible: false
                    },
                    kickoffSpecialist: {
                        positionListValue: Team.Models.PositionList.KickoffSpecialist,
                        title: 'Kickoff Specialist',
                        label: 'KS',
                        unitType: Team.Enums.UnitTypes.SpecialTeams,
                        eligible: false
                    },
                    puntReturner: {
                        positionListValue: Team.Models.PositionList.PuntReturner,
                        title: 'Punt Returner',
                        label: 'PR',
                        unitType: Team.Enums.UnitTypes.SpecialTeams,
                        eligible: true
                    },
                    kickReturner: {
                        positionListValue: Team.Models.PositionList.KickReturner,
                        title: 'Kick Returner',
                        label: 'KR',
                        unitType: Team.Enums.UnitTypes.SpecialTeams,
                        eligible: true
                    },
                    upback: {
                        positionListValue: Team.Models.PositionList.Upback,
                        title: 'Upback',
                        label: 'U',
                        unitType: Team.Enums.UnitTypes.SpecialTeams,
                        eligible: true
                    },
                    gunner: {
                        positionListValue: Team.Models.PositionList.Gunner,
                        title: 'Gunner',
                        label: 'G',
                        unitType: Team.Enums.UnitTypes.SpecialTeams,
                        eligible: true
                    },
                    jammer: {
                        positionListValue: Team.Models.PositionList.Jammer,
                        title: 'Jammer',
                        label: 'J',
                        unitType: Team.Enums.UnitTypes.SpecialTeams,
                        eligible: true
                    },
                    other: {
                        positionListValue: Team.Models.PositionList.Other,
                        title: 'Other',
                        label: '-',
                        unitType: Team.Enums.UnitTypes.Other,
                        eligible: false
                    }
                };
            }
            PositionDefault.prototype.getPosition = function (positionListValue) {
                var results = null;
                for (var positionKey in Team.Models.PositionDefault.defaults) {
                    if (Team.Models.PositionDefault.defaults[positionKey].positionListValue == positionListValue) {
                        var positionSeedData = Team.Models.PositionDefault.defaults[positionKey];
                        results = new Team.Models.Position(positionSeedData.unitType, positionSeedData);
                    }
                }
                return results;
            };
            PositionDefault.prototype.switchPosition = function (fromPosition, toPositionEnum) {
                var newPosition = this.getPosition(toPositionEnum);
                newPosition.index = fromPosition.index;
                return newPosition;
            };
            PositionDefault.getBlank = function (type) {
                var collection = new Team.Models.PositionCollection(type);
                var positionSeedData = null;
                switch (type) {
                    case Team.Enums.UnitTypes.Offense:
                        positionSeedData = Team.Models.PositionDefault.defaults.blankOffense;
                        break;
                    case Team.Enums.UnitTypes.Defense:
                        positionSeedData = Team.Models.PositionDefault.defaults.blankDefense;
                        break;
                    case Team.Enums.UnitTypes.SpecialTeams:
                        positionSeedData = Team.Models.PositionDefault.defaults.blankSpecialTeams;
                        break;
                    case Team.Enums.UnitTypes.Other:
                        positionSeedData = Team.Models.PositionDefault.defaults.blankOther;
                        break;
                }
                if (!positionSeedData)
                    return null;
                for (var i = 0; i < 11; i++) {
                    var blank = new Team.Models.Position(positionSeedData.unitType, positionSeedData);
                    // add an index for the position :]
                    blank.index = i;
                    collection.add(blank);
                }
                return collection;
            };
            PositionDefault.prototype.getByUnitType = function (type) {
                var results = new Team.Models.PositionCollection(type);
                switch (type) {
                    case Team.Enums.UnitTypes.Offense:
                        results.fromJson([
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.blankOffense),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.quarterback),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.runningBack),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.fullBack),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.tightEnd),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.center),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.guard),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.tackle),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.wideReceiver),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.slotReceiver)
                        ]);
                        break;
                    case Team.Enums.UnitTypes.Defense:
                        results.fromJson([
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.blankDefense),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.noseGuard),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.defensiveTackle),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.defensiveGuard),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.defensiveEnd),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.linebacker),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.safety),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.freeSafety),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.strongSafety),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.defensiveBack),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.cornerback)
                        ]);
                        break;
                    case Team.Enums.UnitTypes.SpecialTeams:
                        results.fromJson([
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.blankSpecialTeams),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.kicker),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.holder),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.punter),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.longSnapper),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.kickoffSpecialist),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.puntReturner),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.kickReturner),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.upback),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.gunner),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.jamme)
                        ]);
                        break;
                    case Team.Enums.UnitTypes.Other:
                        results.fromJson([
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.blankOther),
                            new Team.Models.Position(type, Team.Models.PositionDefault.defaults.other)
                        ]);
                        break;
                    default:
                        results = null;
                        break;
                }
                return results;
            };
            ;
            return PositionDefault;
        })();
        Models.PositionDefault = PositionDefault;
    })(Models = Team.Models || (Team.Models = {}));
})(Team || (Team = {}));
/// <reference path='./models.ts' />
var Team;
(function (Team) {
    var Models;
    (function (Models) {
        var PositionCollection = (function (_super) {
            __extends(PositionCollection, _super);
            function PositionCollection(unitType) {
                _super.call(this);
                this.unitType = unitType;
                this.setDefault();
            }
            PositionCollection.prototype.listPositions = function () {
                var arr = [];
                this.forEach(function (position, index) {
                    arr.push(position.title);
                });
                return arr;
            };
            PositionCollection.prototype.toJson = function () {
                return _super.prototype.toJson.call(this);
            };
            PositionCollection.prototype.fromJson = function (positions) {
                if (!positions)
                    return;
                for (var i = 0; i < positions.length; i++) {
                    var rawPosition = positions[i];
                    if (Common.Utilities.isNullOrUndefined(rawPosition))
                        continue;
                    rawPosition.unitType = !Common.Utilities.isNullOrUndefined(rawPosition.unitType) &&
                        rawPosition.unitType >= 0 ? rawPosition.unitType : Team.Enums.UnitTypes.Other;
                    var positionModel = new Team.Models.Position(rawPosition.unitType);
                    positionModel.fromJson(rawPosition);
                    this.add(positionModel);
                }
            };
            PositionCollection.prototype.setDefault = function () {
            };
            return PositionCollection;
        })(Common.Models.Collection);
        Models.PositionCollection = PositionCollection;
    })(Models = Team.Models || (Team.Models = {}));
})(Team || (Team = {}));
/// <reference path='./models.ts' />
var Team;
(function (Team) {
    var Models;
    (function (Models) {
        var UnitType = (function (_super) {
            __extends(UnitType, _super);
            function UnitType(unitType, name) {
                _super.call(this);
                _super.prototype.setContext.call(this, this);
                this.unitType = unitType;
                this.name = name;
            }
            UnitType.getUnitTypes = function () {
                return Common.Utilities.convertEnumToList(Team.Enums.UnitTypes);
            };
            UnitType.prototype.toJson = function () {
                var json = {
                    unitType: this.unitType,
                    name: this.name,
                    guid: this.guid
                };
                return json;
            };
            UnitType.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.unitType = json.unitType;
                this.name = json.name;
                this.guid = json.guid;
            };
            return UnitType;
        })(Common.Models.Modifiable);
        Models.UnitType = UnitType;
    })(Models = Team.Models || (Team.Models = {}));
})(Team || (Team = {}));
/// <reference path='./models.ts' />
var Team;
(function (Team) {
    var Models;
    (function (Models) {
        var UnitTypeCollection = (function (_super) {
            __extends(UnitTypeCollection, _super);
            function UnitTypeCollection() {
                _super.call(this);
                var offense = new Team.Models.UnitType(Team.Enums.UnitTypes.Offense, 'offense');
                this.add(offense);
                var defense = new Team.Models.UnitType(Team.Enums.UnitTypes.Defense, 'defense');
                this.add(defense);
                var specialTeams = new Team.Models.UnitType(Team.Enums.UnitTypes.SpecialTeams, 'special teams');
                this.add(specialTeams);
                var other = new Team.Models.UnitType(Team.Enums.UnitTypes.Other, 'other');
                this.add(other);
            }
            UnitTypeCollection.prototype.getByUnitType = function (unitTypeValue) {
                return this.filterFirst(function (unitType) {
                    return unitType.unitType == unitTypeValue;
                });
            };
            UnitTypeCollection.prototype.getAssociatedPlaybooks = function () {
                var collection = new Common.Models.PlaybookModelCollection(Team.Enums.UnitTypes.Mixed);
                this.forEach(function (unitType, index) {
                    if (unitType && unitType.associated &&
                        unitType.associated.playbooks &&
                        unitType.associated.playbooks.hasElements()) {
                        unitType.associated.playbooks.forEach(function (guid, i) {
                            var playbookModel = impakt.context.Playbook.playbooks.get(guid);
                            if (playbookModel) {
                                collection.add(playbookModel);
                            }
                        });
                    }
                });
                return collection;
            };
            UnitTypeCollection.prototype.toJson = function () {
                return _super.prototype.toJson.call(this);
            };
            // takes an unprocessed arry of playbooks from the server
            // and adds them into the collection and sub collections
            UnitTypeCollection.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.guid = json.guid || this.guid;
            };
            return UnitTypeCollection;
        })(Common.Models.Collection);
        Models.UnitTypeCollection = UnitTypeCollection;
    })(Models = Team.Models || (Team.Models = {}));
})(Team || (Team = {}));
/// <reference path='../team.ts' />
/// <reference path='./TeamModel.ts' />
/// <reference path='./TeamModelCollection.ts' />
/// <reference path='./TeamRecord.ts' />
/// <reference path='./TeamRecordCollection.ts' />
/// <reference path='./PrimaryTeam.ts' />
/// <reference path='./OpponentTeam.ts' />
/// <reference path='./Personnel.ts' />
/// <reference path='./PersonnelCollection.ts' />
/// <reference path='./Position.ts' />
/// <reference path='./PositionCollection.ts' />
/// <reference path='./UnitType.ts' />
/// <reference path='./UnitTypeCollection.ts' /> 
/// <references path='../team.ts' />
/// <references path='./ITeam.ts' />
/// <reference path='../team.ts' />
var Team;
(function (Team) {
    var Enums;
    (function (Enums) {
        (function (UnitTypes) {
            UnitTypes[UnitTypes["Offense"] = 0] = "Offense";
            UnitTypes[UnitTypes["Defense"] = 1] = "Defense";
            UnitTypes[UnitTypes["SpecialTeams"] = 2] = "SpecialTeams";
            UnitTypes[UnitTypes["Other"] = 3] = "Other";
            UnitTypes[UnitTypes["Mixed"] = 4] = "Mixed";
        })(Enums.UnitTypes || (Enums.UnitTypes = {}));
        var UnitTypes = Enums.UnitTypes;
        (function (TeamTypes) {
            TeamTypes[TeamTypes["Primary"] = 0] = "Primary";
            TeamTypes[TeamTypes["Opponent"] = 1] = "Opponent";
            TeamTypes[TeamTypes["Other"] = 2] = "Other";
            TeamTypes[TeamTypes["Mixed"] = 3] = "Mixed";
        })(Enums.TeamTypes || (Enums.TeamTypes = {}));
        var TeamTypes = Enums.TeamTypes;
    })(Enums = Team.Enums || (Team.Enums = {}));
})(Team || (Team = {}));
/// <reference path='../modules.ts' />
/// <reference path='./models/models.ts' />
/// <reference path='./interfaces/interfaces.ts' />
/// <reference path='./enums/enums.ts' />
/// <reference path='../modules.ts' />
/// <reference path='../modules.ts' />
/// <reference path='../modules.ts' />
/// <reference path='./models.ts' />
var Navigation;
(function (Navigation) {
    var Models;
    (function (Models) {
        var NavigationItem = (function (_super) {
            __extends(NavigationItem, _super);
            function NavigationItem(name, label, glyphicon, path, active, activationCallback) {
                _super.call(this);
                _super.prototype.setContext.call(this, this);
                this.name = name;
                this.label = label;
                this.glyphicon = glyphicon;
                this.path = path;
                this.active = active === true;
                this.activationCallback = activationCallback;
            }
            NavigationItem.prototype.activate = function () {
                this.active = true;
                this.activationCallback(this);
            };
            NavigationItem.prototype.deactivate = function () {
                this.active = false;
            };
            NavigationItem.prototype.toggleActivation = function () {
                this.active = !this.active;
                if (this.active === true)
                    this.activate();
            };
            return NavigationItem;
        })(Common.Models.Modifiable);
        Models.NavigationItem = NavigationItem;
    })(Models = Navigation.Models || (Navigation.Models = {}));
})(Navigation || (Navigation = {}));
/// <reference path='./models.ts' />
var Navigation;
(function (Navigation) {
    var Models;
    (function (Models) {
        var NavigationItemCollection = (function (_super) {
            __extends(NavigationItemCollection, _super);
            function NavigationItemCollection() {
                _super.call(this);
            }
            NavigationItemCollection.prototype.activate = function (navItem) {
                this.forEach(function (item, index) {
                    item.deactivate();
                });
                navItem.activate();
            };
            NavigationItemCollection.prototype.getActive = function () {
                return this.filterFirst(function (item, index) {
                    return item.active === true;
                });
            };
            return NavigationItemCollection;
        })(Common.Models.Collection);
        Models.NavigationItemCollection = NavigationItemCollection;
    })(Models = Navigation.Models || (Navigation.Models = {}));
})(Navigation || (Navigation = {}));
/// <reference path='../nav.ts' />
/// <reference path='./navigation.ts' />
/// <reference path='./NavigationItem.ts' />
/// <reference path='./NavigationItemCollection.ts' /> 
/// <reference path='../modules.ts' />
/// <reference path='./models/models.ts' />
/// <reference path='../modules.ts' />
/// <reference path='../modules.ts' />
/// <reference path='./models.ts' />
var League;
(function (League) {
    var Models;
    (function (Models) {
        var LeagueModel = (function (_super) {
            __extends(LeagueModel, _super);
            function LeagueModel() {
                _super.call(this, Common.Enums.ImpaktDataTypes.League);
                _super.prototype.setContext.call(this, this);
            }
            LeagueModel.prototype.toJson = function () {
                return $.extend({
                    name: this.name
                }, _super.prototype.toJson.call(this));
            };
            LeagueModel.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.name = json.name;
                _super.prototype.fromJson.call(this, json);
            };
            return LeagueModel;
        })(Common.Models.AssociableEntity);
        Models.LeagueModel = LeagueModel;
    })(Models = League.Models || (League.Models = {}));
})(League || (League = {}));
/// <reference path='./models.ts' />
var League;
(function (League) {
    var Models;
    (function (Models) {
        var LeagueModelCollection = (function (_super) {
            __extends(LeagueModelCollection, _super);
            function LeagueModelCollection() {
                _super.call(this);
            }
            return LeagueModelCollection;
        })(Common.Models.Collection);
        Models.LeagueModelCollection = LeagueModelCollection;
    })(Models = League.Models || (League.Models = {}));
})(League || (League = {}));
/// <reference path='../league.ts' />
/// <reference path='./LeagueModel.ts' />
/// <reference path='./LeagueModelCollection.ts' />
/// <reference path='../modules.ts' />
/// <reference path='./models/models.ts' />
/// <reference path='../modules.ts' />
/// <reference path='./models.ts' />
var User;
(function (User) {
    var Models;
    (function (Models) {
        var Organization = (function (_super) {
            __extends(Organization, _super);
            function Organization() {
                _super.call(this);
                _super.prototype.setContext.call(this, this);
                this.accountKey = 0;
                this.address1 = null;
                this.address2 = null;
                this.address3 = null;
                this.city = null;
                this.country = null;
                this.faxPrimary = null;
                this.inactive = false;
                this.name = null;
                this.notes = null;
                this.organizationKey = 0;
                this.otherDetails = null;
                this.phonePrimary = null;
                this.postalCode = null;
                this.primaryEmail = null;
                this.stateProvince = null;
            }
            Organization.prototype.toJson = function () {
                return {
                    accountKey: this.accountKey,
                    address1: this.address1,
                    address2: this.address2,
                    address3: this.address3,
                    city: this.city,
                    country: this.country,
                    faxPrimary: this.faxPrimary,
                    inactive: this.inactive,
                    name: this.name,
                    notes: this.notes,
                    organizationKey: this.organizationKey,
                    otherDetails: this.otherDetails,
                    phonePrimary: this.phonePrimary,
                    postalCode: this.postalCode,
                    primaryEmail: this.primaryEmail,
                    stateProvince: this.stateProvince
                };
            };
            Organization.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.accountKey = json.accountKey;
                this.address1 = json.address1;
                this.address2 = json.address2;
                this.address3 = json.address3;
                this.city = json.city;
                this.country = json.country;
                this.faxPrimary = json.faxPrimary;
                this.inactive = json.inactive;
                this.name = json.name;
                this.notes = json.notes;
                this.organizationKey = json.organizationKey;
                this.otherDetails = json.otherDetails;
                this.phonePrimary = json.phonePrimary;
                this.postalCode = json.postalCode;
                this.primaryEmail = json.primaryEmail;
                this.stateProvince = json.stateProvince;
            };
            return Organization;
        })(Common.Models.Modifiable);
        Models.Organization = Organization;
    })(Models = User.Models || (User.Models = {}));
})(User || (User = {}));
/// <reference path='./models.ts' />
var User;
(function (User) {
    var Models;
    (function (Models) {
        var OrganizationCollection = (function (_super) {
            __extends(OrganizationCollection, _super);
            function OrganizationCollection() {
                _super.call(this);
            }
            OrganizationCollection.prototype.toJson = function () {
                return _super.prototype.toJson.call(this);
            };
            OrganizationCollection.prototype.fromJson = function (json) {
                if (!json)
                    return;
                throw new Error('OrganizationCollection fromJson(): not implemented');
            };
            return OrganizationCollection;
        })(Common.Models.Collection);
        Models.OrganizationCollection = OrganizationCollection;
    })(Models = User.Models || (User.Models = {}));
})(User || (User = {}));
/// <reference path='../user.ts' />
/// <reference path='./Organization.ts' />
/// <reference path='./OrganizationCollection.ts' />
/// <reference path='../modules.ts' />
/// <reference path='./models/models.ts' />
/// <reference path='../common/common.ts' />
/// <reference path='./playbook/playbook.ts' />
/// <reference path='./team/team.ts' />
/// <reference path='./analysis/analysis.ts' />
/// <reference path='./home/home.ts' />
/// <reference path='./planning/planning.ts' />
/// <reference path='./nav/nav.ts' />
/// <reference path='./search/search.ts' />
/// <reference path='./season/season.ts' />
/// <reference path='./league/league.ts' />
/// <reference path='./stats/stats.ts' />
/// <reference path='./user/user.ts' /> 
/// <reference path='../modules/modules.ts' />
// global impakt namespace
var impakt = {};
// global application context storage
impakt.context = {};
impakt.app = angular.module('impakt.app', [
    // module registration
    'ui.router',
    'ui.bootstrap',
    'impakt.common',
    'impakt.modules',
    'ngTagsInput'
])
    .config([
    '$stateProvider',
    '$urlRouterProvider',
    '$httpProvider',
    '$sceDelegateProvider',
    function ($stateProvider, $urlRouterProvider, $httpProvider, $sceDelegateProvider) {
        //Reset headers to avoid OPTIONS request (aka preflight)
        // $httpProvider.defaults.headers.common = {};
        // $httpProvider.defaults.headers.post = {};
        // $httpProvider.defaults.headers.put = {};
        // $httpProvider.defaults.headers.patch = {};
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'https://test-impakt.azurewebsites.net/**',
            'http://test.impaktathletics.com/**',
            '*'
        ]);
        //$urlRouterProvider.otherwise('/');
        // impakt module states - should these be module-specific?
        $stateProvider
            .state('home', {
            url: '/home',
            templateUrl: 'modules/home/home.tpl.html'
        })
            .state('season', {
            url: '/season',
            templateUrl: 'modules/season/season.tpl.html'
        })
            .state('team', {
            url: '/team',
            templateUrl: 'modules/team/team.tpl.html'
        })
            .state('planning', {
            url: '/planning',
            templateUrl: 'modules/planning/planning.tpl.html'
        })
            .state('analysis', {
            url: '/analysis',
            templateUrl: 'modules/analysis/analysis.tpl.html'
        })
            .state('profile', {
            url: '/profile',
            templateUrl: 'modules/user/user.tpl.html'
        });
        // TODO @theBull - implement
        // .state('film', {
        // 	url: '/film',
        // 	templateUrl: 'modules/film/film.tpl.html'
        // })
        // .state('stats', {
        // 	url: '/stats',
        // 	templateUrl: 'modules/stats/stats.tpl.html'
        // });
        console.debug('impakt.app - config');
    }])
    .run([
    '$http',
    '$window',
    '__auth',
    '__localStorage',
    '__context',
    '__notifications',
    '_user',
    function ($http, $window, __auth, __localStorage, __context, __notifications, _user) {
        console.debug('impakt - running');
        var accessToken = __localStorage.getAccessToken();
        if (accessToken) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + accessToken;
            var notification = __notifications.pending('Initializing user...');
            _user.initialize().then(function () {
                notification.success('User successfully initialized');
            }, function (err) {
                notification.error('Failed to initialize user');
            });
        }
        else {
            $window.location.href = '/signin.html';
        }
    }]);
impakt.signin = angular.module('impakt.signin', [
    // module registration
    'ui.router',
    'ui.bootstrap',
    'impakt.common'
])
    .config([function () {
        console.debug('impakt.signin - config');
    }])
    .run([
    '$http',
    '$window',
    '$location',
    '$rootScope',
    '__signin',
    function ($http, $window, $location, $rootScope, __signin) {
        console.debug('impakt.signin - running');
        // TODO: Change to application/json?
        $http.defaults.headers.common =
            { 'Content-Type': 'application/json' };
        // attempt login
        //__signin.signin();
    }]);
/// <reference path='../js/impakt.ts' />
/// <reference path='./common.ts' />
impakt.common = angular.module('impakt.common', [
    'impakt.common.api',
    'impakt.common.auth',
    'impakt.common.contextmenu',
    'impakt.common.context',
    'impakt.common.associations',
    'impakt.common.base',
    'impakt.common.scrollable',
    'impakt.common.modals',
    'impakt.common.localStorage',
    'impakt.common.parser',
    'impakt.common.signin',
    'impakt.common.locale',
    'impakt.common.ui',
    'impakt.common.notifications'
])
    .config(function () {
    console.debug('impakt.common - config');
})
    .run(function () {
    console.debug('impakt.common - run');
});
/// <reference path='../common.mdl.ts' />
impakt.common.api = angular.module('impakt.common.api', [])
    .config([function () {
        console.debug('impakt.common.api - config');
    }])
    .run([function () {
        console.debug('impakt.common.api - run');
    }]);
/// <reference path='./api.mdl.ts' />
impakt.common.api.constant('API', {
    'VERSION': 0.01,
    'HOST_URL': 'https://test.impaktathletics.com',
    //'HOST_URL': 'https://test-impakt.azurewebsites.net',
    'ENDPOINT': '/api',
});
/// <reference path='./api.mdl.ts' />
impakt.common.api.factory('__api', [
    'API',
    'AUTH',
    '$http',
    '$q',
    '__localStorage',
    function (API, AUTH, $http, $q, __localStorage) {
        var self = {
            post: post,
            get: get,
            path: path
        };
        function post(endpointUrl, data) {
            if (!data.OrganizationKey)
                data.OrganizationKey = __localStorage.getOrganizationKey();
            var d = $q.defer();
            $http({
                method: 'POST',
                url: path(API.HOST_URL, API.ENDPOINT, endpointUrl),
                data: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (data) {
                // TODO: handle statuses manually
                //console.log(data);
                d.resolve(data);
            }, function (err) {
                console.error(err);
                d.reject(err);
            });
            return d.promise;
        }
        function get(endpointUrl, data) {
            var d = $q.defer();
            $http({
                method: 'POST',
                url: path(API.HOST_URL, API.ENDPOINT, endpointUrl),
                headers: {
                    'X-HTTP-Method-Override': 'GET',
                    'Content-Type': 'application/json'
                },
                data: $.extend({
                    "OrganizationKey": __localStorage.getOrganizationKey()
                }, data)
            }).then(function (data) {
                // TODO: handle statuses manually
                //console.log(data);
                d.resolve(data);
            }, function (err) {
                console.error(err);
                d.reject(err);
            });
            return d.promise;
        }
        function path() {
            var segments = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                segments[_i - 0] = arguments[_i];
            }
            return segments.join('');
        }
        return self;
    }]);
/// <reference path='../common.mdl.ts' />
impakt.common.auth = angular.module('impakt.common.auth', []);
/// <reference path='./auth.mdl.ts' />
impakt.common.auth.constant('AUTH', {
    'TOKEN_ENDPOINT': '/token',
    'HANDSHAKE_DUMMY': 'grant_type=password&username=fredf@imanufacture.com&Password=Abc123',
    'CREATE_ORGANIZATION': '/configuration/createOrganization',
});
/// <reference path='./auth.mdl.ts' />
(function () {
    var name = '__auth';
    impakt.common.auth.factory(name, [
        'AUTH', 'API', '$http', '$q', '__api',
        function (AUTH, API, $http, $q, __api) {
            var self = {
                getToken: getToken
            };
            function getToken(username, password) {
                var d = $q.defer();
                var data = [
                    'grant_type=password',
                    '&username=', encodeURIComponent(username),
                    '&Password=', password
                ].join('');
                $http({
                    method: 'POST',
                    url: __api.path(API.HOST_URL, AUTH.TOKEN_ENDPOINT),
                    data: data,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).then(function (data) {
                    // TODO: handle statuses manually
                    console.log(data);
                    d.resolve(data);
                }, function (err) {
                    console.error(err);
                    d.reject(err);
                });
                return d.promise;
            }
            function createOrganization(organization) {
                var orgData = organization.toJson();
            }
            return self;
        }]);
})();
/// <reference path='../common.mdl.ts' />
/**
 * Defines a common base module for shared and inherited
 * components, such as base services and controllers.
 */
impakt.common.base = angular.module('impakt.common.base', [])
    .config(function () {
    console.debug('impakt.common.base - config');
})
    .run(function () {
    console.debug('impakt.common.base - run');
});
/// <reference path='./base.mdl.ts' />
/**
 * Defines a base service structure with methods that most
 * impakt module-level services will need.
 */
impakt.common.base.service('_base', ['$rootScope', function ($rootScope) {
        console.debug('service: impakt.common.base');
        /**
         * Register all components expected to be made ready.
         *
         * "Components" are other angular services, controllers,
         * or directives that need to have been loaded in order for
         * the editor to be truly ready for service.
         *
         * Components can notify to this service when they are
         * loading and when they have completely loaded. This
         * service can then in turn identify if it is
         * ready based on whether all of the components it is
         * expecting a 'componentLoaded' call from have been
         * called. Once all expected components have reported
         * that they are ready, we can use a ready event in the
         * service to initiate further commands.
         *
         * The name of each expected component should match the
         * string name given to angular to construct the given
         * component.
         */
        var components = new Common.Base.ComponentMap();
        this.loadComponent = function (component) {
            //console.log('component loaded', component);
            this.registerComponent(component);
            if (component.loaded)
                component.ready();
        };
        this.registerComponent = function (component) {
            components[component.guid] = component;
        };
    }]);
/// <reference path='../common.mdl.ts' />
impakt.common.associations = angular.module('impakt.common.associations', [])
    .config([function () {
        console.debug('impakt.common.associations - config');
    }])
    .run([function () {
        console.debug('impakt.common.associations - run');
    }]);
/// <reference path='./associations.mdl.ts' />
impakt.common.associations.constant('ASSOCIATIONS', {
    'ENDPOINT': '/general',
    // Methods
    GET_ASSOCIATIONS_FOR_CONTEXT: '/getAssociationsForContext',
    GET_ASSOCIATIONS_FOR_ENTITY: '/getAssociationsForEntity',
    UPDATE_ASSOCIATIONS: '/updateAssociations',
    DELETE_ASSOCIATIONS: '/deleteAssociations',
});
/// <reference path='./associations.mdl.ts' />
// Association service
impakt.common.associations.service('_associations', [
    'ASSOCIATIONS',
    '$q',
    '__api',
    '__localStorage',
    '__notifications',
    function (ASSOCIATIONS, $q, __api, __localStorage, __notifications) {
        /**
         * Global associations model;
         *
         * Manages associations between all entities/entityTypes
         * as a bi-directional association.
         *
         */
        var organizationKey = __localStorage.getOrganizationKey();
        this.associations = new Common.Models.AssociationCollection(organizationKey);
        /**
         * Get associations by context (organization key)
         */
        this.getAssociationsByContextId = function () {
            var d = $q.defer();
            // Get organization key
            var organizationKey = __localStorage.getOrganizationKey();
            var notification = __notifications.pending('Retrieving Association data for Organization ', organizationKey, '...');
            if (Common.Utilities.isNullOrUndefined(organizationKey)) {
                notification.error('Failed to retrieve associations for Organization ', organizationKey, '');
                d.reject(['Organization Key is invalid when attempting\
				 to request all Associations: (', organizationKey, ')'].join(''));
            }
            // make request
            __api.get(__api.path(ASSOCIATIONS.ENDPOINT, ASSOCIATIONS.GET_ASSOCIATIONS_FOR_CONTEXT), {
                contextId: organizationKey + ''
            }).then(function (associations) {
                var collection = new Common.Models.AssociationCollection(organizationKey);
                if (associations && associations.data && associations.data.results) {
                    collection.fromJson(associations.data.results);
                }
                notification.success(collection.size(), ' Associations successfully retrieved');
                d.resolve(collection);
            }, function (err) {
                notification.error('Failed to retrieve Associations for Organization ', organizationKey, '');
                d.reject(err);
            });
            return d.promise;
        };
        /**
        * Get associations by entity key
        */
        this.getAssociationsByEntityKey = function () {
        };
        /**
        * Update assocations
        */
        this.updateAssociations = function () {
            var d = $q.defer();
            var organizationKey = __localStorage.getOrganizationKey();
            var notification = __notifications.pending('Updating data associations...');
            var associations = impakt.context.Associations.creation.toJson();
            __api.post(__api.path(ASSOCIATIONS.ENDPOINT, ASSOCIATIONS.UPDATE_ASSOCIATIONS), {
                version: 1,
                contextID: organizationKey + '',
                associations: associations
            }).then(function (updatedAssociations) {
                notification.success(impakt.context.Associations.creation.size(), ' Associations successfully updated');
                impakt.context.Associations.associations.merge(impakt.context.Associations.creation);
                impakt.context.Associations.creation.empty();
                d.resolve();
            }, function (err) {
                notification.error('Failed to update Associations');
                d.reject(err);
            });
            return d.promise;
        };
        /**
        * Delete associations
        */
        this.deleteAssociations = function (internalKey) {
            var d = $q.defer();
            var organizationKey = __localStorage.getOrganizationKey();
            var notification = __notifications.pending('Deleting ', 'data associations...');
            var associations = impakt.context.Associations.associations.delete(internalKey);
            __api.post(__api.path(ASSOCIATIONS.ENDPOINT, ASSOCIATIONS.UPDATE_ASSOCIATIONS), {
                contextID: organizationKey,
                associations: associations.toJson()
            }).then(function () {
                notification.success(associations.size(), ' Associations successfully deleted');
                d.resolve();
            }, function (err) {
                notification.error('Failed to update Associations');
                d.reject(err);
            });
            return d.promise;
        };
        /**
        * Create association
        */
        this.createAssociation = function (fromEntity, toEntity) {
            var d = $q.defer();
            impakt.context.Associations.creation.add(fromEntity, toEntity);
            this.updateAssociations()
                .then(function () {
                d.resolve();
            }, function (err) {
                d.reject(err);
            });
            return d.promise;
        };
        this.createAssociations = function (fromEntity, associatedEntities) {
            var d = $q.defer();
            impakt.context.Associations.creation.addAll(fromEntity, associatedEntities);
            this.updateAssociations()
                .then(function () {
                d.resolve();
            }, function (err) {
                d.reject(err);
            });
            return d.promise;
        };
        /**
         * Gets all associated entities for the given IAssociable.
         *
         * @param  {Common.Interfaces.IAssociable} entity The entity for which to find associated entities
         * @return {any}                                  returns an object literal which contains
         *                                                a key representing each type of entity collection
         *                                                (playbooks, plays, formations, etc.), and
         *                                                a corresponding collection of that entity type,
         *                                                which will be empty if no associations of that
         *                                                type are found, or will be populated with entities
         *                                                of the given type if associations are found
         */
        this.getAssociated = function (entity) {
            // 
            // Gets the associations for the given entity by its associationKey
            // 
            var associations = impakt.context.Associations.associations.getByInternalKey(entity.associationKey);
            // Instantiate the set of association collections for the given
            // entity.
            var results = {
                playbooks: new Common.Models.PlaybookModelCollection(Team.Enums.UnitTypes.Mixed),
                plays: new Common.Models.PlayCollection(Team.Enums.UnitTypes.Mixed),
                formations: new Common.Models.FormationCollection(Team.Enums.UnitTypes.Mixed),
                personnel: new Team.Models.PersonnelCollection(Team.Enums.UnitTypes.Mixed),
                assignmentGroups: new Common.Models.AssignmentGroupCollection(Team.Enums.UnitTypes.Mixed)
            };
            //
            // Clients of this service should expect to receive back
            // a resulting set of associations, even if the collections
            // are empty. This should help prevent null pointer exceptions
            // when attempting to create ng-repeat bindings in the view logic
            // which rely on use of the .toArray() method on the given
            // collection.
            // 
            if (Common.Utilities.isNullOrUndefined(associations) ||
                associations.length == 0)
                return results;
            // Iterate over the entity's associations and parse each one
            // to:
            // 1. retrieve its guid
            // 2. determine its type
            // 3. make a query to the correct app. context collection
            for (var i = 0; i < associations.length; i++) {
                // each element in the associations array is in 'internalKey' structure
                // i.e. '<type>|<key>|<guid>''; parse(...) yields an
                // AssociationParts object with the corresponding and correctly typed values
                var associationParts = Common.Models.Association.parse(associations[i]);
                if (Common.Utilities.isNullOrUndefined(associationParts))
                    continue;
                var guid = associationParts.entityGuid;
                var type = associationParts.entityType;
                //
                // Gets the appropriate application context collection 
                // for the given entity's impakt data type enum value
                // 
                switch (type) {
                    case Common.Enums.ImpaktDataTypes.Playbook:
                        var playbook_1 = impakt.context.Playbook.playbooks.get(guid);
                        if (playbook_1)
                            results.playbooks.add(playbook_1);
                        break;
                    case Common.Enums.ImpaktDataTypes.Play:
                        var play = impakt.context.Playbook.plays.get(guid);
                        if (play)
                            results.plays.add(play);
                        break;
                    case Common.Enums.ImpaktDataTypes.Formation:
                        var formation = impakt.context.Playbook.formations.get(guid);
                        if (formation)
                            results.formations.add(formation);
                        break;
                    case Common.Enums.ImpaktDataTypes.PersonnelGroup:
                        var personnel = impakt.context.Playbook.personnel.get(guid);
                        if (personnel)
                            results.personnel.add(personnel);
                        break;
                    case Common.Enums.ImpaktDataTypes.AssignmentGroup:
                        var assignmentGroup = impakt.context.Playbook.assignmentGroups.get(guid);
                        if (assignmentGroup)
                            results.assignmentGroups.add(assignmentGroup);
                        break;
                }
            }
            return results;
        };
        this.associationExists = function (fromInternalKey, toInternalKey) {
            return this.associations.associationExists(fromInternalKey, toInternalKey);
        };
    }]);
/// <reference path='../common.mdl.ts' />
impakt.common.context = angular.module('impakt.common.context', [])
    .config([function () {
        console.debug('impakt.common.context - config');
    }])
    .run([function () {
        console.debug('impakt.common.context - run');
    }]);
/// <reference path='./context.mdl.ts' />
impakt.common.context.factory('__context', ['$q',
    '__api',
    '__localStorage',
    '__notifications',
    '_associations',
    '_playbook',
    '_league',
    '_team',
    function ($q, __api, __localStorage, __notifications, _associations, _playbook, _league, _team) {
        var isReady = false;
        var readyCallbacks = [];
        var initializingCallbacks = [];
        function onReady(callback) {
            readyCallbacks.push(callback);
            if (isReady)
                ready();
        }
        function onInitializing(callback) {
            initializingCallbacks.push(callback);
        }
        function initializing() {
            for (var i = 0; i < initializingCallbacks.length; i++) {
                initializingCallbacks[i]();
            }
            initializingCallbacks = [];
        }
        function ready() {
            isReady = true;
            for (var i = 0; i < readyCallbacks.length; i++) {
                readyCallbacks[i]();
            }
            readyCallbacks = [];
        }
        var self = {
            initialize: initialize,
            onReady: onReady,
            onInitializing: onInitializing
        };
        function initialize(context) {
            // notify listeners that context initialization
            // has begun
            initializing();
            var d = $q.defer();
            console.log('Making application context initialization requests');
            var organizationKey = __localStorage.getOrganizationKey();
            if (!context.Associations) {
                context.Associations = {};
                context.Associations.associations = new Common.Models.AssociationCollection(organizationKey);
                context.Associations.creation = new Common.Models.AssociationCollection(organizationKey);
            }
            if (!context.Playbook)
                context.Playbook = {};
            if (!context.Team)
                context.Team = {};
            if (!context.League)
                context.League = {};
            /**
             *
             *
             * Application-wide context data
             *
             *
             */
            /**
             * Association context
             */
            // Already set
            /**
             * Playbook context
             */
            context.Playbook.playbooks = new Common.Models.PlaybookModelCollection(Team.Enums.UnitTypes.Mixed);
            context.Playbook.formations = new Common.Models.FormationCollection(Team.Enums.UnitTypes.Mixed);
            context.Playbook.assignmentGroups = new Common.Models.AssignmentGroupCollection(Team.Enums.UnitTypes.Mixed);
            context.Playbook.plays = new Common.Models.PlayCollection(Team.Enums.UnitTypes.Mixed);
            /**
             * Team context
             */
            context.Team.teams = new Team.Models.TeamModelCollection(Team.Enums.TeamTypes.Mixed);
            context.Team.personnel = new Team.Models.PersonnelCollection(Team.Enums.UnitTypes.Mixed);
            context.Team.positionDefaults = new Team.Models.PositionDefault();
            context.Team.unitTypes = _playbook.getUnitTypes();
            context.Team.unitTypesEnum = _playbook.getUnitTypesEnum();
            /**
             * League context
             */
            context.League.leagues = new League.Models.LeagueModelCollection();
            /**
             * Module-specific context data; plays currently open in the editor
             */
            context.Playbook.editor = {
                plays: new Common.Models.PlayCollection(Team.Enums.UnitTypes.Mixed),
                tabs: new Common.Models.TabCollection()
            };
            /**
             * A creation context for new plays and formations.
             */
            context.Playbook.creation = {
                plays: new Common.Models.PlayCollection(Team.Enums.UnitTypes.Mixed),
                formations: new Common.Models.FormationCollection(Team.Enums.UnitTypes.Mixed)
            };
            async.parallel([
                // Retrieve associations
                // Retrieve associations
                function (callback) {
                    // make requests to get all associations
                    _associations.getAssociationsByContextId()
                        .then(function (associations) {
                        context.Associations.associations = associations;
                        callback(null, associations);
                    }, function (err) {
                        callback(err);
                    });
                },
                // Retrieve leagues
                // Retrieve leagues
                function (callback) {
                    _league.getLeagues().then(function (leagues) {
                        context.League.leagues = leagues;
                        __notifications.success('Leagues successfully loaded');
                        callback(null, leagues);
                    }, function (err) {
                        callback(err);
                    });
                },
                // Retrieve teams
                // Retrieve teams
                function (callback) {
                    _team.getTeams().then(function (teams) {
                        context.Team.teams = teams;
                        __notifications.success('Teams successfully loaded');
                        callback(null, teams);
                    }, function (err) {
                        callback(err);
                    });
                },
                // Retrieve playbooks
                // Retrieve playbooks
                function (callback) {
                    _playbook.getPlaybooks().then(function (playbooks) {
                        context.Playbook.playbooks = playbooks;
                        __notifications.success('Playbooks successfully loaded');
                        callback(null, playbooks);
                    }, function (err) {
                        callback(err);
                    });
                },
                // Retrieve formations
                // Retrieve formations
                function (callback) {
                    _playbook.getFormations().then(function (formations) {
                        context.Playbook.formations = formations;
                        __notifications.success('Formations successfully loaded');
                        callback(null, formations);
                    }, function (err) {
                        callback(err);
                    });
                },
                // Retrieve personnel sets
                // Retrieve personnel sets
                function (callback) {
                    _playbook.getAssignmentGroups()
                        .then(function (assignmentGroupCollection) {
                        if (!Common.Utilities.isNullOrUndefined(assignmentGroupCollection))
                            context.Playbook.assignmentGroups = assignmentGroupCollection;
                        __notifications.success('Assignments successfully loaded');
                        callback(null, assignmentGroupCollection);
                    }, function (err) {
                        callback(err);
                    });
                },
                function (callback) {
                    _team.getPersonnel().then(function (personnelCollection) {
                        if (!Common.Utilities.isNullOrUndefined(personnelCollection))
                            context.Team.personnel = personnelCollection;
                        __notifications.success('Personnel successfully loaded');
                        callback(null, personnelCollection);
                    }, function (err) {
                        callback(err);
                    });
                },
                // Retrieve plays
                // Retrieve plays
                function (callback) {
                    _playbook.getPlays().then(function (plays) {
                        context.Playbook.plays = plays;
                        __notifications.success('Plays successfully loaded');
                        callback(null, plays);
                    }, function (err) {
                        callback(err);
                    });
                }], 
            // Final callback
            function (err, results) {
                if (err) {
                    d.reject(err);
                }
                else {
                    __notifications.success('Initial data loaded successfully');
                    ready();
                    d.resolve(context);
                }
            });
            return d.promise;
        }
        return self;
    }]);
/// <reference path='../common.mdl.ts' />
impakt.common.contextmenu = angular.module('impakt.common.contextmenu', []);
/// <reference path='./common-contextmenu.mdl.ts' />
impakt.common.contextmenu.controller('common.contextmenu.ctrl', [
    '$scope',
    '_contextmenu',
    function ($scope, _contextmenu) {
        $scope.$contextmenuElement;
        $scope.contextmenuData = _contextmenu.contextmenuData;
        $scope.left = 0;
        $scope.top = 0;
        $scope.width = 200;
        $scope.height = 200;
        $scope.guid = '';
        $scope.contextmenuVisible = false;
        _contextmenu.onopen(function (data) {
            $scope.contextmenuData = data;
            $scope.contextmenuVisible = true;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
            $scope.$contextmenuElement.offset({ top: data.pageY, left: data.pageX });
        });
        _contextmenu.onclose(function () {
            $scope.contextmenuData = null;
            $scope.contextmenuVisible = false;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
        $scope.open = function (data) {
            _contextmenu.open(data);
        };
        $scope.close = function () {
            _contextmenu.close();
        };
    }]).directive('contextmenu', [
    '_contextmenu',
    function (_contextmenu) {
        console.debug('directive: contextmenu - register');
        return {
            controller: 'common.contextmenu.ctrl',
            restrict: 'E',
            templateUrl: 'common/contextmenu/common-contextmenu.tpl.html',
            transclude: true,
            replace: true,
            link: function ($scope, $element, attrs) {
                $scope.$contextmenuElement = $element;
                $(document).keyup(function (e) {
                    if (e.which == Common.Input.Which.Esc) {
                        $scope.close();
                    }
                });
            }
        };
    }])
    .directive('enableContextmenu', [
    '_contextmenu',
    function (_contextmenu) {
        return {
            restrict: 'A',
            scope: {
                entity: '='
            },
            link: function ($scope, $element, attrs) {
                $element.mousedown(function (e) {
                    if (e.which == Common.Input.Which.RightClick) {
                        _contextmenu.open(new Common.Models.ContextmenuData($scope.entity, e.pageX, e.pageY));
                    }
                });
            }
        };
    }]);
/// <reference path='./common-contextmenu.mdl.ts' />
impakt.common.contextmenu.service('_contextmenu', [
    function () {
        var closeCallback = function () { };
        var openCallback = function (data) { };
        this.contextmenuData = null;
        this.open = function (data) {
            this.contextmenuData = data;
            openCallback(data);
        };
        this.onopen = function (callback) {
            openCallback = callback;
        };
        this.close = function () {
            this.data = null;
            closeCallback();
        };
        this.onclose = function (callback) {
            closeCallback = callback;
        };
        this.calculatePosition = function () {
            // todo
        };
    }]);
/// <reference path='../common.mdl.ts' />
impakt.common.localStorage = angular.module('impakt.common.localStorage', [])
    .config(function () {
    console.debug('impakt.common.localStorage - config');
})
    .run(function () {
    console.debug('impakt.common.localStorage - run');
});
/// <reference path='./localStorage.mdl.ts' />
impakt.common.localStorage.constant('LOCAL_STORAGE', {
    'ACCESS_TOKEN': 'access_token',
    'ACCESS_TOKEN_EXPIRES': 'access_token_expires',
    'USER_NAME': 'user_name',
    'ORGANIZATION_KEY': 'organization_key',
    'DEFAULT_PLAYBOOK_KEY': 'default_playbook_key',
    'DEFAULT_PLAYBOOK_UNIT_TYPE': 'default_playbook_unit_type',
    'DEFAULT_EDITOR_TYPE': 'default_editor_type',
    'DEFAULT_EDITOR_ITEM_KEY': 'default_editor_item_key',
    'DEFAULT_EDITOR_ITEM_TYPE': 'default_editor_item_type',
    'DEFAULT_PATH': 'default_path'
});
/// <reference path='./localStorage.mdl.ts' />
impakt.common.localStorage.factory('__localStorage', [
    'LOCAL_STORAGE',
    function (LOCAL_STORAGE) {
        var self = {
            getItem: getItem,
            setItem: setItem,
            getAccessToken: getAccessToken,
            setAccessToken: setAccessToken,
            clearAccessToken: clearAccessToken,
            getAccessTokenExpiration: getAccessTokenExpiration,
            getUserName: getUserName,
            getOrganizationKey: getOrganizationKey,
            setOrganizationKey: setOrganizationKey,
            isDefaultEditorInfoSet: isDefaultEditorInfoSet,
            getDefaultEditorInfo: getDefaultEditorInfo,
            setDefaultEditorInfo: setDefaultEditorInfo,
            getDefaultPlaybookKey: getDefaultPlaybookKey,
            setDefaultPlaybookKey: setDefaultPlaybookKey,
            resetDefaultPlaybookKey: resetDefaultPlaybookKey,
            getDefaultPlaybookUnitType: getDefaultPlaybookUnitType,
            setDefaultPlaybookUnitType: setDefaultPlaybookUnitType,
            resetDefaultPlaybookUnitType: resetDefaultPlaybookUnitType,
            resetDefaultPlaybook: resetDefaultPlaybook,
            getDefaultEditorType: getDefaultEditorType,
            setDefaultEditorType: setDefaultEditorType,
            resetDefaultEditorType: resetDefaultEditorType,
            getDefaultEditorItemKey: getDefaultEditorItemKey,
            setDefaultEditorItemKey: setDefaultEditorItemKey,
            resetDefaultEditorItemKey: resetDefaultEditorItemKey,
            getDefaultEditorItemType: getDefaultEditorItemType,
            setDefaultEditorItemType: setDefaultEditorItemType,
            resetDefaultEditorItemType: resetDefaultEditorItemType,
            resetDefaultEditorItem: resetDefaultEditorItem,
            getDefaultPath: getDefaultPath,
            setDefaultPath: setDefaultPath,
            signout: signout
        };
        function signout() {
            self.clearAccessToken();
            self.resetDefaultEditorItem();
            self.resetDefaultPlaybook();
        }
        function getItem(key) {
            return localStorage.getItem(key);
        }
        function setItem(key, value) {
            localStorage.setItem(key, value);
        }
        /**
         *
         * App-specific settings
         *
         */
        // Access token
        function getAccessToken() {
            return localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);
        }
        function getAccessTokenExpiration() {
            return localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN_EXPIRES);
        }
        /**
         * Returns the username stored in localStorage, if it exists, otherwise throws
         * an exception.
         *
         * @return {string} the username (email) stored in local storage
         */
        function getUserName() {
            var userName = localStorage.getItem(LOCAL_STORAGE.USER_NAME);
            if (!userName)
                throw new Error('__localStorage getUserName(): user name could not be found!');
            return userName;
        }
        /**
         * Retrieves the current logged in user's organization key from local storage,
         * throws an exception if it doesn't exist.
         *
         * @return {number} The organization key
         */
        function getOrganizationKey() {
            var orgKey = localStorage.getItem(LOCAL_STORAGE.ORGANIZATION_KEY);
            if (!orgKey)
                throw new Error('__localStorage getOrganizationKey(): organization key could not be found!');
            return parseInt(orgKey);
        }
        /**
         * Sets the current organization key
         * @param {number} organizationKey the organization key
         */
        function setOrganizationKey(organizationKey) {
            if (isNaN(organizationKey))
                throw new Error('__localStorage setOrganizationKey(): Failed to set organization key ' + organizationKey);
            localStorage.setItem(LOCAL_STORAGE.ORGANIZATION_KEY, organizationKey.toString());
        }
        function setAccessToken(data) {
            self.setItem(LOCAL_STORAGE.ACCESS_TOKEN, data['access_token']);
            self.setItem(LOCAL_STORAGE.ACCESS_TOKEN_EXPIRES, data['.expires']);
            self.setItem(LOCAL_STORAGE.USER_NAME, data['userName']);
            self.setItem(LOCAL_STORAGE.ORGANIZATION_KEY, data['organizationKey']);
        }
        function clearAccessToken() {
            self.setItem(LOCAL_STORAGE.ACCESS_TOKEN, null);
            self.setItem(LOCAL_STORAGE.ACCESS_TOKEN_EXPIRES, null);
            self.setItem(LOCAL_STORAGE.USER_NAME, null);
            self.setItem(LOCAL_STORAGE.ORGANIZATION_KEY, null);
        }
        // Default Playbook Key
        function getDefaultPlaybookKey() {
            return parseInt(localStorage.getItem(LOCAL_STORAGE.DEFAULT_PLAYBOOK_KEY));
        }
        function setDefaultPlaybookKey(key) {
            self.setItem(LOCAL_STORAGE.DEFAULT_PLAYBOOK_KEY, key);
        }
        function resetDefaultPlaybookKey() {
            self.setDefaultPlaybookKey(-1);
        }
        function getDefaultPlaybookUnitType() {
            return parseInt(localStorage.getItem(LOCAL_STORAGE.DEFAULT_PLAYBOOK_UNIT_TYPE));
        }
        function setDefaultPlaybookUnitType(type) {
            self.setItem(LOCAL_STORAGE.DEFAULT_PLAYBOOK_UNIT_TYPE, type);
        }
        function resetDefaultPlaybookUnitType() {
            self.setDefaultPlaybookUnitType(-1);
        }
        function resetDefaultPlaybook() {
            self.resetDefaultPlaybookKey();
            self.resetDefaultPlaybookUnitType();
        }
        function isDefaultEditorInfoSet() {
            var info = self.getDefaultEditorInfo();
            return info && info.playbookKey > 0 && info.editorType >= 0
                && info.editorItemKey > 0 && info.editorItemType >= 0;
        }
        function setDefaultEditorInfo(playbookKey, editorType, editorItemKey, editorItemType) {
            self.setDefaultPlaybookKey(playbookKey);
            self.setDefaultEditorType(editorType);
            self.setDefaultEditorItemKey(editorItemKey);
            self.setDefaultEditorItemType(editorItemType);
        }
        function getDefaultEditorInfo() {
            return {
                playbookKey: self.getDefaultPlaybookKey(),
                editorType: self.getDefaultEditorType(),
                editorItemKey: self.getDefaultEditorItemKey(),
                editorItemType: self.getDefaultEditorItemType()
            };
        }
        function getDefaultEditorType() {
            return parseInt(localStorage.getItem(LOCAL_STORAGE.DEFAULT_EDITOR_TYPE));
        }
        function setDefaultEditorType(type) {
            self.setItem(LOCAL_STORAGE.DEFAULT_EDITOR_TYPE, type);
        }
        function resetDefaultEditorType() {
            self.setDefaultEditorType(-1);
        }
        function getDefaultEditorItemKey() {
            return parseInt(localStorage.getItem(LOCAL_STORAGE.DEFAULT_EDITOR_ITEM_KEY));
        }
        function setDefaultEditorItemKey(key) {
            self.setItem(LOCAL_STORAGE.DEFAULT_EDITOR_ITEM_KEY, key);
        }
        function resetDefaultEditorItemKey() {
            self.setDefaultEditorItemKey(-1);
        }
        function getDefaultEditorItemType() {
            return parseInt(localStorage.getItem(LOCAL_STORAGE.DEFAULT_EDITOR_ITEM_TYPE));
        }
        function setDefaultEditorItemType(type) {
            self.setItem(LOCAL_STORAGE.DEFAULT_EDITOR_ITEM_TYPE, type);
        }
        function resetDefaultEditorItemType() {
            self.setDefaultEditorItemType(-1);
        }
        function resetDefaultEditorItem() {
            self.resetDefaultEditorType();
            self.resetDefaultEditorItemKey();
            self.resetDefaultEditorItemType();
        }
        function getDefaultPath() {
            return localStorage.getItem(LOCAL_STORAGE.DEFAULT_PATH);
        }
        function setDefaultPath(path) {
            self.setItem(LOCAL_STORAGE.DEFAULT_PATH, path);
        }
        return self;
    }]);
/// <reference path='../common.mdl.ts' />
impakt.common.locale = angular.module('impakt.common.locale', [])
    .config([function () {
        console.debug('impakt.common.locale - config');
    }])
    .run([function () {
        console.debug('impakt.common.locale - run');
    }]);
/// <reference path='./locale.mdl.ts' />
impakt.common.locale.factory('__locale', [
    function () {
        var self = {
            states: states()
        };
        function states() {
            return [
                {
                    "name": "Alabama",
                    "abbreviation": "AL"
                },
                {
                    "name": "Alaska",
                    "abbreviation": "AK"
                },
                {
                    "name": "American Samoa",
                    "abbreviation": "AS"
                },
                {
                    "name": "Arizona",
                    "abbreviation": "AZ"
                },
                {
                    "name": "Arkansas",
                    "abbreviation": "AR"
                },
                {
                    "name": "California",
                    "abbreviation": "CA"
                },
                {
                    "name": "Colorado",
                    "abbreviation": "CO"
                },
                {
                    "name": "Connecticut",
                    "abbreviation": "CT"
                },
                {
                    "name": "Delaware",
                    "abbreviation": "DE"
                },
                {
                    "name": "District Of Columbia",
                    "abbreviation": "DC"
                },
                {
                    "name": "Federated States Of Micronesia",
                    "abbreviation": "FM"
                },
                {
                    "name": "Florida",
                    "abbreviation": "FL"
                },
                {
                    "name": "Georgia",
                    "abbreviation": "GA"
                },
                {
                    "name": "Guam",
                    "abbreviation": "GU"
                },
                {
                    "name": "Hawaii",
                    "abbreviation": "HI"
                },
                {
                    "name": "Idaho",
                    "abbreviation": "ID"
                },
                {
                    "name": "Illinois",
                    "abbreviation": "IL"
                },
                {
                    "name": "Indiana",
                    "abbreviation": "IN"
                },
                {
                    "name": "Iowa",
                    "abbreviation": "IA"
                },
                {
                    "name": "Kansas",
                    "abbreviation": "KS"
                },
                {
                    "name": "Kentucky",
                    "abbreviation": "KY"
                },
                {
                    "name": "Louisiana",
                    "abbreviation": "LA"
                },
                {
                    "name": "Maine",
                    "abbreviation": "ME"
                },
                {
                    "name": "Marshall Islands",
                    "abbreviation": "MH"
                },
                {
                    "name": "Maryland",
                    "abbreviation": "MD"
                },
                {
                    "name": "Massachusetts",
                    "abbreviation": "MA"
                },
                {
                    "name": "Michigan",
                    "abbreviation": "MI"
                },
                {
                    "name": "Minnesota",
                    "abbreviation": "MN"
                },
                {
                    "name": "Mississippi",
                    "abbreviation": "MS"
                },
                {
                    "name": "Missouri",
                    "abbreviation": "MO"
                },
                {
                    "name": "Montana",
                    "abbreviation": "MT"
                },
                {
                    "name": "Nebraska",
                    "abbreviation": "NE"
                },
                {
                    "name": "Nevada",
                    "abbreviation": "NV"
                },
                {
                    "name": "New Hampshire",
                    "abbreviation": "NH"
                },
                {
                    "name": "New Jersey",
                    "abbreviation": "NJ"
                },
                {
                    "name": "New Mexico",
                    "abbreviation": "NM"
                },
                {
                    "name": "New York",
                    "abbreviation": "NY"
                },
                {
                    "name": "North Carolina",
                    "abbreviation": "NC"
                },
                {
                    "name": "North Dakota",
                    "abbreviation": "ND"
                },
                {
                    "name": "Northern Mariana Islands",
                    "abbreviation": "MP"
                },
                {
                    "name": "Ohio",
                    "abbreviation": "OH"
                },
                {
                    "name": "Oklahoma",
                    "abbreviation": "OK"
                },
                {
                    "name": "Oregon",
                    "abbreviation": "OR"
                },
                {
                    "name": "Palau",
                    "abbreviation": "PW"
                },
                {
                    "name": "Pennsylvania",
                    "abbreviation": "PA"
                },
                {
                    "name": "Puerto Rico",
                    "abbreviation": "PR"
                },
                {
                    "name": "Rhode Island",
                    "abbreviation": "RI"
                },
                {
                    "name": "South Carolina",
                    "abbreviation": "SC"
                },
                {
                    "name": "South Dakota",
                    "abbreviation": "SD"
                },
                {
                    "name": "Tennessee",
                    "abbreviation": "TN"
                },
                {
                    "name": "Texas",
                    "abbreviation": "TX"
                },
                {
                    "name": "Utah",
                    "abbreviation": "UT"
                },
                {
                    "name": "Vermont",
                    "abbreviation": "VT"
                },
                {
                    "name": "Virgin Islands",
                    "abbreviation": "VI"
                },
                {
                    "name": "Virginia",
                    "abbreviation": "VA"
                },
                {
                    "name": "Washington",
                    "abbreviation": "WA"
                },
                {
                    "name": "West Virginia",
                    "abbreviation": "WV"
                },
                {
                    "name": "Wisconsin",
                    "abbreviation": "WI"
                },
                {
                    "name": "Wyoming",
                    "abbreviation": "WY"
                }
            ];
        }
        return self;
    }]);
/// <reference path='../common.mdl.ts' />
impakt.common.modals = angular.module('impakt.common.modals', [])
    .config([function () {
        console.debug('impakt.common.modals - config');
    }])
    .run([function () {
        console.debug('impakt.common.modals - run');
    }]);
/// <reference path='./modals.mdl.ts' />
impakt.common.modals.factory('__modals', [
    '$uibModal',
    function ($uibModal) {
        var self = {
            open: open
        };
        function open(size, templateUrl, controllerName, resolveData) {
            console.log('open modal', resolveData);
            for (var key in resolveData) {
                if (typeof resolveData[key] != 'function') {
                    throw Error(['Modal resolve data must be given ',
                        'as an anonymous function which ',
                        'returns a value.',
                        ' | key: ', key,
                        ' | data: ', resolveData[key]
                    ].join(''));
                }
            }
            return $uibModal.open({
                animation: true,
                backdrop: true,
                size: size,
                templateUrl: templateUrl,
                controller: controllerName,
                resolve: resolveData
            });
        }
        return self;
    }]);
/// <reference path='../common.mdl.ts' />
impakt.common.notifications = angular.module('impakt.common.notifications', [])
    .config([function () {
        console.debug('impakt.common.notifications - config');
    }])
    .run([function () {
        console.debug('impakt.common.notifications - run');
    }]);
/// <reference path='./notifications.mdl.ts' />
impakt.common.notifications.controller('notifications.ctrl', [
    '$scope',
    '__notifications',
    function ($scope, __notifications) {
        $scope.notifications = __notifications.notifications;
        $scope.notificationTypes = __notifications.notificationTypes;
        $scope.test = function () {
            var index = Math.floor((Math.random() * $scope.notificationTypes.length));
            __notifications.notify('test notification!', index);
        };
        $scope.clearAll = function () {
            __notifications.removeAll();
        };
        $scope.remove = function (guid) {
            __notifications.remove(guid);
        };
    }]).directive('notifications', [
    '$compile', '__notifications',
    function ($compile, __notifications) {
        return {
            restrict: 'E',
            templateUrl: 'common/notifications/notifications.tpl.html',
            controller: 'notifications.ctrl',
            link: function ($scope, $element, attrs) {
            }
        };
    }])
    .directive('notificationItem', [function () {
        return {
            restrict: 'E',
            templateUrl: 'common/notifications/notification-item.tpl.html',
            controller: 'notifications.ctrl',
            link: function ($scope, $element, attrs) {
                var css = '';
                switch (attrs.type) {
                }
            }
        };
    }]);
/// <reference path='./notifications.mdl.ts' />
impakt.common.notifications.service('__notifications', [
    function () {
        this.notifications = new Common.Models.NotificationCollection();
        this.notificationTypes = Common.Utilities.getEnumerationsAsArray(Common.Models.NotificationType);
        /**
         * Removes ("Clears") all notifications
         */
        this.removeAll = function () {
            this.notifications.removeAll();
        };
        /**
         * Removes the given notification by guid
         * @param  {string}                     guid Guid of notification to remove
         * @return {Common.Models.Notification}      The removed notification
         */
        this.remove = function (guid) {
            return this.notifications.remove(guid);
        };
        /**
         * Creates a new notification with the given message and type
         * @param  {string}                         message The message to notify
         * @param  {Common.Models.NotificationType} type    The type of notification to display
         * @return {Common.Models.Notification}             The created notification
         */
        this.notify = function (message, type) {
            var notificationModel = new Common.Models.Notification(message, type);
            this.notifications.add(notificationModel);
            return notificationModel;
        };
        /**
         * Shorthand for creating a success notification
         * @param  {string}                     ...args Message strings to be concatenated
         * @return {Common.Models.Notification}         New notification created
         */
        this.success = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return this.notify(_concat(args), Common.Models.NotificationType.Success);
        };
        /**
         * Shorthand for creating an error notification
         * @param  {string}                     ...args Message strings to be concatenated
         * @return {Common.Models.Notification}         New notification created
         */
        this.error = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return this.notify(_concat(args), Common.Models.NotificationType.Error);
        };
        /**
         * Shorthand for creating a warning notification
         * @param  {string}                     ...args Message strings to be concatenated
         * @return {Common.Models.Notification}         New notification created
         */
        this.warning = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return this.notify(_concat(args), Common.Models.NotificationType.Warning);
        };
        /**
         * Shorthand for creating an info notification
         * @param  {string}                     ...args Message strings to be concatenated
         * @return {Common.Models.Notification}         New notification created
         */
        this.info = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return this.notify(_concat(args), Common.Models.NotificationType.Info);
        };
        /**
         * Shorthand for creating a pending notification; this will display a spinner
         * graphic to indicate that it is in progress (TO-DO).
         * @param  {string}                     ...args Message strings to be concatenated
         * @return {Common.Models.Notification}         New notification created
         */
        this.pending = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return this.notify(_concat(args), Common.Models.NotificationType.Pending);
        };
        function _concat(args) {
            return !args || !args.length || args.length <= 0 ? '' : args.join('');
        }
    }
]);
/// <reference path='../common.mdl.ts' />
impakt.common.parser = angular.module('impakt.common.parser', [])
    .config(function () {
    console.debug('impakt.common.parser - config');
})
    .run(function () {
    console.debug('impakt.common.parser - run');
});
/// <reference path='./parser.mdl.ts' />
impakt.common.parser.constant('PARSER', {});
/// <reference path='./parser.mdl.ts' />
impakt.common.parser.factory('__parser', [
    'PARSER',
    function (PARSER) {
        var self = {
            camelCaseToSpace: camelCaseToSpace,
            convertEnumToList: convertEnumToList,
            toJson: toJson
        };
        function camelCaseToSpace(str, capitalizeFirst) {
            return Common.Utilities.camelCaseToSpace(str, capitalizeFirst);
        }
        function convertEnumToList(obj) {
            return Common.Utilities.convertEnumToList(obj);
        }
        /**
         * takes a complex javascript object
         * (containing primitives, objects & functions)
         * and returns a json object containing entries
         * which are explicitly defined by the object's
         * implementation of a 'toJson()' method.
         *
         * If the object does not implement a 'toJson()' method,
         * the object returned by this method will be null.
         *
         * If the object contains child objects, each child object
         * will be recursively searched for a 'toJson()' method, and
         * the same logic is applied.
         *
         * Functions stored within the json object will be dropped.
         */
        function toJson(obj) {
            return Common.Utilities.toJson(obj);
        }
        return self;
    }]);
/// <reference path='../common.mdl.ts' />
impakt.common.scrollable = angular.module('impakt.common.scrollable', [])
    .config(function () {
    console.debug('impakt.common.scrollable - config');
})
    .run(function () {
    console.debug('impakt.common.scrollable - run');
});
///<reference path='./scrollable.mdl.ts' />
impakt.common.scrollable.directive('scrollable', ['_scrollable', function (_scrollable) {
        console.debug('directive: impakt.common.scrollable - register');
        return {
            restrict: 'A',
            link: function ($scope, $element, attrs) {
                console.log('scrollable element');
            }
        };
    }]);
/// <reference path='./scrollable.mdl.ts' />
impakt.common.scrollable.service('_scrollable', ['$rootScope', function ($rootScope) {
        console.debug('service: impakt.common.scrollable');
        var self = this;
        var down, up;
        this.$container;
        this.$head;
        this.headHeight;
        this.$well;
        this.content;
        this.contentHeight;
        this.HEIGHT_RATIO;
        this.deltaY;
        this.deltaX;
        this.offsetY;
        this.deltaRatioY;
        this.offsetX;
        this.deltaRatioX;
        this.speed;
        this.range;
        this.altKeyPressed;
        this.speed;
        this.thresholdX = 10;
        this.thresholdY = 10;
        this.readyCallback = function () {
            console.log('scrollable ready');
        };
        this.scrollCallback = function (x, y) {
            //console.log('scrolling...');
        };
        this.initialize = function ($container, content) {
            this.altKeyPressed = false;
            // main container window and inner content
            this.$container = $container;
            this.height = $container.height();
            this.content = content;
            this.contentHeight = content.getHeight();
            this.HEIGHT_RATIO = this.height / this.contentHeight;
            // console.log(
            // 	'container height: ', this.height, 
            // 	'content height: ', this.contentHeight, 
            // 	'ratio: ', this.HEIGHT_RATIO
            // );
            this.$head = $("<div class='scroll-head'></div>");
            this.$well = $("<div class='scroll'></div>").append(this.$head);
            this.$container.find('.scroll').remove();
            this.$container.addClass('scrollable-container').append(this.$well);
            this.offsetY = 0;
            this.offsetX = 0;
            this.deltaY = 0;
            this.deltaX = 0;
            this.speed = 0.25; // must be between 0 and 1!
            if (this.speed < 0 || this.speed > 1) {
                throw new Error('scroll speed must be between 0 and 1');
            }
            this.deltaRatioY = 0;
            this.deltaRatioX = 0;
            this.headHeight = Math.ceil(this.HEIGHT_RATIO * this.height);
            this.$head.height(this.headHeight);
            this.headOffsetY = 0;
            this.headOffsetX = 0;
            console.log('container height: ', this.height, 'head height: ', this.headHeight);
            this.range = this.contentHeight - this.height;
            this.headRange = this.height - this.headHeight;
            down = false;
            up = false;
            // set the event listener to the mousewheel event
            this.setListener();
            this.ready();
        };
        this.setListener = function () {
            this.$head.draggable({
                axis: 'y',
                containment: '.scrollable-container .scroll',
                drag: function (event, ui) {
                    // TODO implement
                }
            });
            this.$container[0].addEventListener('mousewheel', function (event) {
                self.scroll.call(self, event.wheelDeltaX, event.wheelDeltaY, event.altKey);
            }, false);
        };
        this.isDown = function () {
            return down && self.offsetY > -self.range;
        };
        this.isUp = function () {
            return up && self.offsetY < 0;
        };
        this.canScroll = function () {
            return this.isDown() || this.isUp();
        };
        this.setHead = function (x, y) {
            this.$head.css({ 'top': y + 'px' });
        };
        this.onready = function (callback) {
            this.readyCallback = callback;
        };
        this.ready = function () {
            this.readyCallback(this.content);
        };
        this.onscroll = function (callback) {
            this.scrollCallback = callback;
        };
        this.scrollToPercentY = function (percentY) {
            if (percentY < 0 || percentY > 1)
                throw new Error('Percent must be between 0 and 1');
            this.headOffsetY = percentY * this.headRange;
            this.offsetY = -percentY * this.range;
            this.setHead(0, this.headOffsetY);
            this.content.scroll(this.offsetX, -this.offsetY);
        };
        this.scrollToPercentX = function (percentX) {
            // TODO implement
        };
        this.scrollToPercent = function (percentX, percentY) {
            this.scrollToPercentX(percentX);
            this.scrollToPercentY(percentY);
        };
        this.scroll = function (deltaX, deltaY, altKeyPressed) {
            /**
             * Seeks to prevent micro-scroll events during clicks / drags
             * from causing glitchy field shifting
             */
            if (Math.abs(deltaX) < self.thresholdX &&
                Math.abs(deltaY) < self.thresholdY)
                return;
            self.deltaX = deltaX;
            self.deltaY = deltaY;
            self.altKeyPressed = altKeyPressed;
            self.deltaRatioX = new Number(self.deltaX * self.HEIGHT_RATIO).toFixed(1);
            self.deltaRatioY = new Number(self.deltaY * self.HEIGHT_RATIO).toFixed(1);
            down = self.deltaY < 0;
            up = !down;
            if (!self.altKeyPressed) {
                if (self.canScroll()) {
                    var scrollDistanceY = self.offsetY + (self.deltaY * self.speed);
                    var scrollableY = self.isDown() ?
                        Math.max(scrollDistanceY, -self.range) :
                        Math.min(scrollDistanceY, 0);
                    if (scrollableY < -self.range ||
                        scrollableY > 0)
                        return;
                    self.headOffsetY = -scrollableY * self.HEIGHT_RATIO;
                    self.offsetY = scrollableY;
                    self.setHead.call(self, 0, self.headOffsetY);
                    self.content.scroll(self.offsetX, -self.offsetY);
                }
                else {
                    console.log('STOP');
                }
            }
            else {
            }
            this.scrollCallback(deltaX, deltaY);
        };
    }]);
/// <reference path='../common.mdl.ts' />
impakt.common.signin = angular.module('impakt.common.signin', [])
    .config([function () {
        console.debug('impakt.common.signin - config');
    }])
    .run([function () {
        console.debug('impakt.common.signin - run');
    }]);
/// <reference path='./signin.mdl.ts' />
impakt.common.signin.constant('SIGNIN', {
    'ORG_ENDPOINT': '/configuration',
    'INVITE_ENDPOINT': '/invitations',
    'REGISTER_USER': '/registerUser',
    'CREATE_ORGANIZATION': '/createOrganization'
});
/// <reference path='./signin.mdl.ts' />
impakt.common.signin.controller('signin.ctrl', ['$scope', '__signin', '__locale',
    function ($scope, __signin, __locale) {
        $scope.showSignin = true;
        $scope.showRegister = false;
        $scope.states = __locale.states;
        $scope.signinData = {
            username: '',
            password: ''
        };
        // $scope.user = new User.Models.UserModel();
        // $scope.user.firstName = 'Danny';
        // $scope.user.lastName = 'Bullis';
        // $scope.user.email = 'daniel.p.bullis@gmail.com';
        // $scope.user.organizationName = 'Test organization';
        $scope.signinMessage = '';
        $scope.organization = new User.Models.Organization();
        $scope.account = new User.Models.Account();
        $scope.toggleSignin = function (show) {
            $scope.showSignin = show === true ? show : !$scope.showSignin;
            $scope.showRegister = !$scope.showSignin;
        };
        $scope.toggleRegister = function (show) {
            $scope.showRegister = show === true ? show : !$scope.showRegister;
            $scope.showSignin = !$scope.showRegister;
        };
        $scope.createUser = function (next) {
            console.log('creating user');
            __signin.registerUser($scope.user)
                .then(function (results) {
                console.log('user created', results);
            }, function (err) {
                console.error(err);
            });
        };
        $scope.createOrganization = function (next) {
            console.log('creating organization');
            __signin.createOrganization($scope.organization)
                .then(function (results) {
                console.log('organization created', results);
            }, function (err) {
                console.error(err);
            });
            next();
        };
        $scope.createAccount = function (next) {
            console.log('creating account');
            next();
        };
        $scope.signin = function () {
            __signin.signin($scope.signinData.username, $scope.signinData.password).then(function (results) {
                $scope.signinMessage = 'signin successful.';
            }, function (err) {
                $scope.signinMessage = err && err.data && err.data.error_description || err;
            });
        };
        $scope.register = function () {
        };
    }]);
/// <reference path='./signin.mdl.ts' />
impakt.common.signin.factory('__signin', [
    '$q',
    '$window',
    '__api',
    '__auth',
    '__localStorage',
    'SIGNIN',
    function ($q, $window, __api, __auth, __localStorage, SIGNIN) {
        var self = {
            signin: signin,
            logout: logout,
            registerUser: registerUser,
            createOrganization: createOrganization
        };
        function signin(username, password) {
            var d = $q.defer();
            // send a handshake
            __auth.getToken(username, password).then(function (data) {
                console.log(data);
                __localStorage.setAccessToken(data.data);
                $window.location.href = 'index.html';
                d.resolve(data);
            }, function (err) {
                console.error(err);
                d.reject(err);
            });
            return d.promise;
        }
        function logout() {
            __localStorage.signout();
            $window.location.href = 'signin.html';
        }
        /**
         * Takes the given user information (first, last, email, org name)
         * and sends an registration confirmation email (invite) to the user
         * @param {User.Models.UserModel} userModel user to register
         */
        function registerUser(userModel) {
            var d = $q.defer();
            var userModelJson = userModel.toJson();
            __api.post(__api.path(SIGNIN.INVITE_ENDPOINT, SIGNIN.REGISTER_USER), {
                version: 1,
                FirstName: userModel.firstName,
                LastName: userModel.lastName,
                OrganizationKey: 0,
                OrganizationName: userModel.organizationName,
                Email: userModel.email,
                data: {
                    version: 1,
                    FirstName: userModel.firstName,
                    LastName: userModel.lastName,
                    OrganizationKey: 0,
                    OrganizationName: userModel.organizationName,
                    Email: userModel.email,
                    user: userModelJson
                }
            }).then(function (results) {
                // TODO - @theBull handle register user results
                d.resolve(results);
            }, function (error) {
                d.reject(error);
            });
            return d.promise;
        }
        function createOrganization(organization) {
            var d = $q.defer();
            var organizationJson = organization.toJson();
            __api.post(__api.path(SIGNIN.ORG_ENDPOINT, SIGNIN.CREATE_ORGANIZATION), {
                version: 1,
                data: {
                    version: 1,
                    organization: organizationJson
                }
            }).then(function (response) {
                var results = Common.Utilities.parseData(response.data.results);
                var createdOrganization = new User.Models.Organization();
                if (results) {
                    createdOrganization.fromJson(results);
                }
                else {
                    d.reject(null);
                }
                d.resolve(createdOrganization);
            }, function (err) {
                d.reject(err);
            });
            return d.promise;
        }
        return self;
    }]);
/// <reference path='../common.mdl.ts' />
impakt.common.ui = angular.module('impakt.common.ui', [
    'impakt.quotes'
])
    .config([function () {
        console.debug('impakt.common.ui - config');
    }])
    .run([function () {
        console.debug('impakt.common.ui - run');
    }]);
/// <reference path='../ui.mdl.ts' />
impakt.common.ui.controller('appLoading.ctrl', [
    '$scope',
    '$timeout',
    '__context',
    '__notifications',
    function ($scope, $timeout, __context, __notifications) {
        $scope.$element;
        $scope.visible = false;
        $scope.notifications = __notifications.notifications;
        $scope.notification;
        $scope.notifications.onModified(function (collection) {
            $scope.notification = collection.getLast();
        });
        __context.onInitializing(function () {
            $scope.visible = true;
        });
        __context.onReady(function () {
            // simulate a slight delay to let the user
            // see that all of their data has been loaded
            // before removing the loading screen
            $timeout(function () {
                $scope.visible = false;
            }, 1000);
        });
    }])
    .directive('appLoading', [
    function () {
        return {
            restrict: 'E',
            templateUrl: 'common/ui/app-loading/app-loading.tpl.html',
            transclude: true,
            replace: true,
            controller: 'appLoading.ctrl',
            link: function ($scope, $element, attrs) {
                $scope.$element = $element;
            }
        };
    }]);
/// <reference path='../ui.mdl.ts' />
impakt.common.ui.controller('assignmentGroupItem.ctrl', [
    '$scope',
    '_playbook',
    '_details',
    function ($scope, _playbook, _details) {
        $scope.assignmentGroup;
        $scope.element;
        /**
         *
         *	Item selection
         *
         */
        $scope.toggleSelection = function (assignmentGroup) {
            impakt.context.Playbook.assignmentGroups.toggleSelect(assignmentGroup);
            if (assignmentGroup.selected) {
                _details.selectedElements.only(assignmentGroup);
            }
            else {
                _details.selectedElements.remove(assignmentGroup.guid);
            }
        };
    }]).directive('assignmentGroupItem', [
    function () {
        /**
         * assignment-group-item directive
         */
        return {
            restrict: 'E',
            controller: 'assignmentGroupItem.ctrl',
            scope: {
                assignmentGroup: '=assignmentgroup'
            },
            templateUrl: 'common/ui/assignment-group-item/assignment-group-item.tpl.html',
            transclude: true,
            replace: true,
            link: function ($scope, $element, attrs) {
                $scope.$element = $element;
            }
        };
    }]);
/// <reference path='../ui.mdl.ts' />
impakt.common.ui.directive('details', [
    function () {
        return {
            restrict: 'E',
            compile: function ($element, attrs) {
                return {
                    pre: function ($scope, $element, attrs, controller, transcludeFn) {
                    },
                    post: function ($scope, $element, attrs, controller, transcludeFn) {
                    }
                };
            }
        };
    }]);
/// <reference path='../ui.mdl.ts' />
impakt.common.ui.controller('expandable.ctrl', [
    '$scope',
    function ($scope) {
        $scope.direction;
        $scope.min = 3; // in em's
        $scope.max = 32; // in em's
        $scope.$element;
        $scope.em = parseInt($('body').css('font-size'));
        $scope.collapsed = true;
        $scope.ready = false;
        $scope.url;
        $scope.handle = {
            position: '',
            collapsed: '',
            expanded: '',
            class: ''
        };
        $scope.toggle = function () {
            $scope.collapsed = !$scope.collapsed;
            if ($scope.collapsed) {
                $scope.$element.removeClass($scope.getMaxClass()).addClass($scope.getMinClass());
            }
            else {
                $scope.$element.removeClass($scope.getMinClass()).addClass($scope.getMaxClass());
            }
            $scope.setHandleClass();
        };
        $scope.getMinClass = function () {
            return 'width' + $scope.min;
        };
        $scope.getMaxClass = function () {
            return 'width' + $scope.max;
        };
        $scope.getInitialClass = function () {
            return $scope.collapsed ? $scope.getMinClass() : $scope.getMaxClass();
        };
        $scope.setInitialClass = function () {
            $scope.$element.addClass($scope.getInitialClass());
        };
        $scope.initializeToggleHandle = function () {
            switch ($scope.direction) {
                case 'left':
                    $scope.handle.position = 'top0 left0';
                    $scope.handle.expanded = 'glyphicon-chevron-right';
                    $scope.handle.collapsed = 'glyphicon-chevron-left';
                    break;
                case 'right':
                    $scope.handle.position = 'top0 right0';
                    $scope.handle.expanded = 'glyphicon-chevron-left';
                    $scope.handle.collapsed = 'glyphicon-chevron-right';
                    break;
                case 'top':
                    $scope.handle.position = 'top0 left0';
                    $scope.handle.expanded = 'glyphicon-chevron-up';
                    $scope.handle.collapsed = 'glyphicon-chevron-down';
                    break;
                case 'bottom':
                    $scope.handle.position = 'bottom0 left0';
                    $scope.handle.expanded = 'glyphicon-chevron-down';
                    $scope.handle.collapsed = 'glyphicon-chevron-up';
                    break;
            }
            $scope.setHandleClass();
        };
        $scope.setHandleClass = function () {
            $scope.handle.class = $scope.collapsed ?
                $scope.handle.collapsed : $scope.handle.expanded;
        };
        /**
         * Deprecated
         * @param {[type]} value [description]
         */
        $scope.getWidth = function (value) {
            return $scope.em * parseInt(value);
        };
        /**
         * Deprecated
         */
        $scope.getInitialWidth = function () {
            return $scope.collapsed ?
                $scope.getWidth($scope.min) :
                $scope.getWidth($scope.max);
        };
    }]).directive('expandable', [
    '$compile',
    function ($compile) {
        return {
            restrict: 'E',
            controller: 'expandable.ctrl',
            transclude: true,
            replace: true,
            templateUrl: 'common/ui/expandable/expandable.tpl.html',
            scope: {
                collapsed: '=?',
                direction: '@',
                url: '@'
            },
            compile: function ($element, attrs) {
                return {
                    pre: function ($scope, $element, attrs, controller, transcludeFn) {
                        $scope.$element = $element;
                        /**
                         * Set initial class on the element for proper sizing
                         */
                        $scope.setInitialClass();
                        $scope.ready = true;
                    },
                    post: function ($scope, $element, attrs, controller, transcludeFn) {
                    }
                };
            }
        };
    }])
    .directive('expandableToggle', [
    function () {
        return {
            restrict: 'E',
            controller: 'expandable.ctrl',
            transclude: true,
            replace: true,
            require: '^expandable',
            template: "<div class='width3 pad {{handle.position}} \
			gray-bg-3-hover pointer font- white'\
			ng-click='toggle()'>\
				<div class='glyphicon {{handle.class}}'></div>\
			</div>'",
            compile: function ($element, attrs) {
                return {
                    pre: function ($scope, $element, attrs, controller, transcludeFn) {
                    },
                    post: function ($scope, $element, attrs, controller, transcludeFn) {
                        /**
                         * Initialize the toggle handle
                         */
                        $scope.initializeToggleHandle();
                    }
                };
            }
        };
    }
]);
/// <reference path='../ui.mdl.ts' />
impakt.common.ui.controller('formationItem.ctrl', [
    '$scope',
    '_playbook',
    '_details',
    function ($scope, _playbook, _details) {
        $scope.play;
        $scope.element;
        /**
         *
         *	Item selection
         *
         */
        $scope.toggleSelection = function (formation) {
            impakt.context.Playbook.formations.toggleSelect(formation);
            if (formation.selected) {
                _details.selectedElements.only(formation);
            }
            else {
                _details.selectedElements.remove(formation.guid);
            }
        };
        $scope.openInEditor = function (formation) {
            _playbook.editFormation(formation);
        };
    }]).directive('formationItem', [
    function () {
        /**
         * play-item directive
         */
        return {
            restrict: 'E',
            controller: 'formationItem.ctrl',
            scope: {
                formation: '='
            },
            templateUrl: 'common/ui/formation-item/formation-item.tpl.html',
            transclude: true,
            replace: true,
            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink($scope, $element, attrs, controller) { },
                    post: function postLink($scope, $element, attrs, controller) {
                        $scope.$element = $element;
                    }
                };
            }
        };
    }]);
/// <reference path='../ui.mdl.ts' />
impakt.common.ui.controller('formationPreview.ctrl', [
    '$scope', '$timeout', function ($scope, $timeout) {
        $scope.previewCanvas;
        $scope.play;
        $scope.formation;
        $scope.$element;
        $scope.isModified = true;
        $scope.modificationTimer;
        $scope.refresh = function () {
            if (!$scope.formation)
                throw new Error('formation-preview refresh(): Formation is null or undefined');
            if (!$scope.previewCanvas)
                throw new Error('formation-preview refresh(): PreviewCanvas is null or undefined');
            if (!$scope.$element)
                throw new Error('formation-preview refresh(): $element is null or undefined');
            $scope.$element.find('svg').show();
            $scope.previewCanvas.refresh();
            $scope.formation.png = $scope.previewCanvas.exportToPng();
            $scope.isModified = false;
            var scrollTop = $scope.previewCanvas.paper.field.getLOSAbsolute()
                - ($scope.$element.height() / 2);
            $scope.$element.scrollTop(scrollTop);
            if ($scope.modificationTimer)
                $timeout.cancel($scope.modificationTimer);
        };
    }]).directive('formationPreview', [
    '$timeout',
    function ($timeout) {
        /**
         * formation-preview directive renders an SVG preview canvas
         * with the given formation data.
         */
        return {
            restrict: 'E',
            controller: 'formationPreview.ctrl',
            scope: {
                formation: '='
            },
            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink($scope, $element, attrs, controller) { },
                    post: function postLink($scope, $element, attrs, controller) {
                        $scope.$element = $element;
                        /**
                         *
                         * Set up the play data to render the formation
                         *
                         */
                        if (!Common.Utilities.isNullOrUndefined($scope.formation)) {
                            // check to see if the formation is being edited; 
                            // in which case a temporary play has already been constructed
                            // 
                            // NOTE: if the play does not exist in the formations context,
                            // it SHOULD NOT exist in the editor context.
                            var editorPlay = impakt.context.Playbook.editor.plays.filterFirst(function (play, index) {
                                // - the play must have editorType: formation
                                // - the play must have a formation
                                // - the play formation guid must match the scope guid
                                return play.editorType == Playbook.Enums.EditorTypes.Formation &&
                                    !Common.Utilities.isNullOrUndefined(play.formation) &&
                                    play.formation.guid == $scope.formation.guid;
                            });
                            if (!Common.Utilities.isNullOrUndefined(editorPlay)) {
                                // there is a temp. play existing in the editor context,
                                // so let's use that play to render the preview
                                $scope.play = editorPlay;
                            }
                            else {
                                // no play has been found to contain the formation,
                                // draw a new play to render the preview
                                $scope.play = new Common.Models.Play($scope.formation.unitType);
                                $scope.play.setFormation($scope.formation);
                            }
                            if (Common.Utilities.isNullOrUndefined($scope.play))
                                throw new Error('formation-preview post(): Play is null or undefined');
                            $scope.play.editorType = Playbook.Enums.EditorTypes.Formation;
                            // create a previewCanvas to handle preview creation. Creating
                            // a previewCanvas will insert a SVG into the <formation-preview/> element
                            // after the intialization phase.
                            $scope.previewCanvas = new Playbook.Models.PreviewCanvas($scope.play, null);
                        }
                        else {
                            // if there's no formation at this point, there's a problem
                            throw new Error('formation-preview post(): Unable to find formation');
                        }
                        $scope.formation.onModified(function () {
                            $scope.isModified = true;
                            if ($scope.modificationTimer)
                                $timeout.cancel($scope.modificationTimer);
                            $scope.modificationTimer = $timeout(function () {
                                console.log('auto refresh based on user changes');
                                $scope.refresh();
                            }, 500);
                        });
                        /**
                         *
                         * NOTE: Due to the way angular renders directives,
                         * we have to wrap DOM-dependent code in a $timeout.
                         *
                         */
                        $timeout(function () {
                            if ($scope.previewCanvas) {
                                $scope.previewCanvas.onready(function () {
                                    var scrollTop = $scope.previewCanvas.paper.field.getLOSAbsolute()
                                        - ($scope.$element.height() / 2);
                                    $scope.$element.scrollTop(scrollTop);
                                });
                                $scope.previewCanvas.initialize($element);
                                /**
                                 * Set the base64 encoded PNG string on the formation
                                 */
                                $scope.formation.png = $scope.previewCanvas.exportToPng();
                            }
                        }, 0);
                    }
                };
            }
        };
    }]);
/// <reference path='../ui.mdl.ts' />
impakt.common.ui.controller('formationThumbnail.ctrl', [
    '$scope', function ($scope) {
        $scope.formation;
    }]).directive('formationThumbnail', [
    function () {
        return {
            restrict: 'E',
            controller: 'formationThumbnail.ctrl',
            scope: {
                formation: '='
            },
            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink($scope, $element, attrs, controller) { },
                    post: function postLink($scope, $element, attrs, controller) {
                        $scope.$element = $element;
                        // get height of $element
                        var elementHeight = $element.height();
                        var img = document.createElement('img');
                        img.src = $scope.formation.png;
                        var $img = $(img);
                        $scope.$element.append($img);
                        img.addEventListener('load', function () {
                            var imgHeight = $img.height();
                            var imgOffsetTop = (-(imgHeight * 0.5) + (elementHeight / 2)) + 'px';
                            $img.css({ 'top': imgOffsetTop });
                        }, false);
                    }
                };
            }
        };
    }]);
/// <reference path='../ui.mdl.ts' />
/**
 * DESCRIPTION:
 * will take the enumerated "value" and the
 * fully-namespaced path to the enumeration object aka "type"
 * and will format the enumerated value as a string label
 * mapped to that enumerated value.
 *
 * I.e.
 * type: Team.Enums.UnitTypes
 * value: 3
 * result: "Offense"
 *
 * REQUIRED:
 * type: Namespaced location of enum "Playbook.Enums.EditorTypes"
 * value: Actual enumerated value
 */
impakt.common.ui.controller('typeFormatter.ctrl', [
    '$scope', function ($scope) {
        $scope.parseValue = function ($element) {
            // i.e. "['Playbook', 'Editor', 'EditorTypes']"
            var namespaceComponents = $scope.type.split('.');
            // Drill down into namespace -> window['Playbook']['Editor']['EditorTypes']
            // returns enum object
            var namespaceRoot = window;
            for (var i = 0; i < namespaceComponents.length; i++) {
                if (namespaceComponents[i]) {
                    // Follow the namespace path down to the node object
                    // window['Playbook']...
                    // window['Playbook']['Editor']...
                    // window['Playbook']['Editor']['EditorTypes']
                    // node reached, namespaceRoot will finally point to the node object
                    namespaceRoot = namespaceRoot[namespaceComponents[i]];
                }
            }
            // Get the enumeration list {enum: "Label"} || {number: string}
            var enumList = Common.Utilities.convertEnumToList(namespaceRoot);
            if (enumList) {
                // if it has values, get the Label string for the enum
                // and append it inside of the directive element
                var enumLabel = enumList[$scope.value];
                if (enumLabel) {
                    $element.html(enumLabel);
                }
            }
        };
    }]).directive('typeFormatter', [function () {
        return {
            restrict: 'E',
            controller: 'typeFormatter.ctrl',
            scope: {
                'value': '=',
                'type': '@'
            },
            link: function ($scope, $element, attrs) {
                if (!attrs.type) {
                    throw new Error('type-formatter directive: \
					A valid "type" attribute must be present on the element, \
					which is the fully namespaced type of the enum to evaluate.');
                }
                if (!attrs.value) {
                    throw new Error('type-formatter directive: \
					A valid "value" attribute must be present on the element, \
					which is the enum value to retrieve the string for.');
                }
                $scope.parseValue($element);
                $scope.$watch('value', function (oldVal, newVal) {
                    $scope.parseValue($element);
                });
            }
        };
    }]);
/// <reference path='../ui.mdl.ts' />
impakt.common.ui.controller('grid.ctrl', [
    '$scope',
    '_details',
    function ($scope, _details) {
        $scope.play;
        $scope.element;
    }]).directive('grid', [
    function () {
        /**
         * play-item directive
         */
        return {
            restrict: 'E',
            controller: 'grid.ctrl',
            scope: {
                element: '='
            },
            templateUrl: '',
            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink($scope, $element, attrs, controller) { },
                    post: function postLink($scope, $element, attrs, controller) {
                        $scope.$element = $element;
                    }
                };
            }
        };
    }]);
/// <reference path='../ui.mdl.ts' />
impakt.common.ui.controller('playItem.ctrl', [
    '$scope',
    '_details',
    '_playbook',
    function ($scope, _details, _playbook) {
        $scope.play;
        $scope.element;
        /**
         *
         *	Item selection
         *
         */
        $scope.toggleSelection = function (play) {
            impakt.context.Playbook.plays.toggleSelect(play);
            if (play.selected) {
                _details.selectedElements.only(play);
            }
            else {
                _details.selectedElements.remove(play.guid);
            }
        };
        $scope.openInEditor = function (play) {
            _playbook.editPlay(play);
        };
    }]).directive('playItem', [
    function () {
        /**
         * play-item directive
         */
        return {
            restrict: 'E',
            controller: 'playItem.ctrl',
            scope: {
                play: '='
            },
            templateUrl: 'common/ui/play-item/play-item.tpl.html',
            transclude: true,
            replace: true,
            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink($scope, $element, attrs, controller) { },
                    post: function postLink($scope, $element, attrs, controller) {
                        $scope.$element = $element;
                    }
                };
            }
        };
    }]);
/// <reference path='../ui.mdl.ts' />
impakt.common.ui.controller('playPreview.ctrl', [
    '$scope', '$timeout', function ($scope, $timeout) {
        $scope.previewCanvas;
        $scope.play;
        $scope.$element;
        $scope.isModified = true;
        $scope.modificationTimer;
        $scope.refresh = function () {
            if (!$scope.play)
                throw new Error('play-preview refresh(): Play is null or undefined');
            if (!$scope.previewCanvas)
                throw new Error('play-preview refresh(): PreviewCanvas is null or undefined');
            if (!$scope.$element)
                throw new Error('play-preview refresh(): $element is null or undefined');
            $scope.$element.find('svg').show();
            $scope.previewCanvas.refresh();
            $scope.play.png = $scope.previewCanvas.exportToPng();
            $scope.isModified = false;
            var scrollTop = $scope.previewCanvas.paper.field.getLOSAbsolute() - ($scope.$element.height() / 2);
            $scope.$element.scrollTop(scrollTop);
            if ($scope.modificationTimer)
                $timeout.cancel($scope.modificationTimer);
        };
    }]).directive('playPreview', [
    '$timeout',
    function ($timeout) {
        /**
         * play-preview directive renders an SVG preview canvas
         * with the given play data.
         */
        return {
            restrict: 'E',
            controller: 'playPreview.ctrl',
            scope: {
                play: '='
            },
            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink($scope, $element, attrs, controller) { },
                    post: function postLink($scope, $element, attrs, controller) {
                        $scope.$element = $element;
                        // create a previewCanvas to handle preview creation. Creating
                        // a previewCanvas will insert a SVG into the <play-preview/> element
                        // after the intialization phase.
                        if (!Common.Utilities.isNullOrUndefined($scope.play)) {
                            $scope.previewCanvas = new Playbook.Models.PreviewCanvas($scope.play, null);
                        }
                        else {
                            // if there's no play at this point, there's a problem
                            throw new Error('play-preview link(): Unable to find play');
                        }
                        $scope.play.onModified(function () {
                            $scope.isModified = true;
                            if ($scope.modificationTimer)
                                $timeout.cancel($scope.modificationTimer);
                            $scope.modificationTimer = $timeout(function () {
                                console.log('auto refresh based on user changes');
                                $scope.refresh();
                            }, 200);
                        });
                        /**
                         *
                         * NOTE: Due to the way angular renders directives,
                         * we have to wrap DOM-dependent code in a $timeout.
                         *
                         */
                        $timeout(function () {
                            if ($scope.previewCanvas) {
                                $scope.previewCanvas.onready(function () {
                                    var scrollTop = $scope.previewCanvas.paper.field.getLOSAbsolute()
                                        - ($scope.$element.height() / 2);
                                    $scope.$element.scrollTop(scrollTop);
                                });
                                $scope.previewCanvas.initialize($element);
                                $scope.play.png = $scope.previewCanvas.exportToPng();
                            }
                        }, 0);
                    }
                };
            }
        };
    }]);
/// <reference path='../ui.mdl.ts' />
impakt.common.ui.service('_playPreview', [function () {
        var self = this;
        this.viewBox = '';
        this.setViewBox = function (x, y, width, height) {
            this.viewBox = [
                x, ' ',
                y, ' ',
                width, ' ',
                height
            ].join('');
        };
        /**
         * Compresses a SVG element into a string for storage.
         * The SVG element is encoded into a base64 string before
         * compression.
         * @param {HTMLElement} svg The element to compress
         */
        this.compress = function (svg) {
            return Common.Utilities.compressSVG(svg);
        };
        /**
         * Decompresses a compressed SVG element string; assumes
         * the decompressed string is base64 encoded, so it decodes
         * the decompressed string before returning the stringified SVG element.
         * @param  {string} compressed The string to decmopress
         * @return {string}            a stringified SVG element
         */
        this.decompress = function (compressed) {
            return Common.Utilities.decompressSVG(compressed);
        };
        function serialize(svg) {
            // take SVG HTML and convert into string
            return Common.Utilities.serializeXMLToString(svg);
        }
        function toBase64(svgString) {
            return Common.Utilities.toBase64(svgString);
        }
        function fromBase64(base64Svg) {
            return Common.Utilities.fromBase64(base64Svg);
        }
        function compress(svg) {
            return Common.Utilities.compress(svg);
        }
        function decompress(compressed) {
            return Common.Utilities.decompress(compressed);
        }
        /**
         * TO-DO: store in local db
         */
    }]);
/// <reference path='../ui.mdl.ts' />
impakt.common.ui.controller('playThumbnail.ctrl', [
    '$scope', function ($scope) {
        $scope.play;
    }]).directive('playThumbnail', [
    function () {
        return {
            restrict: 'E',
            controller: 'playThumbnail.ctrl',
            scope: {
                play: '='
            },
            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink($scope, $element, attrs, controller) { },
                    post: function postLink($scope, $element, attrs, controller) {
                        $scope.$element = $element;
                        // get height of $element
                        var elementHeight = $element.height();
                        var img = document.createElement('img');
                        img.src = $scope.play.png;
                        var $img = $(img);
                        $scope.$element.append($img);
                        img.addEventListener('load', function () {
                            var imgHeight = $img.height();
                            var imgOffsetTop = (-(imgHeight * 0.5) + (elementHeight / 2)) + 'px';
                            $img.css({ 'top': imgOffsetTop });
                        }, false);
                    }
                };
            }
        };
    }]);
/// <reference path='../ui.mdl.ts' />
impakt.common.ui.directive('popout', [
    '$compile',
    function ($compile) {
        // button to open with label
        // open / close icon
        // open direction (up / down / left / right)
        return {
            restrict: 'E',
            controller: function ($scope) {
                console.debug('controller: popout.ctrl');
                $scope.collapsed = true;
                $scope.data = {};
                $scope.label = 'label';
                $scope.open = 'down';
                $scope.classes = {
                    expand: '',
                    collapse: ''
                };
                $scope.toggleIconClass = 'glyphicon-chevron-down';
                function init() {
                    $scope.toggleIconClass = $scope.setToggleIconClass();
                    $scope.collapsed = true;
                }
                $scope.getCollapsed = function () {
                    return $scope.collapsed;
                };
                $scope.getData = function () {
                    return $scope.data;
                };
                $scope.getLabel = function () {
                    return $scope.label;
                };
                $scope.getToggleIconClass = function () {
                    return $scope.toggleIconClass;
                };
                $scope.toggle = function (close) {
                    $scope.collapsed = close === true ? true : !$scope.collapsed;
                    $scope.toggleIconClass = $scope.setToggleIconClass();
                    removeClickeater();
                    if (!$scope.collapsed) {
                        // add clikeater element when toggling
                        var $clickeater = angular.element($('<popout-clickeater></popout-clickeater>'));
                        $compile($clickeater)($scope);
                        $('body').append($clickeater);
                    }
                    console.log($scope.collapsed ? 'close' : 'open', 'popout');
                };
                $scope.setToggleIconClass = function () {
                    switch ($scope.open) {
                        case 'down':
                            $scope.classes.expand = 'glyphicon-chevron-down';
                            $scope.classes.collapse = 'glyphicon-chevron-up';
                            break;
                        case 'up':
                            $scope.classes.expand = 'glyphicon-chevron-up';
                            $scope.classes.collapse = 'glyphicon-chevron-down';
                            break;
                        case 'left':
                            $scope.classes.expand = 'glyphicon-chevron-left';
                            $scope.classes.collapse = 'glyphicon-chevron-right';
                            break;
                        case 'right':
                            $scope.classes.expand = 'glyphicon-chevron-right';
                            $scope.classes.collapse = 'glyphicon-chevron-left';
                            break;
                    }
                    return $scope.collapsed ? $scope.classes.expand : $scope.classes.collapse;
                };
                $scope.close = function () {
                    $scope.toggle(true);
                };
                function removeClickeater() {
                    // remove in case it already exists
                    console.log('remove popout clickeater');
                    $('.popout-clickeater').remove();
                }
                init();
            },
            // scope: {
            // 	data: '=',
            // 	open: '=',
            // 	collapsed: '=?',
            // 	label: '=',
            // },
            scope: true,
            link: function ($scope, $element, attrs) {
            }
        };
    }]).directive('popoutToggle', [
    function () {
        return {
            restrict: 'E',
            require: '^popout',
            replace: true,
            transclude: true,
            scope: true,
            template: '<div class="popout-toggle" ng-click="toggle()">\
			<span class="marginRight1">{{label}}</span>\
			<span class="glyphicon {{toggleIconClass}}"></span>\
		</div>',
            link: function ($scope, $element, attrs) {
                console.log($scope);
            }
        };
    }])
    .directive('popoutContents', [function () {
        return {
            restrict: 'E',
            require: '^popout',
            scope: true,
            replace: true,
            transclude: true,
            template: '<div class="popout-contents" ng-show="!collapsed"></div>',
            link: function ($scope, $element, attrs) {
            }
        };
    }])
    .directive('popoutClickeater', [function () {
        return {
            restrict: 'E',
            scope: true,
            replace: true,
            transclude: true,
            template: '<div class="popout-clickeater" ng-click="close()"></div>',
            link: function ($scope, $element, attrs) {
            }
        };
    }]);
/// <reference path='../ui.mdl.ts' />
impakt.common.ui.controller('quotes.ctrl', [
    '$scope',
    '$interval',
    '_quotes',
    function ($scope, $interval, _quotes) {
        $scope.$element;
        $scope.quote = _quotes.getRandomQuote();
        $interval(function () {
            $scope.quote = _quotes.getRandomQuote();
        }, 10000);
    }])
    .directive('quotes', [
    function () {
        return {
            restrict: 'E',
            templateUrl: 'common/ui/quotes/quotes.tpl.html',
            transclude: true,
            replace: true,
            controller: 'quotes.ctrl',
            link: function ($scope, $element, attrs) {
                $scope.$element = $element;
            }
        };
    }]);
/// <reference path='../ui.mdl.ts' />
impakt.common.ui.quotes = angular.module('impakt.quotes', [])
    .config([function () {
        console.debug('impakt.quotes - config');
    }])
    .run([function () {
        console.debug('impakt.quotes - run');
    }]);
/// <reference path='./quotes.mdl.ts' />
impakt.common.ui.quotes.service('_quotes', [
    function () {
        var quotes = [
            new Common.Models.Quote("It's not whether you get knocked down; \
			it's whether you get back up.", "Vince Lombardi"),
            new Common.Models.Quote("Attitude is a little thing that makes a big \
			difference between football success and \
			football failure.", "Felicity Luckey"),
            new Common.Models.Quote("Winning isn't everything...it's the only thing.", "Vince Lombardi"),
            new Common.Models.Quote("The essence of football was blocking, tackling, \
			and execution based on timing, rhythm and deception.", "Knute Rockne"),
            new Common.Models.Quote("There's two times of year for me: Football season \
			and waiting for football season.", "Darius Rucker"),
            new Common.Models.Quote("In football, the good thing is things can change in a second.", "Didier Drogba"),
            new Common.Models.Quote("It's not the will to win, but the will to prepare \
			to win that makes the difference.", "Bear Bryant"),
            new Common.Models.Quote("We love football.", "Impakt Athletics"),
            new Common.Models.Quote("To me football is like family. We must strive together.", "Mike Lynch"),
            new Common.Models.Quote("Football doesn't build character. It eliminates weak ones.", "Darrell Royal"),
            new Common.Models.Quote("Football is like life. It requires perseverance, self denial \
			hard work, sacrifice, dedication, and respect for authority.", "Vince Lombardi"),
            new Common.Models.Quote("If tomorrow wasn't promised, what would you give for today?", "Ray Lewis"),
        ];
        this.getRandomQuote = function () {
            var index = Common.Utilities.randomInt(0, quotes.length - 1);
            return quotes[index];
        };
    }]);
/// <reference path='../ui.mdl.ts' />
impakt.common.ui.factory('__router', [function () {
        var self = {
            templates: {},
            size: 0,
            index: 0,
            current: function () {
                return self.hasTemplates() ? self.templates[self.index] : null;
            },
            get: function (parent, templateName) {
                return self.templates[parent].filterFirst(function (template, index) {
                    return templateName == template.name;
                });
            },
            add: function (parent, template) {
                if (!self.templates[parent]) {
                    self.templates[parent] = new Common.Models.TemplateCollection(parent);
                    self.size++;
                }
                self.templates[parent].add(template);
            },
            push: function (parent, templates) {
                for (var i = 0; i < templates.length; i++) {
                    self.add(parent, templates[i]);
                }
            },
            next: function () {
                var oldIndex = self.index;
                if (self.hasTemplates()) {
                    self.index = self.hasNextTemplate() ? self.index + 1 : 0;
                }
                console.log('next layer:', oldIndex, '->', self.index, self.templates);
            },
            prev: function () {
                if (self.hasTemplates()) {
                    self.index = self.hasPrevTemplate() ? self.index - 1 : self.size - 1;
                }
            },
            to: function (index) {
                if (self.hasTemplates() && index >= 0 && index < self.size - 1) {
                    self.index = index;
                }
            },
            hasTemplates: function () {
                return self.templates && self.size > 0;
            },
            hasNextTemplate: function () {
                return self.index < self.size - 1;
            },
            hasPrevTemplate: function () {
                return self.index > 0;
            }
        };
        return self;
    }]);
/// <reference path='../ui.mdl.ts' />
impakt.common.ui.directive('search', [
    function () {
        return {
            restrict: 'E',
            templateUrl: 'common/ui/search/search.tpl.html',
            transclude: true,
            replace: true,
            link: function ($scope, $element, attrs) {
            }
        };
    }]);
/// <reference path='../ui.mdl.ts' />
impakt.common.ui.controller('stepper.ctrl', [
    '$scope',
    function ($scope) {
        console.info('stepper directive controller');
        $scope.index = 0;
        $scope.steps = [];
        $scope.$element = null;
        $scope.to = function (index) {
            $($scope.$element.find('step')[index]).show();
            $($scope.$element.find('step')[$scope.index]).hide();
            $scope.index = index;
        };
        $scope.prev = function () {
            if ($scope.index - 1 >= 0)
                $scope.to($scope.index - 1);
        };
        $scope.next = function () {
            if ($scope.index + 1 < $scope.steps.length)
                $scope.to($scope.index + 1);
        };
        $scope.isVisible = function () {
            return true;
        };
    }]).directive('stepper', [
    '$compile',
    function ($compile) {
        return {
            restrict: 'E',
            controller: 'stepper.ctrl',
            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink($scope, $element, attrs, controller) {
                    },
                    post: function postLink($scope, $element, attrs, controller) {
                        var mode = attrs.mode;
                        var HTML = '<step-nav>\
									<step-nav-item ng-repeat="step in steps track by $index" \
										class="gray-bg-7-hover"\
										ng-click="to($index)">\
										{{$index + 1}}\
									</step-nav-item>\
								</step-nav>';
                        var el = angular.element($compile(HTML)($scope));
                        //$element.append(el);
                        $scope.$element = $element;
                    }
                };
            }
        };
    }]).directive('step', [
    '$compile',
    function ($compile) {
        return {
            restrict: 'E',
            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink($scope, $element, attrs, controller) {
                        var guid = Common.Utilities.guid();
                        $element.attr('guid', guid);
                        var index = $scope.steps.length;
                        var step = {
                            guid: guid,
                            visible: false,
                            index: index
                        };
                        $scope.steps.push(step);
                        if (index != 0) {
                            $element.hide();
                        }
                        //console.log($scope.steps);
                    },
                    post: function postLink($scope, $element, attrs, controller) {
                    }
                };
            }
        };
    }])
    .directive('stepNav', [
    function () {
        return {
            restrict: 'E',
            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink($scope, $element, attrs, controller) {
                    },
                    post: function postLink($scope, $element, attrs, controller) {
                    }
                };
            }
        };
    }
])
    .directive('stepNavItem', [
    function () {
        return {
            restrict: 'E',
            compile: function compile(tElement, tAttrs, transclude) {
                return {
                    pre: function preLink($scope, $element, attrs, controller) {
                    },
                    post: function postLink($scope, $element, attrs, controller) {
                    }
                };
            }
        };
    }
]);
/// <reference path='../js/impakt.ts' />
impakt.modules = angular.module('impakt.modules', [
    'impakt.main',
    'impakt.home',
    'impakt.league',
    'impakt.season',
    'impakt.planning',
    'impakt.analysis',
    'impakt.playbook',
    'impakt.nav',
    'impakt.user',
    'impakt.search',
    'impakt.team',
    'impakt.sidebar',
    'impakt.details'
])
    .config(['$stateProvider', '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        console.debug('impakt.modules - config');
    }])
    .run(function () {
    console.debug('impakt.modules - run');
});
/// <reference path='../modules.mdl.ts' />
impakt.analysis = angular.module('impakt.analysis', [])
    .config([function () {
        console.debug('impakt.analysis - config');
    }]).run([function () {
        console.debug('impakt.analysis - run');
    }]);
/// <reference path='../modules.mdl.ts' />
impakt.details = angular.module('impakt.details', [])
    .config(function () {
    console.debug('impakt.details - config');
})
    .run(function () {
    console.debug('impakt.details - run');
});
/// <reference path='./details.mdl.ts' />
impakt.details.controller('details.ctrl', ['$scope',
    '$q',
    '$timeout',
    '__context',
    '__modals',
    '_details',
    '_associations',
    function ($scope, $q, $timeout, __context, __modals, _details, _associations) {
        $scope.selectedElements = _details.selectedElements;
        $scope.selectedElement = null;
        $scope.associatedPlaybooks = [];
        $scope.playbooks;
        $scope._details = _details;
        __context.onReady(function () {
            $scope.playbooks = impakt.context.Playbook.playbooks;
        });
        function init() {
            $scope.selectedElements.onModified(function (selectedElements) {
                // TODO @theBull - open/close details panel when items
                // are selected - currently buggy; isolate scope in expandable directive?
                $scope.collapsed = selectedElements.isEmpty();
                initAssociatedPlaybooks();
            });
        }
        function initAssociatedPlaybooks() {
            if (Common.Utilities.isNullOrUndefined($scope.selectedElements) ||
                $scope.selectedElements.isEmpty())
                return;
            $scope.selectedElement = $scope.selectedElements.first();
            if (!Common.Utilities.isNullOrUndefined($scope.selectedElement)) {
            }
        }
        $scope.loadPlaybooks = function (query) {
            var d = $q.defer();
            d.resolve(impakt.context.Playbook.playbooks.toJson().playbooks);
            return d.promise;
        };
        $scope.associatePlaybook = function (playbookJson, play, service) {
            if (Common.Utilities.isNullOrUndefined(playbookJson))
                return;
            // add association to play if it isn't already there
            // if(!play.associated.playbooks.exists(playbookJson.guid)) {
            // 	play.associated.setPlaybook(playbookJson.guid);
            // 	service.updatePlay(play);
            // }
        };
        $scope.unassociatePlaybook = function (playbookJson, play, service) {
            if (Common.Utilities.isNullOrUndefined(playbookJson))
                return;
            // remove association from play if it exists
            // if(play.associated.playbooks.exists(playbookJson.guid)) {
            // 	play.associated.removePlaybook(playbookJson.guid);
            // 	service.updatePlay(play);
            // }
            // remove association from playbook if it exists
        };
        $scope.delete = function (entity) {
            _details.delete(entity);
        };
        init();
    }]);
/// <reference path='./details.mdl.ts' />
impakt.details.service('_details', [
    '_playbook',
    function (_playbook) {
        this.selectedElements = new Common.Models.ActionableCollection();
        this.state = {
            collapsed: true
        };
        var self = this;
        this.selectedElements.onModified(function (collection) {
            if (collection.hasElements())
                self.state.collapsed = false;
        });
        this.updatePlay = function (play) {
            _playbook.updatePlay(play);
        };
        this.delete = function (entity) {
            _playbook.deleteEntityByType(entity).then(function () {
            }, function (err) {
            });
        };
    }]);
/// <reference path='../modules.mdl.ts' />
impakt.home = angular.module('impakt.home', [])
    .config([function () {
        console.debug('impakt.home - config');
    }])
    .run(function () {
    console.debug('impakt.home - run');
});
/// <reference path='./home.mdl.ts' />
impakt.home.controller('home.ctrl', ['$scope', '$state', '_home',
    function ($scope, $state, _home) {
        $scope.menuItems = _home.menuItems;
        $scope.goTo = function (menuItem) {
            $scope.menuItems.activate(menuItem);
        };
    }]);
/// <reference path='./home.mdl.ts' />
// Home service
impakt.home.service('_home', [
    '$state', '__nav',
    function ($state, __nav) {
        this.menuItems = __nav.menuItems;
    }]);
/// <reference path='../modules.mdl.ts' />
/// <reference path='./league.ts' />
impakt.league = angular.module('impakt.league', [
    'impakt.league.browser',
    'impakt.league.drilldown',
    'impakt.league.modals'
])
    .config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        console.debug('impakt.league - config');
        // impakt module states
        $stateProvider.state('league', {
            url: '/league',
            templateUrl: 'modules/league/league.tpl.html',
            controller: 'league.ctrl'
        });
    }])
    .run(function () {
    console.debug('impakt.league - run');
});
/// <reference path='../league.mdl.ts' />
impakt.league.browser = angular.module('impakt.league.browser', [])
    .config([
    '$stateProvider',
    function ($stateProvider) {
        console.debug('impakt.league.browser - config');
        $stateProvider.state('league.browser', {
            url: '/browser',
            templateUrl: 'modules/league/browser/league-browser.tpl.html',
            controller: 'league.browser.ctrl'
        });
    }])
    .run(function () {
    console.debug('impakt.league.browser - run');
});
/// <reference path='./league-browser.mdl.ts' />
impakt.league.browser.controller('league.browser.ctrl', ['$scope', '_league', '_leagueModals', '_teamModals',
    function ($scope, _league, _leagueModals, _teamModals) {
        $scope.leagues = impakt.context.League.leagues;
        $scope.teams = impakt.context.Team.teams;
        $scope.createLeague = function () {
            _leagueModals.createLeague();
        };
        $scope.createTeam = function () {
            _teamModals.createTeam();
        };
        $scope.leagueDrilldown = function (league) {
            _league.toLeagueDrilldown(league);
        };
        $scope.teamDrilldown = function (team) {
            _league.toTeamDrilldown(team);
        };
    }]);
/// <reference path='../league.mdl.ts' />
impakt.league.drilldown = angular.module('impakt.league.drilldown', [
    'impakt.league.drilldown.league',
    'impakt.league.drilldown.team'
])
    .config([
    '$stateProvider',
    function ($stateProvider) {
        console.debug('impakt.league.drilldown - config');
        $stateProvider.state('league.drilldown', {
            url: '/drilldown',
            templateUrl: 'modules/league/drilldown/league-drilldown.tpl.html',
            controller: 'league.drilldown.ctrl'
        });
    }])
    .run(function () {
    console.debug('impakt.league.drilldown - run');
});
/// <reference path='./league-drilldown.mdl.ts' />
impakt.league.drilldown.controller('league.drilldown.ctrl', [
    '$scope',
    '_league',
    function ($scope, _league) {
        $scope.toBrowser = function () {
            _league.toBrowser();
        };
    }]);
/// <reference path='../league-drilldown.mdl.ts' />
impakt.league.drilldown.league = angular.module('impakt.league.drilldown.league', [])
    .config([
    '$stateProvider',
    function ($stateProvider) {
        console.debug('impakt.league.drilldown.league - config');
        $stateProvider.state('league.drilldown.league', {
            url: '/league',
            templateUrl: 'modules/league/drilldown/league/league-drilldown-league.tpl.html',
            controller: 'league.drilldown.league.ctrl'
        });
    }])
    .run(function () {
    console.debug('impakt.league.drilldown.league - run');
});
/// <reference path='./league-drilldown-league.mdl.ts' />
impakt.league.drilldown.league.controller('league.drilldown.league.ctrl', [
    '$scope',
    '_league',
    '_leagueModals',
    function ($scope, _league, _leagueModals) {
        $scope.league = _league.drilldown.league;
        $scope.delete = function () {
            _leagueModals.deleteLeague($scope.league);
        };
    }]);
/// <reference path='../league-drilldown.mdl.ts' />
impakt.league.drilldown.team = angular.module('impakt.league.drilldown.team', [])
    .config([
    '$stateProvider',
    function ($stateProvider) {
        console.debug('impakt.league.drilldown.team - config');
        $stateProvider.state('league.drilldown.team', {
            url: '/team',
            templateUrl: 'modules/league/drilldown/team/league-drilldown-team.tpl.html',
            controller: 'league.drilldown.team.ctrl'
        });
    }])
    .run(function () {
    console.debug('impakt.league.drilldown.team - run');
});
/// <reference path='./league-drilldown-team.mdl.ts' />
impakt.league.controller('league.drilldown.team.ctrl', ['$scope', '_league', '_teamModals',
    function ($scope, _league, _teamModals) {
        $scope.team = _league.drilldown.team;
        $scope.delete = function () {
            _teamModals.deleteTeam($scope.team);
        };
    }]);
/// <reference path='./league.mdl.ts' />
/**
 * League constants defined here
 */
impakt.league.constant('LEAGUE', {
    ENDPOINT: '/teamInfo',
    // League
    CREATE_LEAGUE: '/createLeague',
    GET_LEAGUES: '/getLeagues',
    GET_LEAGUE: '/getLeague',
    DELETE_LEAGUE: '/deleteLeague',
    // League Teams
    CREATE_TEAM: '/createTeam',
    GET_TEAMS: '/getTeams',
    GET_TEAM: '/getTeam',
    DELETE_TEAM: '/deleteTeam',
});
/// <reference path='./league.mdl.ts' />
impakt.league.controller('league.ctrl', ['$scope', '$state', '_league',
    function ($scope, $state, _league) {
        // load up the browser by default
        $state.go('league.browser');
    }]);
/// <reference path='./models/models.ts' />
/// <reference path='./league.ts' />
// League service
impakt.league.service('_league', [
    'LEAGUE',
    '$q',
    '$state',
    '__api',
    '__localStorage',
    '__notifications',
    '_leagueModals',
    function (LEAGUE, $q, $state, __api, __localStorage, __notifications, _leagueModals) {
        var self = this;
        this.drilldown = {
            league: null,
            team: null
        };
        // TODO @theBull - ensure the 'current user' is being addressed
        // TODO @theBull - add notification handling
        /**
         * Retrieves all leagues
         */
        this.getLeagues = function () {
            var d = $q.defer();
            var notification = __notifications.pending('Getting leagues...');
            __api.get(__api.path(LEAGUE.ENDPOINT, LEAGUE.GET_LEAGUES))
                .then(function (response) {
                var collection = new League.Models.LeagueModelCollection();
                if (response && response.data && response.data.results) {
                    var leagueResults = Common.Utilities.parseData(response.data.results);
                    for (var i = 0; i < leagueResults.length; i++) {
                        var leagueResult = leagueResults[i];
                        if (leagueResult && leagueResult.data && leagueResult.data.model) {
                            var leagueModel = new League.Models.LeagueModel();
                            leagueResult.data.model.key = leagueResult.key;
                            leagueModel.fromJson(leagueResult.data.model);
                            collection.add(leagueModel);
                        }
                    }
                }
                notification.success([collection.size(), ' Leagues successfully retreived'].join(''));
                d.resolve(collection);
            }, function (error) {
                notification.error('Failed to retieve Leagues');
                console.error(error);
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Gets a single league with the given key
         * @param {number} key The key of the league to retrieve
         */
        this.getLeague = function (key) {
            var d = $q.defer();
            __api.get(__api.path(LEAGUE.ENDPOINT, LEAGUE.GET_LEAGUE, '/' + key))
                .then(function (response) {
                var league = Common.Utilities.parseData(response.data.results);
                d.resolve(league);
            }, function (error) {
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Sends a league model to the server for storage
         * @param {Common.Models.LeagueModel} leagueModel The model to be created/saved
         */
        this.createLeague = function (newLeagueModel) {
            var d = $q.defer();
            if (!Common.Utilities.isNullOrUndefined(newLeagueModel)) {
                var nameExists = impakt.context.League.leagues.hasElementWhich(function (leagueModel, index) {
                    return leagueModel.name == newLeagueModel.name;
                });
                if (nameExists) {
                    var notification_1 = __notifications.warning('Failed to create league. League "', newLeagueModel.name, '" already exists.');
                    _leagueModals.createLeagueDuplicate(newLeagueModel);
                    return;
                }
            }
            // set key to -1 to ensure a new object is created server-side
            newLeagueModel.key = -1;
            var leagueModelJson = newLeagueModel.toJson();
            var notification = __notifications.pending('Creating playbook "', newLeagueModel.name, '"...');
            __api.post(__api.path(LEAGUE.ENDPOINT, LEAGUE.CREATE_LEAGUE), {
                version: 1,
                name: newLeagueModel.name,
                data: {
                    version: 1,
                    model: leagueModelJson
                }
            })
                .then(function (response) {
                var results = Common.Utilities.parseData(response.data.results);
                var leagueModel = new League.Models.LeagueModel();
                if (results && results.data && results.data.model) {
                    results.data.model.key = results.key;
                    leagueModel.fromJson(results.data.model);
                    // update the context
                    impakt.context.League.leagues.add(leagueModel);
                }
                else {
                    throw new Error('CreateLeague did not return a valid league model');
                }
                notification.success('Successfully created league "', leagueModel.name, '"');
                d.resolve(leagueModel);
            }, function (error) {
                notification.error('Failed to create league "', newLeagueModel.name, '"');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Deletes the given league for the current user
         * @param {League.Models.LeagueModel} league The league to be deleted
         */
        this.deleteLeague = function (league) {
            var d = $q.defer();
            var notification = __notifications.pending('Deleting league "', league.name, '"...');
            __api.post(__api.path(LEAGUE.ENDPOINT, LEAGUE.DELETE_LEAGUE), { key: league.key }).then(function (response) {
                // update the context
                impakt.context.League.leagues.remove(league.guid);
                notification.success('Deleted league "', league.name, '"');
                d.resolve(league);
            }, function (error) {
                notification.error('Failed to delete league "', league.name, '"');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Updates the given league for the current user
         * @param {League.Models.LeagueModel} league The league to update
         */
        this.updateLeague = function (league) {
            var d = $q.defer();
            // update assignment collection to json object
            var leagueJson = league.toJson();
            var notification = __notifications.pending('Updating league "', league.name, '"...');
            __api.post(__api.path(LEAGUE.ENDPOINT, LEAGUE.UPDATE_LEAGUE), {
                version: 1,
                name: leagueJson.name,
                key: leagueJson.key,
                data: {
                    version: 1,
                    key: leagueJson.key,
                    model: leagueJson
                }
            })
                .then(function (response) {
                var results = Common.Utilities.parseData(response.data.results);
                var leagueModel = new League.Models.LeagueModel();
                if (results && results.data && results.data.model) {
                    leagueModel.fromJson(results.data.model);
                    // update the context
                    impakt.context.League.leagues.set(leagueModel.guid, leagueModel);
                }
                notification.success('Successfully updated league "', league.name, '"');
                d.resolve(leagueModel);
            }, function (error) {
                notification.error('Failed to update league "', league.name, '"');
                d.reject(error);
            });
            return d.promise;
        };
        this.toBrowser = function () {
            this.drilldown.league = null;
            this.drilldown.team = null;
            $state.transitionTo('league.browser');
        };
        this.toLeagueDrilldown = function (league) {
            this.drilldown.league = league;
            $state.transitionTo('league.drilldown.league');
        };
        this.toTeamDrilldown = function (team) {
            this.drilldown.team = team;
            $state.transitionTo('league.drilldown.team');
        };
    }]);
/// <reference path='../league.mdl.ts' />
impakt.league.modals = angular.module('impakt.league.modals', [])
    .config(function () {
    console.debug('impakt.league.modals - config');
})
    .run(function () {
    console.debug('impakt.league.modals - run');
});
/// <reference path='../league-modals.mdl.ts' />
impakt.league.modals.controller('league.modals.createLeagueDuplicateError.ctrl', [
    '$scope',
    '$uibModalInstance',
    '_league',
    'league',
    function ($scope, $uibModalInstance, _league, league) {
        $scope.league = league;
        $scope.ok = function () {
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);
/// <reference path='../league-modals.mdl.ts' />
impakt.league.modals.controller('league.modals.createLeague.ctrl', [
    '$scope',
    '$uibModalInstance',
    '_league',
    function ($scope, $uibModalInstance, _league) {
        $scope.newLeagueModel = new League.Models.LeagueModel();
        $scope.ok = function () {
            _league.createLeague($scope.newLeagueModel)
                .then(function (createdLeague) {
                $uibModalInstance.close(createdLeague);
            }, function (err) {
                console.error(err);
                $uibModalInstance.close(err);
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);
/// <reference path='../league-modals.mdl.ts' />
impakt.league.modals.controller('league.modals.deleteLeague.ctrl', [
    '$scope',
    '$uibModalInstance',
    '_league',
    'league',
    function ($scope, $uibModalInstance, _league, league) {
        $scope.league = league;
        $scope.ok = function () {
            _league.deleteLeague($scope.league)
                .then(function (results) {
                $uibModalInstance.close(results);
            }, function (err) {
                console.error(err);
                $uibModalInstance.close(err);
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);
/// <reference path='./league-modals.mdl.ts' />
impakt.league.modals.service('_leagueModals', [
    '$q',
    '__modals',
    function ($q, __modals) {
        /**
         *
         * LEAGUE
         *
         */
        this.createLeague = function () {
            var d = $q.defer();
            var modalInstance = __modals.open('', 'modules/league/modals/create-league/create-league.tpl.html', 'league.modals.createLeague.ctrl', {});
            modalInstance.result.then(function (createdLeague) {
                console.log(createdLeague);
                d.resolve();
            }, function (results) {
                console.log('dismissed');
                d.reject();
            });
            return d.promise;
        };
        this.createLeagueDuplicate = function (leagueModel) {
            var d = $q.defer();
            var modalInstance = __modals.open('', 'modules/league/modals/create-league-duplicate-error/create-league-duplicate-error.tpl.html', 'league.modals.createLeagueDuplicateError.ctrl', {
                league: function () {
                    return leagueModel;
                }
            });
            modalInstance.result.then(function (createdLeague) {
                console.log(createdLeague);
                d.resolve();
            }, function (results) {
                console.log('dismissed');
                d.reject();
            });
            return d.promise;
        };
        this.deleteLeague = function (league) {
            var d = $q.defer();
            var modalInstance = __modals.open('', 'modules/league/modals/delete-league/delete-league.tpl.html', 'league.modals.deleteLeague.ctrl', {
                league: function () {
                    return league;
                }
            });
            modalInstance.result.then(function (results) {
                console.log(results);
                d.resolve();
            }, function (results) {
                console.log('dismissed');
                d.reject();
            });
            return d.promise;
        };
    }]);
/// <reference path='../modules.mdl.ts' />
impakt.main = angular.module('impakt.main', [])
    .config([function () {
        console.debug('impakt.main - config');
    }])
    .run([function () {
        console.debug('impakt.main - run');
    }]);
/// <reference path='./main.mdl.ts' />
impakt.main.controller('main.ctrl', [
    '$scope',
    '__context',
    function ($scope, __context) {
        $scope.appVisible = false;
        __context.onReady(function () {
            $scope.appVisible = true;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        });
    }]);
/// <reference path='../modules.mdl.ts' />
impakt.nav = angular.module('impakt.nav', [
    'impakt.user',
    'impakt.playbook.nav'
])
    .config(function () {
    console.debug('impakt.nav - config');
})
    .run(function () {
    console.debug('impakt.nav - run');
});
/// <reference path='./nav.mdl.ts' />
impakt.nav.controller('nav.ctrl', [
    '$scope',
    '$location',
    '__nav',
    '__notifications',
    function ($scope, $location, __nav, __notifications) {
        // Default menu visiblity
        $scope.isMenuCollapsed = true;
        $scope.notifications = __notifications.notifications;
        $scope.menuItems = __nav.menuItems;
        $scope.notificationsMenuItem = __nav.notificationsMenuItem;
        $scope.searchMenuItem = __nav.searchMenuItem;
        // set default view to the Home module
        $location.path('/home');
        $scope.navigatorNavSelection = getActiveNavItemLabel();
        $scope.searchItemClick = function () {
            $scope.searchMenuItem.toggleActivation();
        };
        $scope.notificationItemClick = function () {
            $scope.notificationsMenuItem.isActive = !$scope.notificationsMenuItem.isActive;
            $scope.menuVisibilityToggle($scope.notificationsMenuItem, false);
        };
        $scope.menuVisibilityToggle = function (navigationItem, propagate) {
            $scope.isMenuCollapsed = !$scope.isMenuCollapsed;
            propagate && $scope.menuItemClick(navigationItem);
        };
        $scope.menuItemClick = function (navigationItem) {
            $scope.menuItems.activate(navigationItem);
            $scope.navigatorNavSelection = navigationItem.label;
        };
        function getActiveNavItemLabel() {
            var activeNavItem = $scope.menuItems.getActive();
            return activeNavItem ? activeNavItem.label : null;
        }
    }]);
/// <reference path='./nav.mdl.ts' />
// Nav factory
impakt.nav.factory('__nav', [
    '$http',
    '$q',
    '$state',
    function ($http, $q, $state) {
        var menuItems = new Navigation.Models.NavigationItemCollection();
        // Home
        menuItems.add(new Navigation.Models.NavigationItem('home', 'Home', 'home', '/home', true, function (self) {
            $state.transitionTo('home');
        }));
        // League
        menuItems.add(new Navigation.Models.NavigationItem('league', 'League', 'globe', '/league', false, function (self) {
            $state.transitionTo('league');
        }));
        // Season
        menuItems.add(new Navigation.Models.NavigationItem('season', 'Season', 'calendar', '/season', false, function (self) {
            $state.transitionTo('season');
        }));
        // Playbook
        menuItems.add(new Navigation.Models.NavigationItem('playbook', 'Playbook', 'book', '/playbook/browser', false, function (self) {
            $state.transitionTo('playbook');
        }));
        // Planning
        menuItems.add(new Navigation.Models.NavigationItem('planning', 'Planning', 'blackboard', '/planning', false, function (self) {
            $state.transitionTo('planning');
        }));
        // Analysis
        menuItems.add(new Navigation.Models.NavigationItem('analysis', 'Analysis', 'facetime-video', '/analysis', false, function (self) {
            $state.transitionTo('analysis');
        }));
        // Team
        menuItems.add(new Navigation.Models.NavigationItem('team', 'Team Management', 'list-alt', '/team', false, function (self) {
            $state.transitionTo('team');
        }));
        // Profile
        menuItems.add(new Navigation.Models.NavigationItem('profile', 'Profile', 'user', '/profile', false, function (self) {
            $state.transitionTo('profile');
        }));
        // Search
        var searchMenuItem = new Navigation.Models.NavigationItem('search', 'Search', 'search', null, false, function (self) { });
        // Notifications
        var notificationsMenuItem = new Navigation.Models.NavigationItem('notifications', 'Notifications', 'bell', null, false, function (self) { });
        // TODO @theBull - implement
        // ,
        // film: {
        // 	label: 'Film',
        // 	glyphicon: 'film',
        // 	path: '/film',
        // 	isActive: false
        // },
        // stats: {
        // 	label: 'Stats',
        // 	glyphicon: 'signal',
        // 	path: '/stats',
        // 	isActive: false
        // }
        return {
            menuItems: menuItems,
            searchMenuItem: searchMenuItem,
            notificationsMenuItem: notificationsMenuItem
        };
    }]);
/// <reference path='../modules.mdl.ts' />
impakt.modules = angular.module('impakt.planning', [])
    .config([function () {
        console.debug('impakt.planning - config');
    }])
    .run(function () {
    console.debug('impakt.planning - run');
});
/// <reference path='./playbook.ts' />
/// <reference path='../modules.mdl.ts' />
impakt.playbook = angular.module('impakt.playbook', [
    'ui.router',
    'impakt.common',
    'impakt.playbook.contextmenus',
    'impakt.playbook.modals',
    'impakt.playbook.browser',
    'impakt.playbook.drilldown',
    'impakt.playbook.editor',
    'impakt.playbook.layout',
    'impakt.playbook.nav',
])
    .config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        console.debug('impakt.playbook - config');
        // impakt module states
        $stateProvider.state('playbook', {
            url: '/playbook',
            templateUrl: 'modules/playbook/playbook.tpl.html',
            controller: 'playbook.ctrl'
        });
    }])
    .run([function () {
        console.debug('impakt.playbook - run');
    }]);
/// <reference path='../playbook.mdl.ts' />
impakt.playbook.browser = angular.module('impakt.playbook.browser', [])
    .config([
    '$stateProvider',
    function ($stateProvider) {
        console.debug('impakt.playbook.browser - config');
        $stateProvider.state('playbook.browser', {
            url: '/browser',
            templateUrl: 'modules/playbook/browser/playbook-browser.tpl.html',
            controller: 'playbook.browser.ctrl'
        });
    }])
    .run(function () {
    console.debug('impakt.playbook.browser - run');
});
/// <reference path='./playbook-browser.mdl.ts' />
impakt.playbook.browser.controller('playbook.browser.ctrl', [
    '$scope',
    '__context',
    '_details',
    '_playbook',
    '_playbookModals',
    function ($scope, __context, _details, _playbook, _playbookModals) {
        $scope.editor;
        $scope.playbooks;
        $scope.formations;
        $scope.plays;
        $scope.assignmentGroups;
        _details.selectedPlay = null;
        __context.onReady(function () {
            $scope.editor = impakt.context.Playbook.editor;
            $scope.playbooks = impakt.context.Playbook.playbooks;
            $scope.formations = impakt.context.Playbook.formations;
            $scope.plays = impakt.context.Playbook.plays;
            $scope.assignmentGroups = impakt.context.Playbook.assignmentGroups;
        });
        $scope.getEditorTypeClass = function (editorType) {
            return _playbook.getEditorTypeClass(editorType);
        };
        $scope.openEditor = function () {
            _playbook.toEditor();
        };
        $scope.createPlaybook = function () {
            _playbookModals.createPlaybook();
        };
        $scope.deletePlaybook = function (playbook) {
            _playbookModals.deletePlaybook(playbook).then(function (data) {
                // navigate back to the main browser view
                $scope.goToAll();
            }, function (err) {
            });
        };
        $scope.createPlay = function () {
            _playbookModals.createPlay();
        };
        $scope.alertDataRequired = function (dataType) {
            if ($scope.formations.isEmpty() && $scope.playbooks.hasElements()) {
                alert("Please create a base formation in order to begin creating " + dataType + ".");
            }
            else if ($scope.playbooks.isEmpty()) {
                alert("Please create a playbook in order to begin creating " + dataType + ".");
            }
        };
        $scope.deletePlay = function (play) {
            _playbookModals.deletePlay(play);
        };
        $scope.createFormation = function () {
            _playbookModals.createFormation();
        };
        $scope.deleteFormation = function (formation) {
            _playbookModals.deleteFormation(formation);
        };
        $scope.createAssignmentGroup = function () {
            // create default assignment group?
            //_playbookModals.createAssignmentGroup();
        };
        $scope.deleteAssignmentGroup = function (assignmentGroup) {
            _playbookModals.deleteAssignmentGroup(assignmentGroup);
        };
        /**
         *
         * Item Drilldown
         *
         */
        $scope.toPlaybookDrilldown = function (playbookModel) {
            _playbook.toPlaybookDrilldown(playbookModel);
        };
    }]);
/// <reference path='./playbook-browser.mdl.ts' />
impakt.playbook.browser.service('_playbookBrowser', [function () {
    }]);
/// <reference path='../playbook.mdl.ts' />
impakt.playbook.contextmenus = angular.module('impakt.playbook.contextmenus', [
    'impakt.playbook.contextmenus.routeNode',
    'impakt.playbook.contextmenus.play'
])
    .config(function () {
    console.debug('impakt.playbook.contextmenus - config');
})
    .run(function () {
    console.debug('impakt.playbook.contextmenus - run');
});
/// <reference path='../playbook-contextmenus.mdl.ts' />
impakt.playbook.contextmenus.play =
    angular.module('impakt.playbook.contextmenus.play', [])
        .config(function () {
        console.debug('impakt.playbook.contextmenus.play - config');
    })
        .run(function () {
        console.debug('impakt.playbook.contextmenus.play - run');
    });
/// <reference path='./contextmenu-play.mdl.ts' />
impakt.playbook.contextmenus.play.controller('impakt.playbook.contextmenus.play.ctrl', [
    '$scope',
    function ($scope) {
    }]);
/// <reference path='../playbook-contextmenus.mdl.ts' />
impakt.playbook.contextmenus.routeNode =
    angular.module('impakt.playbook.contextmenus.routeNode', [])
        .config(function () {
        console.debug('impakt.playbook.contextmenus.routeNode - config');
    })
        .run(function () {
        console.debug('impakt.playbook.contextmenus.routeNode - run');
    });
/// <reference path='./contextmenu-routeNode.mdl.ts' />
impakt.playbook.contextmenus.routeNode.controller('impakt.playbook.contextmenus.routeNode.ctrl', [
    '$scope',
    function ($scope) {
    }]);
/// <reference path='../playbook.mdl.ts' />
impakt.playbook.drilldown = angular.module('impakt.playbook.drilldown', [
    'impakt.playbook.drilldown.playbook'
]).config([
    '$stateProvider',
    function ($stateProvider) {
        console.debug('impakt.playbook.drilldown - config');
        $stateProvider.state('playbook.drilldown', {
            url: '/drilldown',
            templateUrl: 'modules/playbook/drilldown/playbook-drilldown.tpl.html',
            controller: 'playbook.drilldown.ctrl'
        });
    }])
    .run(function () {
    console.debug('impakt.playbook.drilldown - run');
});
/// <reference path='./playbook-drilldown.mdl.ts' />
impakt.playbook.drilldown.controller('playbook.drilldown.ctrl', [
    '$scope',
    '_playbook',
    function ($scope, _playbook) {
        $scope.toBrowser = function () {
            _playbook.toBrowser();
        };
    }]);
/// <reference path='../playbook-drilldown.mdl.ts' />
impakt.playbook.drilldown.playbook = angular.module('impakt.playbook.drilldown.playbook', [])
    .config([
    '$stateProvider',
    function ($stateProvider) {
        console.debug('impakt.playbook.drilldown.playbook - config');
        $stateProvider.state('playbook.drilldown.playbook', {
            url: '/playbook',
            templateUrl: 'modules/playbook/drilldown/playbook/playbook-drilldown-playbook.tpl.html',
            controller: 'playbook.drilldown.playbook.ctrl'
        });
    }])
    .run(function () {
    console.debug('impakt.playbook.drilldown.playbook - run');
});
/// <reference path='./playbook-drilldown-playbook.mdl.ts' />
impakt.playbook.drilldown.playbook.controller('playbook.drilldown.playbook.ctrl', [
    '$scope',
    '_associations',
    '_playbook',
    '_playbookModals',
    function ($scope, _associations, _playbook, _playbookModals) {
        $scope.playbook = _playbook.drilldown.playbook;
        $scope.plays;
        $scope.formations;
        function init() {
            var associations = _associations.getAssociated($scope.playbook);
            if (!Common.Utilities.isNullOrUndefined(associations)) {
                $scope.plays = associations.plays;
                $scope.formations = associations.formations;
            }
        }
        $scope.delete = function () {
            _playbookModals.deletePlaybook($scope.playbook);
        };
        init();
    }]);
/// <reference path='../playbook.mdl.ts' />
impakt.playbook.editor = angular.module('impakt.playbook.editor', [
    'impakt.playbook.editor.tabs',
    'impakt.playbook.editor.tools',
    'impakt.playbook.editor.mode',
    'impakt.playbook.editor.canvas',
    'impakt.playbook.editor.details'
])
    .config([
    '$stateProvider',
    function ($stateProvider) {
        console.debug('impakt.playbook.editor - config');
        $stateProvider.state('playbook.editor', {
            url: '/editor',
            templateUrl: 'modules/playbook/editor/playbook-editor.tpl.html',
            controller: 'playbook.editor.ctrl'
        });
    }])
    .run(function () {
    console.debug('impakt.playbook.editor - run');
});
/// <reference path='../playbook-editor.mdl.ts' />
impakt.playbook.editor.canvas =
    angular.module('impakt.playbook.editor.canvas', [])
        .config(function () {
        console.debug('impakt.playbook.editor.canvas - config');
    })
        .run(function () {
        console.debug('impakt.playbook.editor.canvas - run');
    });
/// <reference path='./playbook-editor-canvas.mdl.ts' />
impakt.playbook.editor.canvas.controller('playbook.editor.canvas.ctrl', [
    '$scope',
    '$timeout',
    '_playbookEditorCanvas',
    function ($scope, $timeout, _playbookEditorCanvas) {
        $scope.unitTypes = _playbookEditorCanvas.unitTypes;
        $scope.formations = _playbookEditorCanvas.formations;
        $scope.personnelCollection = _playbookEditorCanvas.personnelCollection;
        $scope.assignmentGroups = _playbookEditorCanvas.assignmentGroups;
        $scope.plays = _playbookEditorCanvas.plays;
        $scope.tab = _playbookEditorCanvas.getActiveTab();
        $scope.tabs = _playbookEditorCanvas.tabs;
        $scope.hasOpenTabs = _playbookEditorCanvas.hasTabs();
        $scope.canvas = _playbookEditorCanvas.canvas;
        $scope.editorModeClass = '';
        // check if there are any open tabs; if not, hide the canvas and
        // clear the canvas data.
        if (!Common.Utilities.isNullOrUndefined($scope.tab)) {
            $scope.tab.onclose(function () {
                $scope.hasOpenTabs = _playbookEditorCanvas.hasTabs();
            });
            $scope.canvas.onready(function () {
                $scope.editorModeClass = $scope.getEditorTypeClass($scope.canvas.playPrimary.editorType);
                $scope.canvas.onModified(function () {
                    if (Common.Utilities.isNullOrUndefined($scope.canvas.playPrimary))
                        return;
                    $scope.editorModeClass = $scope.getEditorTypeClass($scope.canvas.playPrimary.editorType);
                    $timeout(function () {
                        console.log('timeout running');
                        $scope.$apply();
                    }, 1);
                });
            });
        }
        if (!Common.Utilities.isNullOrUndefined($scope.tabs)) {
            $scope.tabs.onModified(function (tabs) {
                $scope.hasOpenTabs = tabs.hasElements();
            });
        }
        // _playbookEditorCanvas.onready(function() {
        // 	$scope.tab = _playbookEditorCanvas.activeTab;
        // });	
        $scope.formations.onModified(function () {
            // $scope.$apply();
        });
        /**
         * Toggle Editor mode
         */
        $scope.switchToPlayMode = function () {
            console.log('switch from formation mode to play mode', $scope.tab.playPrimary);
            $scope.tab.playPrimary.editorType = Playbook.Enums.EditorTypes.Play;
        };
        $scope.getEditorTypeClass = function (editorType) {
            return _playbookEditorCanvas.getEditorTypeClass(parseInt(editorType));
        };
        /**
         * Toggle Formation / Personnel / Assignments
         */
        $scope.applyFormation = function (formation) {
            console.log('apply formation to editor');
            _playbookEditorCanvas.applyPrimaryFormation(formation);
            $scope.formationDropdownVisible = false;
        };
        $scope.applyPersonnel = function (personnel) {
            _playbookEditorCanvas.applyPrimaryPersonnel(personnel);
            $scope.setDropdownVisible = false;
        };
        $scope.applyPlay = function (play) {
            _playbookEditorCanvas.applyPrimaryPlay(play);
        };
        $scope.applyAssignmentGroup = function (assignmentGroup) {
            _playbookEditorCanvas.applyPrimaryAssignmentGroup(assignmentGroup);
        };
        $scope.applyUnitType = function (unitType) {
            if (unitType.unitType == $scope.canvas.playPrimary.unitType)
                return;
            _playbookEditorCanvas.applyPrimaryUnitType(unitType.unitType);
            $scope.unitTypeDropdownVisible = false;
        };
        /**
         * Determine whether to show quick formation dropdown. Should only
         * be possible when in play- or formation-editing types.
         * @param {Playbook.Enums.EditorTypes} editorType Editor type enum to
         * determine which type of editor window we have open.
         */
        $scope.isFormationVisible = function (editorType) {
            return editorType == Playbook.Enums.EditorTypes.Formation ||
                editorType == Playbook.Enums.EditorTypes.Play;
        };
        /**
         * Personnel should be visible when setting assignments, since we need the
         * mapping information of a personnel group to determine how assignments are
         * paired with the players in the given formation.
         * @param {Playbook.Enums.EditorTypes} editorType [description]
         */
        $scope.isPersonnelVisible = function (editorType) {
            return editorType == Playbook.Enums.EditorTypes.Assignment ||
                editorType == Playbook.Enums.EditorTypes.Play;
        };
        $scope.isAssignmentGroupsVisible = function (editorType) {
            return editorType == Playbook.Enums.EditorTypes.Assignment ||
                editorType == Playbook.Enums.EditorTypes.Play;
        };
        $scope.toBrowser = function () {
            _playbookEditorCanvas.toBrowser();
        };
    }]);
///<reference path='./playbook-editor-canvas.mdl.ts' />
// TODO - needed?
impakt.playbook.editor.canvas.directive('playbookEditorCanvas', ['$rootScope',
    '$compile',
    '$templateCache',
    '$timeout',
    '_contextmenu',
    '_playPreview',
    '_playbookEditorCanvas',
    '_scrollable',
    function ($rootScope, $compile, $templateCache, $timeout, _contextmenu, _playPreview, _playbookEditorCanvas, _scrollable) {
        console.debug('directive: impakt.playbook.editor.canvas - register');
        return {
            restrict: 'E',
            scope: {
                editortype: '@editortype',
                key: '@key'
            },
            link: function ($scope, $element, attrs) {
                console.debug('directive: impakt.playbook.editor.canvas - link');
                // angular doesn't respect camel-casing in directives, hence
                // the all-lowercased editortype attribute.
                var editorType = parseInt(attrs.editortype);
                var key = attrs.key;
                $timeout(function () {
                    // $timeout NOTE:
                    // wrapping this step in a timeout due to a DOM rendering race.
                    // The angular ng-show directive kicks in when activating/
                    // deactivating the tabs, and the .col class (css-flex)
                    // needs time itself to render to the appropriate size.
                    // This timeout lets all of that finish before intializing
                    // the canvas; the canvas requires an accurate $element height
                    // value in order to get its proper dimensions.
                    var canvas = _playbookEditorCanvas.initialize($element, editorType, key);
                    canvas.setScrollable(_scrollable);
                    _scrollable.onready(function (content) {
                        _scrollable.scrollToPercentY(0.5);
                        _playPreview.setViewBox(canvas.paper.x, canvas.paper.y, canvas.dimensions.width, canvas.dimensions.height);
                    });
                    _scrollable.initialize($element, canvas.paper);
                });
                $(document).on('keydown', function (e) {
                    //console.log(e.which);
                    if (e.which == 8) {
                        console.log('backspace pressed - playbook-editor-canvas.drv.ts');
                    }
                    if (e.which == 82) {
                        console.log('R pressed - playbook-editor-canvas.drv.ts');
                    }
                    if (e.which == 65) {
                        console.log('A pressed - playbook-editor-canvas.drv.ts');
                    }
                });
            }
        };
    }]);
/// <reference path='../../../../common/common.ts' />
/// <reference path='./playbook-editor-canvas.mdl.ts' />
impakt.playbook.editor.canvas.service('_playbookEditorCanvas', [
    '$rootScope',
    '$timeout',
    '_base',
    '_contextmenu',
    '_playPreview',
    '_playbook',
    '_playbookEditor',
    function ($rootScope, $timeout, _base, _contextmenu, _playPreview, _playbook, _playbookEditor) {
        console.debug('service: impakt.playbook.editor.canvas');
        var self = this;
        this.activeTab = _playbookEditor.activeTab;
        this.tabs = _playbookEditor.tabs;
        this.playbooks = impakt.context.Playbook.playbooks;
        this.formations = impakt.context.Playbook.formations;
        this.personnelCollection = impakt.context.Team.personnel;
        this.assignmentGroups = impakt.context.Playbook.assignmentGroups;
        this.plays = impakt.context.Playbook.plays;
        this.readyCallbacks = [function () { console.log('canvas ready'); }];
        this.canvas = _playbookEditor.canvas;
        this.unitTypes = impakt.context.Team.unitTypes;
        this.component = new Common.Base.Component('_playbookEditorCanvas', Common.Base.ComponentType.Service, []);
        function init() {
            _playbookEditor.component.loadDependency(self.component);
        }
        this.onready = function (callback) {
            this.readyCallbacks.push(callback);
            _playbookEditor.onready(function () {
                self.ready();
            });
        };
        this.ready = function () {
            for (var i = 0; i < this.readyCallbacks.length; i++) {
                this.readyCallbacks[i]();
            }
            this.readyCallbacks = [];
        };
        this.create = function (tab) {
            if (Common.Utilities.isNullOrUndefined(tab))
                throw new Error('playbook-editor-canvas.srv create(): tab is null or undefined');
            if (Common.Utilities.isNullOrUndefined(tab.playPrimary))
                throw new Error('playbook-editor-canvas.srv create(): tab.playPrimary is null or undefined');
            var canvas = new Playbook.Models.EditorCanvas(tab.playPrimary, new Common.Models.PlayOpponent(tab.playPrimary.getOpposingUnitType()));
            canvas.tab = tab;
        };
        this.getActiveTab = function () {
            this.activeTab = _playbookEditor.activeTab;
            return this.activeTab;
        };
        this.hasTabs = function () {
            return _playbookEditor.hasTabs();
        };
        this.toBrowser = function () {
            _playbookEditor.toBrowser();
        };
        this.initialize = function ($element, editorType, guid) {
            var canvas = _playbookEditor.canvas;
            // attach listeners to canvas
            // canvas.listen(
            // 	Playbook.Editor.CanvasActions.PlayerContextmenu, 
            // 	function(message: any, player: Common.Models.Player) {
            // 		console.log('action commanded: player contextmenu');
            // 		var absCoords = getAbsolutePosition(player.set.items[1]);
            // 		$rootScope.$broadcast(
            // 			'playbook-editor-canvas.playerContextmenu', 
            // 			{ 
            // 				message: message,
            // 				player: player,
            // 				left: absCoords.left,
            // 				top: absCoords.top
            // 			}
            // 		);
            // 	});
            // Listen for routenode contextmenu
            canvas.listener.listen(Playbook.Enums.Actions.RouteNodeContextmenu, function (data) {
                _contextmenu.open(data);
            });
            canvas.initialize($element);
            return canvas;
        };
        /**
         * Applies the given formation to the field
         * @param {Common.Models.Formation} formation The Formation to apply
         */
        this.applyPrimaryFormation = function (formation) {
            if (canApplyData()) {
                _playbookEditor.canvas.paper.field.applyPrimaryFormation(formation);
            }
        };
        /**
         * Applies the given personnel data to the field
         * @param {Team.Models.Personnel} personnel The Personnel to apply
         */
        this.applyPrimaryPersonnel = function (personnel) {
            if (canApplyData()) {
                _playbookEditor.canvas.paper.field.applyPrimaryPersonnel(personnel);
            }
        };
        /**
         * Applies the given assignmentGroup data to the field
         * @param {Common.Models.AssignmentGroup} assignmentGroup The AssignmentGroup to apply
         */
        this.applyPrimaryAssignmentGroup = function (assignmentGroup) {
            if (canApplyData()) {
                _playbookEditor.canvas.paper.field.applyPrimaryAssignmentGroup(assignmentGroup);
            }
        };
        /**
         * Applies the given play data to the field
         * @param {Common.Models.Play} play The Play to apply
         */
        this.applyPrimaryPlay = function (playPrimary) {
            if (canApplyData()) {
                _playbookEditor.canvas.paper.field.applyPlayPrimary(playPrimary);
            }
        };
        /**
         * Applies the given unitType to the play
         * @param {Common.Models.Play} play The Play to apply
         */
        this.applyPrimaryUnitType = function (unitType) {
            if (canApplyData()) {
                _playbookEditor.canvas.paper.field.applyPrimaryUnitType(unitType);
            }
        };
        function canApplyData() {
            if (!_playbookEditor.canvas ||
                !_playbookEditor.canvas.paper ||
                !_playbookEditor.canvas.paper.field) {
                throw new Error('Cannot apply primary formation; canvas, paper, or field is null or undefined');
            }
            return true;
        }
        function getAbsolutePosition(element) {
            var $dom = $(element.layer.graphics.raphael.node);
            console.log('$dom offsets: ', $dom.offset().left, $dom.offset().top, element.layer.graphics.dimensions.width, element.layer.graphics.dimensions.height);
            //let $playbookCanvas = $dom.closest('playbook-editor-canvas');
            return {
                left: $dom.offset().left,
                top: $dom.offset().top
            };
        }
        this.remove = function (tab) {
            // do something
        };
        this.scrollTo = function (x, y) {
            console.log(x, y);
            this.canvas.paper.scroll(x, y, true);
        };
        this.getEditorTypeClass = function (editorType) {
            return _playbookEditor.getEditorTypeClass(editorType);
        };
        /*****
        *
        *
        *	RECEIVE EXTERNAL COMMANDS
        *
        *
        ******/
        // receives command from playbook.editor to create a new canvas
        $rootScope.$on('playbook-editor-canvas.create', function (e, tab) {
            console.log('creating canvas...');
            self.create(tab);
        });
        $rootScope.$on('playbook-editor-canvas.zoomIn', function (e, data) {
            //self.active.canvas.paper.zoomIn();
        });
        $rootScope.$on('playbook-editor-canvas.zoomOut', function (e, data) {
            //self.active.canvas.paper.zoomOut();
        });
        // receives command from playbook.editor to close canvas
        $rootScope.$on('playbook-editor-canvas.close', function (e, tab) {
            console.log('closing canvas...');
            self.remove(tab);
        });
        // receives command from playbook.editor to activate canvas
        $rootScope.$on('playbook-editor-canvas.activate', function (e, tab) {
            console.log('activating canvas...');
            self.activate(tab);
        });
        // receives command from playbook.editor to add a player to canvas
        $rootScope.$on('playbook-editor-canvas.addPlayer', function (e, data) {
            //self.active.canvas.field.addPlayer({});
            console.info('add player');
        });
        // receives command from playbook.editor to zoom in canvas
        $rootScope.$on('playbook-editor-canvas.zoomIn', function (e, data) {
            console.info('zoom in');
        });
        // receives command from playbook.editor to zoom out canvas
        $rootScope.$on('playbook-editor-canvas.zoomOut', function (e, data) {
            console.info('zoom out');
        });
        init();
    }]);
/// <reference path='../playbook-editor.mdl.ts' />
impakt.playbook.editor.details = angular.module('impakt.playbook.editor.details', [])
    .config(function () {
    console.debug('impakt.playbook.editor.details - config');
})
    .run(function () {
    console.debug('impakt.playbook.editor.details - run');
});
/// <reference path='./playbook-editor-details.mdl.ts' />
impakt.playbook.editor.details.controller('playbook.editor.details.ctrl', ['$scope', '_playbookModals', '_playbookEditorDetails',
    function ($scope, _playbookModals, _playbookEditorDetails) {
        $scope.canvas = _playbookEditorDetails.canvas;
        $scope.paper;
        $scope.field;
        $scope.grid;
        $scope.playPrimary;
        $scope.playOpponent;
        $scope.layers;
        $scope.selected;
        $scope.players;
        $scope.canvas.onready(function () {
            $scope.paper = $scope.canvas.paper;
            $scope.field = $scope.paper.field;
            $scope.grid = $scope.paper.grid;
            $scope.playPrimary = $scope.canvas.playPrimary;
            $scope.playOpponent = $scope.canvas.playOpponent;
            $scope.layers = $scope.field.layers;
            $scope.selected = $scope.field.selected;
            $scope.players = $scope.field.players;
            // update scope when changes to field occur
            $scope.field.onModified(function () {
                if (!$scope.$$phase)
                    $scope.$apply();
            });
        });
        $scope.refreshPreview = function () {
        };
        $scope.deletePrimary = function (play) {
            if (play.editorType == Playbook.Enums.EditorTypes.Play) {
                _playbookModals.deletePlay(play).then(function () {
                    _playbookEditorDetails.closeActiveTab();
                }, function (err) {
                });
            }
            else if (play.editorType == Playbook.Enums.EditorTypes.Formation) {
                _playbookModals.deleteFormation(play.formation).then(function () {
                    _playbookEditorDetails.closeActiveTab();
                }, function (err) {
                });
            }
        };
    }]);
/// <reference path='./playbook-editor-details.mdl.ts' />
impakt.playbook.editor.details.service('_playbookEditorDetails', [
    '_playbookEditor',
    function (_playbookEditor) {
        console.debug('service: impakt.playbook.browser');
        this.canvas = _playbookEditor.canvas;
        this.closeActiveTab = function () {
            _playbookEditor.closeTab(_playbookEditor.activeTab);
        };
    }]);
/// <reference path='../playbook-editor.mdl.ts' />
impakt.playbook.editor.mode = angular.module('impakt.playbook.editor.mode', [])
    .config(function () {
    console.debug('impakt.playbook.editor.mode - config');
})
    .run(function () {
    console.debug('impakt.playbook.editor.mode - run');
});
/// <reference path='./playbook-editor-mode.mdl.ts' />
impakt.playbook.editor.mode.controller('playbook.editor.mode.ctrl', [
    '$scope',
    '_playbookEditor',
    function ($scope, _playbookEditor) {
        $scope.canvas = _playbookEditor.canvas;
        $scope.canvas.onready(function () {
            $scope.cursorCoordinates = $scope.canvas.paper.field.cursorCoordinates;
            $scope.canvas.paper.field.onModified(function (field) {
                $scope.cursorCoordinates.x = field.cursorCoordinates.x;
                $scope.cursorCoordinates.y = field.cursorCoordinates.y;
                if (!$scope.$$phase)
                    $scope.$apply();
            });
        });
    }]);
/// <reference path='./playbook-editor.mdl.ts' />
impakt.playbook.editor.controller('playbook.editor.ctrl', [
    '$scope',
    '$stateParams',
    '_playbookEditor',
    function ($scope, $stateParams, _playbookEditor) {
        $scope.canvas = _playbookEditor.canvas;
        _playbookEditor.init();
        var templatePrefix = 'modules/playbook/editor/';
        $scope.templates = {
            tools: [
                templatePrefix,
                'tools/playbook-editor-tools.tpl.html'
            ].join(''),
            tabs: [
                templatePrefix,
                'tabs/playbook-editor-tabs.tpl.html'
            ].join(''),
            canvas: [
                templatePrefix,
                'canvas/playbook-editor-canvas.tpl.html'
            ].join(''),
            mode: [
                templatePrefix,
                'mode/playbook-editor-mode.tpl.html'
            ].join('')
        };
    }]);
/// <reference path='./playbook-editor.mdl.ts' />
/// <reference path='../playbook.ts' />
/// <reference path='../../../common/common.ts' />
impakt.playbook.editor.service('_playbookEditor', [
    '$rootScope',
    '$q',
    '_base',
    '_associations',
    '_playbook',
    '_playbookModals',
    function ($rootScope, $q, _base, _associations, _playbook, _playbookModals) {
        console.debug('service: impakt.playbook.editor');
        var self = this;
        this.component = new Common.Base.Component('_playbookEditor', Common.Base.ComponentType.Service, [
            '_playbookEditorTools',
            '_playbookEditorTabs',
            '_playbookEditorCanvas'
        ]);
        // tabs and plays are references to the targeted application-level data collections;
        // when the data changes at the application-level; tabs and plays added through this
        // service are handled by reference, so that no copies of them are created, unless
        // a *new* play is being created, or a play is being created as a *new copy* of another.
        // This keeps the data footprint minimal, as well as prevents the redundancy of 
        // data models existing application-wide. 
        this.tabs = impakt.context.Playbook.editor.tabs;
        this.plays = impakt.context.Playbook.editor.plays;
        this.formations = impakt.context.Playbook.editor.formations;
        // sets a default tab - this should be overwritten as soon as it becomes available
        this.activeTab = null;
        this.canvas = null;
        this.toolMode = Playbook.Enums.ToolModes[Playbook.Enums.ToolModes.None];
        $rootScope.$on('playbook-editor.refresh', function (e, formationKey) {
            self.plays = impakt.context.Playbook.editor.plays;
            self.formations = impakt.context.Playbook.editor.formations;
            self.loadTabs();
        });
        this.readyCallback = function () {
            console.log('Playbook editor ready default callback');
        };
        var initialized = false;
        this.ready = function () {
            this.readyCallback();
        };
        this.init = function () {
            console.info('initializing playbook editor service');
            console.debug('service: impakt.playbook.editor - load complete');
            initialized = true;
            var initialPlay = null;
            if (self.tabs.isEmpty() || self.tabs.size() != self.plays.size()) {
                self.loadTabs();
            }
            // check for active tab and initialize the canvas with that tab's play
            self.tabs.forEach(function (tab, index) {
                if (tab.active) {
                    initialPlay = self.plays.filterFirst(function (play) {
                        return play.guid == tab.playPrimary.guid;
                    });
                    var associations = _associations.getAssociated(initialPlay);
                    var assignmentGroup = associations.assignmentGroups.first();
                    var formation = associations.formations.first();
                    var personnel = associations.personnel.first();
                    // let opponentPlayTest = new Common.Models.PlayOpponent();
                    // // initialize the default formation & personnel
                    // opponentPlayTest.setDefault(tab.canvas.field);
                    if (initialPlay) {
                        if (!self.canvas) {
                            self.canvas = new Playbook.Models.EditorCanvas(initialPlay, null);
                        }
                    }
                }
            });
            if (!initialPlay) {
                // Throw an error at this point; we should always have some physical play to use
                // whether it's a new play or an existing play; we shouldn't arbitrarily initialize
                // the canvas with a blank play here
                throw new Error('_playbookEditor init(): \
				Trying to create a new canvas but there are \
				no active tabs / play data to start with.');
            }
            self.canvas.clearListeners();
            self.canvas.onready(function () {
                self.loadTabs();
                self.ready();
            });
            _base.loadComponent(self.component);
        };
        this.onready = function (callback) {
            this.readyCallback = callback;
        };
        /**
         * Checks for open plays in the editor context, as well as the
         * corresponding tab; if the tab is active, grab the corresponding
         * play and pass it in to initialize the canvas.
         */
        this.loadTabs = function () {
            this.plays.forEach(function (play, index) {
                // loop over all plays currently 'open' in the editor context...
                // determine whether each play has a corresponding tab 
                var playExists = false;
                self.tabs.forEach(function (tab, j) {
                    if (tab.playPrimary.guid == play.guid) {
                        playExists = true;
                    }
                });
                if (!playExists) {
                    var tab = new Common.Models.Tab(play, null);
                    // Hmm...
                    tab.active = index == 0;
                    tab.unitType = play.unitType;
                    self.addTab(tab);
                }
            });
        };
        this.addTab = function (tab) {
            // ignore if it is already open
            if (this.tabs.contains(tab.guid)) {
                this.activateTab(tab, true);
                return;
            }
            else {
                // add the new tab...
                this.tabs.add(tab);
                this.activateTab(tab, false);
            }
        };
        this.activateTab = function (tab) {
            this.inactivateOtherTabs(tab);
            // for redundancy to ensure tab is explicitly set to active
            tab.active = true;
            // create another pointer to always track the active tab
            this.activeTab = tab;
            if (this.canvas) {
                // pass new data to canvas
                this.canvas.updatePlay(this.activeTab.playPrimary, null, true);
            }
        };
        this.closeTab = function (tab) {
            this.tabs.close(tab);
            // remove play from editor context
            this.plays.remove(tab.playPrimary.guid);
            // get last tab
            if (this.tabs.hasElements()) {
                // activate the last tab
                this.activateTab(this.tabs.getLast());
            }
            else {
                // no remaining tabs - nullify active Tab
                this.activeTab = null;
                this.canvas.clear();
            }
            // tell tab to close (fire off close callbacks)
            tab.close();
        };
        this.inactivateOtherTabs = function (tab) {
            this.tabs.forEach(function (currentTab, index) {
                if (currentTab.guid != tab.guid)
                    currentTab.active = false;
            });
        };
        this.hasTabs = function () {
            return this.tabs.hasElements();
        };
        this.getEditorTypeClass = function (editorType) {
            return _playbook.getEditorTypeClass(editorType);
        };
        /*
        *
        *	Tool -> Canvas bindings
        *
        */
        this.toggleMenu = function () {
            // N/A
        };
        this.addPlayer = function () {
            $rootScope.$broadcast('playbook-editor-canvas.addPlayer');
        };
        this.save = function () {
            // save the data for the active item
            var activeTab = this.activeTab;
            console.log(activeTab);
            if (activeTab) {
                var play = activeTab.playPrimary;
                switch (play.editorType) {
                    case Playbook.Enums.EditorTypes.Formation:
                        _playbookModals.saveFormation(play);
                        break;
                    case Playbook.Enums.EditorTypes.Play:
                        _playbookModals.savePlay(play);
                        break;
                }
            }
        };
        this.zoomIn = function () {
            $rootScope.$broadcast('playbook-editor-canvas.zoomIn');
        };
        this.zoomOut = function () {
            $rootScope.$broadcast('playbook-editor-canvas.zoomOut');
        };
        this.setCursor = function (cursor) {
            if (this.canvas && this.canvas.$container) {
                this.canvas.$container.css({ 'cursor': cursor });
            }
        };
        this.setToolMode = function (toolMode) {
            console.log('Change editor tool mode: ', toolMode, Playbook.Enums.ToolModes[toolMode]);
            if (this.canvas) {
                this.canvas.toolMode = toolMode;
                this.toolMode = Playbook.Enums.ToolModes[toolMode];
            }
        };
        this.toBrowser = function () {
            _playbook.toBrowser();
        };
        this.editFormation = function (formation) {
            _playbook.editFormation(formation);
            this.loadTabs();
        };
        this.editPlay = function (play) {
            _playbook.editPlay(play);
            this.loadTabs();
        };
        /**
         * Receives broadcast command from other services;
         * loads all tabs according to any plays that have been
         * added to the editor context.
         */
        $rootScope.$on('playbook-editor.loadTabs', function (e, data) {
            self.loadTabs();
        });
    }]);
/// <reference path='../playbook-editor.mdl.ts' />
impakt.playbook.editor.tabs =
    angular.module('impakt.playbook.editor.tabs', [
        'impakt.playbook.editor.canvas'
    ])
        .config(function () {
        console.debug('impakt.playbook.editor.tabs - config');
    })
        .run(function () {
        console.debug('impakt.playbook.editor.tabs - run');
    });
/// <reference path='./playbook-editor-tabs.mdl.ts' />
/// <reference path='../../../../common/common.ts' />
impakt.playbook.editor.tabs.controller('playbook.editor.tabs.ctrl', [
    '$scope',
    '_base',
    '_playbookModals',
    '_playbookEditorTabs',
    function ($scope, _base, _playbookModals, _playbookEditorTabs) {
        this.component = new Common.Base.Component('playbook.editor.tabs.ctrl', Common.Base.ComponentType.Controller);
        function init(self) {
            _playbookEditorTabs.component.loadDependency(self.component);
        }
        $scope.tabs = _playbookEditorTabs.tabs;
        $scope.getEditorTypeClass = function (editorType) {
            return _playbookEditorTabs.getEditorTypeClass(parseInt(editorType));
        };
        $scope.new = function () {
            _playbookModals.openNewEditorTab();
        };
        $scope.close = function (tab) {
            var toClose = confirm('Are you sure you want to close?');
            if (toClose)
                _playbookEditorTabs.close(tab);
        };
        $scope.activate = function (tab) {
            _playbookEditorTabs.activate(tab, true);
        };
        $scope.toBrowser = function () {
            _playbookEditorTabs.toBrowser();
        };
        init(this);
    }]);
/// <reference path='../../playbook.ts' />
/// <reference path='./playbook-editor-tabs.mdl.ts' />
impakt.playbook.editor.tabs.service('_playbookEditorTabs', ['$rootScope',
    '_base',
    '_playbookEditor',
    function ($rootScope, _base, _playbookEditor) {
        console.debug('service: impakt.playbook.editor.tabs');
        var self = this;
        this.tabs = _playbookEditor.tabs;
        this.canvas = _playbookEditor.canvas;
        this.component = new Common.Base.Component('_playbookEditorTabs', Common.Base.ComponentType.Service, [
            'playbook.editor.tabs.ctrl'
        ]);
        function init() {
            _playbookEditor.component.loadDependency(self.component);
        }
        this.close = function (tab) {
            // remove the tab from the array			
            _playbookEditor.closeTab(tab);
        };
        this.activate = function (tab, activateCanvas) {
            if (!tab.active)
                _playbookEditor.activateTab(tab, true);
        };
        this.toBrowser = function () {
            _playbookEditor.toBrowser();
        };
        this.getEditorTypeClass = function (editorType) {
            return _playbookEditor.getEditorTypeClass(editorType);
        };
        this.editFormation = function (formation) {
            _playbookEditor.editFormation(formation);
        };
        this.editPlay = function (play) {
            _playbookEditor.editPlay(play);
        };
        init();
    }]);
/// <reference path='../playbook-editor.mdl.ts' />
impakt.playbook.editor.tools =
    angular.module('impakt.playbook.editor.tools', [])
        .config(function () {
        console.debug('impakt.playbook.editor.tools - config');
    })
        .run(function () {
        console.debug('impakt.playbook.editor.tools - run');
    });
/// <reference path='./playbook-editor-tools.mdl.ts' />
// Inherits from playbookEditorController
impakt.playbook.editor.tools.controller('playbook.editor.tools.ctrl', ['$scope', '$rootScope', '_playbookEditorTools',
    function ($scope, $rootScope, _playbookEditorTools) {
        console.debug('controller: playbook.editor.tools');
        this.component = new Common.Base.Component('playbook.editor.tools.ctrl', Common.Base.ComponentType.Controller);
        function init(self) {
            _playbookEditorTools.component.loadDependency(self.component);
        }
        $scope.tools = _playbookEditorTools.tools;
        $scope.expanded = false;
        $scope.toolClick = function (tool) {
            _playbookEditorTools.invoke(tool);
        };
        $rootScope.$on('playbook-editor-canvas.toggleMenu', function (e, data) {
            $scope.expanded = !$scope.expanded;
        });
        init(this);
    }]);
/// <reference path='../../playbook.ts' />
/// <reference path='./playbook-editor-tools.mdl.ts' />
/// <reference path='../playbook-editor.srv.ts' />
impakt.playbook.editor.tools.service('_playbookEditorTools', ['$rootScope', '_base', '_playbookEditor',
    function ($rootScope, _base, _playbookEditor) {
        console.debug('service: impakt.Playbook.Models.tools');
        this.component = new Common.Base.Component('_playbookEditorTools', Common.Base.ComponentType.Service, [
            'Playbook.Models.tools.ctrl'
        ]);
        function init(self) {
            _playbookEditor.component.loadDependency(self.component);
        }
        this.tools = [
            new Playbook.Models.Tool('Toggle menu', Playbook.Enums.ToolActions.ToggleMenu, 'menu-hamburger'),
            new Playbook.Models.Tool('Save', Playbook.Enums.ToolActions.Save, 'floppy-disk'),
            new Playbook.Models.Tool('Select', Playbook.Enums.ToolActions.Select, 'hand-up', 'Select', Common.Enums.CursorTypes.pointer, Playbook.Enums.ToolModes.Select, true),
            new Playbook.Models.Tool('Assignment', Playbook.Enums.ToolActions.Assignment, 'screenshot', '', Common.Enums.CursorTypes.crosshair, Playbook.Enums.ToolModes.Assignment),
        ];
        this.deselectAll = function () {
            for (var i = 0; i < this.tools.length; i++) {
                this.tools[i].selected = false;
            }
        };
        this.invoke = function (tool) {
            this.deselectAll();
            tool.selected = true;
            switch (tool.action) {
                case Playbook.Enums.ToolActions.Select:
                    break;
                case Playbook.Enums.ToolActions.ToggleMenu:
                    this.toggleMenu();
                    break;
                case Playbook.Enums.ToolActions.AddPlayer:
                    this.addPlayer();
                    break;
                case Playbook.Enums.ToolActions.Save:
                    this.save();
                    break;
                case Playbook.Enums.ToolActions.ZoomIn:
                    this.zoomIn();
                    break;
                case Playbook.Enums.ToolActions.ZoomOut:
                    this.zoomOut();
                    break;
                case Playbook.Enums.ToolActions.Assignment:
                    break;
            }
            this.setCursor(tool.cursor);
            this.setToolMode(tool.mode);
        };
        /*
        *	TOOL BINDINGS
        */
        this.toggleMenu = function () {
            $rootScope.$broadcast('playbook-editor-canvas.toggleMenu');
        };
        this.addPlayer = function () {
            _playbookEditor.addPlayer();
        };
        this.save = function () {
            _playbookEditor.save();
        };
        this.zoomIn = function () {
            _playbookEditor.zoomIn();
        };
        this.zoomOut = function () {
            _playbookEditor.zoomOut();
        };
        this.setCursor = function (cursor) {
            _playbookEditor.setCursor(cursor);
        };
        this.setToolMode = function (mode) {
            _playbookEditor.setToolMode(mode);
        };
        init(this);
    }]);
/// <reference path='../playbook.mdl.ts' />
impakt.playbook.layout = angular.module('impakt.playbook.layout', [])
    .config([
    '$stateProvider',
    function ($stateProvider) {
        console.debug('impakt.playbook.layout - config');
        $stateProvider.state('playbook.layout', {
            url: '/layout',
            views: {
                'sidebar': {},
                'main': {
                    templateUrl: 'modules/playbook/layout/playbook-layout.tpl.html'
                },
                'details': {}
            }
        });
    }])
    .run(function () {
    console.debug('impakt.playbook.layout - run');
});
/// <reference path='../playbook.mdl.ts' />
impakt.playbook.modals = angular.module('impakt.playbook.modals', [])
    .config(function () {
    console.debug('impakt.playbook.modals - config');
})
    .run(function () {
    console.debug('impakt.playbook.modals - run');
});
/// <reference path='../playbook-modals.mdl.ts' />
impakt.playbook.modals.controller('playbook.modals.createFormation.ctrl', ['$scope',
    '$uibModalInstance',
    '_associations',
    '_playbook',
    function ($scope, $uibModalInstance, _associations, _playbook) {
        $scope.selectedUnitType = Team.Enums.UnitTypes.Offense;
        $scope.playbooks = impakt.context.Playbook.playbooks;
        $scope.formation = new Common.Models.Formation($scope.selectedUnitType);
        $scope.formations = impakt.context.Playbook.formations;
        $scope.formation.unitType = $scope.selectedUnitType;
        $scope.unitTypes = impakt.context.Team.unitTypes;
        $scope.selectedPlaybook = $scope.playbooks.first();
        /**
         * Check to ensure there are formations to select as a base formation;
         * Add a new empty formation if there are no others to select from
         */
        $scope.formations.add($scope.formation);
        /**
         * If there are no other formations, the selected base formation
         * will be the current, new formation
         */
        $scope.selectedBaseFormation = $scope.formation;
        impakt.context.Playbook.creation.formations.add($scope.formation);
        /**
         * If there is a selected playbook available, add an association to
         * the new formation to that playbook.
         */
        if ($scope.selectedPlaybook) {
        }
        $scope.selectPlaybook = function (playbook) {
            // update the new formation associated playbook so that it only has 1 playbook
            // association, max, when creating it.
            //$scope.formation.associated.playbooks.only(playbook.guid);
            // Remove the formation from the currently selected playbook
            //$scope.selectedPlaybook.associated.formations.remove($scope.formation.guid);
            // Add the formation to the newly selected playbook
            $scope.selectedPlaybook = playbook;
        };
        $scope.selectBaseFormation = function (formation) {
            if ($scope.selectedBaseFormation != '' &&
                !Common.Utilities.isNullOrUndefined($scope.selectedBaseFormation)) {
                $scope.formation.setPlacements($scope.selectedBaseFormation.placements);
            }
        };
        $scope.unitTypeSelected = function () {
            $scope.formation.unitType = $scope.selectedUnitType;
        };
        $scope.ok = function () {
            $scope.formation.parentRK = 1; // TODO @theBull - deprecate parentRK
            _playbook.createFormation($scope.formation)
                .then(function (createdFormation) {
                _associations.createAssociation(createdFormation, $scope.selectedPlaybook);
                removeFormationFromCreationContext();
                $uibModalInstance.close(createdFormation);
            }, function (err) {
                removeFormationFromCreationContext();
                removeFormationFromCollectionContext();
                $uibModalInstance.close(err);
            });
        };
        $scope.cancel = function () {
            removeFormationFromCreationContext();
            removeFormationFromCollectionContext();
            $uibModalInstance.dismiss();
        };
        function removeFormationFromCreationContext() {
            // Remove the formation from the creation context
            // after creating the new formation or cancelling
            if (!Common.Utilities.isNullOrUndefined($scope.formation)) {
                impakt.context.Playbook.creation.formations.remove($scope.formation.guid);
            }
        }
        function removeFormationFromCollectionContext() {
            // Removes the formation from the formation collection context;
            // call this if you cancel / dismiss the dialog without invoking
            // the createFormation request, since the formation is temporarily
            // added to the formation collection in the situation where
            // there are 0 formations in the user's collection.
            if (!Common.Utilities.isNullOrUndefined($scope.formation)) {
                $scope.formations.remove($scope.formation.guid);
            }
        }
    }]);
/// <reference path='../playbook-modals.mdl.ts' />
impakt.playbook.modals.controller('playbook.modals.createPlay.ctrl', [
    '$scope',
    '$uibModalInstance',
    '_associations',
    '_playbook',
    function ($scope, $uibModalInstance, _associations, _playbook) {
        $scope.unitTypeCollection = impakt.context.Team.unitTypes;
        $scope.selectedUnitType =
            $scope.unitTypeCollection.getByUnitType(Team.Enums.UnitTypes.Offense).toJson();
        $scope.newPlay = new Common.Models.Play($scope.selectedUnitType.unitType);
        $scope.playbooks = impakt.context.Playbook.playbooks;
        $scope.formations = impakt.context.Playbook.formations;
        $scope.assignmentGroups = impakt.context.Playbook.assignmentGroups;
        $scope.selectedPlaybook = $scope.playbooks.first();
        $scope.selectedFormation = $scope.formations.first();
        $scope.selectedAssignmentGroup = $scope.assignmentGroups.first();
        $scope.personnelCollection = impakt.context.Team.personnel;
        $scope.selectedPersonnel = $scope.personnelCollection.first();
        // Intialize new Play with data
        $scope.newPlay.setFormation($scope.selectedFormation);
        $scope.newPlay.setAssignmentGroup($scope.selectedAssignmentGroup);
        $scope.newPlay.setPersonnel($scope.selectedPersonnel);
        // Add the new play onto the creation context, to access from
        // other parts of the application
        impakt.context.Playbook.creation.plays.add($scope.newPlay);
        $scope.selectUnitType = function () {
            $scope.newPlay.unitType = $scope.selectedUnitType.unitType;
        };
        $scope.selectPlaybook = function (playbook) {
            $scope.newPlay.setPlaybook($scope.playbooks.get(playbook.guid));
        };
        $scope.selectFormation = function (formation) {
            $scope.newPlay.setFormation($scope.formations.get(formation.guid));
        };
        $scope.selectAssignmentGroup = function (assignmentGroup) {
            $scope.newPlay.setAssignmentGroup($scope.assignmentGroups.get(assignmentGroup.guid));
        };
        $scope.selectPersonnel = function (personnel) {
            $scope.newPlay.setPersonnel($scope.personnelCollection.get(personnel.guid));
            $scope.selectedUnitType = $scope.unitTypeCollection.getByUnitType(personnel.unitType);
            $scope.selectUnitType($scope.selectedUnitType);
        };
        $scope.ok = function () {
            _playbook.createPlay($scope.newPlay)
                .then(function (createdPlay) {
                _associations.createAssociations(createdPlay, [
                    $scope.selectedPlaybook,
                    $scope.selectedFormation,
                    $scope.selectedPersonnel,
                    $scope.selectedAssignmentGroup
                ]);
                removePlayFromCreationContext();
                $uibModalInstance.close(createdPlay);
            }, function (err) {
                removePlayFromCreationContext();
                console.error(err);
                $uibModalInstance.close(err);
            });
        };
        $scope.cancel = function () {
            removePlayFromCreationContext();
            $uibModalInstance.dismiss();
        };
        // Navigates to the team module
        $scope.toTeam = function () {
            var response = confirm('You are about to navigate to the Team module. Your play will not be created. Continue?');
            if (response) {
                $scope.cancel();
                _playbook.toTeam();
            }
        };
        function removePlayFromCreationContext() {
            // Remove the play from the creation context
            // after creating the new play or cancelling
            if (!Common.Utilities.isNullOrUndefined($scope.newPlay))
                impakt.context.Playbook.creation.plays.remove($scope.newPlay.guid);
        }
    }]);
/// <reference path='../playbook-modals.mdl.ts' />
impakt.playbook.modals.controller('playbook.modals.createPlaybookDuplicateError.ctrl', [
    '$scope',
    '$uibModalInstance',
    '_playbook',
    'playbook',
    function ($scope, $uibModalInstance, _playbook, playbook) {
        $scope.playbook = playbook;
        $scope.ok = function () {
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);
/// <reference path='../playbook-modals.mdl.ts' />
impakt.playbook.modals.controller('playbook.modals.createPlaybook.ctrl', [
    '$scope', '$uibModalInstance', '_playbook',
    function ($scope, $uibModalInstance, _playbook) {
        $scope.unitTypeCollection = impakt.context.Team.unitTypes;
        $scope.selectedUnitType = $scope.unitTypeCollection.getByUnitType(Team.Enums.UnitTypes.Offense);
        $scope.newPlaybookModel = new Common.Models.PlaybookModel($scope.selectedUnitType);
        $scope.ok = function () {
            $scope.newPlaybookModel.unitType = $scope.selectedUnitType.unitType;
            _playbook.createPlaybook($scope.newPlaybookModel)
                .then(function (createdPlaybook) {
                $uibModalInstance.close(createdPlaybook);
            }, function (err) {
                console.error(err);
                $uibModalInstance.close(err);
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);
/// <reference path='../playbook-modals.mdl.ts' />
impakt.playbook.modals.controller('playbook.modals.deleteAssignmentGroup.ctrl', [
    '$scope',
    '$uibModalInstance',
    '_associations',
    '_playbook',
    'assignmentGroup',
    function ($scope, $uibModalInstance, _associations, _playbook, assignmentGroup) {
        $scope.assignmentGroup = assignmentGroup;
        $scope.ok = function () {
            _playbook.deleteAssignmentGroup($scope.assignmentGroup)
                .then(function (results) {
                _associations.deleteAssociations($scope.assignmentGroup.associationKey);
                $uibModalInstance.close(results);
            }, function (err) {
                console.error(err);
                $uibModalInstance.close(err);
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);
/// <reference path='../playbook-modals.mdl.ts' />
impakt.playbook.modals.controller('playbook.modals.deleteFormation.ctrl', [
    '$scope',
    '$uibModalInstance',
    '_associations',
    '_playbook',
    'formation',
    function ($scope, $uibModalInstance, _associations, _playbook, formation) {
        $scope.formation = formation;
        $scope.ok = function () {
            _playbook.deleteFormation($scope.formation)
                .then(function (results) {
                _associations.deleteAssociations($scope.formation.associationKey);
                $uibModalInstance.close(results);
            }, function (err) {
                console.error(err);
                $uibModalInstance.close(err);
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);
/// <reference path='../playbook-modals.mdl.ts' />
impakt.playbook.modals.controller('playbook.modals.deletePlay.ctrl', [
    '$scope', '$uibModalInstance', '_playbook', 'play',
    function ($scope, $uibModalInstance, _playbook, play) {
        $scope.play = play;
        $scope.ok = function () {
            _playbook.deletePlay($scope.play)
                .then(function (results) {
                $uibModalInstance.close(results);
            }, function (err) {
                console.error(err);
                $uibModalInstance.close(err);
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);
/// <reference path='../playbook-modals.mdl.ts' />
impakt.playbook.modals.controller('playbook.modals.deletePlaybook.ctrl', [
    '$scope',
    '$uibModalInstance',
    '_playbook',
    'playbook',
    function ($scope, $uibModalInstance, _playbook, playbook) {
        $scope.playbook = playbook;
        $scope.ok = function () {
            _playbook.deletePlaybook($scope.playbook)
                .then(function (results) {
                $uibModalInstance.close(results);
            }, function (err) {
                console.error(err);
                $uibModalInstance.close(err);
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);
/// <reference path='../playbook-modals.mdl.ts' />
impakt.playbook.modals.controller('playbook.modals.newEditor.ctrl', [
    '$scope',
    '$uibModalInstance',
    '_playbookEditorTabs',
    'data',
    function ($scope, $uibModalInstance, _playbookEditorTabs, data) {
        $scope.plays = impakt.context.Playbook.plays;
        $scope.formations = impakt.context.Playbook.formations;
        $scope.selectedPlay = null;
        $scope.selectedFormation = null;
        $scope.editPlaySelected = false;
        $scope.editFormationSelected = false;
        $scope.selectPlay = function () { };
        $scope.selectFormation = function () { };
        $scope.editPlay = function () {
            $scope.editPlaySelected = true;
            $scope.editFormationSelected = false;
            $scope.selectedFormation = null;
        };
        $scope.editFormation = function () {
            $scope.editPlaySelected = false;
            $scope.editFormationSelected = true;
            $scope.selectedPlay = null;
        };
        $scope.ok = function () {
            if ($scope.selectedPlay)
                _playbookEditorTabs.editPlay($scope.selectedPlay);
            if ($scope.selectedFormation)
                _playbookEditorTabs.editFormation($scope.selectedFormation);
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);
/// <reference path='./playbook-modals.mdl.ts' />
impakt.playbook.modals.service('_playbookModals', [
    '$q',
    '__modals',
    function ($q, __modals) {
        /**
         *
         * PLAYBOOK
         *
         */
        this.createPlaybook = function () {
            var d = $q.defer();
            console.log('create playbook');
            var modalInstance = __modals.open('', 'modules/playbook/modals/create-playbook/create-playbook.tpl.html', 'playbook.modals.createPlaybook.ctrl', {});
            modalInstance.result.then(function (createdPlaybook) {
                console.log(createdPlaybook);
                d.resolve();
            }, function (results) {
                console.log('dismissed');
                d.reject();
            });
            return d.promise;
        };
        this.createPlaybookDuplicate = function (playbookModel) {
            var d = $q.defer();
            var modalInstance = __modals.open('', 'modules/playbook/modals/create-playbook-duplicate-error/create-playbook-duplicate-error.tpl.html', 'playbook.modals.createPlaybookDuplicateError.ctrl', {
                playbook: function () {
                    return playbookModel;
                }
            });
            modalInstance.result.then(function (createdPlaybook) {
                console.log(createdPlaybook);
                d.resolve();
            }, function (results) {
                console.log('dismissed');
                d.reject();
            });
            return d.promise;
        };
        this.deletePlaybook = function (playbook) {
            var d = $q.defer();
            var modalInstance = __modals.open('', 'modules/playbook/modals/delete-playbook/delete-playbook.tpl.html', 'playbook.modals.deletePlaybook.ctrl', {
                playbook: function () {
                    return playbook;
                }
            });
            modalInstance.result.then(function (results) {
                console.log(results);
                d.resolve();
            }, function (results) {
                console.log('dismissed');
                d.reject();
            });
            return d.promise;
        };
        /**
         *
         * PLAY
         *
         */
        this.createPlay = function () {
            var d = $q.defer();
            console.log('create play');
            var modalInstance = __modals.open('lg', 'modules/playbook/modals/create-play/create-play.tpl.html', 'playbook.modals.createPlay.ctrl', {});
            modalInstance.result.then(function (createdPlaybook) {
                console.log(createdPlaybook);
                d.resolve();
            }, function (results) {
                console.log('dismissed');
                d.reject();
            });
            return d.promise;
        };
        this.savePlay = function (play) {
            var d = $q.defer();
            var modalInstance = __modals.open('lg', 'modules/playbook/modals/save-play/save-play.tpl.html', 'playbook.modals.savePlay.ctrl', {
                play: function () {
                    return play;
                }
            });
            modalInstance.result.then(function (results) {
                console.log(results);
                d.resolve();
            }, function (results) {
                console.log('dismissed');
                d.reject();
            });
            return d.promise;
        };
        this.deletePlay = function (play) {
            var d = $q.defer();
            var modalInstance = __modals.open('', 'modules/playbook/modals/delete-play/delete-play.tpl.html', 'playbook.modals.deletePlay.ctrl', {
                play: function () {
                    return play;
                }
            });
            modalInstance.result.then(function (results) {
                console.log(results);
                d.resolve();
            }, function (results) {
                console.log('dismissed');
                d.reject();
            });
            return d.promise;
        };
        /**
         *
         * FORMATION
         *
         */
        this.createFormation = function () {
            var d = $q.defer();
            var modalInstance = __modals.open('lg', 'modules/playbook/modals/create-formation/create-formation.tpl.html', 'playbook.modals.createFormation.ctrl', {});
            modalInstance.result.then(function (createdFormation) {
                d.resolve();
            }, function (results) {
                d.reject();
            });
            return d.promise;
        };
        this.saveFormation = function (play) {
            var d = $q.defer();
            var modalInstance = __modals.open('lg', 'modules/playbook/modals/save-formation/save-formation.tpl.html', 'playbook.modals.saveFormation.ctrl', {
                play: function () {
                    return play;
                }
            });
            modalInstance.result.then(function (results) {
                console.log(results);
                d.resolve();
            }, function (results) {
                console.log('dismissed');
                d.reject();
            });
            return d.promise;
        };
        this.deleteFormation = function (formation) {
            var d = $q.defer();
            console.log('delete formation');
            var modalInstance = __modals.open('', 'modules/playbook/modals/delete-formation/delete-formation.tpl.html', 'playbook.modals.deleteFormation.ctrl', {
                formation: function () {
                    return formation;
                }
            });
            modalInstance.result.then(function (results) {
                d.resolve();
            }, function (results) {
                console.log('dismissed');
                d.reject();
            });
            return d.promise;
        };
        this.deleteAssignmentGroup = function (assignmentGroup) {
            var d = $q.defer();
            var modalInstance = __modals.open('', 'modules/playbook/modals/delete-assignmentGroup/delete-assignmentGroup.tpl.html', 'playbook.modals.deleteAssignmentGroup.ctrl', {
                formation: function () {
                    return assignmentGroup;
                }
            });
            modalInstance.result.then(function (results) {
                d.resolve();
            }, function (results) {
                console.log('dismissed');
                d.reject();
            });
            return d.promise;
        };
        this.openNewEditorTab = function () {
            var d = $q.defer();
            console.log('new editor tab');
            var modalInstance = __modals.open('', 'modules/playbook/modals/new-editor/new-editor.tpl.html', 'playbook.modals.newEditor.ctrl', {
                data: function () {
                    return 1;
                }
            });
            modalInstance.result.then(function (data) {
                console.log(data);
                d.resolve();
            }, function (results) {
                console.log('dismissed');
                d.reject();
            });
            return d.promise;
        };
    }]);
/// <reference path='../playbook-modals.mdl.ts' />
impakt.playbook.modals.controller('playbook.modals.saveFormation.ctrl', ['$scope',
    '$uibModalInstance',
    '_playbook',
    'play',
    function ($scope, $uibModalInstance, _playbook, play) {
        $scope.play = play;
        $scope.playbooks = impakt.context.Playbook.playbooks;
        $scope.formation = play.formation;
        $scope.copyFormation = false;
        $scope.associatedPlaybook;
        var originalFormationKey = $scope.formation.key;
        var originalFormationName = $scope.formation.name;
        var originalFormationGuid = $scope.formation.guid;
        function init() {
            // look for first associated playbook in formation
            var associatedPlaybook = false;
        }
        $scope.copyFormationChange = function () {
            $scope.formation.key = $scope.copyFormation ? -1 : originalFormationKey;
            $scope.formation.name = $scope.copyFormation ?
                $scope.formation.name + ' (copy)' :
                originalFormationName;
            $scope.formation.guid = $scope.copyFormation ?
                Common.Utilities.guid() :
                originalFormationGuid;
        };
        $scope.ok = function () {
            var options = {
                formation: {
                    action: Common.API.Actions.Overwrite // overwrite if modified
                }
            };
            if (Common.Utilities.isNullOrUndefined($scope.formation.key)) {
                options.formation.action = Common.API.Actions.Create;
            }
            if ($scope.copyFormation) {
                options.formation.action = Common.API.Actions.Copy;
            }
            _playbook.saveFormation($scope.formation, options)
                .then(function (savedFormation) {
                if ($scope.copyFormation) {
                    var contextFormation = impakt.context.Playbook.formations.get(savedFormation.guid);
                    if (contextFormation) {
                        // add new copied formation as new tab in editor
                        _playbook.editFormation(contextFormation);
                    }
                }
                console.log(savedFormation);
                $uibModalInstance.close(savedFormation);
            }, function (err) {
                console.error(err);
                $uibModalInstance.close(err);
            });
        };
        $scope.cancel = function () {
            $scope.formation.key = originalFormationKey;
            $scope.formation.name = originalFormationName;
            $uibModalInstance.dismiss();
        };
        init();
    }]);
/// <reference path='../playbook-modals.mdl.ts' />
impakt.playbook.modals.controller('playbook.modals.savePlay.ctrl', [
    '$scope',
    '$uibModalInstance',
    '_playbook',
    'play',
    function ($scope, $uibModalInstance, _playbook, play) {
        $scope.play = play;
        $scope.copyPlay = false;
        $scope.copyFormation = false;
        $scope.copyPersonnel = false;
        $scope.copyAssignmentGroup = false;
        // retain the orginal keys for toggling copy state
        var originalPlayKey = $scope.play.key;
        var originalFormationKey = $scope.play.formation.key;
        var originalAssignmentGroupKey = $scope.play.assignmentGroup.key;
        $scope.copyPlayChange = function () {
            $scope.play.key =
                $scope.copyPlay ? -1 :
                    originalPlayKey;
        };
        $scope.copyFormationChange = function () {
            $scope.play.formation.key =
                $scope.copyFormation ? -1 :
                    originalFormationKey;
        };
        $scope.copyAssignmentGroupChange = function () {
            $scope.play.assignmentGroup.key =
                $scope.copyAssignmentGroup ? -1 :
                    originalAssignmentGroupKey;
        };
        $scope.ok = function () {
            var play = $scope.play;
            // determine whether there are changes to the entity; if so,
            // set action to overwrite, otherwise set action to nothing
            // track options for how to send the data to the server
            // TO-DO: create a better model for this
            var options = {
                play: {
                    action: play.modified ? Common.API.Actions.Overwrite : Common.API.Actions.Nothing
                },
                formation: {
                    action: play.formation.modified ? Common.API.Actions.Overwrite : Common.API.Actions.Nothing
                },
                assignmentGroup: {
                    action: play.assignmentGroup.key == -1 ?
                        Common.API.Actions.Create :
                        (play.assignmentGroup.modified ?
                            Common.API.Actions.Overwrite :
                            Common.API.Actions.Nothing)
                }
            };
            // If any of the following entities (play, formation, assignmentGroup)
            // exist on the play and their corresponding copy boolean
            // (copyPlay, copyFormation, copyPersonnel, copyAssignmentGroup) is set to true,
            // a new corresponding entity (Play, Formation, AssigmentGroup)
            // will be created and the new entity will have its values copied 
            // from the existing entity.
            // this new copied entity gets sent to server-side for creation.
            if ($scope.play && $scope.copyPlay) {
                originalPlayKey = $scope.play.key;
                $scope.play.key = -1;
                options.play.action = Common.API.Actions.Copy;
                play = $scope.play;
            }
            if ($scope.play.formation && $scope.copyFormation) {
                originalFormationKey = $scope.play.formation.key;
                $scope.play.formation.key = -1;
                options.formation.action = Common.API.Actions.Copy;
                play.formation = $scope.formation;
            }
            if ($scope.play.assignmentGroup && $scope.copyAssignmentGroup) {
                originalAssignmentGroupKey = $scope.play.assignmentGroup.key;
                $scope.play.assignmentGroup.key = -1;
                options.assignmentGroup.action = Common.API.Actions.Copy;
                play.assignmentGroup = $scope.assignmentGroup;
            }
            _playbook.savePlay(play, options)
                .then(function (savedPlay) {
                $uibModalInstance.close(savedPlay);
            }, function (err) {
                console.error(err);
                $uibModalInstance.close(err);
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);
/// <reference path='../playbook.mdl.ts' />
impakt.playbook.nav = angular.module('impakt.playbook.nav', [])
    .config(function () {
    console.debug('impakt.playbook.nav - config');
})
    .run(function () {
    console.debug('impakt.playbook.nav - run');
});
/// <reference path='./playbook-nav.mdl.ts' />
impakt.playbook.nav.controller('playbook.nav.ctrl', ['$scope', '$location', '_playbook', '_playbookNav',
    function ($scope, $location, _playbook, _playbookNav) {
    }]);
/// <reference path='../../nav/nav.fct.ts' />
/// <reference path='./playbook-nav.mdl.ts' />
impakt.playbook.nav.service('_playbookNav', ['__nav', '_playbook', function (__nav, _playbook) {
        console.log('_playbookNav (component service)');
    }]);
/// <reference path='./playbook.mdl.ts' />
/**
 * Playbook constants defined here
 */
impakt.playbook.constant('PLAYBOOK', {
    //GET_PLAYBOOKS: 'data/playbook.json',
    ENDPOINT: '/playbook',
    // Playbooks
    CREATE_PLAYBOOK: '/createPlaybook',
    GET_PLAYBOOKS: '/getPlaybooks',
    GET_PLAYBOOK: '/getPlaybook',
    DELETE_PLAYBOOK: '/deletePlaybook',
    // Formations
    CREATE_FORMATION: '/createFormation',
    GET_FORMATIONS: '/getFormations',
    GET_FORMATION: '/getFormation',
    DELETE_FORMATION: '/deleteFormation',
    UPDATE_FORMATION: '/updateFormation',
    // Assignments
    CREATE_ASSIGNMENTGROUP: '/createAssignmentGroup',
    GET_ASSIGNMENTGROUPS: '/getAssignmentGroups',
    UPDATE_ASSIGNMENTGROUP: '/updateAssignmentGroup',
    DELETE_ASSIGNMENTGROUP: '/deleteAssignmentGroup',
    // Plays
    CREATE_PLAY: '/createPlay',
    UPDATE_PLAY: '/updatePlay',
    GET_PLAY: '/getPlay',
    GET_PLAYS: '/getPlays',
    DELETE_PLAY: '/deletePlay'
});
/// <reference path='./playbook.mdl.ts' />
impakt.playbook.controller('playbook.ctrl', ['$scope', '$state', '$stateParams', '_playbook',
    function ($scope, $state, $stateParams, _playbook) {
        // load up the browser by default
        $state.go('playbook.browser');
    }]);
/// <reference path='./models/models.ts' />
/// <reference path='./playbook.ts' />
// Playbook service
impakt.playbook.service('_playbook', [
    'PLAYBOOK',
    '$rootScope',
    '$q',
    '$state',
    '__api',
    '__localStorage',
    '__notifications',
    '_associations',
    '_playbookModals',
    function (PLAYBOOK, $rootScope, $q, $state, __api, __localStorage, __notifications, _associations, _playbookModals) {
        var self = this;
        this.drilldown = {
            playbook: null
        };
        // TODO @theBull - ensure the 'current user' is being addressed
        // TODO @theBull - add notification handling
        /**
         * Retrieves all playbooks for the current user
         */
        this.getPlaybooks = function () {
            var d = $q.defer();
            var notification = __notifications.pending('Getting playbooks...');
            __api.get(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.GET_PLAYBOOKS))
                .then(function (response) {
                var collection = new Common.Models.PlaybookModelCollection(Team.Enums.UnitTypes.Mixed);
                if (response && response.data && response.data.results) {
                    var playbookResults = Common.Utilities.parseData(response.data.results);
                    for (var i = 0; i < playbookResults.length; i++) {
                        var playbookResult = playbookResults[i];
                        if (playbookResult && playbookResult.data && playbookResult.data.model) {
                            var playbookModel = new Common.Models.PlaybookModel(Team.Enums.UnitTypes.Other);
                            playbookResult.data.model.key = playbookResult.key;
                            playbookModel.fromJson(playbookResult.data.model);
                            collection.add(playbookModel);
                        }
                    }
                }
                notification.success([collection.size(), ' Playbooks successfully retreived'].join(''));
                d.resolve(collection);
            }, function (error) {
                notification.error('Failed to retieve Playbooks');
                console.error(error);
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Gets a single playbook with the given key
         * @param {number} key The key of the playbook to retrieve
         */
        this.getPlaybook = function (key) {
            var d = $q.defer();
            __api.get(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.GET_PLAYBOOK, '/' + key))
                .then(function (response) {
                var playbook = Common.Utilities.parseData(response.data.results);
                d.resolve(playbook);
            }, function (error) {
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Sends a playbook model to the server for storage
         * @param {Common.Models.PlaybookModel} playbookModel The model to be created/saved
         */
        this.createPlaybook = function (newPlaybookModel) {
            var d = $q.defer();
            if (!Common.Utilities.isNullOrUndefined(newPlaybookModel)) {
                var nameExists = impakt.context.Playbook.playbooks.hasElementWhich(function (playbookModel, index) {
                    return playbookModel.name == newPlaybookModel.name;
                });
                if (nameExists) {
                    var notification_2 = __notifications.warning('Failed to create playbook. Playbook "', newPlaybookModel.name, '" already exists.');
                    _playbookModals.createPlaybookDuplicate(newPlaybookModel);
                    return;
                }
            }
            // set key to -1 to ensure a new object is created server-side
            newPlaybookModel.key = -1;
            var playbookModelJson = newPlaybookModel.toJson();
            var notification = __notifications.pending('Creating playbook "', newPlaybookModel.name, '"...');
            __api.post(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.CREATE_PLAYBOOK), {
                version: 1,
                name: newPlaybookModel.name,
                data: {
                    version: 1,
                    model: playbookModelJson
                }
            })
                .then(function (response) {
                var results = Common.Utilities.parseData(response.data.results);
                var playbookModel = new Common.Models.PlaybookModel(newPlaybookModel.unitType);
                if (results && results.data && results.data.model) {
                    results.data.model.key = results.key;
                    playbookModel.fromJson(results.data.model);
                    // update the context
                    impakt.context.Playbook.playbooks.add(playbookModel);
                }
                else {
                    throw new Error('CreatePlaybook did not return a valid playbook model');
                }
                notification.success('Successfully created playbook "', playbookModel.name, '"');
                d.resolve(playbookModel);
            }, function (error) {
                notification.error('Failed to create playbook "', newPlaybookModel.name, '"');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Deletes the given playbook for the current user
         * @param {Common.Models.PlaybookModel} playbook The playbook to be deleted
         */
        this.deletePlaybook = function (playbook) {
            var d = $q.defer();
            var notification = __notifications.pending('Deleting playbook "', playbook.name, '"...');
            __api.post(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.DELETE_PLAYBOOK), { key: playbook.key }).then(function (response) {
                // update the context
                impakt.context.Playbook.playbooks.remove(playbook.guid);
                notification.success('Deleted playbook "', playbook.name, '"');
                d.resolve(playbook);
            }, function (error) {
                notification.error('Failed to delete playbook "', playbook.name, '"');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Creates the given formation for the current user
         * @param {Common.Models.Formation} newFormation The formation to be created
         */
        this.createFormation = function (newFormation) {
            var d = $q.defer();
            if (newFormation.key > 0) {
                throw new Error('The formation you are trying to create already exists (key > 0) key: '
                    + newFormation.key);
            }
            var notification = __notifications.pending('Creating formation "', newFormation.name, '"...');
            __api.post(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.CREATE_FORMATION), {
                version: 1,
                name: newFormation.name,
                ownerRK: 1,
                parentRK: 1,
                data: {
                    version: 1,
                    name: newFormation.name,
                    ownerRK: 1,
                    parentRK: 1,
                    formation: newFormation.toJson()
                }
            })
                .then(function (response) {
                var result = Common.Utilities.parseData(response.data.results);
                if (!result || !result.data || !result.data.formation) {
                    d.reject('Create playbook result was invalid');
                }
                var formationModel = new Common.Models.Formation(Team.Enums.UnitTypes.Other);
                result.data.formation.key = result.key;
                formationModel.fromJson(result.data.formation);
                console.log(formationModel);
                impakt.context.Playbook.formations.add(formationModel);
                notification.success('Successfully created formation "', formationModel.name, '"');
                //self.editFormation(formationModel);
                d.resolve(formationModel);
            }, function (error) {
                notification.error('Failed to create formation "', newFormation.name, '"');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Deletes the given formation for the current user
         * @param {Common.Models.Formation} formation The formation to be deleted
         */
        this.deleteFormation = function (formation) {
            var d = $q.defer();
            var notification = __notifications.pending('Deleting formation "', formation.name, '"...');
            __api.post(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.DELETE_FORMATION), {
                key: formation.key
            })
                .then(function (response) {
                var formationKey = response.data.results.key;
                // TODO @theBull
                // Deleting a formation will adversely impakt all plays that are
                // associated with that formation...How do we handle this?
                // update the context
                impakt.context.Playbook.formations.remove(formation.guid);
                notification.success('Successfully deleted formation "', formation.name, '"');
                d.resolve(formationKey);
            }, function (error) {
                notification.error('Failed to delete formation "', formation.name, '"');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Retrieves all formations for the current user
         */
        this.getFormations = function () {
            var d = $q.defer();
            var notification = __notifications.pending('Getting Formations...');
            __api.get(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.GET_FORMATIONS, '?$filter=ParentRK gt 0'))
                .then(function (response) {
                var results = Common.Utilities.parseData(response.data.results);
                var collection = new Common.Models.FormationCollection(Team.Enums.UnitTypes.Mixed);
                var formations = [];
                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    if (result && result.data && result.data.formation) {
                        var formation = result.data.formation;
                        formation.key = result.key;
                        formations.push(formation);
                    }
                    else {
                        throw new Error('An invalid formation was retrieved');
                    }
                }
                collection.fromJson(formations);
                notification.success(collection.size(), ' Formations successfully retrieved');
                d.resolve(collection);
            }, function (error) {
                notification.error('Failed to retrieve Formations');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Retrieves the formation with the given key for the current user
         * @param {[type]} key The key to retrieve
         */
        this.getFormation = function (key) {
            var d = $q.defer();
            __api.get(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.GET_FORMATION, '?Key=' + key))
                .then(function (response) {
                var rawResults = Common.Utilities.parseData(response.data.results);
                var formationRaw = (JSON.parse(rawResults.data)).formation;
                var formationModel = new Common.Models.Formation(Team.Enums.UnitTypes.Other);
                formationModel.fromJson(formationRaw);
                d.resolve(formationModel);
            }, function (error) {
                d.reject(error);
            });
            return d.promise;
        };
        this.newFormation = function () {
        };
        /**
         * Opens the given formation for editing / navigates to the play editor
         * @param {Common.Models.Formation} formation The formation to be edited
         */
        this.editFormation = function (formation, forceOpen) {
            var notification = __notifications.info('Opened formation "', formation.name, '" for editing.');
            // determine whether the formation is already open            
            var formationOpen = forceOpen ? forceOpen : impakt.context.Playbook.editor.plays.hasElementWhich(function (play) {
                return play.editorType == Playbook.Enums.EditorTypes.Formation &&
                    play.formation.guid == formation.guid;
            });
            // do not add a new editor play to the context if the formation
            // is already open
            if (!formationOpen) {
                // formation isn't opened yet,
                // 1. create new play for the formation to sit in
                // 2. create a working copy of the formation
                // 3. update the working copy's properties accordingly
                // 4. add the working play to the editor context
                // Set Play to formation-only editing mode
                var play = new Common.Models.PlayPrimary(formation.unitType);
                // need to make a copy of the formation here
                var formationCopy = formation.copy();
                play.setFormation(formationCopy);
                play.editorType = Playbook.Enums.EditorTypes.Formation;
                play.name = formation.name;
                // add the play onto the editor context
                impakt.context.Playbook.editor.plays.add(play);
            }
            // navigate to playbook editor
            //if(!$state.is('playbook.editor'))
            $state.transitionTo('playbook.editor');
        };
        /**
         * Updates the given formation for the current user
         * @param {Common.Models.Formation} formation The formation to update
         */
        this.updateFormation = function (formation) {
            var d = $q.defer();
            // update assignment collection to json object
            var formationData = formation.toJson();
            var notification = __notifications.pending('Updating formation');
            __api.post(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.UPDATE_FORMATION), {
                version: 1,
                name: formationData.name,
                key: formationData.key,
                data: {
                    version: 1,
                    name: formationData.name,
                    key: formationData.key,
                    formation: formationData
                }
            })
                .then(function (response) {
                var results = Common.Utilities.parseData(response.data.results);
                var formationModel = new Common.Models.Formation(Team.Enums.UnitTypes.Other);
                if (results && results.data && results.data.formation) {
                    formationModel.fromJson(results.data.formation);
                    // update the context
                    impakt.context.Playbook.formations.set(formationModel.guid, formationModel);
                }
                notification.success('Successfully updated formation "', formation.name, '"');
                d.resolve(formationModel);
            }, function (error) {
                notification.error('Failed to update formation "', formation.name, '"');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Saves the given formation according to the options passed for the given user
         * TODO @theBull create Options model
         *
         * @param {Common.Models.Formation} formation    Formation to save
         * @param {any}                  options Save options
         */
        this.saveFormation = function (formation, options) {
            var d = $q.defer();
            var notification = __notifications.pending('Saving formation "', formation.name, '"...');
            if (options.formation.action == Common.API.Actions.Create ||
                options.formation.action == Common.API.Actions.Copy) {
                // ensure formation has no key
                formation.key = -1;
                // ensure formation has a unique guid
                formation.guid = Common.Utilities.guid();
                self.createFormation(formation)
                    .then(function (createdFormation) {
                    notification.success('Successfully created and saved formation "', formation.name, '"');
                    d.resolve(createdFormation);
                }, function (err) {
                    notification.error('Failed to save formation "', formation.name, '"');
                    d.reject(err);
                });
            }
            else if (options.formation.action == Common.API.Actions.Overwrite) {
                // double check that the formation is  modified
                if (formation.modified) {
                    self.updateFormation(formation)
                        .then(function (updatedFormation) {
                        notification.success('Successfully saved formation "', formation.name, '"');
                        d.resolve(updatedFormation);
                    }, function (err) {
                        notification.error('Failed to save formation "', formation.name, '"');
                        d.reject(err);
                    });
                }
                else {
                    notification.warning('Formation "', formation.name, '" was not saved; no changes were detected.');
                    d.reject(null);
                }
            }
            return d.promise;
        };
        /**
         * Retrieves all assignment groups for the current user
         */
        this.getAssignmentGroups = function () {
            var d = $q.defer();
            var assignmentsNotification = __notifications.pending('Getting Assignments...');
            __api.get(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.GET_ASSIGNMENTGROUPS))
                .then(function (response) {
                var results = Common.Utilities.parseData(response.data.results);
                var assignmentGroupCollection = new Common.Models.AssignmentGroupCollection(Team.Enums.UnitTypes.Mixed);
                for (var i = 0; i < results.length; i++) {
                    var result = results[i];
                    if (result && result.data && result.data.assignmentGroup) {
                        var assignmentGroupModel = new Common.Models.AssignmentGroup(Team.Enums.UnitTypes.Other);
                        assignmentGroupModel.key = result.key;
                        result.data.assignmentGroup.key = result.key;
                        assignmentGroupModel.fromJson(result.data.assignmentGroup);
                        assignmentGroupCollection.add(assignmentGroupModel);
                    }
                }
                assignmentsNotification.success(assignmentGroupCollection.size(), ' Assignment groups successfully retrieved');
                d.resolve(assignmentGroupCollection);
            }, function (error) {
                assignmentsNotification.error('Failed to retrieve Assignment groups');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Creates a collection group
         * @param {[type]} assignments The assignments to create
         */
        this.createAssignmentGroup = function (assignmentGroup) {
            var d = $q.defer();
            var notification = __notifications.pending('Creating assignment group "', assignmentGroup.name, '"...');
            __api.post(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.CREATE_ASSIGNMENTGROUP), {
                version: 1,
                name: assignmentGroup.name,
                ownerRK: 1,
                parentRK: 1,
                data: {
                    version: 1,
                    name: assignmentGroup.name,
                    ownerRK: 1,
                    parentRK: 1,
                    assignmentGroup: assignmentGroup.toJson()
                }
            })
                .then(function (response) {
                var results = Common.Utilities.parseData(response.data.results);
                var assignmentGroup = new Common.Models.AssignmentGroup(Team.Enums.UnitTypes.Other);
                if (results && results.data && results.data.assignmentGroup) {
                    var rawAssignmentGroup = results.data.assignmentGroup;
                    assignmentGroup.key = results.key;
                    assignmentGroup.fromJson(rawAssignmentGroup);
                    notification.success('Successfully created assignment group "', assignmentGroup.name, '"');
                    d.resolve(assignmentGroup);
                }
                else {
                    notification.warning('Created assignment group "', assignmentGroup.name, '" but an error may have occurred \
                         in the process. You may need to refresh your browser if you experience issues.');
                    d.reject(null);
                }
            }, function (error) {
                notification.success('Failed to create assignment group "', assignmentGroup.name, '"');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Updates the given assignment collection (group) for the current user
         * @param {Common.Models.AssignmentGroup} assignments The assignment collection (group) to update
         */
        this.updateAssignmentGroup = function (assignmentGroup) {
            var d = $q.defer();
            // update assignment group to json object
            var assignmentGroupData = assignmentGroup.toJson();
            var notification = __notifications.pending('Updating assignment group "', assignmentGroup.name, '"...');
            __api.post(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.UPDATE_ASSIGNMENTGROUP), {
                version: 1,
                name: assignmentGroupData.name,
                key: assignmentGroupData.key,
                data: {
                    version: 1,
                    name: assignmentGroupData.name,
                    key: assignmentGroupData.key,
                    assignmentGroup: assignmentGroup
                }
            })
                .then(function (response) {
                var results = Common.Utilities.parseData(response.data.results);
                var assignmentGroupModel = new Common.Models.AssignmentGroup(Team.Enums.UnitTypes.Other);
                if (results && results.data && results.data.assignmentGroup) {
                    assignmentGroupModel.fromJson(results.data.assignmentGroup);
                    // update the context
                    impakt.context.Playbook.assignmentGroups.set(assignmentGroupModel.guid, assignmentGroupModel);
                }
                notification.success('Successfully updated assignment group "', assignmentGroupModel.name, '"');
                d.resolve(assignmentGroupModel);
            }, function (error) {
                notification.error('Failed to update assignment group "', assignmentGroup.name, '"');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Creates the given play for the current user
         * @param {Common.Models.Play} play The play to create
         */
        this.createPlay = function (play) {
            var playData = play.toJson();
            var d = $q.defer();
            var notification = __notifications.pending('Creating play "', play.name, '"...');
            __api.post(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.CREATE_PLAY), {
                version: 1,
                name: play.name,
                ownerRK: 1,
                parentRK: 1,
                data: {
                    version: 1,
                    name: play.name,
                    ownerRK: 1,
                    parentRK: 1,
                    play: playData
                }
            })
                .then(function (response) {
                var results = Common.Utilities.parseData(response.data.results);
                var playModel = null;
                if (results && results.data && results.data.play) {
                    playModel = new Common.Models.Play(Team.Enums.UnitTypes.Other);
                    playModel.fromJson(results.data.play);
                    playModel.key = results.key;
                    impakt.context.Playbook.plays.add(playModel);
                }
                notification.success('Successfully created play "', play.name, '"');
                d.resolve(playModel);
            }, function (error) {
                notification.error('Failed to create play "', play.name, '"');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Saves the given play according to the options passed for the given user
         * TODO @theBull create Options model
         *
         * @param {Common.Models.Play} play    [description]
         * @param {any}                  options [description]
         */
        this.savePlay = function (play, options) {
            var d = $q.defer();
            var notification = __notifications.pending('Saving play "', play.name, '"...');
            async.parallel([
                // 
                // Save formation
                // 
                // 
                // Save formation
                // 
                function (callback) {
                    // create, copy, or overwrite?
                    if (options.formation.action == Common.API.Actions.Create ||
                        options.formation.action == Common.API.Actions.Copy) {
                        // ensure playbook.formation has no key
                        play.formation.key = -1;
                        self.createFormation(play.formation)
                            .then(function (createdFormation) {
                            play.formation = createdFormation;
                            callback(null, play);
                        }, function (err) {
                            callback(err);
                        });
                    }
                    else if (options.formation.action == Common.API.Actions.Overwrite) {
                        if (play.formation.modified) {
                            self.updateFormation(play.formation)
                                .then(function (updatedFormation) {
                                callback(null, play);
                            }, function (err) {
                                callback(err);
                            });
                        }
                        else {
                            callback(null, play);
                        }
                    }
                    else {
                        callback(null, play);
                    }
                },
                // save personnel
                // function(callback) {
                //     console.warn('Save Play > Personnel not implemented, skipping...');
                //     callback(null, play);
                // },
                // save assignments
                // save personnel
                // function(callback) {
                //     console.warn('Save Play > Personnel not implemented, skipping...');
                //     callback(null, play);
                // },
                // save assignments
                function (callback) {
                    if (Common.Utilities.isNullOrUndefined(play.assignmentGroup))
                        callback(null, play);
                    if (options.assignmentGroup.action == Common.API.Actions.Create ||
                        options.assignmentGroup.action == Common.API.Actions.Copy) {
                        // ensure play has no key
                        play.assignmentGroup.key = -1;
                        self.createAssignmentGroup(play.assignmentGroup)
                            .then(function (createdAssignmentGroup) {
                            if (!_associations.associationExists(play.associationKey, createdAssignmentGroup.associationKey)) {
                                _associations.createAssociation(play, createdAssignmentGroup).then(function () {
                                    callback(null, play);
                                }, function (err) {
                                    callback(err);
                                });
                            }
                        }, function (err) {
                            callback(err);
                        });
                    }
                    else if (options.assignmentGroup.action == Common.API.Actions.Overwrite) {
                        if (play.assignmentGroup.modified) {
                            self.updateAssignmentGroup(play.assignmentGroup)
                                .then(function (updatedAssignmentGroup) {
                                callback(null, updatedAssignmentGroup);
                            }, function (err) {
                                callback(err);
                            });
                        }
                        else {
                            callback(null, play);
                        }
                    }
                    else {
                        callback(null, play);
                    }
                },
                // save play
                // save play
                function (callback) {
                    if (options.play.action == Common.API.Actions.Create ||
                        options.play.action == Common.API.Actions.Copy) {
                        // ensure play has no key
                        play.key = -1;
                        self.createPlay(play)
                            .then(function (createdPlay) {
                            callback(null, createdPlay);
                        }, function (err) {
                            callback(err);
                        });
                    }
                    else if (options.play.action == Common.API.Actions.Overwrite) {
                        if (play.modified) {
                            self.updatePlay(play)
                                .then(function (updatedPlay) {
                                callback(null, updatedPlay);
                            }, function (err) {
                                callback(err);
                            });
                        }
                        else {
                            callback(null, play);
                        }
                    }
                    else {
                        callback(null, play);
                    }
                }
            ], function (err, results) {
                if (err) {
                    notification.error('Failed to save play "', play.name, '"');
                    d.reject(err);
                }
                else {
                    notification.success('Successfully saved play "', play.name, '"');
                    d.resolve(results);
                }
            });
            return d.promise;
        };
        /**
         * Updates the given play for the current user
         * @param {Common.Models.Play} play The play to update
         */
        this.updatePlay = function (play) {
            var d = $q.defer();
            var notification = __notifications.pending('Updating play "', play.name, '"...');
            var playData = play.toJson();
            __api.post(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.UPDATE_PLAY), {
                version: 1,
                name: play.name,
                key: play.key,
                data: {
                    version: 1,
                    name: play.name,
                    key: play.key,
                    play: playData
                }
            })
                .then(function (response) {
                var results = Common.Utilities.parseData(response.data.results);
                var playModel = new Common.Models.Play(Team.Enums.UnitTypes.Other);
                if (results && results.data && results.data.play) {
                    playModel.fromJson(results.data.play);
                    // update the context
                    impakt.context.Playbook.plays.set(playModel.guid, playModel);
                }
                notification.success('Successfully updated play "', playModel.name, '"');
                d.resolve(playModel);
            }, function (error) {
                notification.error('Failed to update play "', play.name, '"');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Retrieves all plays for the current user
         */
        this.getPlays = function () {
            var d = $q.defer();
            var notification = __notifications.pending('Getting Plays...');
            __api.get(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.GET_PLAYS))
                .then(function (response) {
                var playCollection = new Common.Models.PlayCollection(Team.Enums.UnitTypes.Mixed);
                if (response && response.data && response.data.results) {
                    var results = Common.Utilities.parseData(response.data.results);
                    if (results) {
                        var rawPlays = results;
                        for (var i = 0; i < results.length; i++) {
                            var result = results[i];
                            if (result && result.data && result.data.play) {
                                var playModel = new Common.Models.Play(Team.Enums.UnitTypes.Other);
                                playModel.fromJson(result.data.play);
                                playModel.key = result.key;
                                playCollection.add(playModel);
                            }
                        }
                    }
                }
                notification.success(playCollection.size(), ' Plays successfully retrieved');
                d.resolve(playCollection);
            }, function (error) {
                notification.error('Failed to retrieve Plays');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Prepares the given play to be opened in the play editor
         * @param {Common.Models.Play} play The play to be edited
         */
        this.editPlay = function (play) {
            var notification = __notifications.info('Opened play "', play.name, '" for editing.');
            // Set Play to play editing mode
            play.editorType = Playbook.Enums.EditorTypes.Play;
            if (!play.formation) {
            }
            if (!play.personnel) {
            }
            // add the play onto the editor context
            impakt.context.Playbook.editor.plays.add(play);
            // navigate to playbook editor
            //if (!$state.is('playbook.editor'))
            $state.transitionTo('playbook.editor');
        };
        /**
         * Deletes the given play for the current user
         * @param {Common.Models.Play} play The play to be deleted
         */
        this.deletePlay = function (play) {
            var d = $q.defer();
            var notification = __notifications.pending('Deleting play "', play.name, '"...');
            __api.post(__api.path(PLAYBOOK.ENDPOINT, PLAYBOOK.DELETE_PLAY), {
                key: play.key
            })
                .then(function (response) {
                var playKey = response.data.results.key;
                // update the context
                impakt.context.Playbook.plays.remove(play.guid);
                notification.success('Successfully deleted play "', play.name, '"');
                d.resolve(play);
            }, function (error) {
                notification.error('Failed to delete play "', play.name, '"');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Returns a list of all unit types
         */
        this.getUnitTypes = function () {
            return new Team.Models.UnitTypeCollection();
        };
        /**
         * Returns an list of all unit types
         */
        this.getUnitTypesEnum = function () {
            var typeEnums = {};
            for (var unitType in Team.Enums.UnitTypes) {
                var unitTypeInt = parseInt(unitType);
                if (unitTypeInt >= 0)
                    typeEnums[unitTypeInt]
                        = Common.Utilities.camelCaseToSpace(Team.Enums.UnitTypes[unitTypeInt], true);
            }
            return typeEnums;
        };
        /**
         * Returns a class for the given editorType
         * @param {Playbook.Enums.EditorTypes} editorType Editor Type enum
         */
        this.getEditorTypeClass = function (editorType) {
            var editorTypeClass = '';
            switch (editorType) {
                case Playbook.Enums.EditorTypes.Formation:
                    editorTypeClass = 'playbook-editor-type-formation';
                    break;
                case Playbook.Enums.EditorTypes.Assignment:
                    editorTypeClass = 'playbook-editor-type-assignment';
                    break;
                case Playbook.Enums.EditorTypes.Play:
                    editorTypeClass = 'playbook-editor-type-play';
                    break;
            }
            return editorTypeClass;
        };
        /**
         * Navigates to the playbook editor
         */
        this.toEditor = function () {
            $state.transitionTo('playbook.editor');
        };
        /**
         * Refreshes the playbook editor
         */
        this.refreshEditor = function () {
            $rootScope.$broadcast('playbook-editor.refresh');
        };
        /**
         * Navigates to the playbook browser
         */
        this.toBrowser = function () {
            this.drilldown.playbook = null;
            $state.transitionTo('playbook.browser');
        };
        this.toPlaybookDrilldown = function (playbookModel) {
            this.drilldown.playbook = playbookModel;
            $state.transitionTo('playbook.drilldown.playbook');
        };
        /**
         * Navigates to the team module
         */
        this.toTeam = function () {
            $state.transitionTo('team');
        };
        /**
         * Takes a given entity (of unknown type) and uses its internally
         * defined ImpaktDataType to determine the appropriate API method
         * to call.
         *
         * @param {Common.Interfaces.IActionable} entity The entity to delete
         */
        this.deleteEntityByType = function (entity) {
            var d = $q.defer();
            switch (entity.impaktDataType) {
                case Common.Enums.ImpaktDataTypes.Playbook:
                    return _playbookModals.deletePlaybook(entity);
                case Common.Enums.ImpaktDataTypes.Play:
                    return _playbookModals.deletePlay(entity);
                case Common.Enums.ImpaktDataTypes.Formation:
                    return _playbookModals.deleteFormation(entity);
                default:
                    d.reject(new Error('_playbook deleteEntityByType: impaktDataType not supported'));
            }
            return d.promise;
        };
    }]);
/// <reference path='../playbook.mdl.ts' />
impakt.playbook.sidebar = angular.module('impakt.playbook.sidebar', [])
    .config([
    '$stateProvider',
    function ($stateProvider) {
        console.debug('impakt.playbook.sidebar - config');
    }])
    .run([function () {
        console.debug('impakt.playbook.sidebar - run');
    }]);
/// <reference path='./playbook-sidebar.mdl.ts' />
impakt.playbook.sidebar.controller('playbook.sidebar.ctrl', [
    '$scope',
    '__router',
    '_playbook',
    '_playbookModals',
    function ($scope, __router, _playbook, _playbookModals) {
        var parent = 'playbook.sidebar';
        __router.push(parent, [
            new Common.Models.Template('playbook.sidebar.playbooks', 'modules/playbook/sidebar/playbook/playbook-sidebar-playbooks.tpl.html'),
            new Common.Models.Template('playbook.sidebar.plays', 'modules/playbook/sidebar/play/playbook-sidebar-plays.tpl.html'),
            new Common.Models.Template('playbook.sidebar.formations', 'modules/playbook/sidebar/formation/playbook-sidebar-formations.tpl.html')
        ]);
        $scope.template = {};
        $scope.plays = impakt.context.Playbook.plays;
        $scope.formations = impakt.context.Playbook.formations;
        $scope.playbooks = impakt.context.Playbook.playbooks;
        $scope.goToPlaybooks = function () {
            $scope.template = __router.get(parent, 'playbook.sidebar.playbooks');
        };
        $scope.goToPlays = function () {
            $scope.template = __router.get(parent, 'playbook.sidebar.plays');
        };
        $scope.goToFormations = function () {
            $scope.template = __router.get(parent, 'playbook.sidebar.formations');
        };
        $scope.refreshPlays = function () {
            $scope.plays = impakt.context.Playbook.plays;
        };
        $scope.refreshFormations = function () {
            $scope.formations = impakt.context.Playbook.formations;
        };
        $scope.refreshPlaybooks = function () {
            $scope.playbooks = impakt.context.Playbook.playbooks;
        };
        $scope.createPlay = function () {
            _playbookModals.createPlay();
        };
        $scope.createFormation = function () {
            _playbookModals.createFormation();
        };
        $scope.createPlaybook = function () {
            _playbookModals.createPlaybook();
        };
        $scope.openFormationInEditor = function (formation) {
            _playbook.editFormation(formation);
            _playbook.refreshEditor();
        };
        $scope.openPlayInEditor = function (play) {
            _playbook.editPlay(play);
            _playbook.refreshEditor();
        };
        $scope.goToPlays();
    }]);
/// <reference path='../modules.mdl.ts' />
impakt.search = angular.module('impakt.search', [])
    .filter('globalSearchFilter', function () {
    return function (input, searchQuery) {
    };
});
/// <reference path='./search.mdl.ts' />
impakt.search.controller('search.ctrl', [
    '$scope',
    '__context',
    function ($scope, __context) {
        $scope.title = 'Results';
        $scope.query = '';
        $scope.playbooks;
        $scope.formations;
        $scope.plays;
        // attach key listeners
        __context.onReady(function () {
            $scope.playbooks = impakt.context.Playbook.playbooks;
            $scope.formations = impakt.context.Playbook.formations;
            $scope.plays = impakt.context.Playbook.plays;
        });
        $scope.$on("$destroy", function () {
        });
    }]);
/// <reference path='../modules.mdl.ts' />
impakt.season = angular.module('impakt.season', [])
    .config([function () {
        console.debug('impakt.season - config');
    }])
    .run(function () {
    console.debug('impakt.season - run');
});
/// <reference path='../modules.mdl.ts' />
impakt.sidebar = angular.module('impakt.sidebar', [
    'impakt.playbook.sidebar'
])
    .config([
    '$stateProvider',
    function ($stateProvider) {
        console.debug('impakt.sidebar - config');
    }])
    .run([function () {
        console.debug('impakt.sidebar - run');
    }]);
/// <reference path='./sidebar.mdl.ts' />
impakt.sidebar.controller('sidebar.ctrl', [
    '$scope',
    function ($scope) {
    }]);
/// <references path='./interfaces.ts' />
/// <reference path='../modules.mdl.ts' />
/// <reference path='./team.ts' />
impakt.team = angular.module('impakt.team', [
    'impakt.team.personnel',
    'impakt.team.main',
    'impakt.team.unitTypes',
    'impakt.team.modals'
])
    .config([function () {
        console.debug('impakt.team - config');
    }])
    .run(function () {
    console.debug('impakt.team - run');
});
/// <reference path='../team.mdl.ts' />
impakt.team.main = angular.module('impakt.team.main', [])
    .config([function () {
        console.debug('impakt.team.main - config');
    }])
    .run(function () {
    console.debug('impakt.team.main - run');
});
/// <reference path='./team-main.mdl.ts' />
impakt.team.main.controller('team.main.ctrl', ['$scope', '_team', '_teamModals',
    function ($scope, _team, _teamModals) {
        $scope.createTeam = function () {
            _teamModals.createTeam();
        };
    }]);
/// <reference path='../team.mdl.ts' />
impakt.team.modals = angular.module('impakt.team.modals', [])
    .config(function () {
    console.debug('impakt.team.modals - config');
})
    .run(function () {
    console.debug('impakt.team.modals - run');
});
/// <reference path='../team-modals.mdl.ts' />
impakt.team.modals.controller('team.modals.createTeamDuplicateError.ctrl', [
    '$scope',
    '$uibModalInstance',
    '_team',
    'team',
    function ($scope, $uibModalInstance, _team, team) {
        $scope.team = team;
        $scope.ok = function () {
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);
/// <reference path='../team-modals.mdl.ts' />
impakt.team.modals.controller('team.modals.createTeam.ctrl', [
    '$scope',
    '$uibModalInstance',
    '_team',
    function ($scope, $uibModalInstance, _team) {
        $scope.newTeamModel = new Team.Models.TeamModel(Team.Enums.TeamTypes.Primary);
        $scope.teamTypes = Common.Utilities.convertEnumToList(Team.Enums.TeamTypes);
        $scope.ok = function () {
            _team.createTeam($scope.newTeamModel)
                .then(function (createdTeam) {
                $uibModalInstance.close(createdTeam);
            }, function (err) {
                $uibModalInstance.close(err);
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);
/// <reference path='../team-modals.mdl.ts' />
impakt.team.modals.controller('team.modals.deleteTeam.ctrl', [
    '$scope',
    '$uibModalInstance',
    '_team',
    'team',
    function ($scope, $uibModalInstance, _team, team) {
        $scope.team = team;
        $scope.ok = function () {
            _team.deleteTeam($scope.team)
                .then(function (results) {
                $uibModalInstance.close(results);
            }, function (err) {
                $uibModalInstance.close(err);
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);
/// <reference path='./team-modals.mdl.ts' />
impakt.team.modals.service('_teamModals', [
    '$q',
    '__modals',
    function ($q, __modals) {
        /**
         *
         * Team
         *
         */
        this.createTeam = function () {
            var d = $q.defer();
            var modalInstance = __modals.open('', 'modules/team/modals/create-team/create-team.tpl.html', 'team.modals.createTeam.ctrl', {});
            modalInstance.result.then(function (createdTeam) {
                console.log(createdTeam);
                d.resolve();
            }, function (results) {
                console.log('dismissed');
                d.reject();
            });
            return d.promise;
        };
        this.createTeamDuplicate = function (teamModel) {
            var d = $q.defer();
            var modalInstance = __modals.open('', 'modules/team/modals/create-team-duplicate-error/create-team-duplicate-error.tpl.html', 'team.modals.createTeamDuplicateError.ctrl', {
                team: function () {
                    return teamModel;
                }
            });
            modalInstance.result.then(function (createdTeam) {
                console.log(createdTeam);
                d.resolve();
            }, function (results) {
                console.log('dismissed');
                d.reject();
            });
            return d.promise;
        };
        this.deleteTeam = function (teamModel) {
            var d = $q.defer();
            var modalInstance = __modals.open('', 'modules/team/modals/delete-team/delete-team.tpl.html', 'team.modals.deleteTeam.ctrl', {
                team: function () {
                    return teamModel;
                }
            });
            modalInstance.result.then(function (results) {
                console.log(results);
                d.resolve();
            }, function (results) {
                console.log('dismissed');
                d.reject();
            });
            return d.promise;
        };
    }]);
/// <reference path='../team.mdl.ts' />
impakt.team.personnel = angular.module('impakt.team.personnel', [
    'impakt.team.personnel.create'
])
    .config([function () {
        console.debug('impakt.team.create -- config');
    }])
    .run([function () {
        console.debug('impakt.team.create -- run');
    }]);
/// <reference path='../team-personnel.mdl.ts' />
impakt.team.personnel.create = angular.module('impakt.team.personnel.create', [])
    .config([function () {
        console.debug('impakt.team.create -- config');
    }])
    .run([function () {
        console.debug('impakt.team.create -- run');
    }]);
/// <reference path='./team-personnel-create.mdl.ts' />
impakt.team.personnel.create.controller('impakt.team.personnel.create.ctrl', [
    '$scope',
    '_team',
    function ($scope, _team) {
        console.debug('impakt.team.personnel.create.ctrl');
    }
]);
/// <reference path='./team-personnel.mdl.ts' />
impakt.team.personnel.controller('impakt.team.personnel.ctrl', [
    '$scope',
    '_team',
    function ($scope, _team) {
        console.debug('impakt.team.personnel.ctrl');
        $scope.personnelCollection;
        $scope.personnel;
        $scope.selectedPersonnel;
        $scope.unitTypes = Team.Models.UnitType.getUnitTypes();
        var positionDefault = new Team.Models.PositionDefault();
        $scope.positionOptions;
        $scope.createNew = false;
        $scope.creating = false;
        function init() {
            _team.initialize();
            $scope.personnelCollection = _team.personnel;
            $scope.personnel = _team.personnel.getOne() ||
                new Team.Models.Personnel(Team.Enums.UnitTypes.Other);
            $scope.selectedPersonnel = {
                guid: $scope.personnel.guid,
                unitType: $scope.personnel.unitType.toString()
            };
            $scope.positionOptions = positionDefault.getByUnitType($scope.personnel.unitType);
        }
        $scope.cancelCreate = function () {
            $scope.creating = false;
        };
        $scope.createPersonnel = function () {
            $scope.personnel = new Team.Models.Personnel(Team.Enums.UnitTypes.Other);
            $scope.creating = true;
            $scope.selectedPersonnel.unitType = $scope.personnel.unitType;
            $scope.createNew = true;
        };
        $scope.selectPersonnel = function () {
            $scope.createNew = false;
            console.log($scope.selectedPersonnel.guid);
            if ($scope.selectedPersonnel.guid) {
                $scope.personnel = null;
                $scope.personnel = $scope.personnelCollection.get($scope.selectedPersonnel.guid);
                $scope.selectedPersonnel.unitType = $scope.personnel.unitType.toString();
                $scope.positionOptions = positionDefault.getByUnitType($scope.personnel.unitType);
            }
        };
        $scope.selectUnitType = function () {
            $scope.personnel.setUnitType(parseInt($scope.selectedPersonnel.unitType));
            $scope.positionOptions = positionDefault.getByUnitType($scope.personnel.unitType);
        };
        $scope.update = function (position, index) {
            var updated = impakt.context.Team.positionDefaults.switchPosition(position, position.positionListValue);
            console.log(position, updated);
            $scope.personnel.positions.replace(position.guid, updated);
        };
        $scope.save = function () {
            console.log($scope.personnel);
            _team.savePersonnel($scope.personnel, $scope.createNew).then(function (results) {
                console.log(results);
            }, function (err) {
                console.error(err);
            });
        };
        $scope.deletePersonnel = function (personnelItem) {
            console.log('deleting personnel', personnelItem);
            _team.deletePersonnel(personnelItem).then(function (results) {
                console.log(results);
            }, function (err) {
                console.error(err);
            });
        };
        init();
    }
]);
/// <reference path='./team.mdl.ts' />
/**
 * Team constants defined here
 */
impakt.team.constant('TEAM', {
    ENDPOINT: '/playbook',
    // Personnel
    CREATE_PERSONNEL: '/createPersonnel',
    UPDATE_PERSONNEL: '/updatePlay',
    GET_PERSONNEL: '/getPlay',
    GET_PERSONNELGROUPS: '/getPlays',
    DELETE_PERSONNEL: '/deletePlay',
    // Sets
    CREATE_SET: '/createSet',
    GET_SETS: '/getSets',
    UPDATE_SET: '/updateSet',
    DELETE_SET: '/deleteSet'
});
/// <reference path='./team.mdl.ts' />
impakt.team.controller('team.ctrl', ['$scope', '_team',
    function ($scope, _team) {
        $scope.title = 'Team Management';
        $scope.tabs = {
            personnel: {
                title: 'Personnel groups',
                active: true,
                src: "modules/team/personnel/team-personnel.tpl.html"
            },
            teams: {
                title: 'My teams',
                active: false,
                src: 'modules/team/main/team-main.tpl.html'
            },
            unitTypes: {
                title: 'Unit types',
                active: false,
                src: "modules/team/unit-types/team-unit-types.tpl.html"
            }
        };
        $scope.activate = function (tab) {
            for (var key in $scope.tabs) {
                var obj = $scope.tabs[key];
                if (obj.active)
                    obj.active = false;
            }
            tab.active = true;
        };
    }]);
/// <reference path='./team.mdl.ts' />
// Team service
impakt.team.service('_team', [
    '$q',
    'PLAYBOOK',
    'TEAM',
    'LEAGUE',
    '__api',
    '__notifications',
    '_teamModals',
    function ($q, PLAYBOOK, TEAM, LEAGUE, __api, __notifications, _teamModals) {
        this.personnel = null;
        this.initialize = function () {
            this.personnel = impakt.context.Team.personnel;
        };
        /**
         * Retrieves all teams
         */
        this.getTeams = function () {
            var d = $q.defer();
            var notification = __notifications.pending('Getting all league teams...');
            __api.get(__api.path(LEAGUE.ENDPOINT, LEAGUE.GET_TEAMS))
                .then(function (response) {
                var collection = new Team.Models.TeamModelCollection(Team.Enums.TeamTypes.Mixed);
                if (response && response.data && response.data.results) {
                    var teamResults = Common.Utilities.parseData(response.data.results);
                    for (var i = 0; i < teamResults.length; i++) {
                        var teamResult = teamResults[i];
                        if (teamResult && teamResult.data && teamResult.data.model) {
                            var teamModel = new Team.Models.TeamModel(teamResult.data.model.teamType);
                            teamResult.data.model.key = teamResult.key;
                            teamModel.fromJson(teamResult.data.model);
                            collection.add(teamModel);
                        }
                    }
                }
                notification.success([collection.size(), ' league teams successfully retreived'].join(''));
                d.resolve(collection);
            }, function (error) {
                notification.error('Failed to retieve league teams');
                console.error(error);
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Gets a single team with the given key
         * @param {number} key The key of the team to retrieve
         */
        this.getTeam = function (key) {
            var d = $q.defer();
            __api.get(__api.path(LEAGUE.ENDPOINT, LEAGUE.GET_TEAM, '/' + key))
                .then(function (response) {
                var team = Common.Utilities.parseData(response.data.results);
                d.resolve(team);
            }, function (error) {
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Sends a team model to the server for storage
         * @param {Team.Models.TeamModel} teamModel The model to be created/saved
         */
        this.createTeam = function (newTeamModel) {
            var d = $q.defer();
            if (!Common.Utilities.isNullOrUndefined(newTeamModel)) {
                var nameExists = impakt.context.Team.teams.hasElementWhich(function (teamModel, index) {
                    return teamModel.name == newTeamModel.name;
                });
                if (nameExists) {
                    var notification_3 = __notifications.warning('Failed to create team. Team "', newTeamModel.name, '" already exists.');
                    _teamModals.createTeamDuplicate(newTeamModel);
                    return;
                }
            }
            // set key to -1 to ensure a new object is created server-side
            newTeamModel.key = -1;
            var teamModelJson = newTeamModel.toJson();
            var notification = __notifications.pending('Creating playbook "', newTeamModel.name, '"...');
            __api.post(__api.path(LEAGUE.ENDPOINT, LEAGUE.CREATE_TEAM), {
                version: 1,
                name: newTeamModel.name,
                data: {
                    version: 1,
                    model: teamModelJson
                }
            })
                .then(function (response) {
                var results = Common.Utilities.parseData(response.data.results);
                var teamModel = new Team.Models.TeamModel(Team.Enums.TeamTypes.Other);
                if (results && results.data && results.data.model) {
                    results.data.model.key = results.key;
                    teamModel.fromJson(results.data.model);
                    // update the context
                    impakt.context.Team.teams.add(teamModel);
                }
                else {
                    throw new Error('CreateTeam did not return a valid team model');
                }
                notification.success('Successfully created team "', teamModel.name, '"');
                d.resolve(teamModel);
            }, function (error) {
                notification.error('Failed to create team "', newTeamModel.name, '"');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Deletes the given team for the current user
         * @param {Team.Models.TeamModel} team The team to be deleted
         */
        this.deleteTeam = function (team) {
            var d = $q.defer();
            var notification = __notifications.pending('Deleting team "', team.name, '"...');
            __api.post(__api.path(LEAGUE.ENDPOINT, LEAGUE.DELETE_TEAM), { key: team.key }).then(function (response) {
                // update the context
                impakt.context.Team.teams.remove(team.guid);
                notification.success('Deleted team "', team.name, '"');
                d.resolve(team);
            }, function (error) {
                notification.error('Failed to delete team "', team.name, '"');
                d.reject(error);
            });
            return d.promise;
        };
        /**
         * Updates the given team for the current user
         * @param {Team.Models.TeamModel} team The team to update
         */
        this.updateTeam = function (team) {
            var d = $q.defer();
            // update assignment collection to json object
            var teamJson = team.toJson();
            var notification = __notifications.pending('Updating team "', team.name, '"...');
            __api.post(__api.path(LEAGUE.ENDPOINT, LEAGUE.UPDATE_TEAM), {
                version: 1,
                name: teamJson.name,
                key: teamJson.key,
                data: {
                    version: 1,
                    key: teamJson.key,
                    model: teamJson
                }
            })
                .then(function (response) {
                var results = Common.Utilities.parseData(response.data.results);
                var teamModel = new Team.Models.TeamModel(Team.Enums.TeamTypes.Other);
                if (results && results.data && results.data.model) {
                    teamModel.fromJson(results.data.model);
                    // update the context
                    impakt.context.Team.teams.set(teamModel.guid, teamModel);
                }
                notification.success('Successfully updated team "', team.name, '"');
                d.resolve(teamModel);
            }, function (error) {
                notification.error('Failed to update team "', team.name, '"');
                d.reject(error);
            });
            return d.promise;
        };
        this.getPersonnel = function () {
            var d = $q.defer();
            var personnelNotification = __notifications.pending('Getting Personnel...');
            __api.get(__api.path(TEAM.ENDPOINT, TEAM.GET_SETS))
                .then(function (response) {
                var personnelResults = Common.Utilities.parseData(response.data.results);
                var personnelCollection = new Team.Models.PersonnelCollection(Team.Enums.UnitTypes.Mixed);
                for (var i = 0; i < personnelResults.length; i++) {
                    var results = personnelResults[i];
                    if (results && results.data && results.data.personnel) {
                        var rawPersonnel = results.data.personnel;
                        var personnelModel = new Team.Models.Personnel(Team.Enums.UnitTypes.Other);
                        personnelModel.fromJson(rawPersonnel);
                        personnelCollection.add(personnelModel);
                    }
                }
                personnelNotification.success(personnelCollection.size(), ' Personnel groups successfully retrieved');
                d.resolve(personnelCollection);
            }, function (error) {
                personnelNotification.error('Failed to retrieve Personnel groups');
                d.reject(error);
            });
            return d.promise;
        };
        this.savePersonnel = function (personnelModel, createNew) {
            var d = $q.defer();
            var result;
            var notification = __notifications.pending('Saving personnel "', personnelModel.name, '"...');
            if (createNew) {
                personnelModel.key = 0;
                personnelModel.guid = Common.Utilities.guid();
                result = this.createPersonnel(personnelModel);
            }
            else {
                result = this.updatePersonnel(personnelModel);
            }
            result.then(function (results) {
                notification.success('Successfully saved personnel "', personnelModel.name, '"');
                d.resolve(results);
            }, function (err) {
                notification.error('Failed to save personnel "', personnelModel.name, '"');
                d.reject(err);
            });
            return d.promise;
        };
        this.createPersonnel = function (personnelModel) {
            var d = $q.defer();
            var personnelJson = personnelModel.toJson();
            var notification = __notifications.pending('Creating personnel group "', personnelModel.name, '"...');
            __api.post(__api.path(TEAM.ENDPOINT, TEAM.CREATE_SET), {
                version: 1,
                ownerRK: 1,
                parentRK: 1,
                name: personnelJson.name,
                data: {
                    setType: Common.Enums.SetTypes.Personnel,
                    personnel: personnelJson,
                    name: personnelJson.name,
                    version: 1,
                    ownerRK: 1,
                    parentRK: 1
                }
            })
                .then(function (response) {
                var results = Common.Utilities.parseData(response.data.results);
                var personnelModel = new Team.Models.Personnel(Team.Enums.UnitTypes.Other);
                if (results && results.data && results.data.personnel) {
                    results.data.personnel.key = results.key;
                    personnelModel.fromJson(results.data.personnel);
                }
                impakt.context.Team.personnel.add(personnelModel);
                notification.success('Personnel group "', personnelModel.name, '" successfully created');
                d.resolve(personnelModel);
            }, function (error) {
                d.reject(error);
            });
            return d.promise;
        };
        this.updatePersonnel = function (personnelModel) {
            var d = $q.defer();
            var personnelJson = personnelModel.toJson();
            var notification = __notifications.pending('Updating personnel "', personnelModel.name, '"...');
            __api.post(__api.path(TEAM.ENDPOINT, TEAM.UPDATE_SET), {
                version: 1,
                name: personnelJson.name,
                key: personnelJson.key,
                data: {
                    setType: Common.Enums.SetTypes.Personnel,
                    personnel: personnelJson,
                    name: personnelJson.name,
                    key: personnelJson.key,
                    version: 1
                }
            })
                .then(function (response) {
                var results = Common.Utilities.parseData(response.data.results);
                var personnelModel = new Team.Models.Personnel(Team.Enums.UnitTypes.Other);
                if (results && results.data && results.data.personnel) {
                    personnelModel.fromJson(results.data.personnel);
                }
                impakt.context.Team.personnel.set(personnelModel.guid, personnelModel);
                notification.success('Successfully updated personnel "', personnelModel.name, '"...');
                d.resolve(personnelModel);
            }, function (error) {
                notification.error('Failed to update personnel "', personnelModel.name, '"...');
                d.reject(error);
            });
            return d.promise;
        };
        this.deletePersonnel = function (personnelModel) {
            var d = $q.defer();
            var notification = __notifications.pending('Deleting personnel "', personnelModel.name, '"...');
            __api.post(__api.path(TEAM.ENDPOINT, TEAM.DELETE_SET), {
                key: personnelModel.key
            }).then(function (response) {
                impakt.context.Team.personnel.remove(personnelModel.guid);
                notification.success('Successfully saved personnel "', personnelModel.name, '"');
                d.resolve(response);
            }, function (err) {
                notification.error('Failed to save personnel "', personnelModel.name, '"');
                d.reject(err);
            });
            return d.promise;
        };
        this.createPrimaryTeam = function (teamModel) {
        };
        this.updatePrimaryTeam = function (teamModel) {
        };
        this.deletePrimaryTeam = function (teamModel) {
        };
        this.savePrimaryTeam = function (teamModel) {
        };
    }]);
/// <reference path='../team.mdl.ts' />
impakt.team.unitTypes = angular.module('impakt.team.unitTypes', [])
    .config([function () {
        console.debug('impakt.team.unitTypes - config');
    }])
    .run([function () {
        console.debug('impakt.team.unitTypes - run');
    }]);
/// <reference path='./team-unit-types.mdl.ts' />
impakt.team.unitTypes.controller('impakt.team.unitTypes.ctrl', [
    '$scope',
    '_team',
    function ($scope, _team) {
        $scope.unitTypes = impakt.context.Team.unitTypes.toArray();
    }
]);
/// <reference path='../modules.mdl.ts' />
impakt.user = angular.module('impakt.user', [
    'impakt.user.login',
    'impakt.user.modals'
])
    .config(function () {
    console.debug('impakt.user -- config');
})
    .run(function () {
    console.debug('impakt.user -- run');
});
/// <reference path='../user.mdl.ts' />
impakt.user.login = angular.module('impakt.user.login', [])
    .config(function () {
    console.debug('impakt.user.login - config');
})
    .run(function () {
    console.debug('impakt.user.login - run');
});
/// <reference path='./user-login.mdl.ts' />
impakt.user.login.controller('user.login.ctrl', ['$scope', function ($scope) {
    }]);
/// <reference path='../user.mdl.ts' />
impakt.user.modals = angular.module('impakt.user.modals', [])
    .config(function () {
    console.debug('impakt.user.modals - config');
})
    .run(function () {
    console.debug('impakt.user.modals - run');
});
/// <reference path='../user-modals.mdl.ts' />
impakt.user.modals.controller('user.modals.selectOrganization.ctrl', [
    '$scope',
    '$uibModalInstance',
    '_user',
    function ($scope, $uibModalInstance, _user) {
        $scope.selectedOrganization = _user.selectedOrganization;
        $scope.organizations = _user.organizations;
        $scope.organizationSelected = function () {
            console.log('selected organization', $scope.selectedOrganization);
        };
        $scope.ok = function () {
            _user.selectOrganization($scope.selectedOrganization)
                .then(function (selectedOrganization) {
                $uibModalInstance.close(selectedOrganization);
            }, function (err) {
                $uibModalInstance.close(err);
            });
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }]);
/// <reference path='./user-modals.mdl.ts' />
impakt.user.modals.service('_userModals', [
    '__modals',
    function (__modals) {
        /**
         *
         * PLAYBOOK
         *
         */
        this.selectOrganization = function () {
            var modalInstance = __modals.open('', 'modules/user/modals/select-organization/select-organization.tpl.html', 'user.modals.selectOrganization.ctrl', {});
            modalInstance.result.then(function (selectedOrganization) {
                console.log(selectedOrganization);
            }, function (results) {
                console.log('dismissed');
            });
        };
    }]);
/// <reference path='./models.ts' />
var User;
(function (User) {
    var Models;
    (function (Models) {
        var Account = (function (_super) {
            __extends(Account, _super);
            function Account() {
                _super.call(this);
            }
            Account.prototype.toJson = function () {
                return {
                    Name: this.name,
                    OrganizationKey: this.organizationKey
                };
            };
            Account.prototype.fromJson = function (json) {
                this.name = json.name;
                this.organizationKey = json.organizationKey;
            };
            return Account;
        })(Common.Models.Storable);
        Models.Account = Account;
    })(Models = User.Models || (User.Models = {}));
})(User || (User = {}));
/// <reference path='./models.ts' />
var User;
(function (User) {
    var Models;
    (function (Models) {
        var AccountUser = (function (_super) {
            __extends(AccountUser, _super);
            function AccountUser() {
                _super.call(this);
            }
            AccountUser.prototype.toJson = function () {
                return {};
            };
            AccountUser.prototype.fromJson = function () {
            };
            return AccountUser;
        })(Common.Models.Storable);
        Models.AccountUser = AccountUser;
    })(Models = User.Models || (User.Models = {}));
})(User || (User = {}));
/// <reference path='./models.ts' />
var User;
(function (User) {
    var Models;
    (function (Models) {
        var UserModel = (function (_super) {
            __extends(UserModel, _super);
            function UserModel() {
                _super.call(this);
                this.firstName = null;
                this.lastName = null;
                this.organizationKey = 0;
                this.organizationName = null;
                this.invitationType = 1;
                this.invitationKey = 0;
                this.email = null;
                this.recaptchaChallenge = '';
                this.recaptchaResponse = '';
            }
            UserModel.prototype.toJson = function () {
                return {
                    FirstName: this.firstName,
                    LastName: this.lastName,
                    OrganizationName: this.organizationName,
                    OrganizationKey: this.organizationKey,
                    InvitationType: this.invitationType,
                    InvitationKey: this.invitationKey,
                    Email: this.email,
                    RecaptchaChallenge: this.recaptchaChallenge,
                    RecaptchaResponse: this.recaptchaResponse
                };
            };
            UserModel.prototype.fromJson = function (json) {
                this.firstName = json.FirstName;
                this.lastName = json.LastName;
                this.organizationName = json.OrganizationName;
                this.email = json.Email;
            };
            return UserModel;
        })(Common.Models.Storable);
        Models.UserModel = UserModel;
    })(Models = User.Models || (User.Models = {}));
})(User || (User = {}));
/// <reference path='./user.mdl.ts' />
impakt.user.constant('USER', {
    'ORG_ENDPOINT': '/accounts',
    'GET_ORGANIZATIONS': '/getOrganizations'
});
/// <reference path='./user.mdl.ts' />
impakt.user.controller('impakt.user.ctrl', [
    '$scope',
    '$http',
    '$window',
    '__signin',
    '_user',
    function ($scope, $http, $window, __signin, _user) {
        $scope.userName = _user.userName;
        $scope.organizationKey = _user.organizationKey;
        $scope.isOnline = _user.isOnline;
        $scope.onlineStatus = _user.getOnlineStatusString();
        $scope.organizations = _user.organizations;
        $scope.selectedOrganization = _user.selectedOrganization;
        $scope.$watch('isOnline', function (newVal, oldVal) {
            $scope.onlineStatus = _user.getOnlineStatusString();
        });
        $scope.selectOrganization = function () {
            _user.selectOrganization($scope.selectedOrganization);
        };
        $scope.profileClick = function () {
            // TODO
        };
        $scope.logout = function () {
            confirm('Are you sure you want to logout? You will lose any unsaved data.') && __signin.logout();
        };
    }]);
/// <reference path='./user.mdl.ts' />
impakt.user.service('_user', [
    'USER',
    '$window',
    '$q',
    '__context',
    '__api',
    '__notifications',
    '__localStorage',
    '_userModals',
    function (USER, $window, $q, __context, // TODO @theBull - might not need this after the Alpha
        __api, __notifications, __localStorage, _userModals) {
        this.userName = __localStorage.getUserName();
        this.organizationKey = __localStorage.getOrganizationKey();
        this.organizations = new User.Models.OrganizationCollection();
        this.selectedOrganization = null;
        this.isOnline = navigator ? navigator.onLine : undefined;
        var self = this;
        this.initialize = function () {
            var d = $q.defer();
            var notification = __notifications.pending('Looking for default user organization...');
            var organizationKey = __localStorage.getOrganizationKey();
            self.getOrganizations().then(function (organizations) {
                // select default organization from localStorage
                if (organizations && organizations.hasElements() &&
                    organizationKey && organizationKey > 0) {
                    var selectedOrganization = organizations.filterFirst(function (organization, index) {
                        return organization.organizationKey == organizationKey;
                    });
                    self.selectOrganization(selectedOrganization);
                    notification.success('Default user organization #', organizationKey, ' is set');
                    d.resolve(self.selectedOrganization);
                }
                else {
                    // open select organization dialog
                    notification.warning('Default organization not found. Please select \
					an organization from the Profile area.');
                    _userModals.selectOrganization();
                    d.resolve(null);
                }
            }, function (err) {
                notification.error('Failed to set default organization #', organizationKey);
                d.reject(err);
            });
            return d.promise;
        };
        $window.addEventListener("offline", function (e) {
            console.log('offline');
            self.isOnline = false;
        });
        $window.addEventListener("online", function (e) {
            console.log('online');
            self.isOnline = true;
        });
        this.selectOrganization = function (organization) {
            var d = $q.defer();
            var notification = __notifications.pending('Updating application context data...');
            if (!organization) {
                var errorMessage = 'Something went wrong while attempting to select the organization';
                notification.error(errorMessage);
                d.reject(errorMessage);
            }
            this.selectedOrganization = organization;
            __localStorage.setOrganizationKey(organization.organizationKey);
            // make application context requests
            __context.initialize(impakt.context).then(function (results) {
                notification.success('Successfully updated the application context data');
                d.resolve(self.selectedOrganization);
            }, function (err) {
                notification.error('Failed to update the application context data');
                d.reject(err);
            });
            return d.promise;
        };
        this.getOnlineStatusString = function () {
            return this.isOnline === true ? "online" :
                this.isOnline === false ? "offline" : "unknown";
        };
        this.getOrganizations = function () {
            var d = $q.defer();
            var notification = __notifications.pending('Retrieving Organizations...');
            __api.get(__api.path(USER.ORG_ENDPOINT, USER.GET_ORGANIZATIONS)).then(function (response) {
                if (response && response.data && response.data.results) {
                    var results = response.data.results;
                    for (var i = 0; i < results.length; i++) {
                        var result = response.data.results[i];
                        if (result) {
                            var organizationModel = new User.Models.Organization();
                            organizationModel.fromJson(result);
                            self.organizations.add(organizationModel);
                        }
                    }
                }
                notification.success(self.organizations.size(), ' Organizations successfully retrieved');
                d.resolve(self.organizations);
            }, function (err) {
                notification.error('Failed to retrieve Organizations');
                d.reject(err);
            });
            return d.promise;
        };
    }]);
//# sourceMappingURL=impakt.js.map