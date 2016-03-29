/// <reference path='../models.ts' />

module Playbook.Models {
    export class PlayOpponent
        extends Playbook.Models.Play {

        public playType: Playbook.Editor.PlayTypes;

        constructor() {
            super();
            this.playType = Playbook.Editor.PlayTypes.Opponent;
        }
        public draw(field: Playbook.Interfaces.IField): void {
            // TODO @theBull - flip the play over
            super.draw(field);
        }
    }
}