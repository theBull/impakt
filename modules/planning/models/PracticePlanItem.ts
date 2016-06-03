/// <reference path='./models.ts' />

module Planning.Models {

	export class PracticePlanItem
	extends Common.Models.Modifiable {

		public index: number;
		public situationData: Planning.Models.PracticePlanSituationData;
		public offensiveData: Planning.Models.PracticePlanOffensiveData;
		public defensiveData: Planning.Models.PracticePlanDefensiveData;

		constructor() {
			super();
			this.index = -1;
			this.situationData = new Planning.Models.PracticePlanSituationData();
			this.offensiveData = new Planning.Models.PracticePlanOffensiveData();
			this.defensiveData = new Planning.Models.PracticePlanDefensiveData();
		}

		public toJson(): any {
			return $.extend({
				index: this.index,
				situationData: this.situationData.toJson(),
				offensiveData: this.offensiveData.toJson(),
				defensiveData: this.defensiveData.toJson()
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.index = json.index;
			this.situationData.fromJson(json.situationData);
			this.offensiveData.fromJson(json.offensiveData);
			this.defensiveData.fromJson(json.defensiveData);

			super.fromJson(json);
		}

		public getNumber(): number {
			return this.index + 1;
		}
	}

}