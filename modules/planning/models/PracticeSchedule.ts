/// <reference path='./models.ts' />

module Planning.Models {

	export class PracticeSchedule
	extends Common.Models.AssociableEntity {

		constructor() {
			super(Common.Enums.ImpaktDataTypes.PracticePlan);
		}	

		public toJson(): any {
			return $.extend({

			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			// TODO

			super.fromJson(json);
		}

	}

}