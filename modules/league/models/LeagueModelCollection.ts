/// <reference path='./models.ts' />

module League.Models {
	export class LeagueModelCollection
	extends Common.Models.ActionableCollection<League.Models.LeagueModel> {

		constructor() {
			super();
		}
	}
}