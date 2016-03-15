/// <reference path='../models.ts' />

module Playbook.Models {
	export class Personnel
	extends Common.Models.Modifiable {

		public positions: Playbook.Models.PositionCollection;
		public unitType: Playbook.Editor.UnitTypes;
		public key: number;
		public name: string;
		public setType: Playbook.Editor.PlaybookSetTypes;

		constructor() {
			super(this);
			this.name = 'Untitled';
			this.unitType = Playbook.Editor.UnitTypes.Other;
			this.key = -1;
			this.positions = new Playbook.Models.PositionCollection();
			this.setDefault();
			this.setType = Playbook.Editor.PlaybookSetTypes.Personnel;

			this.onModified(function(data: any) {
				console.log('personnel changed', data);
			});

			this.positions.onModified(function(data: any) {
				console.log('personnel positions changed', data);
			});
		}

		public hasPositions(): boolean {
			return this.positions && this.positions.size() > 0;
		}

		public update(personnel: Playbook.Models.Personnel) {
			this.unitType = personnel.unitType;
			this.key = personnel.key;
			this.name = personnel.name;
			this.guid = personnel.guid;
		}

		public fromJson(json: any) {
			this.positions.removeAll();
			this.positions.fromJson(json.positions);
			this.unitType = json.unitType;
			this.key = json.key;
			this.name = json.name;
			this.guid = json.guid;
		}

		public toJson(): any {
			return {
				name: this.name,
				unitType: this.unitType,
				key: this.key,
				positions: this.positions.toJsonArray(),
				guid: this.guid
			}
		}

		public setDefault() {
			this.positions = Playbook.Models.PositionDefault.getBlank(this.unitType);
		}

		public setUnitType(unitType: Playbook.Editor.UnitTypes) {
			this.unitType = unitType;
			this.setDefault();
		}

	}
}