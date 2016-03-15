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
