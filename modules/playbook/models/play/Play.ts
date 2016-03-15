/// <reference path='../models.ts' />

module Playbook.Models {
	
	export class Play 
	extends Common.Models.Modifiable
	implements Playbook.Interfaces.IEditorObject {

		public field: Playbook.Models.Field;
		public assignments: Playbook.Models.AssignmentCollection;
		public personnel: Playbook.Models.Personnel;
		public formation: Playbook.Models.Formation;
		public name: string;
		public key: number;
		public type: Playbook.Editor.UnitTypes;
		public editorType: Playbook.Editor.EditorTypes;
		public parentRK: number;
		public guid: string;

		constructor() {
			super(this);
			this.name = 'Default';
			this.assignments = new Playbook.Models.AssignmentCollection();
			this.formation = new Playbook.Models.Formation();
			this.personnel = new Playbook.Models.Personnel();
			this.type = Playbook.Editor.UnitTypes.Other;
		}

		public draw(field: Playbook.Models.Field): void {
			this.field = field;
			let self = this;
			this.formation.placements.forEach(function(placement, index) {
				let position = <Playbook.Models.Position>self.personnel.positions.getIndex(index);
				let assignment = <Playbook.Models.Assignment>self.assignments.getIndex(index);
				self.field.addPlayer(placement, position, assignment);
			});
		}

		public fromJson(json: any) {
			// TODO
			this.key = json.key;
			this.name = json.name;
			this.assignments = new Playbook.Models.AssignmentCollection();
			this.assignments.fromJson(json.assignments);
			this.personnel = new Playbook.Models.Personnel();
			this.personnel.fromJson(json.personnel);
			this.type = json.type;
		}

		public toJson(): any {
			return {
				key: this.key,
				name: this.name,
				assignmentsGuid: this.assignments.guid,
				personnelGuid: this.personnel.guid,
				formationGuid: this.formation.guid,
				type: this.type,
				guid: this.guid
			}
		}

		public hasAssignments(): boolean {
			return this.assignments && this.assignments.size() > 0;
		}

		public setDefault() {
			// empty what's already there, if anything...
			this.personnel.setDefault();
			this.formation.setDefault();
			// assignments?
		}
	}
}