/// <reference path='./models.ts' />

module Planning.Models {
	export abstract class PlanningEditorToggleItem
	extends Common.Models.Actionable
	implements Planning.Interfaces.IPlanningEditorToggleItem {

		public label: string;
		public type: Planning.Enums.PlanningEditorToggleTypes;

		constructor(label: string) {
			super(Common.Enums.ImpaktDataTypes.Unknown);

			if (Common.Utilities.isNullOrUndefined(label) ||
				Common.Utilities.isEmptyString(label))
				throw new Error('PlanningEditorToggleItem constructor(): label is null or undefined');

			this.label = label;
			this.type = Planning.Enums.PlanningEditorToggleTypes.Unknown;
		}

		public toJson(): any {
			return $.extend({
				label: this.label
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.label = json.label;

			super.fromJson(json);
		}
	}
}