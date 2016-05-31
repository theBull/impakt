/// <reference path='./models.ts' />

module League.Models {

	export class LocationCollection
	extends Common.Models.ActionableCollection<League.Models.Location> {

		constructor() {
			super();
		}

		public toJson(): any {
			return {
				guid: this.guid,
				locations: super.toJson()
			}
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.guid = json.guid;

			let locationArray = json.locations || [];
			for (var i = 0; i < locationArray.length; i++) {
                var rawLocationModel = locationArray[i];
                if (Common.Utilities.isNullOrUndefined(rawLocationModel)) {
                    continue;
                }

                var locationModel = new League.Models.Location();
                locationModel.fromJson(rawLocationModel);
                this.add(locationModel);
            }
		}

	}

}