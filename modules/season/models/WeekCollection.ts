/// <reference path='./models.ts' />

module Season.Models {

	export class WeekCollection
	extends Common.Models.ActionableCollection<Season.Models.Week> {

		constructor() {
			super();
		}

		public toJson(): any {
			return {
				guid: this.guid,
				weeks: super.toJson()
			}
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.guid = json.guid;

			let weekArray = json.weeks || [];
			for (var i = 0; i < weekArray.length; i++) {
                var rawWeekModel = weekArray[i];
                if (Common.Utilities.isNullOrUndefined(rawWeekModel)) {
                    continue;
                }

                var weekModel = new Season.Models.Week();
                weekModel.fromJson(rawWeekModel);
                this.add(weekModel, false);
            }
		}

	}

}