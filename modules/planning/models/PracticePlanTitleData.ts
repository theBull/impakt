/// <reference path='./models.ts' />

module Planning.Models {

	export class PracticePlanTitleData
	extends Common.Models.Storable {

		public periodName: Planning.Models.PracticePlanPeriodName;
		public periodNumber: Planning.Models.PracticePlanPeriodNumber;
		public periodReps: Planning.Models.PracticePlanPeriodReps;
		public periodStart: Planning.Models.PracticePlanPeriodStart;
		public periodFinish: Planning.Models.PracticePlanPeriodFinish;
		public date: Planning.Models.PracticePlanDate;
		public location: Planning.Models.PracticePlanLocation;
		public opponent: Planning.Models.PracticePlanOpponent;
		public duration: Planning.Models.PracticePlanDuration;

		constructor() {
			super();
			this.periodName = new Planning.Models.PracticePlanPeriodName();
			this.periodNumber = new Planning.Models.PracticePlanPeriodNumber();
			this.periodReps = new Planning.Models.PracticePlanPeriodReps();
			this.periodStart = new Planning.Models.PracticePlanPeriodStart();
			this.periodFinish = new Planning.Models.PracticePlanPeriodFinish();
			this.date = new Planning.Models.PracticePlanDate();
			this.location = new Planning.Models.PracticePlanLocation();
			this.opponent = new Planning.Models.PracticePlanOpponent();
			this.duration = new Planning.Models.PracticePlanDuration();
		}

		public toJson(): any {
			return $.extend({
				periodName: this.periodName.toJson(),
				periodNumber: this.periodNumber.toJson(),
				periodReps: this.periodReps.toJson(),
				periodStart: this.periodStart.toJson(),
				periodFinish: this.periodFinish.toJson(),
				date: this.date.toJson(),
				location: this.location.toJson(),
				opponent: this.opponent.toJson(),
				duration: this.duration.toJson()
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.periodName.fromJson(json.periodName);
			this.periodNumber.fromJson(json.periodNumber);
			this.periodReps.fromJson(json.periodReps);
			this.periodStart.fromJson(json.periodStart);
			this.periodFinish.fromJson(json.periodFinish);
			this.date.fromJson(json.date);
			this.location.fromJson(json.locationGuid);
			this.opponent.fromJson(json.opponentGuid);
			this.duration.fromJson(json.duration);

			super.fromJson(json);
		}

		public toCollection(): Planning.Models.PlanningEditorToggleItemCollection {
			let collection = new Planning.Models.PlanningEditorToggleItemCollection();
			
			collection.add(this.periodName, false);
			collection.add(this.periodNumber, false);
			collection.add(this.periodReps, false);
			collection.add(this.periodStart, false);
			collection.add(this.periodFinish, false);
			collection.add(this.date, false);
			collection.add(this.location, false);
			collection.add(this.opponent, false);
			collection.add(this.duration, false);

			return collection;
		}
	}

	export class PracticePlanPeriodName
	extends Planning.Models.PlanningEditorToggleItem {

		public name: string;

		constructor() {
			super('Period name');
			this.name = '';
			this.type = Planning.Enums.PlanningEditorToggleTypes.PeriodName;
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

	export class PracticePlanPeriodNumber
	extends Planning.Models.PlanningEditorToggleItem {

		public number: number;

		constructor() {
			super('Period number');
			this.number = 0;
			this.type = Planning.Enums.PlanningEditorToggleTypes.PeriodName;
		}

		public toJson(): any {
			return $.extend({
				number: this.number
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.number = json.number;

			super.fromJson(json);
		}

	}

	export class PracticePlanPeriodReps
	extends Planning.Models.PlanningEditorToggleItem {

		public reps: number;

		constructor() {
			super('Period Reps');
			this.reps = 0;
			this.type = Planning.Enums.PlanningEditorToggleTypes.PeriodReps;
		}

		public toJson(): any {
			return $.extend({
				reps: this.reps
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.reps = json.reps;

			super.fromJson(json);
		}

	}

	export class PracticePlanPeriodStart
	extends Planning.Models.PlanningEditorToggleItem {

		public start: number;

		constructor() {
			super('Period start');
			this.start = 0;
			this.type = Planning.Enums.PlanningEditorToggleTypes.PeriodStart;
		}

		public toJson(): any {
			return $.extend({
				start: this.start
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.start = json.start;

			super.fromJson(json);
		}

	}

	export class PracticePlanPeriodFinish
	extends Planning.Models.PlanningEditorToggleItem {

		public finish: number;

		constructor() {
			super('Period finish');
			this.finish = 0;
			this.type = Planning.Enums.PlanningEditorToggleTypes.PeriodFinish;
		}

		public toJson(): any {
			return $.extend({
				finish: this.finish
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.finish = json.finish;

			super.fromJson(json);
		}

	}

	export class PracticePlanDate
	extends Planning.Models.PlanningEditorToggleItem {

		public date: Common.Models.Datetime;

		constructor() {
			super('Date');
			this.date = new Common.Models.Datetime();
			this.type = Planning.Enums.PlanningEditorToggleTypes.Date;
		}

		public toJson(): any {
			return $.extend({
				date: this.date.toJson()
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.date.fromJson(json.date);

			super.fromJson(json);
		}

	}

	export class PracticePlanLocation
	extends Planning.Models.PlanningEditorToggleItem {

		public location: League.Models.Location;
		public locationGuid: string;

		constructor() {
			super('Location');
			this.location = null;
			this.locationGuid = '';
			this.type = Planning.Enums.PlanningEditorToggleTypes.Location;
		}

		public toJson(): any {
			return $.extend({
				locationGuid: this.locationGuid
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.locationGuid = json.locationGuid;

			super.fromJson(json);
		}

		public setLocation(location: League.Models.Location): void {
			this.location = location;
			this.locationGuid = this.location ? this.location.guid : '';
		}

	}

	export class PracticePlanOpponent
	extends Planning.Models.PlanningEditorToggleItem {
		
		public opponent: Team.Models.TeamModel;
		public opponentGuid: string;

		constructor() {
			super('Opponent');
			this.opponent = null;
			this.opponentGuid = '';
			this.type = Planning.Enums.PlanningEditorToggleTypes.Opponent;
		}

		public toJson(): any {
			return $.extend({
				opponentGuid: this.opponentGuid
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.opponentGuid = json.opponentGuid;

			super.fromJson(json);
		}

		public setOpponent(opponent: Team.Models.TeamModel): void {
			this.opponent = opponent;
			this.opponentGuid = this.opponent ? this.opponent.guid : '';
		}

	}

	export class PracticePlanDuration
	extends Planning.Models.PlanningEditorToggleItem {

		public duration: number;

		constructor() {
			super('Duration');
			this.duration = 0;
			this.type = Planning.Enums.PlanningEditorToggleTypes.Duration;
		}

		public toJson(): any {
			return $.extend({
				duration: this.duration
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.duration = json;

			super.fromJson(json);
		}

	}
}