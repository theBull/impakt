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

		constructor(name?: string) {
			super(this);
			this.field = null;
			this.unitType = Playbook.Editor.UnitTypes.Other;
			this.parentRK = 1;
			this.editorType = Playbook.Editor.EditorTypes.Formation;
			this.name = name || 'untitled';
			this.associated = new Common.Models.Association();
			this.placements = new Playbook.Models.PlacementCollection();
			this.setDefault();
		}

		public toJson(): any {
			return {
				name: this.name,
				key: this.key,
				parentRK: this.parentRK,
				unitType: this.unitType,
				editorType: this.editorType,
				guid: this.guid,
				associated: this.associated.toJson(),
				placements: this.placements.toJson()
			}
		}

		public fromJson(json: any) {
			if (!json)
				return;

			this.parentRK = json.parentRK;
			this.editorType = Playbook.Editor.EditorTypes.Formation;
			this.name = json.name;
			this.guid = json.guid;
			this.unitType = json.unitType;
			this.placements.fromJson(json.placements);
			this.key = json.key;
			this.associated.fromJson(json.associated);
		}

		public setDefault() {
			this.placements.removeAll();

			let p1 = new Playbook.Models.Placement({ x: 26, y: 61});
			let p2 = new Playbook.Models.Placement({ x: 27.5, y: 61});
			let p3 = new Playbook.Models.Placement({ x: 24.5, y: 61});
			let p4 = new Playbook.Models.Placement({ x: 23, y: 61});
			let p5 = new Playbook.Models.Placement({ x: 29, y: 61});
			let p6 = new Playbook.Models.Placement({ x: 26, y: 62});
			let p7 = new Playbook.Models.Placement({ x: 22, y: 62});
			let p8 = new Playbook.Models.Placement({ x: 10, y: 61});
			let p9 = new Playbook.Models.Placement({ x: 40, y: 61});
			let p10 = new Playbook.Models.Placement({ x: 26, y: 64});
			let p11 = new Playbook.Models.Placement({ x: 26, y: 66});


			this.placements.add(p1.guid, p1);
			this.placements.add(p2.guid, p2);
			this.placements.add(p3.guid, p3);
			this.placements.add(p4.guid, p4);
			this.placements.add(p5.guid, p5);
			this.placements.add(p6.guid, p6);
			this.placements.add(p7.guid, p7);
			this.placements.add(p8.guid, p8);
			this.placements.add(p9.guid, p9);
			this.placements.add(p10.guid, p10);
			this.placements.add(p11.guid, p11);
		}

		public isValid(): boolean {
			// TODO add validation for 7 players on LOS
			return this.placements.size() == 11;
		}
	}

}