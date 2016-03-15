/// <reference path='../models.ts' />

module Playbook.Models {

	export class FormationCollection
	extends Common.Models.ModifiableCollection<Playbook.Models.Formation> {

		public parentRK: number;
		public unitType: Playbook.Editor.UnitTypes;

		// at this point I'm expecting an object literal with data / count
		// properties, but not a valid FormationCollection; Essentially
		// this is to get around 
		constructor() {
			super();
			this.parentRK = -1;
			this.unitType = Playbook.Editor.UnitTypes.Other;

			this.onModified(function() {
				console.log('formation collection modified');
			});
		}

		public toJson(): any {
			return {
				formations: super.toJson(),
				unitType: this.unitType,
				guid: this.guid
			}
		}

		public fromJson(json) {
			if (!json)
				return;

			// this.guid = json.guid || this.guid;
			// this.unitType = json.unitType || this.unitType;
			// this.parentRK = json.parentRK || this.parentRK
			let self = this;
			let formations = json || [];
			for (let i = 0; i < formations.length; i++) {
				let rawFormation = formations[i];

				let formationModel = new Playbook.Models.Formation();
				formationModel.fromJson(rawFormation);

				this.add(formationModel);
			}

			this.forEach(function(formation, index) {
				formation.onModified(function() {
					console.log('formation collection modified: formation');
					self.setModified(true);
				});
			});


		}
	}
}