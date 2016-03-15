/// <reference path='./models.ts' />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
