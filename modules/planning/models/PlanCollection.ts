/// <reference path='./models.ts' />

module Planning.Models {

	export class PlanCollection
		extends Common.Models.ActionableCollection<Planning.Models.Plan> {

		constructor() {
			super();
		}

		public toJson(): any {
			return {
				guid: this.guid,
				Plans: super.toJson()
			}
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.guid = json.guid;

			let planArray = json.plans || [];
			for (var i = 0; i < planArray.length; i++) {
                var rawPlanModel = planArray[i];
                if (Common.Utilities.isNullOrUndefined(rawPlanModel)) {
                    continue;
                }

                var planModel = new Planning.Models.Plan();
                planModel.fromJson(rawPlanModel);
                this.add(planModel);
            }
		}

	}

}