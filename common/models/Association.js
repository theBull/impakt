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
        /**
         * Associates an element with one or more other elements
         * by guid.
         */
        var Association = (function (_super) {
            __extends(Association, _super);
            function Association() {
                _super.call(this, this);
                this.playbooks = new Common.Models.AssociationArray();
                this.formations = new Common.Models.AssociationArray();
                this.personnel = new Common.Models.AssociationArray();
                this.assignments = new Common.Models.AssociationArray();
                this.plays = new Common.Models.AssociationArray();
            }
            Association.prototype.toJson = function () {
                var self = this;
                return {
                    playbooks: self.playbooks.toJson(),
                    formations: self.formations.toJson(),
                    personnel: self.personnel.toJson(),
                    assignments: self.assignments.toJson(),
                    plays: self.plays.toJson(),
                    guid: self.guid
                };
            };
            Association.prototype.fromJson = function (json) {
                if (!json)
                    return;
                this.playbooks.addAll(json.playbooks);
                this.formations.addAll(json.formations);
                this.personnel.addAll(json.personnel);
                this.assignments.addAll(json.assignments);
                this.plays.addAll(json.plays);
                this.guid = json.guid || this.guid;
            };
            return Association;
        })(Common.Models.Modifiable);
        Models.Association = Association;
    })(Models = Common.Models || (Common.Models = {}));
})(Common || (Common = {}));
