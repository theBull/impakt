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
