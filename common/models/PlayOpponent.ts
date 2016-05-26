/// <reference path='./models.ts' />

module Common.Models {
    
    export class PlayOpponent
    extends Common.Models.Play
    implements Common.Interfaces.IPlay {

        constructor(unitType: Team.Enums.UnitTypes) {
            super(unitType);
            this.playType = Playbook.Enums.PlayTypes.Opponent;
        }

        public copy(newPlay?: Common.Interfaces.IPlay): Common.Models.PlayOpponent {
            var copyPlay = newPlay || new Common.Models.PlayOpponent(this.unitType);
            return <Common.Models.PlayOpponent>super.copy(copyPlay);
        }
        
        public draw(field: Common.Interfaces.IField): void {
            super.setField(field);

            this.field.clearOpponentPlayers();

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
            
            this.field.opponentPlayers.listen(false);
            this.formation.placements.forEach(function(placement: Common.Models.Placement, index: number) {
                // placement.relative.rx *= -1;
                // placement.relative.ry *= -1;
                var position = self.personnel.positions.getIndex(index);
                var assignment = self.assignmentGroup.assignments.getIndex(index);
                self.field.addOpponentPlayer(placement, position, assignment);
            });

            // flip the formation and assignments
            if (Common.Utilities.isNotNullOrUndefined(this.field.opponentPlayers) && !this.flipped) {
                this.field.opponentPlayers.forEach(function(player: Common.Interfaces.IPlayer, index: number) {
                    if(Common.Utilities.isNotNullOrUndefined(player) && !player.flipped) {
                        player.flip();
                    }
                });
                this.flipped = !this.flipped;
            }
            this.field.opponentPlayers.listen(true);
            this.field.opponentPlayers.setModified(true);
        }
    }
}