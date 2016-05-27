/// <reference path='./models.ts' />

module League.Models {

	export class Division
	extends Common.Models.AssociableEntity {

		public png: string;
		public conference: League.Models.Conference;
		public conferenceGuid: string;

		constructor() {
			super(Common.Enums.ImpaktDataTypes.Division);

			this.name = '';
			this.conference = null;
			this.conferenceGuid = '';

			this.associable = [
				'leagues',
				'conferences',
				'teams'
			];
		}
        
        public copy(newDivision?: League.Models.Division): League.Models.Division {
            var copyDivision = newDivision || new League.Models.Division();
            return <League.Models.Division>super.copy(copyDivision, this);
        }

		public toJson(): any {
			return $.extend({
				name: this.name,
				png: this.png,
				conferenceGuid: this.conferenceGuid
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.name = json.name;
			this.png = json.png;
			this.conferenceGuid = json.conferenceGuid;

			super.fromJson(json);
		}

		public setConference(conference: League.Models.Conference): void {
			this.conference = conference;
			this.conferenceGuid = this.conference ? this.conference.guid : '';
		}

	}

}