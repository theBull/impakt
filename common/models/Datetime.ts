/// <reference path='./models.ts' />

module Common.Models {
	export class Datetime {

		public date: Date;
		public time: number;
		public meridian: string;
		public timezone: string;
		public options: any;
		public popup: any;
		public format: string;

		constructor() {
			this.date = new Date();
			this.time = null;
			// TODO @theBull handle meridian
			// TODO @theBull handle timezone

			this.options = {
				// maxDate: new Date(2020, 12, 31),
				// minDate: new Date(),
				startingDay: 1,
				showWeeks: true
			};

			this.popup = {
				opened: false
			}

			this.format = 'MM/DD/YYYY';
		}

		public toJson(): any {
			return {
				date: this.date,
				time: this.time,
				meridian: this.meridian,
				timezone: this.timezone,
				format: this.format
			}
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.date = new Date(json.date);
			this.time = json.time;
			this.meridian = json.meridian;
			this.timezone = json.timezone;
			this.format = json.format;
		}

		public openPopup(): void {
			this.popup.opened = true;
		}

		public closePopup(): void {
			this.popup.opened = false;
		}

		public togglePopup(open?: boolean): void {
			this.popup.opened = !this.popup.opened || open === true ? this.openPopup() : this.closePopup();
		}

		public getFormatted(): string {
			return moment(this.date).format(this.format);
		}
	}
}