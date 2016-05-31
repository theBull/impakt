/// <reference path='./models.ts' />

module Season.Models {

	export class Game
	extends Common.Models.AssociableEntity {

		public season: Season.Models.SeasonModel;
		public seasonGuid: string;
		public outcome: any;
		public home: Team.Models.TeamModel;
		public homeGuid: string;
		public away: Team.Models.TeamModel;
		public awayGuid: string;
		public location: League.Models.Location;
		public locationGuid: string;
		public week: Season.Models.Week;
		public weekGuid: string;
		public start: Common.Models.Datetime;


		constructor() {
			super(Common.Enums.ImpaktDataTypes.Game);

			this.start = new Common.Models.Datetime();
			
			this.location = new League.Models.Location();
			this.locationGuid = '';
			
			this.home = new Team.Models.TeamModel();
			this.homeGuid = '';

			this.away = new Team.Models.TeamModel();
			this.awayGuid = '';

			this.week = new Season.Models.Week();
			this.weekGuid = '';

			this.outcome = null;
			this.season = null;
			this.seasonGuid = '';

			this.associable = [
				'seasons',
				'teams',
				'locations'
			];
		}
        
        public copy(newGame?: Season.Models.Game): Season.Models.Game {
            var copyGame = newGame || new Season.Models.Game();
            return <Season.Models.Game>super.copy(copyGame, this);
        }

		public toJson(): any {
			return $.extend({
				start: this.start.toJson(),
				locationGuid: this.locationGuid,
				homeGuid: this.homeGuid,
				awayGuid: this.awayGuid,
				seasonGuid: this.seasonGuid,
				weekGuid: this.weekGuid
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.start.fromJson(json.start);
			this.locationGuid = json.locationGuid;
			this.homeGuid = json.homeGuid;
			this.awayGuid = json.awayGuid;
			this.seasonGuid = json.seasonGuid;
			this.weekGuid = json.weekGuid;

			super.fromJson(json);
		}

		public getFormattedName(): string {
			return this.away && this.home ? [this.away.name, ' @ ', this.home.name].join('') : this.name;
		}

		public setSeason(season: Season.Models.SeasonModel): void {
			this.season = season;
			this.seasonGuid = this.season ? this.season.guid : '';
		}

		public setWeek(week: Season.Models.Week): void {
			this.week = week;
			this.weekGuid = this.week ? this.week.guid : '';
		}

		public setLocation(location: League.Models.Location): void {
			this.location = location;
			this.locationGuid = this.location ? this.location.guid : '';
		}

		public setHome(home: Team.Models.TeamModel): void {
			this.home = home;
			this.homeGuid = this.home ? this.home.guid : '';
			this.name = this.getFormattedName();
		}

		public setAway(away: Team.Models.TeamModel): void {
			this.away = away;
			this.awayGuid = this.away ? this.away.guid : '';
			this.name = this.getFormattedName();
		}

	}
}