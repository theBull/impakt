/// <reference path='./models.ts' />

module Planning.Models {

	export class QBWristbandCollection
		extends Common.Models.ActionableCollection<Planning.Models.QBWristband> {

		constructor() {
			super();
		}

		public toJson(): any {
			return {
				guid: this.guid,
				QBWristbands: super.toJson()
			}
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.guid = json.guid;

			let QBWristbandArray = json.QBWristbands || [];
			for (var i = 0; i < QBWristbandArray.length; i++) {
                var rawQBWristbandModel = QBWristbandArray[i];
                if (Common.Utilities.isNullOrUndefined(rawQBWristbandModel)) {
                    continue;
                }

                var QBWristbandModel = new Planning.Models.QBWristband();
                QBWristbandModel.fromJson(rawQBWristbandModel);
                this.add(QBWristbandModel);
            }
		}

	}

}