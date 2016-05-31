/// <reference path='./models.ts' />

module Season.Models {

	export class Week
	extends Common.Models.Actionable {

		public name: string;
		public number: number;
		public season: Season.Models.SeasonModel;
		public seasonGuid: string;
		public start: Common.Models.Datetime;

		constructor() {
			super(Common.Enums.ImpaktDataTypes.Unknown);
			this.name = null;
			this.number = 0;
			this.season = new Season.Models.SeasonModel();
			this.seasonGuid = '';
			this.start = new Common.Models.Datetime();
		}

		public toJson(): any {
			return $.extend({
				name: this.name,
				number: this.number,
				guid: this.guid,
				seasonGuid: this.seasonGuid,
				start: this.start.toJson()
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.name = json.name;
			this.number = json.number;
			this.seasonGuid = json.seasonGuid;
			this.start.fromJson(json.start);

			super.fromJson(json);
		}

		public getFormattedName(): string {
			return this.name + ' ' + this.number;
		}

		public setSeason(season: Season.Models.SeasonModel): void {
			this.season = season;
			this.seasonGuid = this.season ? this.season.guid : '';
		}

		/**
		 * Takes the given start Datetime and then increments the created
		 * date with the given number of weeks (weekOffset)
		 * 
		 * @param {Date}   start      [description]
		 * @param {number} weekOffset [description]
		 */
		public incrementWeek(start: Common.Models.Datetime, addWeeks: number): void {
			this.start.date = (moment(start.date).add(addWeeks, 'week'))._d;
		}

		/**
		 * Takes the given start Datetime and subtracts the given number of
		 * weeks from that date.
		 * 
		 * @param {Common.Models.Datetime} start         [description]
		 * @param {number}                 subtractWeeks [description]
		 */
		public decrementWeek(start: Common.Models.Datetime, subtractWeeks: number): void {
			this.start.date = (moment(start.date).subtract(subtractWeeks, 'week'))._d;
		}

		public getFormattedDate(): string {
			return this.start.getFormatted();
		}

	}

}