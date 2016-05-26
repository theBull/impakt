/// <reference path='./models.ts' />

module Common.Models {

    export class PlayPrimary
    extends Common.Models.Play
    implements Common.Interfaces.IPlay {
        
        constructor(unitType: Team.Enums.UnitTypes) {
            super(unitType);
            this.playType = Playbook.Enums.PlayTypes.Primary;
        }

        public copy(newPlay?: Common.Interfaces.IPlay): Common.Models.PlayPrimary {
            var copyPlay = newPlay || new Common.Models.PlayPrimary(this.unitType);
            return <Common.Models.PlayPrimary>super.copy(copyPlay);
        }

        public draw(field: Common.Interfaces.IField): void {
            super.setField(field);

            this.field.clearPrimaryPlayers();

            var self = this;
            // set defaults, in case no assignments / personnel were assigned
            if (!this.personnel) {
                this.personnel = new Team.Models.Personnel(this.unitType);
            }
            if (!this.personnel.positions) {
                this.personnel.setDefault();
            }
            if (!this.assignmentGroup) {
                this.assignmentGroup = new Common.Models.AssignmentGroup(this.unitType);
            }
            if (!this.formation) {
                this.formation = new Common.Models.Formation(this.unitType);
            }
            if (!this.formation.placements || this.formation.placements.isEmpty()) {
                this.formation.setDefault(this.field.ball);
            }
            this.field.primaryPlayers.listen(false);
            this.formation.placements.forEach(function(placement, index) {
                var position = self.personnel.positions.getIndex(index);
                var assignment = self.assignmentGroup.assignments.getIndex(index);
                self.field.addPrimaryPlayer(placement, position, assignment);
            });
            this.field.primaryPlayers.listen(true);
            this.field.primaryPlayers.setModified(true);
        }
    }
}
