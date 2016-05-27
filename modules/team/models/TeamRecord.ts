/// <reference path='./models.ts' />

module Team.Models {
	export class TeamRecord
	extends Common.Models.Modifiable {
		
		public wins: number;
		public losses: number;
		public season: number; // year begin (i.e. 2015 - 2016 season is 2015)
		
		constructor() {
			super();
			super.setContext(this);
			
			this.wins = 0;
			this.losses = 0;
			this.season = 2016; // @theBull - TODO - how to tie this with the season...association?
		}

		public toJson(): any {
			return {
				wins: this.wins,
				losses: this.losses,
				season: this.season
			};
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.wins = json.wins;
			this.losses = json.losses;
			this.season = json.season;
		}

	}
}