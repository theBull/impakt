/// <reference path='../models.ts' />

module Playbook.Models {
    export class PreviewField
        extends Playbook.Models.Field {

        constructor(
            paper: Playbook.Interfaces.IPaper,
            playPrimary: Playbook.Models.PlayPrimary,
            playOpponent: Playbook.Models.PlayOpponent
        ) {
            super(paper, playPrimary, playOpponent);
        }
        public draw(): void {
            var self = this;
            this.ground.click = function(e: any) { return false; }
            this.ball.placement.coordinates.y = 20;
            this.ball.placement.coordinates.x = 26;
            this.los.placement.coordinates.y = 20;
            this.los.height = 1;
            this.hashmark_left.start = 0;
            this.hashmark_left.yards = 40;
            this.hashmark_right.start = 0;
            this.hashmark_right.yards = 40;
            this.sideline_left.opacity = 0.35;
            this.sideline_right.opacity = 0.35;
            this.ground.draw();
            this.hashmark_left.draw();
            this.hashmark_right.draw();
            this.sideline_left.draw();
            this.sideline_right.draw();
            this.los.draw();
            this.ball.draw();
            // draw the play data onto the field
            if (this.playPrimary)
                this.playPrimary.draw(this);
            // draw the opponent play data onto the field
            if (this.playOpponent)
                this.playOpponent.draw(this);
        }
        public addPlayer(
            placement: Playbook.Models.Placement,
            position: Playbook.Models.Position,
            assignment: Playbook.Models.Assignment
        ): Playbook.Interfaces.IPlayer {
            // TODO @theBull - look into this
            // adjust for no sidelines...
            //placement.x -= 1;
            var player = new Playbook.Models.PreviewPlayer(this, placement, position, assignment);
            player.draw();
            this.players.add(player);
            return player;
        }
        public togglePlayerSelection(player: Playbook.Models.Player) {
            throw new Error('PreviewField togglePlayerSelection() not implemented');
        }
        public deselectAll() {
            throw new Error('PreviewField deselectAll() not implemented');
        }
        public useAssignmentTool(coords: Playbook.Models.Coordinates) {
            throw new Error('PreviewField useAssignmentTool() not implemented');
        }
    }
}
