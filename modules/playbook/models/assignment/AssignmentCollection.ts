/// <reference path='../models.ts' />

module Playbook.Models {

	export class AssignmentCollection
	extends Common.Models.ModifiableCollection<Playbook.Models.Assignment> {

		public unitType: Playbook.Editor.UnitTypes;
		public setType: Playbook.Editor.PlaybookSetTypes;
		public name: string;

		// at this point I'm expecting an object literal with data / count
		// properties, but not a valid AssignmentCollection; Essentially
		// this is to get around 
		constructor(count?: number) {
			super();

			if(count) {
				for (let i = 0; i < count; i++) {
					let assignment = new Playbook.Models.Assignment();
					assignment.positionIndex = i;
					this.add(assignment.guid, assignment);
				}
			}

			this.setType = Playbook.Editor.PlaybookSetTypes.Assignment;
			this.unitType = Playbook.Editor.UnitTypes.Other;
			this.name = 'Untitled';
		}

		public hasAssignments(): boolean {
			return this.size() > 0;
		}

		public toJson(): any {
			return {
				unitType: this.unitType,
				setType: this.setType,
				guid: this.guid,
				assignments: super.toJson()
			}
		}

		public fromJson(json: any) {
			if (!json)
				return;

			this.guid = json.guid;
			this.unitType = json.unitType;
			this.setType = json.setType;

			let assignments = json.assignments || [];
			for (let i = 0; i < assignments.length; i++) {
				let rawAssignment = assignments[i];				

				let assignmentModel = new Playbook.Models.Assignment();
				assignmentModel.fromJson(rawAssignment);

				this.add<Assignment>(
					assignmentModel.guid,
					assignmentModel
				);
			}
		}

		public getAssignmentByPositionIndex(index: number): Playbook.Models.Assignment {
			let result = null;
			if (this.hasAssignments()) {
				result = this.filterFirst<Playbook.Models.Assignment>(
					function(assignment) {
						return assignment.positionIndex == index;
					});
			}
			return result;
		}
	}
}