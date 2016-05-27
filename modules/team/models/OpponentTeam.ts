/// <reference path='./models.ts' />

module Team.Models {
    export class OpponentTeam
    extends Team.Models.TeamModel {

        constructor() {
            super(Team.Enums.TeamTypes.Opponent);
            super.setContext(this);            
            
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
