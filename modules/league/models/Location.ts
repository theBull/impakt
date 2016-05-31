/// <reference path='./models.ts' />

module League.Models {

	export class Location
	extends Common.Models.AssociableEntity {

		

		constructor() {
			super(Common.Enums.ImpaktDataTypes.Location);

			this.associable = [
				'games',
				'teams'
			];
		}
        
        public copy(newLocation?: League.Models.Location): League.Models.Location {
            var copyLocation = newLocation || new League.Models.Location();
            return <League.Models.Location>super.copy(copyLocation, this);
        }

		public toJson(): any {
			return $.extend({
				name: this.name,
				
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