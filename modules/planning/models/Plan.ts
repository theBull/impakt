/// <reference path='./models.ts' />

module Planning.Models {

	export class Plan
	extends Common.Models.AssociableEntity {

		public game: Season.Models.Game;
		public gameGuid: string;
		public start: Common.Models.Datetime;

		constructor() {
			super(Common.Enums.ImpaktDataTypes.Plan);

			this.game = null;
			this.gameGuid = '';
			this.start = new Common.Models.Datetime();

			this.associable = [
				'games',
				'practicePlans',
				'practiceSchedules',
				'gamePlans',
				'scoutCards',
				'QBWristbands',
				'teams',
				'playbooks'
			];
		}
		public toJson(): any {
			return $.extend({
				gameGuid: this.gameGuid,
				start: this.start
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.gameGuid = json.gameGuid;
			this.start.fromJson(json.start);

			super.fromJson(json);
		}

		public setGame(game: Season.Models.Game): void {
			this.game = game;
			this.gameGuid = this.game ? this.game.guid : '';
		}
	}

}