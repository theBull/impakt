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
        var LinkedList = (function (_super) {
            __extends(LinkedList, _super);
            function LinkedList() {
                _super.call(this);
                this.root = null;
                this.last = null;
                this._length = 0;
            }
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
                    else {
                        throw new Error('node data is null or toJson not implemented');
                        arr.push(null);
                    }
                });
                return arr;
            };
            LinkedList.prototype.toDataArray = function () {
                var arr = Array();
                this.forEach(function (node, i) {
                    arr.push(node.data);
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
            LinkedList.prototype.remove = function (guid) {
                throw Error('not implemented');
            };
            LinkedList.prototype.size = function () {
                return this._length;
            };
            LinkedList.prototype.hasElements = function () {
                return this.size() > 0;
            };
            return LinkedList;
        })(Common.Models.Storable);
        Models.LinkedList = LinkedList;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
