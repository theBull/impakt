/// <reference path='./models.ts' />

module Common.Models {

    export class Play
    extends Common.Models.AssociableEntity {

        public field: Common.Interfaces.IField;
        public name: string;
        public assignmentGroup: Common.Models.AssignmentGroup;
        public formation: Common.Models.Formation;
        public personnel: Team.Models.Personnel;
        public unitType: Team.Enums.UnitTypes;
        public editorType: Playbook.Enums.EditorTypes;
        public png: string;

        constructor(unitType: Team.Enums.UnitTypes) {
            super(Common.Enums.ImpaktDataTypes.Play);
            
            this.field = null;
            this.name = 'New play';
            this.unitType = unitType;
            this.assignmentGroup = null;
            this.formation = null;
            this.personnel = null;
            this.editorType = Playbook.Enums.EditorTypes.Play;
            this.png = null;
            this.contextmenuTemplateUrl = Common.Constants.PLAY_CONTEXTMENU_TEMPLATE_URL;
        }
        public setPlaybook(playbook: Common.Models.PlaybookModel): void {
            // TODO @theBull - handle associations

            // TODO @theBull
            // - add playbook field?
            // - what happens when changing to playbooks of different unit types? 
            this.setModified(true);
        }
        public setFormation(formation: Common.Models.Formation): void {
            if (Common.Utilities.isNotNullOrUndefined(formation)) {
                if(formation.unitType != this.unitType) {
                    //throw new Error('Play setFormation(): Formation unit type does not match play unit type');
                }

            }
            else {
                this.setAssignmentGroup(null);
                this.setPersonnel(null);
            }
            this.formation = formation;
            this.unitType = formation.unitType;
            this.setModified(true);
        }
        public setAssignmentGroup(assignmentGroup: Common.Models.AssignmentGroup): void {
            if (Common.Utilities.isNotNullOrUndefined(assignmentGroup)) {
                if(assignmentGroup.unitType != this.unitType)
                    throw new Error('Play setAssignmentGroup(): Assignments unit type does not match play unit type');
                
            }
            else {
            }
            this.assignmentGroup = assignmentGroup;
            this.setModified(true);
        }
        public setPersonnel(personnel: Team.Models.Personnel): void {
            if (Common.Utilities.isNotNullOrUndefined(personnel)) {
                if (personnel.unitType != this.unitType)
                    throw new Error('Play setPersonnel(): Cannot apply personnel with different unit type.');

            } else {
            }
            this.personnel = personnel;
            this.setModified(true);
        }
        public setUnitType(unitType: Team.Enums.UnitTypes) {
            this.isFieldSet(this.field);
            this.isBallSet(this.field.ball);

            // 1. if formation doesn't match unit type, select default formation
            // of unit type
            if(this.formation && this.formation.unitType != unitType) {
                let confirmed = confirm('Formation unit type mismatch.\nContinue with a default formation of the correct unit type?');
                if(confirmed) {
                    this.formation.unitType = unitType;
                } else {
                    return;
                }
            }

            // Handle the formation / confirm dialog first; that way if user clicks cancel
            // in the confirm, we don't end up setting the play's unit type anyway.
            this.unitType = unitType;            

            // 2. if personnel doesn't match unit type, select default personnel
            // of unit type
            if(this.personnel && this.personnel.unitType != unitType) {
                this.personnel.unitType = unitType;
                this.personnel.setDefault();
            }

            // 3. if assignments do not match unit type, clear them.
            if(this.assignmentGroup.unitType != this.unitType) {
                this.assignmentGroup = new Common.Models.AssignmentGroup(this.unitType);
            }
        }
        public draw(field: Common.Interfaces.IField): void {
            this.isFieldSet(field);
            this.isBallSet(field.ball);

            this.field = field;

            // Clear the players
            this.field.clearPlayers();
            
            var self = this;
            // set defaults, in case no assignments / personnel were assigned
            if (!this.personnel) {
                this.personnel = new Team.Models.Personnel(this.unitType);
            }
            if(!this.personnel.positions) {
                this.personnel.setDefault();
            }
            if (!this.assignmentGroup) {
                this.assignmentGroup = new Common.Models.AssignmentGroup(this.unitType);
            }
            if (!this.formation) {
                this.formation = new Common.Models.Formation(this.unitType);
            }
            if(!this.formation.placements || this.formation.placements.isEmpty()) {   
                this.formation.setDefault(this.field.ball);
            }
            this.formation.placements.forEach(function(placement, index) {
                var position = self.personnel.positions.getIndex(index);
                var assignment = self.assignmentGroup.assignments.getIndex(index);
                self.field.addPlayer(placement, position, assignment);
            });
        }
        public fromJson(json: any): any {
            // TODO
            this.name = json.name;
            this.unitType = json.unitType;
            this.editorType = json.editorType;
            this.png = json.png;

            super.fromJson(json);
        }
        public toJson(): any {
            return $.extend({
                name: this.name,
                unitType: this.unitType,
                editorType: this.editorType,
                png: this.png
            }, super.toJson());
        }
        public hasAssignments() {
            return this.assignmentGroup && this.assignmentGroup.assignments.size() > 0;
        }
        public setDefault(field: Common.Interfaces.IField) {
            this.isFieldSet(field);

            this.field = field;
            // empty what's already there, if anything...
            if (!this.personnel)
                this.personnel = new Team.Models.Personnel(this.unitType);
            if (!this.formation)
                this.formation = new Common.Models.Formation(this.unitType);
            this.personnel.setDefault();
            this.formation.setDefault(this.field.ball);
            // assignments?
            // this.draw(field);
        }
        public getOpposingUnitType(): Team.Enums.UnitTypes {
            let opponentUnitType = Team.Enums.UnitTypes.Other;
            switch(this.unitType) {
                case Team.Enums.UnitTypes.Offense:
                    opponentUnitType = Team.Enums.UnitTypes.Defense;
                    break;
                case Team.Enums.UnitTypes.Defense:
                    opponentUnitType = Team.Enums.UnitTypes.Offense;
                    break;
            }
            return opponentUnitType;
        }
        public isFieldSet(field: Common.Interfaces.IField): boolean {
            if (!field)
                throw new Error('Play draw(): Field is null or undefined');

            return true;
        }
        public isBallSet(ball: Common.Interfaces.IBall): boolean {
            if (!ball)
                throw new Error('Play draw(): Ball is null or undefined');

            return true;
        }
    }
}
