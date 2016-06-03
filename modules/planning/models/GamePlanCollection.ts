/// <reference path='./models.ts' />

module Planning.Models {

	export class GamePlanCollection
		extends Common.Models.ActionableCollection<Planning.Models.GamePlan> {

		constructor() {
			super();
		}

		public toJson(): any {
			return {
				guid: this.guid,
				gamePlans: super.toJson()
			}
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.guid = json.guid;

			let gamePlanArray = json.gamePlans || [];
			for (var i = 0; i < gamePlanArray.length; i++) {
                var rawGamePlanModel = gamePlanArray[i];
                if (Common.Utilities.isNullOrUndefined(rawGamePlanModel)) {
                    continue;
                }

                var gamePlanModel = new Planning.Models.GamePlan();
                gamePlanModel.fromJson(rawGamePlanModel);
                this.add(gamePlanModel);
            }
		}

	}

}