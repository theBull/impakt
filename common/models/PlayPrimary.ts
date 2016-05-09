/// <reference path='./models.ts' />

module Common.Models {
    export class PlayPrimary
    extends Common.Models.Play {
        public playType: Playbook.Enums.PlayTypes;
        constructor(unitType: Team.Enums.UnitTypes) {
            super(unitType);
            this.playType = Playbook.Enums.PlayTypes.Primary;
        }
    }
}
