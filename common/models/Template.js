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
        var Template = (function (_super) {
            __extends(Template, _super);
            function Template(name, url) {
                _super.call(this);
                this.name = name;
                this.url = url;
                this.data = {};
            }
            return Template;
        })(Common.Models.Storable);
        Models.Template = Template;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
