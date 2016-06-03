/// <reference path='./models.ts' />

module Planning.Models {

	export class ScoutCard
	extends Common.Models.AssociableEntity {

		public plan: Planning.Models.Plan;
		public planGuid: string;

		constructor() {
			super(Common.Enums.ImpaktDataTypes.ScoutCard);

			this.plan = null;
			this.planGuid = '';
		}	

		public toJson(): any {
			return $.extend({
				planGuid: this.planGuid
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.planGuid = json.planGuid;

			super.fromJson(json);
		}

		public setPlan(plan: Planning.Models.Plan): void {
			this.plan = plan;
			this.planGuid = this.plan ? this.plan.guid : '';
		}

	}

}