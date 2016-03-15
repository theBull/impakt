/// <reference path='../models.ts' />

module Playbook.Models {

	export class UnitType
	extends Common.Models.Modifiable {

		public unitType: Playbook.Editor.UnitTypes;
		public name: string;
		public active: boolean;
		public associated: Common.Models.Association;
		public setType: Playbook.Editor.SetTypes;

		constructor(unitType: Playbook.Editor.UnitTypes, name: string) {
			super(this);
			this.unitType = unitType;

			this.associated = new Common.Models.Association();

			this.name = name;
			this.active = false;
		}

		public static getUnitTypes() {
			return Common.Utilities.convertEnumToList(Playbook.Editor.UnitTypes);
		}

		public toJson(): any {
			let json = {
				associated: this.associated.toJson(),
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
			this.associated.playbooks.fromJson(json.playbooks);
			this.associated.formations.fromJson(json.formations);
			this.associated.personnel.fromJson(json.personnel);
			this.associated.assignments.fromJson(json.assignments);
		}
	}
}