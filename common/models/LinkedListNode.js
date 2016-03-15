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
        var LinkedListNode = (function (_super) {
            __extends(LinkedListNode, _super);
            function LinkedListNode(data, next, prev) {
                _super.call(this);
                this.data = data;
                this.data.node = this;
                this.next = next;
                this.prev = prev || null;
            }
            LinkedListNode.prototype.toJson = function () {
                return Common.Utilities.toJson(this.data);
            };
            return LinkedListNode;
        })(Common.Models.Storable);
        Models.LinkedListNode = LinkedListNode;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
