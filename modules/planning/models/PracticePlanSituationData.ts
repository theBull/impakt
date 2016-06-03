/// <reference path='./models.ts' />

module Planning.Models {

	export class PracticePlanSituationData
	extends Common.Models.Storable {

		public playCount: Planning.Models.PracticePlanPlayCount;
		public hashmark: Planning.Models.PracticePlanHashmark;
		public down: Planning.Models.PracticePlanDown;
		public distance: Planning.Models.PracticePlanDistance;
		public yardline: Planning.Models.PracticePlanYardline;
		public fieldZone: Planning.Models.PracticePlanFieldZone;
		public time: Planning.Models.PracticePlanTime;
		public tempo: Planning.Models.PracticePlanTempo;
		public scoreDifference: Planning.Models.PracticePlanScoreDifference;

		constructor() {
			super();
			this.playCount = new Planning.Models.PracticePlanPlayCount();
			this.hashmark = new Planning.Models.PracticePlanHashmark();
			this.down = new Planning.Models.PracticePlanDown();
			this.distance = new Planning.Models.PracticePlanDistance();
			this.yardline = new Planning.Models.PracticePlanYardline();
			this.fieldZone = new Planning.Models.PracticePlanFieldZone();
			this.time = new Planning.Models.PracticePlanTime();
			this.tempo = new Planning.Models.PracticePlanTempo();
			this.scoreDifference = new Planning.Models.PracticePlanScoreDifference();
		}

		public toJson(): any {
			return $.extend({
				playCount: this.playCount.toJson(),
				hashmark: this.hashmark.toJson(),
				down: this.down.toJson(),
				distance: this.distance.toJson(),
				yardline: this.yardline.toJson(),
				fieldZone: this.fieldZone.toJson(),
				time: this.time.toJson(),
				tempo: this.tempo.toJson(),
				scoreDifference: this.scoreDifference.toJson()
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.playCount.fromJson(json.playCount);
			this.hashmark.fromJson(json.hashmark);
			this.down.fromJson(json.down);
			this.distance.fromJson(json.distance);
			this.yardline.fromJson(json.yardline);
			this.fieldZone.fromJson(json.fieldZone);
			this.time.fromJson(json.time);
			this.tempo.fromJson(json.tempo);
			this.scoreDifference.fromJson(json.scoreDifference);

			super.fromJson(json);
		}

		public toCollection(): Planning.Models.PlanningEditorToggleItemCollection {
			let collection = new Planning.Models.PlanningEditorToggleItemCollection();
			collection.add(this.playCount, false);
			collection.add(this.hashmark, false);
			collection.add(this.down, false);
			collection.add(this.distance, false);
			collection.add(this.yardline, false);
			collection.add(this.fieldZone, false);
			collection.add(this.time, false);
			collection.add(this.tempo, false);
			collection.add(this.scoreDifference, false);
			return collection;
		}
	}

	export class PracticePlanPlayCount
	extends Planning.Models.PlanningEditorToggleItem {

		public count: number;

		constructor() {
			super('Play count');
			this.type = Planning.Enums.PlanningEditorToggleTypes.PlayCount;
			this.count = 30;
		}

		public toJson(): any {
			return $.extend({
				count: this.count
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.count = json.count;

			super.fromJson(json);
		}
	}

	export class PracticePlanHashmark
	extends Planning.Models.PlanningEditorToggleItem {

		public hashmark: Playbook.Enums.Hashmark;

		constructor() {
			super('Hashmark');
			this.type = Planning.Enums.PlanningEditorToggleTypes.Hashmark;
			this.hashmark = Playbook.Enums.Hashmark.Center;
		}

		public toJson(): any {
			return $.extend({
				hashmark: this.hashmark
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;
			this.hashmark = json.hashmark;
			super.fromJson(json);
		}
	}

	export class PracticePlanDown
	extends Planning.Models.PlanningEditorToggleItem {

		public down: number;

		constructor() {
			super('Down');
			this.type = Planning.Enums.PlanningEditorToggleTypes.Down;
			this.down = 1;
		}

		public toJson(): any {
			return $.extend({
				down: this.down
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;
			this.down = json.down;
			super.fromJson(json);
		}
	}

	export class PracticePlanDistance
	extends Planning.Models.PlanningEditorToggleItem {

		public distance: number;

		constructor() {
			super('Distance');
			this.type = Planning.Enums.PlanningEditorToggleTypes.Distance;
			this.distance = 10;
		}

		public toJson(): any {
			return $.extend({
				distance: this.distance
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;
			this.distance = json.distance;
			super.fromJson(json);
		}
	}

	export class PracticePlanYardline
	extends Planning.Models.PlanningEditorToggleItem {

		public yardline: number;

		constructor() {
			super('Yardline');
			this.type = Planning.Enums.PlanningEditorToggleTypes.Yardline;
			this.yardline = 50;
		}

		public toJson(): any {
			return $.extend({
				yardline: this.yardline
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;
			this.yardline = json.yardline;
			super.fromJson(json);
		}
	}

	export class PracticePlanFieldZone
	extends Planning.Models.PlanningEditorToggleItem {

		public fieldZone: Common.Models.NotImplementedClass;

		constructor() {
			super('Field zone');
			this.type = Planning.Enums.PlanningEditorToggleTypes.FieldZone;
			this.fieldZone = new Common.Models.NotImplementedClass();
		}

		public toJson(): any {
			return $.extend({
				fieldZone: this.fieldZone
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;
			this.fieldZone.fromJson(json.fieldZone);
			super.fromJson(json);
		}
	}

	export class PracticePlanTime
	extends Planning.Models.PlanningEditorToggleItem {

		public time: number;

		constructor() {
			super('Time');
			this.type = Planning.Enums.PlanningEditorToggleTypes.Time;
			this.time = 0;
		}

		public toJson(): any {
			return $.extend({
				time: this.time
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;
			this.time = json.time;
			super.fromJson(json);
		}
	}

	export class PracticePlanTempo
	extends Planning.Models.PlanningEditorToggleItem {

		public tempo: Common.Models.NotImplementedClass;

		constructor() {
			super('Tempo');
			this.type = Planning.Enums.PlanningEditorToggleTypes.Tempo;
			this.tempo = new Common.Models.NotImplementedClass();
		}

		public toJson(): any {
			return $.extend({
				tempo: this.tempo
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;
			this.tempo.fromJson(json);
			super.fromJson(json);
		}
	}

	export class PracticePlanScoreDifference
	extends Planning.Models.PlanningEditorToggleItem {

		public difference: number;

		constructor() {
			super('Score difference');
			this.type = Planning.Enums.PlanningEditorToggleTypes.ScoreDifference;
		}

		public toJson(): any {
			return $.extend({
				difference: this.difference
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;
			this.difference = json.difference;
			super.fromJson(json);
		}
	}

}