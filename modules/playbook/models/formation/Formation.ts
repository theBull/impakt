	/// <reference path='../models.ts' />

module Playbook.Models {

	export class Formation
	extends Common.Models.Modifiable {

		public field: Playbook.Models.Field;
		public placements: Playbook.Models.PlacementCollection;
		public name: string;
		public key: any;
		public parentRK: number;
		public unitType: Playbook.Editor.UnitTypes;
		public editorType: Playbook.Editor.EditorTypes;
		public associated: Common.Models.Association;
		public png: string;

		constructor(name?: string) {
			super(this);
			this.field = null;
			this.unitType = Playbook.Editor.UnitTypes.Other;
			this.parentRK = 1;
			this.editorType = Playbook.Editor.EditorTypes.Formation;
			this.name = name || 'untitled';
			this.associated = new Common.Models.Association();
			this.placements = new Playbook.Models.PlacementCollection();
			this.png = null;
			//this.setDefault();
		}

		public copy(newFormation?: Playbook.Models.Formation): Playbook.Models.Formation {
			let copyFormation = newFormation || new Playbook.Models.Formation();
			return <Playbook.Models.Formation>super.copy(copyFormation, this);
		}

		public toJson(): any {
			return $.extend(super.toJson(), {
				name: this.name,
				key: this.key,
				parentRK: this.parentRK,
				unitType: this.unitType,
				editorType: this.editorType,
				guid: this.guid,
				associated: this.associated.toJson(),
				placements: this.placements.toJson(),
				png: this.png
			});
		}

		public fromJson(json: any) {
			if (!json)
				return;

			let self = this;
			super.fromJson(json);
			this.parentRK = json.parentRK;
			this.editorType = Playbook.Editor.EditorTypes.Formation;
			this.name = json.name;
			this.guid = json.guid;
			this.unitType = json.unitType;
			this.placements.fromJson(json.placements);
			this.key = json.key;
			this.associated.fromJson(json.associated);
			this.png = json.png;

			this.placements.onModified(function() {
				console.log('formation modified: placement collection:', self.guid);
				self.setModified(true);
			});

			this.onModified(function() {
				console.log('formation modified?', self.modified);
			});
		}

		public setDefault() {
			this.placements.removeAll();

			let p1 = new Playbook.Models.Placement(new Playbook.Models.Coordinate(26, 61), 0);
			let p2 = new Playbook.Models.Placement(new Playbook.Models.Coordinate(27.5, 61), 1);
			let p3 = new Playbook.Models.Placement(new Playbook.Models.Coordinate(24.5, 61), 2);
			let p4 = new Playbook.Models.Placement(new Playbook.Models.Coordinate(23, 61), 3);
			let p5 = new Playbook.Models.Placement(new Playbook.Models.Coordinate(29, 61), 4);
			let p6 = new Playbook.Models.Placement(new Playbook.Models.Coordinate(26, 62), 5);
			let p7 = new Playbook.Models.Placement(new Playbook.Models.Coordinate(22, 62), 6);
			let p8 = new Playbook.Models.Placement(new Playbook.Models.Coordinate(10, 61), 7);
			let p9 = new Playbook.Models.Placement(new Playbook.Models.Coordinate(40, 61), 8);
			let p10 = new Playbook.Models.Placement(new Playbook.Models.Coordinate(26, 64), 9);
			let p11 = new Playbook.Models.Placement(new Playbook.Models.Coordinate(26, 66), 10);


			this.placements.add(p1);
			this.placements.add(p2);
			this.placements.add(p3);
			this.placements.add(p4);
			this.placements.add(p5);
			this.placements.add(p6);
			this.placements.add(p7);
			this.placements.add(p8);
			this.placements.add(p9);
			this.placements.add(p10);
			this.placements.add(p11);
		}

		public isValid(): boolean {
			// TODO add validation for 7 players on LOS
			return this.placements.size() == 11;
		}
	}

}