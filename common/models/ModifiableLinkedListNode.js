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
        var ModifiableLinkedListNode = (function (_super) {
            __extends(ModifiableLinkedListNode, _super);
            function ModifiableLinkedListNode(data, next, prev) {
                _super.call(this, data, next, prev);
            }
            ModifiableLinkedListNode.prototype.toJson = function () {
                return _super.prototype.toJson.call(this);
            };
            return ModifiableLinkedListNode;
        })(Common.Models.LinkedListNode);
        Models.ModifiableLinkedListNode = ModifiableLinkedListNode;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
