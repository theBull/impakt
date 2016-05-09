/// <reference path='./models.ts' />

module League.Models {
	export class LeagueModel
	extends Common.Models.AssociableEntity
	implements Common.Interfaces.IAssociable {

		public name: string;

		constructor() {
			super(Common.Enums.ImpaktDataTypes.League);
			super.setContext(this);
		}

		public toJson(): any {
			return $.extend({
				name: this.name
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.name = json.name;

			super.fromJson(json);
		}

	}
}