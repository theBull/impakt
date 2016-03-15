/// <reference path='../models.ts' />

module Playbook.Models {

	export class PersonnelCollection
	extends Common.Models.ModifiableCollection<Playbook.Models.Personnel> {

		public unitType: Playbook.Editor.UnitTypes;
		public setType: Playbook.Editor.SetTypes;
		public guid: string;

		constructor() {
			super();
			this.unitType = Playbook.Editor.UnitTypes.Other;
			this.setType = Playbook.Editor.SetTypes.Personnel;
			this.guid = Common.Utilities.guid();
		}

		public toJson(): any {
			return {
				unitType: this.unitType,
				setType: this.setType,
				personnel: super.toJson()
			}
		}

		public fromJson(json: any) {
			if (!json)
				return;

			this.unitType = json.unitType;
			this.guid = json.guid;
			this.setType = json.setType;

			let personnelArray = json.personnel || [];
			for (let i = 0; i < personnelArray.length; i++) {
				let rawPersonnel = personnelArray[i];

				let personnelModel = new Playbook.Models.Personnel();
				personnelModel.fromJson(rawPersonnel);

				this.add(personnelModel);
			}
		}
	}
}