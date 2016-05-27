/// <reference path='./models.ts' />

module Team.Models {
    export class TeamModel
    extends Common.Models.AssociableEntity {

        public teamType: Team.Enums.TeamTypes;
        public records: Team.Models.TeamRecordCollection;
        public division: League.Models.Division;
        public divisionGuid: string;

        constructor(teamType: Team.Enums.TeamTypes) {
            super(Common.Enums.ImpaktDataTypes.Team);
            super.setContext(this);
            
            this.name = 'Untitled';
            this.teamType = teamType;
            this.records = new Team.Models.TeamRecordCollection();
            this.division = null;
            this.divisionGuid = '';

            let self = this;
            this.onModified(function(data) {});

            this.associable = [
                'leagues',
                'conferences',
                'divisions',
                'playbooks'
            ];
        }

        public toJson(): any {
            return $.extend({
                name: this.name,
                teamType: this.teamType,
                records: this.records.toJson(),
                divisionGuid: this.divisionGuid
            }, super.toJson());
        }

        public fromJson(json: any): any {
            if (!json)
                return null;

            this.teamType = json.teamType;
            this.name = json.name;
            this.records.fromJson(json.records);
            this.divisionGuid = json.divisionGuid;

            super.fromJson(json);
        }

        public setDivision(division: League.Models.Division): void {
            this.division = division;
            this.divisionGuid = this.division ? this.division.guid : '';
        }
    }
}
