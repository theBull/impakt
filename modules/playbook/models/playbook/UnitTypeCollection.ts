/// <reference path='../models.ts' />

module Playbook.Models {
	export class UnitTypeCollection
	extends Common.Models.ModifiableCollection<Playbook.Models.UnitType> {

		constructor() {
			super();

			let offense = new Playbook.Models.UnitType(
				Playbook.Editor.UnitTypes.Offense,
				'offense'
			);
			this.add<Playbook.Models.UnitType>(
				offense.guid,
				offense
			);

			let defense = new Playbook.Models.UnitType(
				Playbook.Editor.UnitTypes.Defense,
				'defense'
			);
			this.add<Playbook.Models.UnitType>(
				defense.guid,
				defense
			);

			let specialTeams = new Playbook.Models.UnitType(
				Playbook.Editor.UnitTypes.SpecialTeams,
				'special teams'
			);
			this.add<Playbook.Models.UnitType>(
				specialTeams.guid,
				specialTeams
			);

			let other = new Playbook.Models.UnitType(
				Playbook.Editor.UnitTypes.Other,
				'other'
			);
			this.add<Playbook.Models.UnitType>(
				other.guid,
				other
			);

			let mixed = new Playbook.Models.UnitType(
				Playbook.Editor.UnitTypes.Mixed,
				'mixed'
			);
			this.add<Playbook.Models.UnitType>(
				mixed.guid,
				mixed
			);
		}

		public getByUnitType(unitTypeValue: Playbook.Editor.UnitTypes)
			: Playbook.Models.UnitType 
		{
			return this.filterFirst<Playbook.Models.UnitType>(
				function(unitType: Playbook.Models.UnitType) {
					return unitType.unitType == unitTypeValue;
				});
		}

		public getAllPlaybooks(): Playbook.Models.PlaybookModelCollection {
			let collection = new Playbook.Models.PlaybookModelCollection();

			this.forEach<Playbook.Models.UnitType>(
				function(unitType: Playbook.Models.UnitType, index) {

					if(unitType && unitType.playbooks && unitType.playbooks.size()) {

						collection.append(
							unitType.playbooks
						);

					}

			});

			return collection;
		}

		public toJson(): any {
			return super.toJson();
		}

		// takes an unprocessed arry of playbooks from the server
		// and adds them into the collection and sub collections
		public fromJson(json: any) {
			if (!json)
				return;

			this.guid = json.guid || this.guid;
		}

	}
}