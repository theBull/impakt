/// <reference path='./models.ts' />

module Common.Models {

    export abstract class Play
    extends Common.Models.AssociableEntity {

        public field: Common.Interfaces.IField;
        public assignmentGroup: Common.Models.AssignmentGroup;
        public formation: Common.Models.Formation;
        public personnel: Team.Models.Personnel;
        public unitType: Team.Enums.UnitTypes;
        public playType: Playbook.Enums.PlayTypes;
        public png: string;

        constructor(unitType: Team.Enums.UnitTypes) {
            super(Common.Enums.ImpaktDataTypes.Play);
            
            this.field = null;
            this.name = 'New play';
            this.unitType = unitType;
            this.assignmentGroup = null;
            this.formation = null;
            this.personnel = null;
            this.png = null;
            this.contextmenuTemplateUrl = Common.Constants.PLAY_CONTEXTMENU_TEMPLATE_URL;
            this.playType = Playbook.Enums.PlayTypes.Unknown;
            this.flipped = false;
        }
        
        public copy(newPlay: Common.Interfaces.IPlay): Common.Interfaces.IPlay {
            newPlay.formation = this.formation && this.formation.copy();
            newPlay.personnel = this.personnel && this.personnel.copy();
            newPlay.assignmentGroup = this.assignmentGroup && this.assignmentGroup.copy();
            return <Common.Interfaces.IPlay>super.copy(newPlay, this);
        }

        public toJson(): any {
            return $.extend({
                name: this.name,
                unitType: this.unitType,
                png: this.png,
                playType: this.playType
            }, super.toJson());
        }
        public fromJson(json: any): any {
            // TODO
            this.name = json.name;
            this.unitType = json.unitType;
            this.png = json.png;
            this.playType = json.playType || this.playType;

            super.fromJson(json);
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

            if(unitType != this.unitType) {
                this.unitType = unitType;

                // 1. reset formation unit type
                if (this.formation) {
                    this.formation.setUnitType(unitType);
                }

                // 2. reset default personnel
                if (this.personnel && this.personnel.unitType != unitType) {
                    this.personnel.unitType = unitType;
                    this.personnel.setDefault();
                }

                // 3. clear assignments
                if (this.assignmentGroup && this.assignmentGroup.unitType != this.unitType) {
                    this.assignmentGroup = null;
                }

                this.setModified(true);
            }
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

        public setField(field: Common.Interfaces.IField): void {
            this.isFieldSet(field);
            this.isBallSet(field.ball);

            this.field = field;
        }

        public static toPrimary(play: Common.Interfaces.IPlay): Common.Models.PlayPrimary {
            if (play.playType == Playbook.Enums.PlayTypes.Primary)
                return <Common.Models.PlayPrimary>play; 

            let newPlay = new Common.Models.PlayPrimary(play.unitType);
            newPlay.fromJson(play.toJson());
            newPlay.playType = Playbook.Enums.PlayTypes.Primary;
            newPlay.assignmentGroup = play.assignmentGroup;
            newPlay.formation = play.formation;
            newPlay.personnel = play.personnel;
            return newPlay;
        }

        public static toOpponent(play: Common.Interfaces.IPlay): Common.Models.PlayOpponent {
            if (play.playType == Playbook.Enums.PlayTypes.Opponent)
                return <Common.Models.PlayOpponent>play;

            let newPlay = new Common.Models.PlayOpponent(play.unitType);
            newPlay.fromJson(play.toJson());
            newPlay.playType = Playbook.Enums.PlayTypes.Opponent;
            newPlay.assignmentGroup = play.assignmentGroup;
            newPlay.formation = play.formation;
            newPlay.personnel = play.personnel;
            return newPlay;
        }

        public flip(): void {
            if (Common.Utilities.isNotNullOrUndefined(this.formation)) {
                this.formation.flip();
            }
            if(Common.Utilities.isNotNullOrUndefined(this.assignmentGroup)) {
                //this.assignmentGroup.flip();
            }
            this.flipped = !this.flipped;
        }
    }
}
