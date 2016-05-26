/// <reference path='./models.ts' />

module League.Models {

	export class Conference
	extends Common.Models.AssociableEntity {

		public name: string;
		public png: string;
		public league: League.Models.LeagueModel;
		public leagueGuid: string;

		constructor() {
			super(Common.Enums.ImpaktDataTypes.Conference);

			this.name = 'Untitled';
			this.league = null;
			this.leagueGuid = '';

			this.associable = [
				'leagues',
				'divisions',
				'teams'
			];
		}
        
        public copy(newConference?: League.Models.Conference): League.Models.Conference {
            var copyConference = newConference || new League.Models.Conference();
            return <League.Models.Conference>super.copy(copyConference, this);
        }

		public toJson(): any {
			return $.extend({
				name: this.name,
				png: this.png,
				leagueGuid: this.leagueGuid
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.name = json.name;
			this.png = json.png;
			this.leagueGuid = json.leagueGuid;

			super.fromJson(json);
		}

		public setLeague(league: League.Models.LeagueModel): void {
			this.league = league;
			this.leagueGuid = this.league ? this.league.guid : '';
		}

	}

}