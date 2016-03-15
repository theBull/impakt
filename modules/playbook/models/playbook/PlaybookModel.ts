/// <reference path='../models.ts' />

module Playbook.Models {

	export class PlaybookModel
	extends Common.Models.Modifiable {

		public key: number;
		public name: string;
		public associated: Common.Models.Association;
		public active: boolean;
		public unitType: Playbook.Editor.UnitTypes;

		constructor() {
			super(this);
			this.key = -1;
			this.name = 'Untitled';
			this.associated = new Common.Models.Association();
			this.active = false;			
			this.unitType = Playbook.Editor.UnitTypes.Other;
		}

		public toJson(): any {
			return {
				key: this.key,
				name: this.name,
				associated: this.associated.toJson(),
				active: this.active,
				unitType: this.unitType,
				guid: this.guid
			}
		}

		public fromJson(json: any) {
			if (!json)
				return;
			
			this.key = json.key || this.key;
			this.name = json.name || this.name;
			this.active = json.active || this.active;
			this.unitType = json.unitType || this.unitType;
			this.guid = json.guid || this.guid;
			if (json.associated)
				this.associated.fromJson(json.associated);
		}

	}
}