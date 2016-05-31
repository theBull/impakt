/// <reference path='./models.ts' />

module Team.Models {
    export class PrimaryTeam
    extends Team.Models.TeamModel {

        constructor() {
            super();
            this.teamType = Team.Enums.TeamTypes.Primary;
            this.onModified(function(data) {});
        }

        public toJson(): any {
            return {

            }
        }

        public fromJson(json: any): void {
            if (!json)
                return;


        }        
    }
}
