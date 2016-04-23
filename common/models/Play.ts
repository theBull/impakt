/// <reference path='./models.ts' />

module Common.Models {

    export class Play
    extends Common.Models.Modifiable {

        public field: Common.Interfaces.IField;
        public name: string;
        public associated: Common.Models.Association;
        public assignments: Common.Models.AssignmentCollection;
        public formation: Common.Models.Formation;
        public personnel: Team.Models.Personnel;
        public unitType: Team.Enums.UnitTypes;
        public editorType: Playbook.Enums.EditorTypes;
        public png: string;
        public key: number;

        constructor() {
            super();
            super.setContext(this);
            
            this.field = null;
            this.name = 'New play';
            this.associated = new Common.Models.Association();
            this.assignments = null;
            this.formation = null;
            this.personnel = null;
            this.unitType = Team.Enums.UnitTypes.Other;
            this.editorType = Playbook.Enums.EditorTypes.Play;
            this.png = null;
        }
        public setPlaybook(playbook: Common.Models.PlaybookModel): void {
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
        public setFormation(formation: Common.Models.Formation): void {
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
        public setAssignments(assignments: Common.Models.AssignmentCollection): void {
            if (assignments) {
                this.associated.assignments.only(assignments.guid);
            }
            else {
                this.associated.assignments.empty();
            }
            this.assignments = assignments;
            this.setModified(true);
        }
        public setPersonnel(personnel: Team.Models.Personnel): void {
            if (personnel) {
                this.associated.personnel.only(personnel.guid);
            }
            else {
                this.associated.personnel.empty();
            }
            this.personnel = personnel;
            this.setModified(true);
        }
        public draw(field: Common.Interfaces.IField): void {
            if (!field)
                throw new Error('Play draw(): Field is null or undefined');
            if (!field.ball)
                throw new Error('Play draw(): Ball is null or undefined');
            this.field = field;

            // Clear the players
            this.field.clearPlayers();
            
            var self = this;
            // set defaults, in case no assignments / personnel were assigned
            if (!this.personnel) {
                this.personnel = new Team.Models.Personnel();
            }
            if (!this.assignments) {
                this.assignments = new Common.Models.AssignmentCollection();
            }
            if (!this.formation) {
                this.formation = new Common.Models.Formation();
            }
            if(!this.formation.placements || this.formation.placements.isEmpty()) {   
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
        public setDefault(field: Common.Interfaces.IField) {
            if (!field)
                throw new Error('Play setDefault(): field is null or undefined');
            this.field = field;
            // empty what's already there, if anything...
            if (!this.personnel)
                this.personnel = new Team.Models.Personnel();
            if (!this.formation)
                this.formation = new Common.Models.Formation();
            this.personnel.setDefault();
            this.formation.setDefault(this.field.ball);
            // assignments?
            // this.draw(field);
        }
    }
}
