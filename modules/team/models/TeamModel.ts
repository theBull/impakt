/// <reference path='./models.ts' />

module Team.Models {
    export class TeamModel
    extends Common.Models.AssociableEntity {

        public teamType: Team.Enums.TeamTypes;
        public name: string;
        public records: Team.Models.TeamRecordCollection;

        constructor(teamType: Team.Enums.TeamTypes) {
            super(Common.Enums.ImpaktDataTypes.Team);
            super.setContext(this);
            
            this.name = 'Untitled';
            this.teamType = teamType;
            this.records = new Team.Models.TeamRecordCollection();

            let self = this;
            this.onModified(function(data) {});
        }

        public toJson(): any {
            return $.extend({
                name: this.name,
                teamType: this.teamType,
                records: this.records.toJson()
            }, super.toJson());
        }

        public fromJson(json: any): any {
            if (!json)
                return null;

            this.teamType = json.teamType;
            this.name = json.name;
            this.records.fromJson(json.records);

            super.fromJson(json);
        }
    }
}
