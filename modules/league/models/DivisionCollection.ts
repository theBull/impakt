/// <reference path='./models.ts' />

module League.Models {

	export class DivisionCollection
	extends Common.Models.ActionableCollection<League.Models.Division> {

		constructor() {
			super();
		}

		public toJson(): any {
			return {
				guid: this.guid,
				divisions: super.toJson()
			}
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.guid = json.guid;

			let divisionArray = json.divisions || [];
			for (var i = 0; i < divisionArray.length; i++) {
                var rawDivisionModel = divisionArray[i];
                if (Common.Utilities.isNullOrUndefined(rawDivisionModel)) {
                    continue;
                }

                var divisionModel = new League.Models.Division();
                divisionModel.fromJson(rawDivisionModel);
                this.add(divisionModel);
            }
		}

	}

}