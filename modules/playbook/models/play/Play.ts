/// <reference path='../models.ts' />

module Playbook.Models {

    export class Play
    extends Common.Models.Modifiable {

        public field: Playbook.Interfaces.IField;
        public name: string;
        public associated: Common.Models.Association;
        public assignments: Playbook.Models.AssignmentCollection;
        public formation: Playbook.Models.Formation;
        public personnel: Playbook.Models.Personnel;
        public unitType: Playbook.Editor.UnitTypes;
        public editorType: Playbook.Editor.EditorTypes;
        public png: string;
        public key: number;

        constructor() {
            super(this);
            this.field = null;
            this.name = 'Default';
            this.associated = new Common.Models.Association();
            this.assignments = null;
            this.formation = null;
            this.personnel = null;
            this.unitType = Playbook.Editor.UnitTypes.Other;
            this.editorType = Playbook.Editor.EditorTypes.Play;
            this.png = null;
        }
        public setPlaybook(playbook) {
            // Unit type is key.
            if (playbook) {
                this.associated.playbooks.only(playbook.guid);
            }
            else {
                this.associated.playbooks.empty();
                console.warn('Play setPlaybook(): implementation is incomplete');
            }
            // TODO @theBull
            // - add playbook field?
            // - what happens when changing to playbooks of different unit types? 
            this.setModified(true);
        }
        public setFormation(formation) {
            if (formation) {
                this.associated.formations.only(formation.guid);
            }
            else {
                this.associated.formations.empty();
                this.setAssignments(null);
                this.setPersonnel(null);
            }
            this.formation = formation;
            this.setModified(true);
        }
        public setAssignments(assignments) {
            if (assignments) {
                this.associated.assignments.only(assignments.guid);
            }
            else {
                this.associated.assignments.empty();
            }
            this.assignments = assignments;
            this.setModified(true);
        }
        public setPersonnel(personnel) {
            if (personnel) {
                this.associated.personnel.only(personnel.guid);
            }
            else {
                this.associated.personnel.empty();
            }
            this.personnel = personnel;
            this.setModified(true);
        }
        public draw(field: Playbook.Interfaces.IField): void {
            if (!field)
                throw new Error('Play draw(): Field is null or undefined');
            if (!field.ball)
                throw new Error('Play draw(): Ball is null or undefined');
            this.field = field;
            var self = this;
            // set defaults, in case no assignments / personnel were assigned
            if (!this.personnel) {
                this.personnel = new Playbook.Models.Personnel();
            }
            if (!this.assignments) {
                this.assignments = new Playbook.Models.AssignmentCollection();
            }
            if (!this.formation || !this.formation.placements || this.formation.placements.isEmpty()) {
                this.formation = new Playbook.Models.Formation();
                this.formation.setDefault(this.field.ball);
            }
            this.formation.placements.forEach(function(placement, index) {
                var position = self.personnel.positions.getIndex(index);
                var assignment = self.assignments.getIndex(index);
                self.field.addPlayer(placement, position, assignment);
            });
        }
        public fromJson(json: any): any {
            // TODO
            this.key = json.key;
            this.name = json.name;
            this.guid = json.guid;
            this.associated.formations.add(json.formationGuid);
            this.associated.personnel.add(json.personnelGuid);
            this.associated.assignments.add(json.assignmentsGuid);
            this.unitType = json.unitType;
            this.editorType = json.editorType;
            this.png = json.png;
        }
        public toJson(): any {
            return {
                key: this.key,
                name: this.name,
                associated: this.associated.toJson(),
                assignmentsGuid: this.assignments ? this.assignments.guid : null,
                personnelGuid: this.personnel ? this.personnel.guid : null,
                formationGuid: this.formation ? this.formation.guid : null,
                unitType: this.unitType,
                editorType: this.editorType,
                guid: this.guid,
                png: this.png
            }
        }
        public hasAssignments() {
            return this.assignments && this.assignments.size() > 0;
        }
        public setDefault(field: Playbook.Interfaces.IField) {
            if (!field)
                throw new Error('Play setDefault(): field is null or undefined');
            this.field = field;
            // empty what's already there, if anything...
            if (!this.personnel)
                this.personnel = new Playbook.Models.Personnel();
            if (!this.formation)
                this.formation = new Playbook.Models.Formation();
            this.personnel.setDefault();
            this.formation.setDefault(this.field.ball);
            // assignments?
            // this.draw(field);
        }
    }
}
