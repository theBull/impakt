/// <reference path='../models.ts' />

module Playbook.Models {

	export class PositionCollection 
	extends Common.Models.ModifiableCollection<Playbook.Models.Position> {

		constructor() {
			super();
			this.setDefault();
		}

		public listPositions(): string[] {
			let arr = [];	
			this.forEach(function(position: Playbook.Models.Position, index) {
				arr.push(position.title);
			});
			return arr;
		}

		public toJson(): any {
			return super.toJson();
		}

		public fromJson(positions: any) {

			if (!positions)
				return;

			for (let i = 0; i < positions.length; i++) {
				let rawPosition = positions[i];

				let positionModel = new Playbook.Models.Position();
				positionModel.fromJson(rawPosition);

				this.add(positionModel);
			}
		}

		public setDefault() {
			
		}
	}
}