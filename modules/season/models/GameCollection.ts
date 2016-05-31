/// <reference path='./models.ts' />

module Season.Models {

	export class GameCollection
	extends Common.Models.ActionableCollection<Season.Models.Game> {

		constructor() {
			super();
		}

		public toJson(): any {
			return {
				guid: this.guid,
				games: super.toJson()
			}
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.guid = json.guid;

			let gameArray = json.games || [];
			for (var i = 0; i < gameArray.length; i++) {
                var rawGameModel = gameArray[i];
                if (Common.Utilities.isNullOrUndefined(rawGameModel)) {
                    continue;
                }

                var gameModel = new Season.Models.Game();
                gameModel.fromJson(rawGameModel);
                this.add(gameModel);
            }
		}

	}

}