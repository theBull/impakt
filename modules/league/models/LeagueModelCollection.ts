/// <reference path='./models.ts' />

module League.Models {
	export class LeagueModelCollection
	extends Common.Models.ModifiableCollection<League.Models.LeagueModel> {

		constructor() {
			super();
		}
	}
}