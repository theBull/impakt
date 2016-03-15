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
        var Organization = (function (_super) {
            __extends(Organization, _super);
            function Organization() {
                _super.call(this);
                this.companyName = null;
                this.primaryAddress1 = null;
                this.primaryCity = null;
                this.primaryStateProvince = null;
                this.primaryPostalCode = null;
                this.primaryCountry = null;
                this.organizationKey = 0;
            }
            Organization.prototype.toJson = function () {
                var json = {
                    companyName: this.companyName,
                    primaryAddress1: this.primaryAddress1,
                    primaryCity: this.primaryCity,
                    primaryStateProvince: this.primaryStateProvince,
                    primaryPostalCode: this.primaryPostalCode,
                    primaryCountry: this.primaryCountry,
                    organizationKey: this.organizationKey
                };
                return json;
            };
            Organization.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.companyName = json.companyName;
                this.primaryAddress1 = json.primaryAddress1;
                this.primaryCity = json.primaryCity;
                this.primaryStateProvince = json.primaryStateProvince;
                this.primaryPostalCode = json.primaryPostalCode;
                this.primaryCountry = json.primaryCountry;
                this.organizationKey = json.organizationKey;
            };
            return Organization;
        })(Common.Models.Storable);
        Models.Organization = Organization;
    })(Models = User.Models || (User.Models = {}));
})(User || (User = {}));
