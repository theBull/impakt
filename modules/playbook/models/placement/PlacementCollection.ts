/// <reference path='../models.ts' />

module Playbook.Models {
	export class PlacementCollection 
		extends Common.Models.ModifiableCollection<Playbook.Models.Placement> {

		constructor() {
			super();
		}

		public fromJson(placements: any) {
			if (!placements)
				return;

			let self = this;

			this.empty();

			for (let i = 0; i < placements.length; i++) {
				let rawPlacement = placements[i];
				let placementModel = new Playbook.Models.Placement(null);
				placementModel.fromJson(rawPlacement);
				this.add(placementModel);
			}

			this.forEach(function(placement, index) {
				placement.onModified(function() {
					console.log('placement collection modified: placement:', placement.guid);
					self.setModified(true);
				});	
			});

			this.setModified(true);
		}

		public toJson(): any {
			return super.toJson();
		}
	}
}