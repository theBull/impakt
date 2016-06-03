/// <reference path='./models.ts' />

module Planning.Models {

	export class GamePlan
	extends Common.Models.AssociableEntity {

		public plan: Planning.Models.Plan;
		public planGuid: string;
		public start: Common.Models.Datetime;

		constructor() {
			super(Common.Enums.ImpaktDataTypes.GamePlan);

			this.plan = null;
			this.planGuid = '';
			this.start = new Common.Models.Datetime();
		}	

		public toJson(): any {
			return $.extend({
				planGuid: this.planGuid,
				start: this.start.toJson()
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.planGuid = json.planGuid;
			this.start.fromJson(json.start);

			super.fromJson(json);
		}

		public setPlan(plan: Planning.Models.Plan): void {
			this.plan = plan;
			this.planGuid = this.plan ? this.plan.guid : '';
		}

	}

}