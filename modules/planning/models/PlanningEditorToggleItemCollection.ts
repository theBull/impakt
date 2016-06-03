/// <reference path='./models.ts' />

module Planning.Models {
	export class PlanningEditorToggleItemCollection
	extends Common.Models.ActionableCollection<Planning.Models.PlanningEditorToggleItem> {

		constructor() {
			super();
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			let toggleItems = json || [];
			for (let i = 0; i < toggleItems.length; i++) {

			}
		}
	}
}