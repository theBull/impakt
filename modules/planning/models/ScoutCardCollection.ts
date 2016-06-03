/// <reference path='./models.ts' />

module Planning.Models {

	export class ScoutCardCollection
		extends Common.Models.ActionableCollection<Planning.Models.ScoutCard> {

		constructor() {
			super();
		}

		public toJson(): any {
			return {
				guid: this.guid,
				scoutCards: super.toJson()
			}
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.guid = json.guid;

			let scoutCardArray = json.scoutCards || [];
			for (var i = 0; i < scoutCardArray.length; i++) {
                var rawscoutCardModel = scoutCardArray[i];
                if (Common.Utilities.isNullOrUndefined(rawscoutCardModel)) {
                    continue;
                }

                var scoutCardModel = new Planning.Models.ScoutCard();
                scoutCardModel.fromJson(rawscoutCardModel);
                this.add(scoutCardModel);
            }
		}

	}

}