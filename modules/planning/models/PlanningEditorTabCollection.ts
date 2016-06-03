/// <reference path='./models.ts' />

module Planning.Models {
	export class PlanningEditorTabCollection
	extends Common.Models.ActionableCollection<Planning.Models.PlanningEditorTab> {
		constructor() {
			super();
		}

		public close(tab: Common.Models.Tab): void {
			this.remove(tab.guid);
			tab.close();
		}
	}
}