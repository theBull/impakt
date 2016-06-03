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

			let items = json || [];
			for (let i = 0; i < items.length; i++) {
				let rawItem = items[i];
				let itemModel = new Planning.Models.PracticePlanItem();
				itemModel.fromJson(rawItem);
				this.add(itemModel, false);
			}

			super.fromJson(json);
		}
	}

}