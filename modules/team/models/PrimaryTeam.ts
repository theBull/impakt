/// <reference path='./models.ts' />

module Team.Models {
    export class PrimaryTeam
    extends Team.Models.TeamModel {

        constructor() {
            super(Team.Enums.TeamTypes.Primary);
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
