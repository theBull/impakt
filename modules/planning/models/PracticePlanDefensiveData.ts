/// <reference path='./models.ts' />

module Planning.Models {

	export class PracticePlanDefensiveData
	extends Common.Models.Storable {

		public personnel: Planning.Models.PracticePlanPersonnel;
		public formation: Planning.Models.PracticePlanFormation;
		public play: Planning.Models.PracticePlanPlay;
		public pressure: Planning.Models.PracticePlanPressure;
		public coverage: Planning.Models.PracticePlanCoverage;
		public read: Planning.Models.PracticePlanRead;

		constructor() {
			super();
			this.personnel = new Planning.Models.PracticePlanPersonnel();
			this.formation = new Planning.Models.PracticePlanFormation();
			this.play = new Planning.Models.PracticePlanPlay();
			this.pressure = new Planning.Models.PracticePlanPressure();
			this.coverage = new Planning.Models.PracticePlanCoverage();
			this.read = new Planning.Models.PracticePlanRead();
		}

		public toJson(): any {
			return $.extend({
				personnel: this.personnel.toJson(),
				formation: this.formation.toJson(),
				play: this.play.toJson(),
				pressure: this.pressure.toJson(),
				coverage: this.coverage.toJson(),
				read: this.read.toJson()
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.personnel.fromJson(json.personnel);			
			this.formation.fromJson(json.formation);			
			this.play.fromJson(json.play);			
			this.pressure.fromJson(json.pressure);			
			this.coverage.fromJson(json.coverage);
			this.read.fromJson(json.read);

			super.fromJson(json);
		}

		public toCollection(): Planning.Models.PlanningEditorToggleItemCollection {
			let collection = new Planning.Models.PlanningEditorToggleItemCollection();
			collection.add(this.personnel, false);
			collection.add(this.formation, false);
			collection.add(this.play, false);
			collection.add(this.pressure, false);
			collection.add(this.coverage, false);
			collection.add(this.read, false);
			return collection;
		}
	}

	export class PracticePlanPressure
	extends Planning.Models.PlanningEditorToggleItem {

		public pressure: Common.Models.NotImplementedClass;
		public pressureGuid: string;

		constructor() {
			super('Pressure');
			this.type = Planning.Enums.PlanningEditorToggleTypes.Pressure;
			this.pressure = null;
			this.pressureGuid = '';
		}

		public toJson(): any {
			return $.extend({
				pressureGuid: this.pressureGuid
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;
			this.pressureGuid = json.pressureGuid;
			super.fromJson(json);
		}

		public setPressure(pressure: Common.Models.NotImplementedClass): void {
			// this.pressure = pressure;
			// this.pressureGuid = this.pressure ? this.pressure.guid : '';
		}
	}

	export class PracticePlanCoverage
	extends Planning.Models.PlanningEditorToggleItem {

		public coverage: Common.Models.NotImplementedClass;
		public coverageGuid: string;

		constructor() {
			super('Coverage');
			this.type = Planning.Enums.PlanningEditorToggleTypes.Coverage;
			this.coverage = null;
			this.coverageGuid = '';
		}

		public toJson(): any {
			return $.extend({
				coverageGuid: this.coverageGuid
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;
			this.coverageGuid = json.coverageGuid;
			super.fromJson(json);
		}

		public setCoverage(coverage: Common.Models.NotImplementedClass): void {
			// this.coverage = coverage;
			// this.coverageGuid = this.coverage ? this.coverage.guid : '';
		}
	}

}