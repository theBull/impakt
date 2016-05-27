/// <reference path='./models.ts' />

module League.Models {
	export class LeagueModel
	extends Common.Models.AssociableEntity
	implements Common.Interfaces.IAssociable {

		constructor() {
			super(Common.Enums.ImpaktDataTypes.League);
			super.setContext(this);

			this.associable = [
				'conferences',
				'divisions',
				'teams'
			]
		}

        public copy(newLeague?: League.Models.LeagueModel): League.Models.LeagueModel {
            var copyLeague = newLeague || new League.Models.LeagueModel();
            return <League.Models.LeagueModel>super.copy(copyLeague, this);
        }

		public toJson(): any {
			return $.extend({
				name: this.name
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.name = json.name;

			super.fromJson(json);
		}

	}
}