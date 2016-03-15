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
            function Modifiable(context) {
                _super.call(this);
                this.context = context;
                this.lastModified = Date.now();
                this.modified = false;
                this.checksum = null;
                this.original = null;
                // always listening. To prevent re-hashing from occurring when initializing
                // an object, insert the .listen(false) method into the method chain prior
                // to calling a method that will trigger a modification.
                this.listening = true;
                this.callbacks = [];
            }
            /**
             * Allows for switching the listening mechanism on or off
             * within a method chain. listen(false) would prevent
             * any mutation from triggering a rehash.
             *
             * @param {boolean} startListening true or false
             */
            Modifiable.prototype.listen = function (startListening) {
                this.listening = startListening;
                return this;
            };
            Modifiable.prototype._clearListeners = function () {
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
                        callback(this);
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
                    var cs = this._generateChecksum();
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
            Modifiable.prototype._generateChecksum = function () {
                // determine current checksum
                var json = this.context.toJson();
                return Common.Utilities.generateChecksum(json);
            };
            Modifiable.prototype.copy = function (newElement, context) {
                var copiedJson = context.toJson();
                newElement.fromJson(copiedJson);
                newElement.setModified(true);
                return newElement;
            };
            Modifiable.prototype.toJson = function () {
                return {
                    lastModified: this.lastModified,
                    guid: this.guid,
                    checksum: this.checksum
                };
            };
            Modifiable.prototype.fromJson = function (json) {
                this.modified = json.modified;
                this.lastModified = json.lastModified;
                this.guid = json.guid || this.guid;
                this.original = json.checksum;
                this.checksum = Common.Utilities.generateChecksum(this.toJson());
            };
            return Modifiable;
        })(Common.Models.Storable);
        Models.Modifiable = Modifiable;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
