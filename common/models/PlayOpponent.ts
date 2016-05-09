/// <reference path='./models.ts' />

module Common.Models {
    export class PlayOpponent
        extends Common.Models.Play {

        public playType: Playbook.Enums.PlayTypes;

        constructor(unitType: Team.Enums.UnitTypes) {
            super(unitType);
            this.playType = Playbook.Enums.PlayTypes.Opponent;
        }
        public draw(field: Common.Interfaces.IField): void {
            // TODO @theBull - flip the play over
            super.draw(field);
        }
    }
}