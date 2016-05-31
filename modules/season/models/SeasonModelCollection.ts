/// <reference path='./models.ts' />

module Season.Models {

	export class SeasonModelCollection
	extends Common.Models.ActionableCollection<Season.Models.SeasonModel> {

		constructor() {
			super();
		}

		public toJson(): any {
			return null;
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.guid = json.guid;

			let seasonArray = json.seasons || [];
			for (var i = 0; i < seasonArray.length; i++) {
                var rawSeasonModel = seasonArray[i];
                if (Common.Utilities.isNullOrUndefined(rawSeasonModel)) {
                    continue;
                }

                var seasonModel = new Season.Models.SeasonModel();
                seasonModel.fromJson(rawSeasonModel);
                this.add(seasonModel);
            }
		}

	}

}