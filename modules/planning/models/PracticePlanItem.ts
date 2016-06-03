/// <reference path='./models.ts' />

module Planning.Models {

	export class PracticePlanItem
	extends Common.Models.Modifiable {

		public index: number;

		constructor() {
			super();
			this.index = -1;
		}

		public toJson(): any {
			return $.extend({
				index: this.index
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.index = json.index;

			super.fromJson(json);
		}

		public getNumber(): number {
			return this.index + 1;
		}
	}

}