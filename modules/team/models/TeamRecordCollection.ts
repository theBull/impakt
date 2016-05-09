/// <reference path='./models.ts' />

module Team.Models {
	export class TeamRecordCollection
	extends Common.Models.ModifiableCollection<Team.Models.TeamRecord> {
				
		constructor() {
			super();
		}

		public toJson(): any {
			return super.toJson();
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			var recordArray = json.records || [];
            for (var i = 0; i < recordArray.length; i++) {
                var rawTeamRecordModel = recordArray[i];
                if (Common.Utilities.isNullOrUndefined(rawTeamRecordModel)) {
                    continue;
                }

                var teamRecordModel = new Team.Models.TeamRecord();
                teamRecordModel.fromJson(rawTeamRecordModel);
                this.add(teamRecordModel);
            }
		}
	}
}