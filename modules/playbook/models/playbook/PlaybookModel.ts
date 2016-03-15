/// <reference path='../models.ts' />

module Playbook.Models {

	export class PlaybookModel
	extends Common.Models.Modifiable {

		public key: number;
		public name: string;
		public unitType: Playbook.Editor.UnitTypes;
		public active: boolean;

		constructor() {
			super(this);
			this.key = -1;
			this.name = 'Untitled';
			this.unitType = Playbook.Editor.UnitTypes.Other;
			this.active = false;			
		}

		public toJson(): any {
			return {
				key: this.key,
				name: this.name,
				unitType: this.unitType,
				active: this.active,
				guid: this.guid
			}
		}

		public fromJson(json: any) {
			if (!json)
				return;
			
			this.key = json.key || this.key;
			this.name = json.name || this.name;
			this.unitType = json.type || this.unitType;
			this.active = json.active || this.active;
			this.guid = json.guid || this.guid;
		}

	}
}