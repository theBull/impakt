/// <reference path='./models.ts' />

module Team.Models {
    export class TeamModel
    extends Common.Models.AssociableEntity {

        public teamType: Team.Enums.TeamTypes;
        public records: Team.Models.TeamRecordCollection;
        public division: League.Models.Division;
        public divisionGuid: string;
        public location: League.Models.Location;
        public locationGuid: string;

        constructor() {
            super(Common.Enums.ImpaktDataTypes.Team);
            super.setContext(this);
            
            this.name = '';
            this.teamType = Team.Enums.TeamTypes.Mixed;
            this.records = new Team.Models.TeamRecordCollection();
            this.division = new League.Models.Division();
            this.divisionGuid = '';
            this.location = new League.Models.Location();
            this.locationGuid = '';

            let self = this;
            this.onModified(function(data) {});

            this.associable = [
                'leagues',
                'conferences',
                'divisions',
                'playbooks',
                'locations'
            ];
        }

        public toJson(): any {
            return $.extend({
                name: this.name,
                teamType: this.teamType,
                records: this.records.toJson(),
                divisionGuid: this.divisionGuid,
                locationGuid: this.locationGuid 
            }, super.toJson());
        }

        public fromJson(json: any): any {
            if (!json)
                return null;

            this.teamType = json.teamType;
            this.name = json.name;
            this.records.fromJson(json.records);
            this.divisionGuid = json.divisionGuid;
            this.locationGuid = json.locationGuid;

            super.fromJson(json);
        }

        public setDivision(division: League.Models.Division): void {
            this.division = division;
            this.divisionGuid = this.division ? this.division.guid : '';
        }

        public setLocation(location: League.Models.Location): void {
            this.location = location;
            this.locationGuid = this.location ? this.location.guid : '';
        }
    }
}
