/// <reference path='../models.ts' />

module Playbook.Models {

	export class UnitType
	extends Common.Models.Modifiable {

		public unitType: Playbook.Editor.UnitTypes;
		public name: string;
		public active: boolean;
		public playbooks: Playbook.Models.PlaybookModelCollection;
		public formations: Playbook.Models.FormationCollection;
		public personnel: Playbook.Models.PersonnelCollection;
		public assignments: Playbook.Models.AssignmentCollection;

		constructor(unitType: Playbook.Editor.UnitTypes, name: string) {
			super(this);
			this.unitType = unitType;

			this.playbooks = new Playbook.Models.PlaybookModelCollection();
			this.playbooks.unitType = unitType;

			this.formations = new Playbook.Models.FormationCollection();
			this.formations.unitType = unitType;

			this.personnel = new Playbook.Models.PersonnelCollection();
			this.personnel.unitType = unitType;

			this.assignments = new Playbook.Models.AssignmentCollection();
			this.assignments.unitType = unitType;

			this.name = name;
			this.active = false;
		}

		public static getUnitTypes() {
			return Common.Utilities.convertEnumToList(Playbook.Editor.UnitTypes);
		}

		public toJson(): any {
			let json = {
				playbooks: this.playbooks.toJson(),
				formations: this.formations.toJson(),
				personnel: this.personnel.toJson(),
				assignments: this.assignments.toJson(),
				unitType: this.unitType,
				name: this.name,
				active: this.active,
				guid: this.guid
			}
			return json;
		}

		public fromJson(json: any) {
			if (!json)
				return;

			this.unitType = json.unitType;
			this.name = json.name;
			this.active = json.active;
			this.guid = json.guid;
			this.playbooks.fromJson(json.playbooks);
			this.formations.fromJson(json.formations);
			this.personnel.fromJson(json.personnel);
			this.assignments.fromJson(json.assignments);
		}
	}
}