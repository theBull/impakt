/// <reference path='./models.ts' />

module Planning.Models {

	export class PracticePlan
	extends Common.Models.AssociableEntity {

		public plan: Planning.Models.Plan;
		public planGuid: string;
		public start: Common.Models.Datetime;
		public titleData: Planning.Models.PracticePlanTitleData;
		public situationData: Planning.Models.PracticePlanSituationData;
		public offensiveData: Planning.Models.PracticePlanOffensiveData;
		public defensiveData: Planning.Models.PracticePlanDefensiveData;
		public items: Planning.Models.PracticePlanItemCollection;

		constructor() {
			super(Common.Enums.ImpaktDataTypes.PracticePlan);

			this.plan = null;
			this.planGuid = '';
			this.start = new Common.Models.Datetime();
			this.titleData = new Planning.Models.PracticePlanTitleData();
			this.situationData = new Planning.Models.PracticePlanSituationData();
			this.offensiveData = new Planning.Models.PracticePlanOffensiveData();
			this.defensiveData = new Planning.Models.PracticePlanDefensiveData();
			this.items = new Planning.Models.PracticePlanItemCollection();

			this._populateItems();

			this.associable = [
				'plans'
			];
		}	

		public toJson(): any {
			return $.extend({
				planGuid: this.planGuid,
				start: this.start.toJson(),
				titleData: this.titleData.toJson(),
				situationData: this.situationData.toJson(),
				offensiveData: this.offensiveData.toJson(),
				defensiveData: this.defensiveData.toJson(),
				items: this.items.toJson()
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.planGuid = json.planGuid;
			this.start.fromJson(json.start);
			this.titleData.fromJson(json.titleData);
			this.situationData.fromJson(json.situationData);
			this.offensiveData.fromJson(json.offensiveData);
			this.defensiveData.fromJson(json.defensiveData);

			this.items.empty(false);
			this.items.fromJson(json.items);

			super.fromJson(json);
		}

		private _populateItems(): void {
			for (let i = 0; i < Planning.Constants.DEFAULT_PRACTICE_PLAN_ITEMS_LENGTH; i++) {
				let newItem = new Planning.Models.PracticePlanItem();
				newItem.index = i;
				this.items.add(newItem, false);
			}
		}

		public setPlan(plan: Planning.Models.Plan): void {
			this.plan = plan;
			this.planGuid = this.plan ? this.plan.guid : '';
		}

	}

}