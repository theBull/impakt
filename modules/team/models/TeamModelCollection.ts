/// <reference path='./models.ts' />

module Team.Models {
    export class TeamModelCollection
    extends Common.Models.ActionableCollection<Team.Models.TeamModel> {
        
        public teamType: Team.Enums.TeamTypes;

        constructor() {
            super();
            this.teamType = Team.Enums.TeamTypes.Mixed;
        }
        public toJson() {
            return {
                teamType: this.teamType,
                guid: this.guid,
                teams: super.toJson()
            }
        }
        public fromJson(json) {
            if (!json)
                return;

            this.teamType = json.teamType;
            this.guid = json.guid;
           
            var teamArray = json.teams || [];
            for (var i = 0; i < teamArray.length; i++) {
                var rawTeamModel = teamArray[i];
                if(Common.Utilities.isNullOrUndefined(rawTeamModel)) {
                    continue;
                }
                rawTeamModel.teamType = Common.Utilities.isNullOrUndefined(rawTeamModel.teamType) &&
                    rawTeamModel.teamType >= 0 ? rawTeamModel.teamType : Team.Enums.TeamTypes.Other;
                    
                var teamModel = new Team.Models.TeamModel();
                teamModel.fromJson(rawTeamModel);
                this.add(teamModel);
            }
        }
    }
}
