/// <reference path='../models.ts' />

module Playbook.Models {

	export class PositionCollection 
	extends Common.Models.ModifiableCollection<Playbook.Models.Position> {

		constructor() {
			super();
			this.setDefault();
		}

		public toJson(): any {
			return {
				guid: this.guid,
				positions: super.toJson()
			};
		}

		public fromJson(positions: any) {

			if (!positions)
				return;

			for (let i = 0; i < positions.length; i++) {
				let rawPosition = positions[i];

				let positionModel = new Playbook.Models.Position();
				positionModel.fromJson(rawPosition);

				this.add<Playbook.Models.Position>(positionModel.guid, positionModel);
			}
		}

		public setDefault() {
			
		}
	}
}