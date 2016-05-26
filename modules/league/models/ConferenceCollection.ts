/// <reference path='./models.ts' />

module League.Models {

	export class ConferenceCollection
	extends Common.Models.ActionableCollection<League.Models.Conference> {

		constructor() {
			super();
		}

		public toJson(): any {
			return {
				guid: this.guid,
				conferences: super.toJson()
			}
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.guid = json.guid;

			let conferenceArray = json.conferences || [];
			for (var i = 0; i < conferenceArray.length; i++) {
                var rawConferenceModel = conferenceArray[i];
                if (Common.Utilities.isNullOrUndefined(rawConferenceModel)) {
                    continue;
                }

                var conferenceModel = new League.Models.Conference();
                conferenceModel.fromJson(rawConferenceModel);
                this.add(conferenceModel);
            }
		}

	}

}