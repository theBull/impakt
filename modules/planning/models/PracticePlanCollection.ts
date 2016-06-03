/// <reference path='./models.ts' />

module Planning.Models {

	export class PracticePlanCollection
		extends Common.Models.ActionableCollection<Planning.Models.PracticePlan> {

		constructor() {
			super();
		}

		public toJson(): any {
			return {
				guid: this.guid,
				practicePlans: super.toJson()
			}
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.guid = json.guid;

			let practicePlanArray = json.practicePlans || [];
			for (var i = 0; i < practicePlanArray.length; i++) {
                var rawPracticePlanModel = practicePlanArray[i];
                if (Common.Utilities.isNullOrUndefined(rawPracticePlanModel)) {
                    continue;
                }

                var practicePlanModel = new Planning.Models.PracticePlan();
                practicePlanModel.fromJson(rawPracticePlanModel);
                this.add(practicePlanModel);
            }
		}

	}

}