/// <reference path='../models.ts' />

module Playbook.Models {
	export class PlacementCollection 
		extends Common.Models.ModifiableCollection<Playbook.Models.Placement> {

		constructor() {
			super();
		}

		public fromJson(json: any) {
			if (!json)
				return;

			this.guid = json.guid;

			let placements = json.placements || [];
			for (let i = 0; i < placements.length; i++) {
				let rawPlacement = placements[i];
				let placementModel = new Playbook.Models.Placement();
				placementModel.fromJson(rawPlacement);
				this.add<Playbook.Models.Placement>(
					placementModel.guid, 
					placementModel
				);
			}
		}

		public toJson(): any {
			return super.toJsonArray();
		}
	}
}