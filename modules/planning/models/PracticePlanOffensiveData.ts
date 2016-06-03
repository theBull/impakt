/// <reference path='./models.ts' />

module Planning.Models {

	export class PracticePlanOffensiveData
	extends Common.Models.Storable {

		public personnel: Planning.Models.PracticePlanPersonnel;
		public formation: Planning.Models.PracticePlanFormation;
		public play: Planning.Models.PracticePlanPlay;
		public wristband: Planning.Models.PracticePlanWristband;
		public depth: Planning.Models.PracticePlanDepth;
		public read: Planning.Models.PracticePlanRead;

		constructor() {
			super();
			this.personnel = new Planning.Models.PracticePlanPersonnel();
			this.formation = new Planning.Models.PracticePlanFormation();
			this.play = new Planning.Models.PracticePlanPlay();
			this.wristband = new Planning.Models.PracticePlanWristband();
			this.depth = new Planning.Models.PracticePlanDepth();
			this.read = new Planning.Models.PracticePlanRead();
		}

		public toJson(): any {
			return $.extend({
				personnel: this.personnel.toJson(),
				formation: this.formation.toJson(),
				play: this.play.toJson(),
				wristband: this.wristband.toJson(),
				depth: this.depth.toJson(),
				read: this.read.toJson()
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;

			this.personnel.fromJson(json.personnel);			
			this.formation.fromJson(json.formation);			
			this.play.fromJson(json.play);			
			this.wristband.fromJson(json.wristband);			
			this.depth.fromJson(json.depth);
			this.read.fromJson(json.read);

			super.fromJson(json);
		}

		public toCollection(): Planning.Models.PlanningEditorToggleItemCollection {
			let collection = new Planning.Models.PlanningEditorToggleItemCollection();
			collection.add(this.personnel, false);
			collection.add(this.formation, false);
			collection.add(this.play, false);
			collection.add(this.wristband, false);
			collection.add(this.depth, false);
			collection.add(this.read, false);
			return collection;
		}
	}

	export class PracticePlanWristband
	extends Planning.Models.PlanningEditorToggleItem {

		public wristband: Common.Models.NotImplementedClass;
		public wristbandGuid: string;

		constructor() {
			super('Wristband');
			this.type = Planning.Enums.PlanningEditorToggleTypes.Wristband;
			this.wristband = null;
			this.wristbandGuid = '';
		}

		public toJson(): any {
			return $.extend({
				wristbandGuid: this.wristbandGuid
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;
			this.wristbandGuid = json.wristbandGuid;
			super.fromJson(json);
		}

		public setWristband(wristband: Common.Models.NotImplementedClass): void {
			// this.wristband = wristband;
			// this.wristbandGuid = this.wristband ? this.wristband.guid : '';
		}
	}

	export class PracticePlanRead
	extends Planning.Models.PlanningEditorToggleItem {

		public read: Common.Models.NotImplementedClass;
		public readGuid: string;

		constructor() {
			super('Read');
			this.type = Planning.Enums.PlanningEditorToggleTypes.Read;
			this.read = null;
			this.readGuid = '';
		}

		public toJson(): any {
			return $.extend({
				readGuid: this.readGuid
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;
			this.readGuid = json.readGuid;
			super.fromJson(json);
		}

		public setRead(read: Common.Models.NotImplementedClass): void {
			// this.read = read;
			// this.readGuid = this.read ? this.read.guid : '';
		}
	}

	export class PracticePlanDepth
	extends Planning.Models.PlanningEditorToggleItem {

		public depth: Common.Models.NotImplementedClass;
		public depthGuid: string;

		constructor() {
			super('Depth');
			this.type = Planning.Enums.PlanningEditorToggleTypes.Depth;
			this.depth = null;
			this.depthGuid = '';
		}

		public toJson(): any {
			return $.extend({
				depthGuid: this.depthGuid
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;
			this.depthGuid = json.depthGuid;
			super.fromJson(json);
		}

		public setDepth(depth: Common.Models.NotImplementedClass): void {
			// this.depth = depth;
			// this.depthGuid = this.depth ? this.depth.guid : '';
		}
	}

	export class PracticePlanPlay
	extends Planning.Models.PlanningEditorToggleItem {

		public play: Common.Interfaces.IPlay;
		public playGuid: string;

		constructor() {
			super('Play');
			this.type = Planning.Enums.PlanningEditorToggleTypes.Play;
			this.play = null;
			this.playGuid = '';
		}

		public toJson(): any {
			return $.extend({
				playGuid: this.playGuid
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;
			this.playGuid = json.playGuid;
			super.fromJson(json);
		}

		public setPlay(play: Common.Models.Play): void {
			this.play = play;
			this.playGuid = this.play ? this.play.guid : '';
		}
	}

	export class PracticePlanFormation
	extends Planning.Models.PlanningEditorToggleItem {

		public formation: Common.Models.Formation;
		public formationGuid: string;

		constructor() {
			super('Formation');
			this.type = Planning.Enums.PlanningEditorToggleTypes.Formation;
			this.formation = null;
			this.formationGuid = '';
		}

		public toJson(): any {
			return $.extend({
				formationGuid: this.formationGuid
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;
			this.formationGuid = json.formationGuid;
			super.fromJson(json);
		}

		public setFormation(formation: Common.Models.Formation): void {
			this.formation = formation;
			this.formationGuid = this.formation ? this.formation.guid : '';
		}
	}

	export class PracticePlanPersonnel
	extends Planning.Models.PlanningEditorToggleItem {

		public personnel: Team.Models.Personnel;
		public personnelGuid: string;

		constructor() {
			super('Personnel');
			this.type = Planning.Enums.PlanningEditorToggleTypes.Personnel;
			this.personnel = null;
			this.personnelGuid = '';
		}

		public toJson(): any {
			return $.extend({
				personnelGuid: this.personnelGuid
			}, super.toJson());
		}

		public fromJson(json: any): void {
			if (!json)
				return;
			this.personnelGuid = json.personnelGuid;
			super.fromJson(json);
		}

		public setPersonnel(personnel: Team.Models.Personnel): void {
			this.personnel = personnel;
			this.personnelGuid = this.personnel ? this.personnel.guid : '';
		}
	}

}