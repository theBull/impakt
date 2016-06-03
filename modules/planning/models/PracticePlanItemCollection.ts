/// <reference path='./models.ts' />

module Planning.Models {

	export class PracticePlanItemCollection 
	extends Common.Models.Collection<Planning.Models.PracticePlanItem> {

		constructor(count?: number) {
			super(count);
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			super.fromJson(json);
		}
	}

}