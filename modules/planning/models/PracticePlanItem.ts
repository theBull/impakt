/// <reference path='./models.ts' />

module Planning.Models {

	export class PracticePlanItem
	extends Common.Models.Modifiable {

		public index: number;
		public situationData: Planning.Models.PracticePlanSituationData;

		constructor() {
			super();
			this.index = -1;
			this.situationData = new Planning.Models.PracticePlanSituationData();
		}

		public toJson(): any {
			return $.extend({
				index: this.index,
				situationData: this.situationData.toJson()
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.index = json.index;
			this.situationData.fromJson(json.situationData);

			super.fromJson(json);
		}

		public getNumber(): number {
			return this.index + 1;
		}
	}

}