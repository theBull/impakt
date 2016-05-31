/// <reference path='./models.ts' />

module Season.Models {

	export class SeasonModel
	extends Common.Models.AssociableEntity {

		public year: number;
		public start: Common.Models.Datetime;
		public weeks: Season.Models.WeekCollection;

		constructor() {
			super(Common.Enums.ImpaktDataTypes.Season);

			this.year = (new Date()).getFullYear();
			this.start = new Common.Models.Datetime();
			this.weeks = new Season.Models.WeekCollection();
			this.associable = [
				'leagues'
			];
		}
        
        public copy(newSeason?: Season.Models.SeasonModel): Season.Models.SeasonModel {
            var copySeason = newSeason || new Season.Models.SeasonModel();
            return <Season.Models.SeasonModel>super.copy(copySeason, this);
        }

		public toJson(): any {
			return $.extend({
				weeks: this.weeks.toJson(),
				year: this.year,
				start: this.start.toJson()
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.year = json.year;
			this.weeks.fromJson(json.weeks);
			this.start.fromJson(json.start);

			super.fromJson(json);
		}

	}

}