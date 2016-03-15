/// <reference path='../models.ts' />

module Playbook.Models {

	export class PlaybookModelCollection
	extends Common.Models.ModifiableCollection<Playbook.Models.PlaybookModel> {

		public unitType: Playbook.Editor.UnitTypes;

		constructor() {
			super();
			this.unitType = Playbook.Editor.UnitTypes.Other;
		}

		public toJson(): any {
			return {
				unitType: this.unitType,
				guid: this.guid,
				playbooks: super.toJson()
			}
		}

		public fromJson(json: any) {
			if (!json)
				return;
			
			this.unitType = json.unitType || this.unitType;
			this.guid = json.guid || this.guid;

			let playbooks = json.playbooks || [];
			for (let i = 0; i < playbooks.length; i++) {
				let rawPlaybook = playbooks[i];
				let playbookModel = new Playbook.Models.PlaybookModel();
				playbookModel.fromJson(rawPlaybook);
				this.add<Playbook.Models.PlaybookModel>(
					playbookModel.guid,
					playbookModel
				);
			}
		}
	}
}