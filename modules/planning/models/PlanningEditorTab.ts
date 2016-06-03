/// <reference path='./models.ts' />

module Planning.Models {
	export class PlanningEditorTab 
	extends Common.Models.Actionable
	implements Common.Interfaces.ICollectionItem {

		public data: Common.Interfaces.IActionable;
		
		private _closeCallbacks: Array<Function>;

		constructor(data: Common.Interfaces.IActionable) {
			super(Common.Enums.ImpaktDataTypes.Unknown);
			
			if (Common.Utilities.isNullOrUndefined(data))
				throw new Error('PlanningEditorTab constructor(): data is null or undefined');

			this.data = data;
		}
	}
}