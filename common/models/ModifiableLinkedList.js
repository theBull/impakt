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
        var ModifiableLinkedList = (function (_super) {
            __extends(ModifiableLinkedList, _super);
            function ModifiableLinkedList() {
                _super.call(this);
                this._modifiable = new Common.Models.Modifiable(this);
            }
            ModifiableLinkedList.prototype.add = function (node) {
                _super.prototype.add.call(this, node);
                this._modifiable.setModified();
            };
            ModifiableLinkedList.prototype.getIndex = function (index) {
                return _super.prototype.getIndex.call(this, index);
            };
            ModifiableLinkedList.prototype.forEach = function (iterator) {
                _super.prototype.forEach.call(this, iterator);
            };
            ModifiableLinkedList.prototype.toJson = function () {
                return _super.prototype.toJson.call(this);
            };
            ModifiableLinkedList.prototype.toDataArray = function () {
                return _super.prototype.toDataArray.call(this);
            };
            ModifiableLinkedList.prototype.toArray = function () {
                return _super.prototype.toArray.call(this);
            };
            ModifiableLinkedList.prototype.getLast = function () {
                return _super.prototype.getLast.call(this);
            };
            ModifiableLinkedList.prototype.remove = function (guid) {
                var results = _super.prototype.remove.call(this, guid);
                this._modifiable.setModified();
                return results;
            };
            ModifiableLinkedList.prototype.size = function () {
                return _super.prototype.size.call(this);
            };
            ModifiableLinkedList.prototype.hasElements = function () {
                return _super.prototype.hasElements.call(this);
            };
            return ModifiableLinkedList;
        })(Common.Models.LinkedList);
        Models.ModifiableLinkedList = ModifiableLinkedList;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
