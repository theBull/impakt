/// <reference path='../models.ts' />

module Playbook.Models {

	export class AssignmentCollection
	extends Common.Models.ModifiableCollection<Playbook.Models.Assignment> {

		public unitType: Playbook.Editor.UnitTypes;
		public setType: Playbook.Editor.SetTypes;
		public name: string;
		public key: number;

		// at this point I'm expecting an object literal with data / count
		// properties, but not a valid AssignmentCollection; Essentially
		// this is to get around 
		constructor(count?: number) {
			super();

			if(count) {
				for (let i = 0; i < count; i++) {
					let assignment = new Playbook.Models.Assignment();
					assignment.positionIndex = i;
					this.add(assignment);
				}
			}

			this.setType = Playbook.Editor.SetTypes.Assignment;
			this.unitType = Playbook.Editor.UnitTypes.Other;
			this.name = 'Untitled';
			this.key = -1;
		}

		public copy(): Playbook.Models.AssignmentCollection {
			console.error('copy Playbook AssignmentCollection not implemented');
			return null;
		}

		public toJson(): any {
			return {
				unitType: this.unitType,
				setType: this.setType,
				guid: this.guid,
				key: this.key,
				assignments: super.toJson()
			}
		}

		public fromJson(json: any) {
			if (!json)
				return;

			this.guid = json.guid;
			this.key = json.key;
			this.unitType = json.unitType;
			this.setType = json.setType;

			let assignments = json.assignments || [];
			for (let i = 0; i < assignments.length; i++) {
				let rawAssignment = assignments[i];				

				let assignmentModel = new Playbook.Models.Assignment();
				assignmentModel.fromJson(rawAssignment);

				this.add(assignmentModel);
			}
		}

		public getAssignmentByPositionIndex(index: number): Playbook.Models.Assignment {
			let result = null;
			if (this.hasElements()) {
				result = this.filterFirst(function(assignment) {
					return assignment.positionIndex == index;
				});
			}
			return result;
		}
	}
}