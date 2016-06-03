/// <reference path='./models.ts' />

module Planning.Models {

	export class PracticeScheduleCollection
		extends Common.Models.ActionableCollection<Planning.Models.PracticeSchedule> {

		constructor() {
			super();
		}

		public toJson(): any {
			return {
				guid: this.guid,
				practiceSchedules: super.toJson()
			}
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.guid = json.guid;

			let practiceScheduleArray = json.practiceSchedules || [];
			for (var i = 0; i < practiceScheduleArray.length; i++) {
                var rawpracticeScheduleModel = practiceScheduleArray[i];
                if (Common.Utilities.isNullOrUndefined(rawpracticeScheduleModel)) {
                    continue;
                }

                var practiceScheduleModel = new Planning.Models.PracticeSchedule();
                practiceScheduleModel.fromJson(rawpracticeScheduleModel);
                this.add(practiceScheduleModel);
            }
		}

	}

}