/// <reference path='../models.ts' />

module Playbook.Models {

	export class PlaybookModelCollection
	extends Common.Models.ModifiableCollection<Playbook.Models.PlaybookModel> {

		constructor() {
			super();
		}

		public toJson(): any {
			return {
				guid: this.guid,
				playbooks: super.toJson()
			}
		}

		public fromJson(json: any) {
			if (!json)
				return;

			this.guid = json.guid || this.guid;

			let playbooks = json.playbooks || [];
			for (let i = 0; i < playbooks.length; i++) {
				let rawPlaybook = playbooks[i];
				let playbookModel = new Playbook.Models.PlaybookModel();
				playbookModel.fromJson(rawPlaybook);
				this.add(playbookModel);
			}
		}
	}
}