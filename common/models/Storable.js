/// <reference path='./models.ts' />
var Common;
(function (Common) {
    var Models;
    (function (Models) {
        var Storable = (function () {
            function Storable() {
                this.guid = Common.Utilities.guid();
            }
            return Storable;
        })();
        Models.Storable = Storable;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
